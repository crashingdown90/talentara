"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { UserMenu } from "@/components/shared/UserMenu";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { isAuthenticated } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={onMenuToggle}
              className="rounded-md p-2 hover:bg-gray-100 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <Logo size="sm" />
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link href="/notifications" className="relative rounded-md p-2 hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" />
                {/* Notification badge — akan aktif saat ada notifikasi */}
              </Link>
              <UserMenu />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
              <Button size="sm" className="bg-brand-500 hover:bg-brand-600" asChild>
                <Link href="/register">Daftar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
