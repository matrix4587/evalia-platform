"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid email or password.");
        return;
      }

      toast.success("Logged in successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // THE FIX: Removed max-w-md from here since the layout wrapper handles it
    <div className="space-y-8 w-full">
      
      {/* Header */}
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-slate-500 mt-2 text-lg">
          Log in to continue earning.
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 font-bold">Email Address</Label>
          <Input 
            id="email"
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-slate-50"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-slate-700 font-bold">Password</Label>
            <Link href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input 
              id="password"
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-slate-50 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-11 text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
            </>
          ) : (
            "Log in"
          )}
        </Button>
      </form>

      {/* Footer Links */}
      <p className="text-center text-slate-600">
        Don't have an account?{" "}
        <Link href="/register" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}