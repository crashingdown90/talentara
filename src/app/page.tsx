import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Zap,
  Eye,
  UserPlus,
  Search,
  Briefcase,
  Star,
  Users,
  CheckCircle,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button size="sm" className="bg-brand-500 hover:bg-brand-600" asChild>
              <Link href="/register">Daftar Gratis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-accent-purple-50">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center md:px-6 md:py-32">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1 text-sm font-medium text-brand-700">
              <Star className="h-4 w-4" />
              Platform #1 untuk SPG &amp; Usher di Indonesia
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
              Where{" "}
              <span className="bg-gradient-to-r from-brand-600 to-accent-purple-600 bg-clip-text text-transparent">
                Talent
              </span>{" "}
              Meets{" "}
              <span className="bg-gradient-to-r from-accent-purple-600 to-brand-600 bg-clip-text text-transparent">
                Opportunity
              </span>
            </h1>
            <p className="mb-8 text-lg text-gray-600 md:text-xl">
              Platform marketplace talent digital yang menghubungkan perusahaan dengan
              talent profesional SPG &amp; Usher. Transparan, aman, dan mudah.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="w-full bg-brand-500 hover:bg-brand-600 sm:w-auto" asChild>
                <Link href="/register">
                  Daftar Sebagai Talent
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/register">Cari Talent untuk Event</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-gray-50 py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4 md:px-6">
          {[
            { value: "500+", label: "Talent Terdaftar", icon: Users },
            { value: "100+", label: "Perusahaan", icon: Briefcase },
            { value: "1.000+", label: "Event Selesai", icon: CheckCircle },
            { value: "4.8/5", label: "Rating Rata-rata", icon: Star },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto mb-2 h-6 w-6 text-brand-500" />
              <p className="text-2xl font-bold text-gray-900 md:text-3xl">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Mengapa Memilih TALENTARA?
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Kami menyediakan platform yang transparan, aman, dan mudah digunakan untuk menghubungkan talent dengan perusahaan.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Eye,
                title: "Transparan",
                description: "Harga, komisi, dan proses booking terlihat jelas. Tidak ada biaya tersembunyi.",
                color: "text-brand-500 bg-brand-50",
              },
              {
                icon: Shield,
                title: "Aman & Terpercaya",
                description: "Sistem escrow melindungi pembayaran. Dana baru dikirim setelah job selesai.",
                color: "text-green-600 bg-green-50",
              },
              {
                icon: Zap,
                title: "Cepat & Mudah",
                description: "Cari talent dalam hitungan menit. Booking langsung, tanpa ribet.",
                color: "text-accent-purple-600 bg-accent-purple-50",
              },
            ].map((item) => (
              <Card key={item.title} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Bagaimana Cara Kerjanya?
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Hanya 3 langkah mudah untuk memulai
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Daftar & Buat Profil",
                description: "Daftarkan diri Anda sebagai talent atau perusahaan. Lengkapi profil untuk meningkatkan visibilitas.",
              },
              {
                step: "2",
                title: "Cari & Temukan",
                description: "Talent: Cari lowongan yang sesuai. Perusahaan: Cari talent berdasarkan kategori, kota, dan rating.",
              },
              {
                step: "3",
                title: "Booking & Bekerja",
                description: "Booking talent atau terima job. Pembayaran aman via escrow. Selesai, terima bayaran!",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Talent & For Company */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2">
            {/* For Talent */}
            <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 p-8">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Untuk Talent</h3>
              <ul className="mb-6 space-y-3">
                {[
                  "Temukan lowongan dari perusahaan terpercaya",
                  "Profil profesional dengan portfolio",
                  "Pembayaran transparan via escrow",
                  "Rating & review untuk reputasi",
                  "Terima bayaran langsung ke rekening",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="bg-brand-500 hover:bg-brand-600" asChild>
                <Link href="/register">
                  Daftar Sebagai Talent
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* For Company */}
            <div className="rounded-2xl bg-gradient-to-br from-accent-purple-50 to-accent-purple-100 p-8">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Untuk Perusahaan</h3>
              <ul className="mb-6 space-y-3">
                {[
                  "Akses ratusan talent terverifikasi",
                  "Filter berdasarkan kategori, kota, rating",
                  "Sistem booking & pembayaran terintegrasi",
                  "Kelola event dan talent dalam satu dashboard",
                  "Escrow aman — bayar setelah job selesai",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-purple-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="bg-accent-purple-600 hover:bg-accent-purple-700 text-white" asChild>
                <Link href="/register">
                  Daftar Sebagai Client
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-600 to-accent-purple-600 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <h2 className="mb-4 text-3xl font-bold">Siap Memulai?</h2>
          <p className="mb-8 text-lg text-brand-100">
            Bergabung dengan ratusan talent dan perusahaan yang sudah menggunakan TALENTARA.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">
              Daftar Gratis Sekarang
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
