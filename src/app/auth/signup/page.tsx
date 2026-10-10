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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50/60 p-4 dark:bg-zinc-950 font-sans">
      <Toaster position="top-right" richColors />
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/80 backdrop-blur-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Join Daymark
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Start collecting your dreams and tracking your life achievements today.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="signup-name">Your Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                id="signup-name"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-password">Password (min 8 characters)</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                required
                minLength={8}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gap-2 shadow-md cursor-pointer mt-2"
            disabled={isLoading}
          >
            <span>{isLoading ? "Creating account..." : "Create Account"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Switch to Sign In */}
        <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
