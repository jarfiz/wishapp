import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans">
      {/* Navigation Bar */}
      <header className="flex h-16 items-center justify-between border-b border-zinc-100 px-6 sm:px-12 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Daymark
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/auth/signin">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="shadow-xs">
              Get Started Free
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 sm:py-32 px-6 sm:px-12 text-center">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/60 px-4 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Personal Wishlist • Life Goals • Achievement Tracking</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
              Dream about it. Plan for it.{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
                Achieve it.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Daymark is your private sanctuary for the life you want to build. Collect wishes with zero friction, plan realistic savings, connect purchases to milestones, and celebrate earned achievements.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2 shadow-lg shadow-indigo-500/20">
                  <span>Start Your Wishlist</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="mx-auto max-w-6xl mt-20 sm:mt-28 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <Gift className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-zinc-900 dark:text-zinc-100 text-base">
                Frictionless Wishes
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-zinc-500 leading-relaxed">
                Add an item in 3 seconds with just a name. Add estimated prices, target dates, or photos whenever you are ready.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <PiggyBank className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-zinc-900 dark:text-zinc-100 text-base">
                Savings Projections
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-zinc-500 leading-relaxed">
                Set monthly savings targets. Know exactly how many months remain until your dream is ready to purchase.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-zinc-900 dark:text-zinc-100 text-base">
                Vision Board
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-zinc-500 leading-relaxed">
                Curate a visual board of upcoming aspirations, personal motivations, and photos of what you&apos;re working toward.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                <Trophy className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-zinc-900 dark:text-zinc-100 text-base">
                Achievement Journey
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-zinc-500 leading-relaxed">
                Earn badges and XP from real milestones. Keep a lifelong history of what you accomplished and what you learned.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8 px-6 text-center text-xs text-zinc-400 dark:border-zinc-800/80">
        <p>© {new Date().getFullYear()} Daymark. Dream about it. Plan for it. Work toward it. Achieve it.</p>
      </footer>
    </div>
  );
}
