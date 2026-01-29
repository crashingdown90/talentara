"use client";

import { Briefcase, Star, Wallet, Calendar, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format";

// Placeholder data — akan diganti dengan data real dari Supabase
const stats = [
  { label: "Total Job", value: "0", icon: Briefcase, color: "text-brand-500 bg-brand-50" },
  { label: "Rating", value: "0.0", icon: Star, color: "text-yellow-500 bg-yellow-50" },
  { label: "Saldo Wallet", value: formatCurrency(0), icon: Wallet, color: "text-green-500 bg-green-50" },
  { label: "Booking Aktif", value: "0", icon: Calendar, color: "text-accent-purple-500 bg-accent-purple-50" },
];

const recentBookings: { code: string; company: string; date: string; status: string; amount: number }[] = [];

const recommendedJobs: { title: string; company: string; city: string; dailyRate: number; category: string }[] = [];

export default function TalentDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Talent</h1>
        <p className="text-muted-foreground">Selamat datang di TALENTARA</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Booking Terbaru</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/bookings">
                Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="mb-3 h-10 w-10 text-gray-300" />
                <p className="text-sm text-muted-foreground">Belum ada booking</p>
                <p className="text-xs text-muted-foreground">Mulai cari lowongan yang sesuai</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.code} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{booking.company}</p>
                      <p className="text-xs text-muted-foreground">{booking.code} &middot; {booking.date}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{booking.status}</Badge>
                      <p className="mt-1 text-sm font-medium">{formatCurrency(booking.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended Jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Lowongan Terbaru</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/jobs">
                Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recommendedJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Briefcase className="mb-3 h-10 w-10 text-gray-300" />
                <p className="text-sm text-muted-foreground">Belum ada lowongan</p>
                <p className="text-xs text-muted-foreground">Lowongan baru akan muncul di sini</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recommendedJobs.map((job) => (
                  <div key={job.title} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.company} &middot; {job.city}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{job.category.toUpperCase()}</Badge>
                      <p className="mt-1 text-sm font-medium text-brand-600">{formatCurrency(job.dailyRate)}/hari</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lengkapi Profil Anda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile">Lengkapi Profil</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile#portfolio">Upload Portfolio</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/verification">Verifikasi KTP</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
