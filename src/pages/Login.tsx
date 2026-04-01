import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logo from "@/assets/trisutra-logo.png";

type AuthMode = "login" | "signup";

export default function Login() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock authentication delay
    setTimeout(() => {
      setIsLoading(false);
      toast.success(mode === "login" ? "Welcome back!" : "Account created successfully!");
      navigate("/account"); // Redirect to account dashboard
    }, 1500);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Visual Side */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-primary/10 relative overflow-hidden gradient-earth">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30" style={{ backgroundImage: "var(--texture-noise)" }}></div>
        <Link to="/" className="z-10 w-fit">
          <img src={logo} alt="TriSutra Ayurveda" className="h-16 w-auto drop-shadow-sm" />
        </Link>
        <div className="z-10 max-w-sm">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
            Embrace ancient wellness in modern life.
          </h1>
          <p className="font-body text-secondary text-lg">
            Join the TriSutra community and get access to exclusive, authentic Ayurvedic formulations securely delivered to your door.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8 bg-background relative relative">
        <Link to="/" className="absolute top-8 left-8 md:hidden">
            <img src={logo} alt="TriSutra Ayurveda" className="h-12 w-auto" />
        </Link>
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
              {mode === "login" ? "Welcome Back" : "Create an Account"}
            </h2>
            <p className="font-body text-muted-foreground">
              {mode === "login" 
                 ? "Sign in to your account to view your orders and profile." 
                 : "Enter your details to register and start shopping."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required className="bg-background" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@example.com" required className="bg-background" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "login" && (
                    <a href="#" className="text-sm text-primary hover:underline font-medium">
                      Forgot Password?
                    </a>
                  )}
                </div>
                <Input id="password" type="password" required className="bg-background" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-gold-foreground font-semibold" size="lg" disabled={isLoading}>
              {isLoading 
                ? "Processing..." 
                : (mode === "login" ? "Sign In" : "Sign Up")
              }
            </Button>
          </form>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-medium text-primary hover:underline"
              >
                {mode === "login" ? "Create a Free Account" : "Sign In Here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
