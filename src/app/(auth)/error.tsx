"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Auth error:", error);
  }, [error]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Terjadi Kesalahan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          Maaf, terjadi kesalahan saat memproses autentikasi.
        </p>
        <div className="flex flex-col gap-2">
          <Button onClick={reset} className="w-full bg-brand-500 hover:bg-brand-600">
            Coba Lagi
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">Kembali ke Login</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
