import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { GalleryUpload } from "./GalleryUpload";

export const GalleryManager = () => {
  const queryClient = useQueryClient();

  const { data: images, isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      console.log("Admin fetching all gallery images...");
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching gallery:", error);
        throw error;
      }
      console.log("Gallery images fetched:", data);
      return data;
    },
  });

  const deleteImage = useMutation({
    mutationFn: async (imageId: string) => {
      console.log("Deleting image:", imageId);
      const { error } = await supabase
        .from("gallery")
        .delete()
        .eq("id", imageId);

      if (error) {
        console.error("Error deleting image:", error);
        throw error;
      }
      console.log("Image deleted successfully");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-carousel"] });
    },
    onError: (error: any) => {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete image",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Upload New Image</h3>
        <GalleryUpload />
      </div>

      {/* Gallery Management Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Manage Gallery Images</h3>
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading gallery...</div>
        ) : !images || images.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No images in gallery yet
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-lg overflow-hidden border"
              >
                <img
                  src={image.image_url}
                  alt={image.description || "Gallery image"}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteImage.mutate(image.id)}
                    disabled={deleteImage.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {image.description && (
                  <div className="p-2 bg-muted">
                    <p className="text-sm text-muted-foreground truncate">
                      {image.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};