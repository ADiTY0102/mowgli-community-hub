import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export const GalleryUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Please select a file");

      setUploading(true);

      // Upload to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery_images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("gallery_images")
        .getPublicUrl(filePath);

      // Save to gallery table (uploaded_by is nullable now)
      const { error: insertError } = await supabase
        .from("gallery")
        .insert({
          image_url: publicUrl,
          description: description || null,
        });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      toast({
        title: "Image Uploaded",
        description: "Image has been added to the gallery.",
      });
      setFile(null);
      setDescription("");
      setUploading(false);
      // Reset file input
      const fileInput = document.getElementById("gallery-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
      setUploading(false);
    },
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="gallery-upload">Select Image</Label>
        <Input
          id="gallery-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={uploading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description for this image..."
          disabled={uploading}
          rows={3}
        />
      </div>

      {file && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Selected: <strong>{file.name}</strong>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Size: {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}

      <Button
        onClick={() => uploadMutation.mutate()}
        disabled={!file || uploading}
        className="w-full"
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? "Uploading..." : "Upload to Gallery"}
      </Button>
    </div>
  );
};
