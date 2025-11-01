import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, PawPrint, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { GallerySection } from "@/components/home/GallerySection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, signOut } = useAuth();

  const { data: metrics } = useQuery({
    queryKey: ["site-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_metrics")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Video Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background z-10" />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center space-y-6 px-4 animate-fade-in">
            <h1 className="text-6xl md:text-8xl mb-10 font-bold text-foreground drop-shadow-lg">
              MOWGLIANS
            </h1> <br />
            <p className="text-xl md:text-2xl text-foreground/90 font-medium drop-shadow">
              Give Love, Find Love - Adopt or Donate a Pet Today
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              {user ? (
                <>
                  <Button size="lg" asChild className="shadow-lg hover:shadow-xl">
                    <Link to="/profile">My Profile</Link>
                  </Button>
                  <Button size="lg" variant="outline" onClick={signOut} className="shadow-lg hover:shadow-xl">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button size="lg" asChild className="shadow-lg hover:shadow-xl">
                  <Link to="/auth">Get Started</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      {/* Three Cards Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">How You Can Help</h2>
          <p className="text-xl text-muted-foreground">Together, we can make a difference</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2">
            <CardHeader>
              <Heart className="w-12 h-12 mb-4 text-primary" />
              <CardTitle>Adopt a Pet</CardTitle>
              <CardDescription>
                Find your perfect companion from our loving pets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Browse through pets ready for adoption and give them a forever home.
              </p>
              <Button className="w-full">View Pets</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2">
            <CardHeader>
              <PawPrint className="w-12 h-12 mb-4 text-secondary" />
              <CardTitle>Donate a Pet</CardTitle>
              <CardDescription>
                Help pets find their new loving families
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                List a pet for donation and help them find a caring home.
              </p>
              <Button className="w-full" variant="secondary" asChild>
                <Link to={user ? "/profile?tab=donate" : "/auth"}>Donate Pet</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2">
            <CardHeader>
              <DollarSign className="w-12 h-12 mb-4 text-accent" />
              <CardTitle>Fund Raise</CardTitle>
              <CardDescription>
                Support our mission to help more pets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Every contribution helps us care for more animals in need.
              </p>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Total Raised</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{Number(metrics?.total_funds || 0).toLocaleString()}
                </p>
              </div>
              <Button className="w-full" variant="default" asChild>
                <Link to="/fundraising">Donate Funds</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection />

      {/* Social Media */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Connect With Us</h2>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://www.instagram.com/solapurpet"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://chat.whatsapp.com/DoiiNrPW3cFE1Guon2AWIL"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Community
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://youtu.be/vJyGVfdaHlE"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xl font-bold mb-2">MOWGLIANS</p>
          <p className="text-muted-foreground">
            Making the world a better place for pets, one adoption at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
