"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation check
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success("Account created successfully! Please log in.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* Header */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create your account
        </h2>
        <p className="text-slate-500 mt-1 text-sm">
          Start your journey as an AI trainer.
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow-xl border border-slate-200 w-full">
        
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-slate-700 text-sm font-bold">Full name</Label>
          <Input 
            id="name"
            type="text" 
            placeholder="Jane Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 bg-slate-50"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-slate-700 text-sm font-bold">Email Address</Label>
          <Input 
            id="email"
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 bg-slate-50"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-slate-700 text-sm font-bold">Password</Label>
          <div className="relative">
            <Input 
              id="password"
              type={showPassword ? "text" : "password"} 
              placeholder="8+ chars, 1 upper, 1 number" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 bg-slate-50 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* NEW: Confirm Password Field */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-slate-700 text-sm font-bold">Confirm Password</Label>
          <div className="relative">
            <Input 
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Re-enter your password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`h-10 bg-slate-50 pr-10 ${
                confirmPassword && password !== confirmPassword ? "border-red-400 focus-visible:ring-red-400" : ""
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Inline error message if passwords don't match */}
          {confirmPassword && password !== confirmPassword && (
            <p className="text-[11px] font-medium text-red-500 mt-1">
              Passwords do not match.
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full h-10 text-sm font-bold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 mt-2"
          disabled={isLoading || (confirmPassword !== "" && password !== confirmPassword)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>

        <p className="text-[11px] text-center text-slate-500 font-medium pt-1">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link> and{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
        </p>
      </form>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}