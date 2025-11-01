import { AuthForm } from "@/components/auth/AuthForm";

const Auth = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background z-10" />
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
      
      {/* Auth Form Container */}
      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
