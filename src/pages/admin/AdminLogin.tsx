import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, User } from "lucide-react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In production, these should be handled by a backend auth service like Supabase Auth.
    // For local development, we use Vite environment variables or mock fallback.
    const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || "admin";
    const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || "admin123";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem("isAdminLoggedIn", "true");
      toast.success("Welcome back, Administrator.");
      navigate("/admin/dashboard");
    } else {
      toast.error("Invalid credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Admin Portal</CardTitle>
          <CardDescription>
            Enter your credentials to access the TriSutra dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  readOnly={false}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  readOnly={false}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-6">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t py-4 text-sm text-muted-foreground">
          Secure TriSutra Administrative Login
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
