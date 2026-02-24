"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, Link2, Loader2, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Failed to login");
      } else {
        toast.success("Successfully logged in!");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Description */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-indigo-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -m-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-50 transition-all"></div>
        <div className="absolute bottom-0 left-0 -m-20 w-80 h-80 bg-indigo-700 rounded-full blur-3xl opacity-50 transition-all"></div>

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Link2 className="w-8 h-8" />
            </div>
            <span className="text-3xl font-bold tracking-tight">
              HTR Link Manager
            </span>
          </div>

          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Manage your links with confidence.
          </h1>
          <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
            HTR Link Manager provides powerful analytics, UTM building, and
            secure link management for professionals who care about their data.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-400/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <span className="text-indigo-50 font-medium">
                Real-time Analytics Tracking
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-400/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <span className="text-indigo-50 font-medium">
                Professional UTM Builder
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-400/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <span className="text-indigo-50 font-medium">
                Secure Admin Dashboard
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-12 text-sm text-indigo-200">
          © {new Date().getFullYear()} HTR Link Manager. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background text-foreground">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex flex-col items-center text-center mb-8">
            <div className="flex items-center gap-2 font-bold text-2xl text-indigo-600 mb-2">
              <Link2 className="w-8 h-8" />
              <span>HTR Link Manager</span>
            </div>
            <p className="text-muted-foreground">
              Sign in to manage your short links
            </p>
          </div>

          <Card className="border-border shadow-xl shadow-slate-200/50 dark:shadow-none">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Login
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@htrcare.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="●●●●●●●●"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute right-1 top-2 h-4 w-4 text-slate-400 cursor-pointer hover:text-slate-600 hover:bg-slate-100"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
