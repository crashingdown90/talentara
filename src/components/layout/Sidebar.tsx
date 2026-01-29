"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Calendar,
  MessageSquare,
  Wallet,
  Star,
  Building2,
  Users,
  Search,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const talentNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Profil Saya", href: "/profile", icon: User },
  { label: "Lowongan", href: "/jobs", icon: Briefcase },
  { label: "Booking", href: "/bookings", icon: Calendar },
  { label: "Chat", href: "/chat", icon: MessageSquare },
  { label: "Wallet", href: "/wallet", icon: Wallet },
];

const clientNavItems: NavItem[] = [
  { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Perusahaan", href: "/company", icon: Building2 },
  { label: "Cari Talent", href: "/company/talents", icon: Search },
  { label: "Lowongan", href: "/company/jobs", icon: Briefcase },
  { label: "Booking", href: "/company/bookings", icon: Calendar },
  { label: "Chat", href: "/chat", icon: MessageSquare },
];

const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Verifikasi", href: "/admin/verifications", icon: ShieldCheck },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { isTalent, isClient, isAdmin } = useUser();

  let navItems: NavItem[] = talentNavItems;
  if (isClient) navItems = clientNavItems;
  if (isAdmin) navItems = adminNavItems;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 transform border-r bg-white transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-brand-500" : "text-gray-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
