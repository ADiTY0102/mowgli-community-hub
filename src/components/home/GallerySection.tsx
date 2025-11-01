import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const GallerySection = () => {
  const { data: images, isLoading } = useQuery({
    queryKey: ["gallery-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw error;
      return data;
    },
  });
// updated
  return (
    <section className="py-20 px-4 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Gallery</h2>
        
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading gallery...</div>
        ) : !images || images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl text-muted-foreground mb-4">No images yet</p>
            <p className="text-muted-foreground">Check back soon for photos of our adorable pets!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="aspect-square rounded-lg overflow-hidden group cursor-pointer"
                >
                  <img
                    src={image.image_url}
                    alt={image.description || "Gallery image"}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
            {images.length >= 8 && (
              <div className="text-center">
                <Button variant="outline" size="lg">
                  View More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
