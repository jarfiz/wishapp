"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight, Lock, Mail } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both email and password");
      return;
    }

    try {
      setIsLoading(true);
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        toast.error(res.error.message || "Invalid credentials");
        return;
      }

      toast.success("Welcome back to Daymark!");
      router.push("/overview");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in";
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
            Sign in to Daymark
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Welcome back to your personal aspiration workspace.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="signin-email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="signin-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-10 rounded-xl"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signin-password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="signin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-10 rounded-xl"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gap-2 shadow-md shadow-indigo-500/20 cursor-pointer mt-2 h-10 font-semibold"
            disabled={isLoading}
          >
            <span>{isLoading ? "Signing in..." : "Sign In"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Switch to Sign Up */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/auth/signup"
            className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
          >
            Create one for free
          </Link>
        </div>
      </div>
    </div>
  );
}
