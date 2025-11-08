import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export const FeedbacksSection = () => {
  const { data: feedbacks, isLoading } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      console.log("Fetching feedbacks...");
      const { data, error } = await supabase
        .from("feedbacks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching feedbacks:", error);
        throw error;
      }
      console.log("Feedbacks fetched:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">What People Say</h2>
          <div className="text-center text-muted-foreground">Loading feedbacks...</div>
        </div>
      </section>
    );
  }

  const testimonials = feedbacks?.map((feedback) => ({
    quote: feedback.feedback_text,
    name: feedback.user_name,
    designation: feedback.user_designation || "Pet Lover",
    src: feedback.user_photo_url,
  })) || [];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">What People Say</h2>
        <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
      </div>
    </section>
  );
};