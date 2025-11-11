import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, PawPrint, DollarSign } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GalleryCarousel } from "@/components/home/GalleryCarousel";
import { FeedbackForm } from "@/components/home/FeedbackForm";
import { FeedbacksSection } from "@/components/home/FeedbacksSection";
import { Footer } from "@/components/home/Footer";
import { Navbar1 } from "@/components/ui/navbar-1";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin and redirect to dashboard
  const { data: isAdmin } = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      return !!data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

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
      {/* Navbar */}
      <Navbar1 />

      {/* Hero Video Section */}
      <section className="h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background z-10" />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center space-y-4 sm:space-y-6 px-4 animate-fade-in mn-10">
            <h1 className="text-4xl sm:text-6xl md:text-8xl mb-6 sm:mb-10 font-bold text-foreground drop-shadow-lg">
              MOWGLIANS
            </h1> <br /><br />
            <p className="text-base sm:text-xl md:text-2xl text-foreground/90 font-medium drop-shadow">
              Give Love, Find Love - Adopt or Donate a Pet Today
            </p>
            <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
              {user ? (
                <Button size="lg" asChild className="shadow-lg hover:shadow-xl rounded-full">
                  <Link to="/profile">My Profile</Link>
                </Button>

              ) : (
                <Button size="lg" asChild className="shadow-lg hover:shadow-xl rounded-full mt-10">
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
      <section className="py-12 sm:py-16 lg:py-20 px-4 max-w-7xl mx-auto animate-fade-in">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">How You Can Help</h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">Together, we can make a difference</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
              <br /><br /><br />
              <Button className="w-full" asChild>
                <Link to="/adopt">View Pets</Link>
              </Button>
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
              <br /><br /><br />
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

      {/* Gallery Carousel Section */}
      <GalleryCarousel />

      {/* Feedback Form Section */}
      <FeedbackForm />

      {/* Feedbacks Display Section */}
      <FeedbacksSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
