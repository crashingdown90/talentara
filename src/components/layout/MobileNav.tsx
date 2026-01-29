"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Bell,
  User,
  Search,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";

interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const talentMobileNav: MobileNavItem[] = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Lowongan", href: "/jobs", icon: Briefcase },
  { label: "Chat", href: "/chat", icon: MessageSquare },
  { label: "Notifikasi", href: "/notifications", icon: Bell },
  { label: "Profil", href: "/profile", icon: User },
];

const clientMobileNav: MobileNavItem[] = [
  { label: "Home", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Cari Talent", href: "/company/talents", icon: Search },
  { label: "Chat", href: "/chat", icon: MessageSquare },
  { label: "Notifikasi", href: "/notifications", icon: Bell },
  { label: "Perusahaan", href: "/company", icon: Building2 },
];

export function MobileNav() {
  const pathname = usePathname();
  const { isTalent, isClient } = useUser();

  const navItems = isClient ? clientMobileNav : talentMobileNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-xs",
                isActive ? "text-brand-600" : "text-gray-500"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-brand-500")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
