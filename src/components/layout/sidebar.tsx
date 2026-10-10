"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  Gift,
  Compass,
  PiggyBank,
  Eye,
  Trophy,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  onNavigate?: () => void;
}

export function Sidebar({ user, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      label: "Overview",
      href: "/overview",
      icon: LayoutDashboard,
    },
    {
      label: "My Wishlist",
      href: "/wishlist",
      icon: Gift,
    },
    {
      label: "Goals & Quests",
      href: "/goals",
      icon: Compass,
    },
    {
      label: "Savings Plans",
      href: "/savings",
      icon: PiggyBank,
    },
    {
      label: "Vision Board",
      href: "/vision-board",
      icon: Eye,
    },
    {
      label: "Achievements",
      href: "/achievements",
      icon: Trophy,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/auth/signin");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#0D0F17]/90 transition-colors">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-100 dark:border-white/[0.06]">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20">
          <Sparkles className="h-4.5 w-4.5 drop-shadow-xs" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 tracking-tight dark:text-white text-base leading-tight">
              Daymark
            </span>
            <span className="rounded-full bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              PRO
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Dream • Plan • Achieve
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/overview" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-slate-900 text-white shadow-xs dark:bg-white/[0.1] dark:text-white dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] font-semibold"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-slate-100"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                  isActive
                    ? "text-indigo-400 dark:text-indigo-300"
                    : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                )}
              />
              <span>{item.label}</span>
              {isActive && (
                <div className="absolute right-2.5 h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section & Logout */}
      <div className="border-t border-slate-100 p-3 dark:border-white/[0.06]">
        <div className="flex items-center justify-between rounded-xl p-2 bg-slate-50/60 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/[0.05] transition-colors">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white text-xs font-bold shadow-xs">
              {user?.name ? user.name[0]?.toUpperCase() : <User className="h-4 w-4" />}
            </div>
            <div className="flex flex-col truncate">
              <span className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                {user?.name || "Dreamer"}
              </span>
              <span className="truncate text-[10px] text-slate-400 dark:text-slate-500">
                {user?.email || "Personal Space"}
              </span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-white/[0.08] dark:hover:text-slate-200 cursor-pointer transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
