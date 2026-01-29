"use client";

import { Briefcase, Users, Wallet, Calendar, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format";

// Placeholder data — akan diganti dengan data real dari Supabase
const stats = [
  { label: "Lowongan Aktif", value: "0", icon: Briefcase, color: "text-brand-500 bg-brand-50" },
  { label: "Total Booking", value: "0", icon: Calendar, color: "text-accent-purple-500 bg-accent-purple-50" },
  { label: "Total Pengeluaran", value: formatCurrency(0), icon: Wallet, color: "text-green-500 bg-green-50" },
  { label: "Talent Dipakai", value: "0", icon: Users, color: "text-yellow-500 bg-yellow-50" },
];

const recentBookings: { code: string; talent: string; date: string; status: string; amount: number }[] = [];

const activeJobs: { title: string; slots: string; applicants: number; status: string }[] = [];

export default function ClientDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Client</h1>
          <p className="text-muted-foreground">Kelola talent dan event Anda</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-brand-500 hover:bg-brand-600" asChild>
            <Link href="/company/jobs/create">
              <Plus className="mr-2 h-4 w-4" />
              Buat Lowongan
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/company/talents">Cari Talent</Link>
          </Button>
        </div>
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
              <Link href="/company/bookings">
                Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="mb-3 h-10 w-10 text-gray-300" />
                <p className="text-sm text-muted-foreground">Belum ada booking</p>
                <p className="text-xs text-muted-foreground">Buat lowongan atau cari talent untuk mulai</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.code} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{booking.talent}</p>
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

        {/* Active Jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Lowongan Aktif</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/company/jobs">
                Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {activeJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Briefcase className="mb-3 h-10 w-10 text-gray-300" />
                <p className="text-sm text-muted-foreground">Belum ada lowongan aktif</p>
                <Button variant="link" size="sm" className="text-brand-600" asChild>
                  <Link href="/company/jobs/create">Buat lowongan pertama</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeJobs.map((job) => (
                  <div key={job.title} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.slots} &middot; {job.applicants} pelamar</p>
                    </div>
                    <Badge variant="outline">{job.status}</Badge>
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
          <CardTitle className="text-lg">Langkah Selanjutnya</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/company">Lengkapi Profil Perusahaan</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/company/jobs/create">Pasang Lowongan</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/company/talents">Jelajahi Talent</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
