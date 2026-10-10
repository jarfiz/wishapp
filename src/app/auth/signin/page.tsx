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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50/60 p-4 dark:bg-zinc-950 font-sans">
      <Toaster position="top-right" richColors />
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/80 backdrop-blur-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sign in to Daymark
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Welcome back to your personal aspiration workspace.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="signin-email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                id="signin-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signin-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                id="signin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gap-2 shadow-md cursor-pointer mt-2"
            disabled={isLoading}
          >
            <span>{isLoading ? "Signing in..." : "Sign In"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Switch to Sign Up */}
        <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Create one for free
          </Link>
        </div>
      </div>
    </div>
  );
}
