"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Client dashboard error:", error);
  }, [error]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Terjadi Kesalahan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi.
          </p>
          <Button onClick={reset} className="bg-brand-500 hover:bg-brand-600">
            Coba Lagi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
