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
    <aside className="flex h-full w-64 flex-col border-r border-zinc-200/80 bg-white/95 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/95">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-md shadow-indigo-500/20">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-zinc-900 tracking-tight dark:text-zinc-50 text-base leading-tight">
            Daymark
          </span>
          <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
            Dream. Plan. Achieve.
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
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 shadow-xs font-semibold"
                  : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-transform group-hover:scale-110",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section & Logout */}
      <div className="border-t border-zinc-100 p-3 dark:border-zinc-800/60">
        <div className="flex items-center justify-between rounded-lg p-2 hover:bg-zinc-100/60 dark:hover:bg-zinc-900 transition-colors">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold">
              {user?.name ? user.name[0]?.toUpperCase() : <User className="h-4 w-4" />}
            </div>
            <div className="flex flex-col truncate">
              <span className="truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">
                {user?.name || "Dreamer"}
              </span>
              <span className="truncate text-[11px] text-zinc-400 dark:text-zinc-500">
                {user?.email || ""}
              </span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
