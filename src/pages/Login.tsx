import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/trisutra-logo.png";

type AuthMode = "login" | "signup";

export default function Login() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Automatically redirect when user is authenticated
  useEffect(() => {
    if (user) {
      navigate("/account", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await signUp(email, password, name);
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Account created! Please check your email to verify.");
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Welcome back!");
        navigate("/account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/account",
      },
    });

    if (error) {
      toast.error("Google sign-in failed: " + error.message);
      return;
    }
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
      <div className="flex items-center justify-center p-8 bg-background relative">
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

          {/* Social Login */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full gap-2" onClick={handleGoogleSignIn} type="button">
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required className="bg-background" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@example.com" required className="bg-background" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "login" && (
                    <a href="#" className="text-sm text-primary hover:underline font-medium">Forgot Password?</a>
                  )}
                </div>
                <Input id="password" type="password" required className="bg-background" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-gold-foreground font-semibold" size="lg" disabled={isLoading}>
              {isLoading ? "Processing..." : (mode === "login" ? "Sign In" : "Sign Up")}
            </Button>
          </form>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-medium text-primary hover:underline">
                {mode === "login" ? "Create a Free Account" : "Sign In Here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
