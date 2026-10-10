"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight, Lock, Mail, User } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      setIsLoading(true);
      const res = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (res.error) {
        toast.error(res.error.message || "Registration failed");
        return;
      }

      toast.success("Account created! Welcome to Daymark!");
      router.push("/overview");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create account";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50/50 p-4 dark:bg-[#090A0F] font-sans transition-colors overflow-hidden">
      {/* Ambient mesh background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-500/15" />

      <Toaster position="top-right" richColors />
      <div className="relative z-10 w-full max-w-md space-y-6 rounded-3xl border border-slate-200/80 bg-white/80 p-8 sm:p-10 shadow-xl dark:border-white/[0.08] dark:bg-[#11131B]/85 backdrop-blur-2xl transition-all">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Join Daymark
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Start collecting your dreams and tracking your life achievements today.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="signup-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Your Name
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="signup-name"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 h-10 rounded-xl"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-10 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password (min 8 characters)
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-10 rounded-xl"
                required
                minLength={8}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gap-2 shadow-md shadow-indigo-500/20 cursor-pointer mt-2 h-10 font-semibold"
            disabled={isLoading}
          >
            <span>{isLoading ? "Creating account..." : "Create Account"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Switch to Sign In */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
