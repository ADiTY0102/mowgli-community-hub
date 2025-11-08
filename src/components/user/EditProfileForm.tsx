import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export const EditProfileForm = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users_profile")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile?.profile_picture_url || null);

  // Update form data when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
      setPreviewUrl(profile.profile_picture_url || null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      console.log("Updating user profile...", { userId, formData, hasProfilePicture: !!profilePicture });
      
      let profilePictureUrl = profile?.profile_picture_url;

      // Upload profile picture if provided
      if (profilePicture) {
        console.log("Uploading new profile picture...");
        const fileExt = profilePicture.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('gallery_images')
          .upload(filePath, profilePicture);

        if (uploadError) {
          console.error("Profile picture upload error:", uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('gallery_images')
          .getPublicUrl(filePath);

        console.log("Profile picture uploaded successfully:", publicUrl);
        profilePictureUrl = publicUrl;
      }

      const { error } = await supabase
        .from("users_profile")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          profile_picture_url: profilePictureUrl,
        })
        .eq("user_id", userId);

      if (error) {
        console.error("Profile update error:", error);
        throw error;
      }
      console.log("Profile updated successfully!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      setProfilePicture(null);
      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateMutation.mutate();
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="profilePicture">Profile Picture</Label>
        {previewUrl && (
          <div className="mb-2">
            <img
              src={previewUrl}
              alt="Profile preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-border"
            />
          </div>
        )}
        <Input
          id="profilePicture"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setProfilePicture(file);
            if (file) {
              const url = URL.createObjectURL(file);
              setPreviewUrl(url);
              console.log("Profile picture selected:", file.name);
            }
          }}
        />
        <p className="text-xs text-muted-foreground">
          This will be displayed in your feedbacks
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email (Cannot be changed)</Label>
        <Input id="email" value={profile?.email || ""} disabled />
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name *</Label>
        <Input
          id="full_name"
          required
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={3}
        />
      </div>

      <Button type="submit" disabled={updateMutation.isPending}>
        {updateMutation.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};
