import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sparkles,
  Gift,
  PiggyBank,
  Eye,
  Trophy,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getServerSession();

  // If already authenticated, redirect straight to dashboard
  if (session?.user) {
    redirect("/overview");
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50/50 dark:bg-[#090A0F] text-slate-950 dark:text-slate-50 font-sans transition-colors overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[1000px] rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-500/15" />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/70 px-6 sm:px-12 backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#090A0F]/70">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Daymark
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/auth/signin">
            <Button variant="ghost" size="sm" className="font-semibold text-slate-600 dark:text-slate-300">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="shadow-md shadow-indigo-500/20 font-semibold">
              Get Started Free
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10">
        <section className="relative py-20 sm:py-32 px-6 sm:px-12 text-center">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
              <span>Personal Wishlist • Life Goals • Achievement Tracking</span>
            </div>

            <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              Dream about it. Plan for it.{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 bg-clip-text text-transparent">
                Achieve it.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Daymark is your private sanctuary for the life you want to build. Collect wishes with zero friction, plan realistic savings, connect purchases to milestones, and celebrate earned achievements.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2 shadow-lg shadow-indigo-500/25 px-6">
                  <span>Start Your Wishlist</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="glass" className="px-6">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="mx-auto max-w-6xl mt-20 sm:mt-28 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
            <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-xs backdrop-blur-md hover:border-slate-300 hover:shadow-xl dark:border-white/[0.07] dark:bg-[#11131B]/70 dark:hover:border-white/[0.14] transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-xs">
                <Gift className="h-5 w-5 stroke-[1.8]" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">
                Frictionless Wishes
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Add an item in 3 seconds with just a name. Add estimated prices, target dates, or photos whenever you are ready.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-xs backdrop-blur-md hover:border-slate-300 hover:shadow-xl dark:border-white/[0.07] dark:bg-[#11131B]/70 dark:hover:border-white/[0.14] transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
                <PiggyBank className="h-5 w-5 stroke-[1.8]" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">
                Savings Projections
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Set monthly savings targets. Know exactly how many months remain until your dream is ready to purchase.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-xs backdrop-blur-md hover:border-slate-300 hover:shadow-xl dark:border-white/[0.07] dark:bg-[#11131B]/70 dark:hover:border-white/[0.14] transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-xs">
                <Eye className="h-5 w-5 stroke-[1.8]" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">
                Vision Board
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Curate a visual board of upcoming aspirations, personal motivations, and photos of what you&apos;re working toward.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-xs backdrop-blur-md hover:border-slate-300 hover:shadow-xl dark:border-white/[0.07] dark:bg-[#11131B]/70 dark:hover:border-white/[0.14] transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-xs">
                <Trophy className="h-5 w-5 stroke-[1.8]" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">
                Achievement Journey
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Earn badges and XP from real milestones. Keep a lifelong history of what you accomplished and what you learned.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 py-8 px-6 text-center text-xs text-slate-400 dark:border-white/[0.07]">
        <p>© {new Date().getFullYear()} Daymark. Dream about it. Plan for it. Work toward it. Achieve it.</p>
      </footer>
    </div>
  );
}
