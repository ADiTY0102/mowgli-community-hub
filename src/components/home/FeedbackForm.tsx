import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export const FeedbackForm = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [feedbackText, setFeedbackText] = useState("");
  const [designation, setDesignation] = useState("");

  // Fetch user profile to get profile picture
  const { data: userProfile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      console.log("Fetching user profile for feedback...");
      const { data, error } = await supabase
        .from("users_profile")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      console.log("User profile fetched:", data);
      return data;
    },
    enabled: !!user,
  });

  const submitFeedback = useMutation({
    mutationFn: async () => {
      if (!user || !userProfile) {
        throw new Error("User not authenticated or profile not found");
      }

      console.log("Submitting feedback...", {
        user_id: user.id,
        feedback_text: feedbackText,
        user_name: userProfile.full_name,
        designation: designation || "Pet Lover",
        photo_url: userProfile.profile_picture_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      });

      const { data, error } = await supabase.from("feedbacks").insert([
        {
          user_id: user.id,
          feedback_text: feedbackText,
          user_name: userProfile.full_name,
          user_designation: designation || "Pet Lover",
          user_photo_url: userProfile.profile_picture_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
        },
      ]).select();

      if (error) {
        console.error("Error submitting feedback:", error);
        throw error;
      }

      console.log("Feedback submitted successfully:", data);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted successfully.",
      });
      setFeedbackText("");
      setDesignation("");
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
    onError: (error: any) => {
      console.error("Feedback submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit feedback",
        variant: "destructive",
      });
    },
  });

  if (!user) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Card>
            <CardHeader>
              <CardTitle>Share Your Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Please login to share your feedback</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Share Your Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitFeedback.mutate();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="designation">Your Role/Title (Optional)</Label>
                <Input
                  id="designation"
                  placeholder="e.g., Pet Adopter, Volunteer, etc."
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback">Your Feedback</Label>
                <Textarea
                  id="feedback"
                  required
                  placeholder="Share your experience with us..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={5}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={submitFeedback.isPending || !feedbackText.trim()}
              >
                {submitFeedback.isPending ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};