import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-sm text-muted-foreground">
              Platform marketplace talent digital yang menghubungkan perusahaan dengan talent profesional SPG & Usher.
            </p>
          </div>

          {/* Untuk Talent */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Untuk Talent</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/register" className="hover:text-brand-600">Daftar Sebagai Talent</Link></li>
              <li><Link href="/jobs" className="hover:text-brand-600">Cari Lowongan</Link></li>
              <li><Link href="#" className="hover:text-brand-600">Tips & Panduan</Link></li>
            </ul>
          </div>

          {/* Untuk Perusahaan */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Untuk Perusahaan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/register" className="hover:text-brand-600">Daftar Sebagai Client</Link></li>
              <li><Link href="#" className="hover:text-brand-600">Pasang Lowongan</Link></li>
              <li><Link href="#" className="hover:text-brand-600">Harga & Komisi</Link></li>
            </ul>
          </div>

          {/* Perusahaan */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">TALENTARA</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-brand-600">Tentang Kami</Link></li>
              <li><Link href="#" className="hover:text-brand-600">Syarat & Ketentuan</Link></li>
              <li><Link href="#" className="hover:text-brand-600">Kebijakan Privasi</Link></li>
              <li><Link href="#" className="hover:text-brand-600">Hubungi Kami</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TALENTARA by PT. Lambe Turah Group. All rights reserved.</p>
          <p className="mt-1">Semarang, Jawa Tengah, Indonesia</p>
        </div>
      </div>
    </footer>
  );
}
