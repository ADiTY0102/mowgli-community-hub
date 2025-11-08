import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export const GalleryCarousel = () => {
  const { data: images, isLoading } = useQuery({
    queryKey: ["gallery-carousel"],
    queryFn: async () => {
      console.log("Fetching gallery images for carousel...");
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching gallery:", error);
        throw error;
      }
      console.log("Gallery images fetched:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Gallery</h2>
          <div className="text-center text-muted-foreground">Loading gallery...</div>
        </div>
      </section>
    );
  }

  if (!images || images.length === 0) {
    return (
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Gallery</h2>
          <div className="text-center py-12">
            <p className="text-2xl text-muted-foreground mb-4">No images yet</p>
            <p className="text-muted-foreground">Check back soon for photos of our adorable pets!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Gallery</h2>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <div className="relative aspect-square rounded-lg overflow-hidden group">
                    <img
                      src={image.image_url}
                      alt={image.description || "Gallery image"}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    {image.description && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-white text-sm">{image.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};