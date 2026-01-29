# Product Requirements Document (PRD)

**TALENTARA — Platform Marketplace Talent Digital**
**Versi:** 1.0 | **Tanggal:** Januari 2025

---

## 1. Overview

### 1.1 Product Vision

TALENTARA adalah platform marketplace digital mobile-first yang menghubungkan perusahaan/brand dengan talent profesional (SPG & Usher) secara langsung, transparan, dan aman. Platform ini menggantikan proses konvensional melalui agency yang menerapkan markup harga berlebihan.

### 1.2 Target Users

| User | Deskripsi |
|---|---|
| **Talent** | SPG & Usher usia 18-35 tahun, butuh pekerjaan konsisten dengan kompensasi transparan |
| **Client** | Corporate, Brand, Event Organizer yang membutuhkan talent berkualitas secara cepat |
| **Admin** | Tim TALENTARA yang mengelola verifikasi, dispute, dan operasional platform |

### 1.3 Success Metrics (Tahun 1)

| Metrik | Target |
|---|---|
| Talent Terdaftar | 1.000 |
| Talent Terverifikasi | 500 |
| Klien Terdaftar | 100 |
| Transaksi/Bulan (Bulan 12) | 200 |
| Revenue Tahun 1 | Rp 360.000.000 |

---

## 2. User Personas

### Persona 1: Talent — Dina (SPG)

| Atribut | Detail |
|---|---|
| Nama | Dina Permata |
| Usia | 22 tahun |
| Lokasi | Semarang |
| Pekerjaan | Freelance SPG |
| Frustasi | Fee dipotong 30-50% oleh agency, pekerjaan tidak konsisten, tidak ada platform untuk showcase portofolio |
| Kebutuhan | Platform transparan yang memberi akses langsung ke klien, fee adil, pekerjaan rutin |
| Tech Savvy | Tinggi, aktif di Instagram & TikTok, terbiasa pakai aplikasi mobile |

### Persona 2: Client — Budi (Marketing Manager)

| Atribut | Detail |
|---|---|
| Nama | Budi Santoso |
| Usia | 35 tahun |
| Lokasi | Semarang |
| Pekerjaan | Marketing Manager di perusahaan consumer goods |
| Frustasi | Proses cari talent lewat agency lambat, biaya mahal, kualitas tidak konsisten |
| Kebutuhan | Akses cepat ke database talent berkualitas, filter detail, rating system, pembayaran mudah |
| Tech Savvy | Sedang, terbiasa pakai aplikasi bisnis dan e-commerce |

### Persona 3: Admin — Rani (Tim TALENTARA)

| Atribut | Detail |
|---|---|
| Nama | Rani Wijaya |
| Usia | 28 tahun |
| Peran | Operations & Quality Control |
| Tugas | Verifikasi KTP talent, verifikasi dokumen perusahaan, resolve dispute, proses withdrawal |
| Kebutuhan | Dashboard admin yang efisien, queue verifikasi, dispute management |

---

## 3. User Stories & Acceptance Criteria

### 3.1 AUTH — Landing Page

**US-001: Melihat Landing Page**
> Sebagai pengunjung baru, saya ingin melihat informasi tentang TALENTARA, sehingga saya memahami manfaat platform dan tertarik untuk mendaftar.

**Acceptance Criteria:**
- [ ] Tampil hero section dengan tagline "Where Talent Meets Opportunity" dan CTA "Daftar Sekarang"
- [ ] Tampil section "Bagaimana TALENTARA Bekerja" dengan 3-5 langkah
- [ ] Tampil section keunggulan platform (transparan, aman, cepat)
- [ ] Tampil section "Untuk Talent" dan "Untuk Perusahaan" dengan penjelasan masing-masing
- [ ] Tampil footer dengan info kontak dan link penting
- [ ] Responsive: mobile-first, tampil baik di 375px-1280px
- [ ] CTA "Daftar" dan "Login" terlihat jelas di header

---

### 3.2 AUTH — Login

**US-002: Login ke Platform**
> Sebagai user terdaftar, saya ingin login dengan email dan password, sehingga saya bisa mengakses dashboard sesuai role saya.

**Acceptance Criteria:**
- [ ] Form login: email (required, format email valid), password (required, min 8 karakter)
- [ ] Tombol "Login" disabled saat form kosong/invalid
- [ ] Jika sukses → redirect ke dashboard sesuai role (talent/client/admin)
- [ ] Jika gagal → tampilkan error message: "Email atau password salah"
- [ ] Link "Lupa Password?" tersedia
- [ ] Link "Belum punya akun? Daftar" tersedia
- [ ] Loading state saat proses login

---

### 3.3 AUTH — Register (Pilih Role)

**US-003: Memilih Role Saat Registrasi**
> Sebagai pengunjung baru, saya ingin memilih role (Talent atau Perusahaan) saat mendaftar, sehingga saya diarahkan ke form registrasi yang sesuai.

**Acceptance Criteria:**
- [ ] 2 card pilihan: "Daftar sebagai Talent" dan "Daftar sebagai Perusahaan"
- [ ] Masing-masing card menampilkan deskripsi singkat dan icon
- [ ] Klik card → navigasi ke form registrasi sesuai role
- [ ] Link "Sudah punya akun? Login" tersedia

---

### 3.4 AUTH — Register Talent

**US-004: Mendaftar sebagai Talent**
> Sebagai calon talent, saya ingin mendaftar dengan data diri lengkap, sehingga saya bisa membuat profil dan mulai mencari pekerjaan.

**Acceptance Criteria:**
- [ ] Form fields: nama lengkap*, email*, password*, konfirmasi password*, no. HP*, kategori* (SPG/Usher/Keduanya), jenis kelamin*, tanggal lahir, kota*, provinsi
- [ ] Validasi realtime: email format valid, password min 8 karakter, konfirmasi password match, HP format Indonesia (+62/08xx)
- [ ] Tombol "Daftar" disabled saat form invalid
- [ ] Jika email sudah terdaftar → error "Email sudah digunakan"
- [ ] Jika sukses → redirect ke halaman verifikasi email
- [ ] Loading state saat proses registrasi
- [ ] Field dengan tanda * wajib diisi

---

### 3.5 AUTH — Register Client

**US-005: Mendaftar sebagai Perusahaan**
> Sebagai calon klien, saya ingin mendaftar dengan data perusahaan, sehingga saya bisa mulai mencari dan booking talent.

**Acceptance Criteria:**
- [ ] Form fields: nama lengkap (PIC)*, email*, password*, konfirmasi password*, no. HP*, nama perusahaan*, jenis perusahaan (Corporate/Brand/EO), industri, kota*, provinsi
- [ ] Validasi sama seperti register talent
- [ ] Jika sukses → redirect ke halaman verifikasi email
- [ ] Loading state saat proses registrasi

---

### 3.6 AUTH — Verify Email

**US-006: Verifikasi Email**
> Sebagai user baru, saya ingin memverifikasi email saya, sehingga akun saya teraktivasi.

**Acceptance Criteria:**
- [ ] Halaman menampilkan pesan "Cek email Anda untuk link verifikasi"
- [ ] Tombol "Kirim Ulang Email" tersedia (cooldown 60 detik)
- [ ] Klik link di email → akun terverifikasi → redirect ke dashboard
- [ ] Jika link expired → tampilkan pesan error dan opsi kirim ulang

---

### 3.7 AUTH — Forgot Password

**US-007: Reset Password**
> Sebagai user, saya ingin mereset password jika lupa, sehingga saya bisa mengakses akun kembali.

**Acceptance Criteria:**
- [ ] Form input email
- [ ] Jika email terdaftar → kirim link reset password → tampilkan pesan sukses
- [ ] Jika email tidak terdaftar → tampilkan error
- [ ] Link reset → halaman form password baru (min 8 karakter + konfirmasi)
- [ ] Setelah reset sukses → redirect ke login

---

### 3.8 TALENT — Dashboard

**US-008: Melihat Dashboard Talent**
> Sebagai talent, saya ingin melihat ringkasan aktivitas saya, sehingga saya tahu kondisi pekerjaan, rating, dan saldo wallet saya.

**Acceptance Criteria:**
- [ ] Stat cards: Total Jobs Completed, Rating Rata-rata, Saldo Wallet, Status Verifikasi
- [ ] Section "Booking Terbaru" — 3-5 booking terakhir dengan status
- [ ] Section "Job Recommendations" — 3-5 job yang sesuai kategori dan kota talent
- [ ] Jika belum verifikasi KTP → tampilkan banner "Lengkapi verifikasi untuk mulai bekerja"
- [ ] Jika profil belum lengkap → tampilkan banner "Lengkapi profil Anda"
- [ ] Loading skeleton saat data belum dimuat

---

### 3.9 TALENT — Profile

**US-009: Mengelola Profil Talent**
> Sebagai talent, saya ingin mengedit profil saya, sehingga klien bisa melihat informasi lengkap tentang saya.

**Acceptance Criteria:**
- [ ] Tampilan profil: foto avatar (upload/ganti), nama, kategori, bio, kota, gender, tanggal lahir, tinggi badan, berat badan, daily rate
- [ ] Mode edit: semua field bisa diedit inline atau via form modal
- [ ] Upload foto avatar → preview sebelum simpan → upload ke Cloudinary
- [ ] Daily rate input dalam Rupiah (format: Rp 400.000)
- [ ] Tombol "Simpan" → loading → success toast "Profil berhasil diperbarui"
- [ ] Validasi: daily rate > 0, tinggi/berat angka positif, bio max 500 karakter
- [ ] Preview mode: tampilan profil seperti yang dilihat klien

---

### 3.10 TALENT — Portfolio Management

**US-010: Mengelola Portfolio**
> Sebagai talent, saya ingin mengupload foto dan video event sebelumnya, sehingga klien bisa melihat pengalaman visual saya.

**Acceptance Criteria:**
- [ ] Grid gallery menampilkan semua portfolio items (foto/video)
- [ ] Tombol "Upload" → dialog: pilih file, isi caption (optional), nama event (optional)
- [ ] Support format: JPG, PNG, WebP (max 10MB), MP4 (max 50MB)
- [ ] Preview sebelum upload
- [ ] Progress bar saat upload
- [ ] Hover/tap portfolio item → opsi hapus
- [ ] Konfirmasi dialog sebelum hapus: "Yakin ingin menghapus?"
- [ ] Drag & drop untuk reorder (nice-to-have, P2)
- [ ] Maksimal 20 portfolio items
- [ ] Empty state: "Belum ada portfolio. Upload foto event pertama Anda!"

---

### 3.11 TALENT — Experience Management

**US-011: Mengelola Pengalaman Kerja**
> Sebagai talent, saya ingin menambahkan riwayat pengalaman kerja, sehingga klien bisa melihat track record saya.

**Acceptance Criteria:**
- [ ] List pengalaman kerja, diurutkan dari terbaru
- [ ] Tombol "Tambah Pengalaman" → form: nama perusahaan*, nama event, role (SPG/Usher/dll)*, deskripsi, tanggal mulai*, tanggal selesai
- [ ] Edit: klik item → form edit terisi data existing
- [ ] Hapus: konfirmasi dialog sebelum hapus
- [ ] Validasi: tanggal selesai >= tanggal mulai
- [ ] Empty state: "Belum ada pengalaman. Tambahkan riwayat kerja Anda!"

---

### 3.12 TALENT — KTP Verification

**US-012: Verifikasi Identitas (KTP)**
> Sebagai talent, saya ingin mengupload KTP dan selfie untuk verifikasi, sehingga saya mendapat badge verified dan bisa apply job.

**Acceptance Criteria:**
- [ ] Form: nomor KTP (16 digit), upload foto KTP (clear, full frame), upload foto selfie (holding KTP)
- [ ] Preview gambar sebelum submit
- [ ] Validasi: nomor KTP harus 16 digit angka, file max 5MB, format JPG/PNG
- [ ] Status verifikasi ditampilkan: Belum Diajukan / Menunggu Review / Terverifikasi / Ditolak
- [ ] Jika ditolak → tampilkan alasan penolakan, tombol "Ajukan Ulang"
- [ ] Jika sudah verified → tampilkan badge "Verified" dan info KTP termasking
- [ ] Talent HARUS verified untuk bisa apply job

---

### 3.13 TALENT — Browse Jobs

**US-013: Mencari Lowongan Pekerjaan**
> Sebagai talent, saya ingin mencari lowongan pekerjaan yang tersedia, sehingga saya bisa menemukan pekerjaan yang sesuai.

**Acceptance Criteria:**
- [ ] Search bar: keyword search (judul, deskripsi, perusahaan)
- [ ] Filter: kategori (SPG/Usher/Semua), kota, rentang tanggal, fee minimum, fee maksimum
- [ ] Filter chips aktif ditampilkan, bisa di-clear satu per satu atau "Clear All"
- [ ] Job cards: judul, nama perusahaan, kota, tanggal, fee/hari, jumlah slot, badge (Open/Urgent)
- [ ] Sort: Terbaru, Fee Tertinggi, Fee Terendah
- [ ] Pagination atau infinite scroll
- [ ] Empty state: "Tidak ada lowongan yang sesuai filter Anda"
- [ ] Loading skeleton saat fetch data

---

### 3.14 TALENT — Job Detail

**US-014: Melihat Detail Lowongan & Apply**
> Sebagai talent, saya ingin melihat detail lowongan, sehingga saya bisa memutuskan apakah ingin melamar.

**Acceptance Criteria:**
- [ ] Info job: judul, perusahaan (dengan badge verified), deskripsi, kategori, lokasi (kota + alamat), tanggal mulai-selesai, jam kerja, fee/hari, slot tersisa, gender requirement, tinggi minimum, usia min-max, dress code, requirements
- [ ] Tombol "Apply" → dialog konfirmasi dengan optional cover message
- [ ] Jika sudah apply → tombol berubah jadi "Sudah Dilamar" (disabled)
- [ ] Jika belum verified → tombol "Verifikasi dulu untuk melamar" → link ke halaman verifikasi
- [ ] Jika slot penuh → tombol "Slot Penuh" (disabled)
- [ ] Jika job sudah expired/closed → tampilkan badge "Ditutup"

---

### 3.15 TALENT — My Applications

**US-015: Melihat Status Lamaran Saya**
> Sebagai talent, saya ingin melihat semua lamaran yang telah saya ajukan, sehingga saya bisa tracking status masing-masing.

**Acceptance Criteria:**
- [ ] Tabs: Semua, Menunggu, Diterima, Ditolak
- [ ] Application cards: judul job, perusahaan, tanggal apply, status badge (Pending/Accepted/Rejected)
- [ ] Klik card → navigasi ke job detail
- [ ] Jika diterima → tampilkan tombol atau info booking
- [ ] Counter per tab
- [ ] Empty state per tab

---

### 3.16 TALENT — My Bookings

**US-016: Melihat Daftar Booking Saya**
> Sebagai talent, saya ingin melihat semua booking pekerjaan saya, sehingga saya bisa tracking jadwal dan status.

**Acceptance Criteria:**
- [ ] Tabs: Semua, Aktif (paid/in_progress), Selesai (confirmed), Dibatalkan
- [ ] Booking cards: booking code, judul job, perusahaan, tanggal, status badge, fee yang akan diterima
- [ ] Klik card → navigasi ke booking detail
- [ ] Counter per tab
- [ ] Sort: Terbaru, Tanggal Job

---

### 3.17 TALENT — Booking Detail

**US-017: Melihat Detail Booking**
> Sebagai talent, saya ingin melihat detail booking, sehingga saya tahu informasi lengkap pekerjaan.

**Acceptance Criteria:**
- [ ] Timeline status: Pending → Paid → In Progress → Completed → Confirmed
- [ ] Info booking: booking code, tanggal dibuat, status
- [ ] Info job: judul, perusahaan, tanggal, lokasi, dress code, requirements
- [ ] Info pembayaran: fee talent, komisi platform (10%), yang diterima talent
- [ ] Tombol "Chat dengan Klien" → buka chat room
- [ ] Jika status "paid" → info "Menunggu tanggal job dimulai"
- [ ] Jika status "confirmed" → tampil review dari klien (jika ada)

---

### 3.18 TALENT — Wallet

**US-018: Melihat Saldo & Riwayat Wallet**
> Sebagai talent, saya ingin melihat saldo wallet dan riwayat pemasukan, sehingga saya tahu penghasilan saya.

**Acceptance Criteria:**
- [ ] Balance card: saldo saat ini dalam Rupiah (format: Rp 1.440.000)
- [ ] Tombol "Tarik Saldo" (disabled jika saldo < Rp 50.000)
- [ ] Riwayat transaksi: tipe (Pemasukan/Penarikan), jumlah, deskripsi, tanggal, status
- [ ] Pemasukan: hijau (+), Penarikan: merah (-)
- [ ] Filter: Semua, Pemasukan, Penarikan
- [ ] Pagination atau infinite scroll

---

### 3.19 TALENT — Withdrawal

**US-019: Menarik Saldo ke Rekening Bank**
> Sebagai talent, saya ingin menarik saldo wallet ke rekening bank saya, sehingga saya menerima uang secara fisik.

**Acceptance Criteria:**
- [ ] Form: jumlah penarikan* (min Rp 50.000, max saldo tersedia), nama bank* (dropdown: BCA, BNI, BRI, Mandiri, CIMB, dll), nomor rekening*, nama pemilik rekening*
- [ ] Tampilkan saldo tersedia di atas form
- [ ] Validasi: jumlah >= 50.000, jumlah <= saldo, nomor rekening 10-16 digit
- [ ] Konfirmasi dialog: "Tarik Rp XXX ke BCA - 1234567890 a/n DINA PERMATA?"
- [ ] Jika sukses → toast "Penarikan berhasil diajukan. Diproses dalam 1-3 hari kerja."
- [ ] Riwayat penarikan: jumlah, bank, status (Pending/Diproses/Selesai/Ditolak), tanggal

---

### 3.20 TALENT — Reviews Received

**US-020: Melihat Review yang Diterima**
> Sebagai talent, saya ingin melihat review dan rating dari klien, sehingga saya bisa mengevaluasi kinerja saya.

**Acceptance Criteria:**
- [ ] Overall rating: bintang rata-rata, jumlah review
- [ ] Sub-rating breakdown: Profesionalisme, Ketepatan Waktu, Penampilan, Komunikasi
- [ ] Distribusi rating (bar chart: 5 star = 60%, 4 star = 30%, dll)
- [ ] List review cards: nama klien, rating, komentar, tanggal, nama event/job
- [ ] Sort: Terbaru, Rating Tertinggi, Rating Terendah

---

### 3.21 CLIENT — Dashboard

**US-021: Melihat Dashboard Klien**
> Sebagai klien, saya ingin melihat ringkasan aktivitas perusahaan saya, sehingga saya tahu kondisi job dan booking.

**Acceptance Criteria:**
- [ ] Stat cards: Total Jobs Posted, Active Bookings, Total Spending, Status Verifikasi Perusahaan
- [ ] Section "Booking Terbaru" — 3-5 booking terakhir
- [ ] Section "Job Aktif" — job yang masih open
- [ ] Quick action: "Post Job Baru", "Cari Talent"
- [ ] Jika belum verifikasi → banner "Lengkapi verifikasi perusahaan"

---

### 3.22 CLIENT — Company Profile

**US-022: Mengelola Profil Perusahaan**
> Sebagai klien, saya ingin mengedit profil perusahaan, sehingga talent bisa melihat informasi perusahaan saya.

**Acceptance Criteria:**
- [ ] Form: logo perusahaan (upload), nama perusahaan, jenis (Corporate/Brand/EO), industri, NPWP, NIB, alamat, kota, provinsi, website
- [ ] Upload logo → preview → upload ke Cloudinary
- [ ] Tombol "Simpan" → loading → success toast
- [ ] Status verifikasi perusahaan ditampilkan
- [ ] Tombol "Ajukan Verifikasi" → upload dokumen legal

---

### 3.23 CLIENT — Search Talents

**US-023: Mencari Talent**
> Sebagai klien, saya ingin mencari dan memfilter talent dari database, sehingga saya bisa menemukan talent yang sesuai kebutuhan.

**Acceptance Criteria:**
- [ ] Search bar: keyword (nama, bio)
- [ ] Filters: kategori (SPG/Usher), kota, rating minimum, gender, rentang usia, tinggi minimum, availability
- [ ] Talent grid cards: foto, nama, kategori, kota, rating (bintang + angka), fee/hari, badge verified
- [ ] Sort: Rating Tertinggi, Fee Terendah, Fee Tertinggi, Terbaru
- [ ] Klik card → navigasi ke talent detail
- [ ] Pagination atau infinite scroll
- [ ] Empty state: "Tidak ada talent yang sesuai filter"

---

### 3.24 CLIENT — Talent Detail

**US-024: Melihat Detail Profil Talent**
> Sebagai klien, saya ingin melihat profil lengkap talent, sehingga saya bisa menilai kualitas dan memutuskan untuk booking.

**Acceptance Criteria:**
- [ ] Header: foto besar, nama, kategori, kota, badge verified, rating
- [ ] Bio section
- [ ] Info: gender, usia, tinggi, berat, daily rate
- [ ] Portfolio gallery: foto & video (carousel/grid), klik untuk full view
- [ ] Pengalaman kerja: list kronologis
- [ ] Reviews: overall rating + list review cards
- [ ] Tombol "Booking Talent Ini" (sticky bottom mobile)
- [ ] Tombol "Chat" → buka chat room
- [ ] Jika talent not available → badge "Tidak Tersedia"

---

### 3.25 CLIENT — Create Job

**US-025: Membuat Lowongan Pekerjaan**
> Sebagai klien, saya ingin membuat lowongan pekerjaan, sehingga talent bisa melihat dan melamar.

**Acceptance Criteria:**
- [ ] Form fields: judul*, deskripsi*, kategori* (SPG/Usher/Keduanya), tipe job (One-time/Recurring), kota*, alamat lengkap, tanggal mulai*, tanggal selesai*, jam mulai, jam selesai, fee per hari* (Rp), jumlah talent dibutuhkan*, gender requirement (Pria/Wanita/Semua), tinggi minimum, usia minimum, usia maksimum, dress code, requirements tambahan
- [ ] Validasi: tanggal mulai harus di masa depan, tanggal selesai >= tanggal mulai, fee > 0, jumlah talent >= 1
- [ ] Preview sebelum publish
- [ ] Tombol "Publish" → loading → success → redirect ke my jobs
- [ ] Tombol "Simpan Draft" → status draft (belum dipublish)

---

### 3.26 CLIENT — My Jobs

**US-026: Mengelola Job Postings**
> Sebagai klien, saya ingin melihat semua job yang saya posting, sehingga saya bisa mengelola dan monitor.

**Acceptance Criteria:**
- [ ] Tabs: Semua, Draft, Open, In Progress, Completed, Cancelled
- [ ] Job cards: judul, tanggal, fee, slots (terisi/total), status badge, jumlah applicants
- [ ] Actions: Edit (draft/open only), Batalkan, Lihat Applicants
- [ ] Counter per tab

---

### 3.27 CLIENT — Job Applicants

**US-027: Melihat dan Mengelola Lamaran**
> Sebagai klien, saya ingin melihat talent yang melamar ke job saya, sehingga saya bisa memilih talent terbaik.

**Acceptance Criteria:**
- [ ] List applicant cards: foto talent, nama, kategori, rating, kota, cover message, tanggal apply
- [ ] Tombol "Accept" → konfirmasi → create booking suggestion
- [ ] Tombol "Reject" → konfirmasi → talent dinotifikasi
- [ ] Klik nama/foto → navigasi ke talent detail (new tab)
- [ ] Filter: Pending, Accepted, Rejected
- [ ] Counter slots: "3/5 slot terisi"

---

### 3.28 CLIENT — Create Booking

**US-028: Membuat Booking Talent**
> Sebagai klien, saya ingin membooking talent untuk pekerjaan saya, sehingga talent terkonfirmasi dan saya bisa melanjutkan pembayaran.

**Acceptance Criteria:**
- [ ] Info talent: foto, nama, rating, daily rate
- [ ] Pilih job (dropdown dari job milik klien) atau input manual: tanggal mulai, tanggal selesai
- [ ] Price breakdown otomatis: Fee talent (rate x hari), Platform fee (5%), Total bayar
- [ ] Notes (optional)
- [ ] Tombol "Booking & Bayar" → lanjut ke payment
- [ ] Jika talent not available di tanggal tersebut → error message

---

### 3.29 CLIENT — My Bookings

**US-029: Melihat Daftar Booking**
> Sebagai klien, saya ingin melihat semua booking saya, sehingga saya bisa tracking status.

**Acceptance Criteria:**
- [ ] Tabs: Semua, Menunggu Bayar, Aktif, Selesai, Dibatalkan
- [ ] Booking cards: booking code, talent name + foto, job title, tanggal, total bayar, status badge
- [ ] Klik → booking detail

---

### 3.30 CLIENT — Booking Detail

**US-030: Melihat Detail Booking & Konfirmasi Selesai**
> Sebagai klien, saya ingin melihat detail booking dan mengkonfirmasi penyelesaian job.

**Acceptance Criteria:**
- [ ] Timeline status: Pending → Paid → In Progress → Completed → Confirmed
- [ ] Info talent: foto, nama, rating, kontak (setelah payment)
- [ ] Info job: judul, tanggal, lokasi, requirements
- [ ] Price breakdown: fee talent, komisi 10% talent, komisi 5% klien, total bayar
- [ ] Jika status "paid" → tombol "Chat dengan Talent"
- [ ] Jika status "paid/in_progress" → tombol "Konfirmasi Job Selesai" → dialog konfirmasi
- [ ] Setelah konfirmasi → escrow released, tampil tombol "Beri Review"
- [ ] Jika ada masalah → tombol "Laporkan Masalah" (dispute)

---

### 3.31 CLIENT — Payment

**US-031: Melakukan Pembayaran**
> Sebagai klien, saya ingin membayar booking dengan metode pembayaran yang nyaman.

**Acceptance Criteria:**
- [ ] Recap booking: talent, tanggal, price breakdown
- [ ] Tombol "Bayar Sekarang" → Midtrans Snap popup muncul
- [ ] Metode pembayaran: BCA VA, BNI VA, Mandiri VA, Permata VA, GoPay, ShopeePay, QRIS
- [ ] Setelah payment sukses → redirect ke booking detail, status berubah "Paid"
- [ ] Jika payment gagal/cancel → tampilkan pesan error, opsi retry
- [ ] Jika payment expired (24 jam) → booking otomatis cancelled
- [ ] Loading state saat proses

---

### 3.32 CLIENT — Payment History

**US-032: Melihat Riwayat Pembayaran**
> Sebagai klien, saya ingin melihat riwayat semua pembayaran saya.

**Acceptance Criteria:**
- [ ] List/table: booking code, talent name, tanggal bayar, jumlah, metode, status badge
- [ ] Filter: status (All/Paid/Expired/Failed)
- [ ] Klik → booking detail
- [ ] Total spending di atas list

---

### 3.33 CLIENT — Give Review

**US-033: Memberikan Review untuk Talent**
> Sebagai klien, saya ingin memberikan review setelah job selesai, sehingga talent mendapat feedback dan sistem rating terisi.

**Acceptance Criteria:**
- [ ] Rating overall: 1-5 bintang (required)
- [ ] Sub-ratings (1-5 bintang, optional): Profesionalisme, Ketepatan Waktu, Penampilan, Komunikasi
- [ ] Comment textarea (optional, max 500 karakter)
- [ ] Hanya bisa review jika booking status "confirmed"
- [ ] 1 review per booking
- [ ] Tombol "Kirim Review" → loading → success toast
- [ ] Setelah submit → rating talent terupdate otomatis

---

### 3.34 SHARED — Chat Room List

**US-034: Melihat Daftar Chat**
> Sebagai user, saya ingin melihat semua percakapan saya, sehingga saya bisa memilih chat yang ingin dibuka.

**Acceptance Criteria:**
- [ ] List chat rooms: avatar lawan chat, nama, pesan terakhir (truncated), waktu, unread count badge
- [ ] Sort: terbaru di atas (berdasarkan last_message_at)
- [ ] Klik room → buka percakapan
- [ ] Unread indicator (dot/badge) pada room yang ada pesan baru
- [ ] Empty state: "Belum ada percakapan"

---

### 3.35 SHARED — Chat Conversation

**US-035: Berkomunikasi via Chat**
> Sebagai user, saya ingin mengirim dan menerima pesan realtime, sehingga saya bisa berkomunikasi dengan talent/klien.

**Acceptance Criteria:**
- [ ] Chat bubbles: pesan saya (kanan, warna primary), pesan lawan (kiri, warna gray)
- [ ] Timestamp per pesan atau per group waktu
- [ ] Input bar di bawah: text input, tombol kirim
- [ ] Pesan baru muncul realtime tanpa refresh (Supabase Realtime)
- [ ] Auto-scroll ke pesan terbaru
- [ ] Loading older messages saat scroll ke atas (pagination)
- [ ] Read indicator (optional P2)
- [ ] Header: nama + avatar lawan chat, tombol back

---

### 3.36 SHARED — Notifications

**US-036: Melihat Notifikasi**
> Sebagai user, saya ingin melihat semua notifikasi penting, sehingga saya tidak melewatkan update.

**Acceptance Criteria:**
- [ ] List notifications: icon (per tipe), judul, pesan, waktu, unread indicator
- [ ] Tipe: new_job, booking_confirmed, payment_received, payment_released, review_received, verification_approved, verification_rejected
- [ ] Klik notifikasi → mark as read + navigasi ke halaman terkait
- [ ] Tombol "Tandai Semua Dibaca"
- [ ] Badge count di navigation bar (unread count)
- [ ] Empty state: "Tidak ada notifikasi"

---

### 3.37 SHARED — Account Settings

**US-037: Mengelola Pengaturan Akun**
> Sebagai user, saya ingin mengubah password atau email saya.

**Acceptance Criteria:**
- [ ] Section "Ubah Password": password lama, password baru, konfirmasi password baru
- [ ] Section "Ubah Email": email baru (memerlukan verifikasi ulang)
- [ ] Tombol "Logout" → konfirmasi → redirect ke login
- [ ] Tombol "Hapus Akun" (P2) → konfirmasi ganda

---

### 3.38 ADMIN — Dashboard

**US-038: Melihat Dashboard Admin**
> Sebagai admin, saya ingin melihat overview platform, sehingga saya bisa monitor kesehatan bisnis.

**Acceptance Criteria:**
- [ ] Stat cards: Total Talent, Total Klien, Total Booking, Total Revenue, Pending Verifications, Open Disputes, Pending Withdrawals
- [ ] Quick actions: "Review Verifikasi", "Proses Withdrawal", "Lihat Disputes"
- [ ] Grafik sederhana: booking per bulan, revenue per bulan (P1)

---

### 3.39 ADMIN — Talent Verifications

**US-039: Memverifikasi Identitas Talent**
> Sebagai admin, saya ingin memverifikasi KTP talent, sehingga hanya talent terverifikasi yang bisa bekerja.

**Acceptance Criteria:**
- [ ] List talent pending verification: foto, nama, nomor KTP, tanggal submit
- [ ] Klik → detail: foto KTP (zoomable), foto selfie (zoomable), data talent
- [ ] Tombol "Approve" → talent status verified, send notification
- [ ] Tombol "Reject" → input alasan → talent dinotifikasi, bisa resubmit
- [ ] Filter: Pending, Verified, Rejected
- [ ] Counter pending di header

---

### 3.40 ADMIN — Company Verifications

**US-040: Memverifikasi Perusahaan**
> Sebagai admin, saya ingin memverifikasi dokumen perusahaan klien.

**Acceptance Criteria:**
- [ ] List companies pending: nama perusahaan, NPWP, NIB, tanggal submit
- [ ] Detail: dokumen legal (viewable), info perusahaan lengkap
- [ ] Approve / Reject (dengan alasan)

---

### 3.41 ADMIN — Disputes Management

**US-041: Mengelola Dispute**
> Sebagai admin, saya ingin menyelesaikan dispute antara talent dan klien.

**Acceptance Criteria:**
- [ ] List disputes: booking code, raised by, reason, tanggal, status
- [ ] Detail: info booking, info talent, info klien, alasan dispute, bukti (foto/screenshot)
- [ ] Resolution: "Selesaikan untuk Talent" (release escrow) / "Selesaikan untuk Klien" (refund) / "Tutup" (tanpa action)
- [ ] Input resolusi wajib diisi
- [ ] Notifikasi ke kedua pihak setelah resolved

---

### 3.42 ADMIN — Withdrawals Management

**US-042: Memproses Penarikan Saldo**
> Sebagai admin, saya ingin memproses permintaan penarikan saldo talent.

**Acceptance Criteria:**
- [ ] List pending withdrawals: nama talent, jumlah, bank, nomor rekening, tanggal request
- [ ] Tombol "Proses" → update status ke "Processing" → lakukan transfer manual → update ke "Completed"
- [ ] Tombol "Tolak" → input alasan → saldo dikembalikan ke wallet talent
- [ ] Filter: Pending, Processing, Completed, Rejected

---

## 4. Feature Priority Matrix

### P0 — MVP Critical (HARUS ada saat launch)

| ID | Fitur | User Story |
|---|---|---|
| F01 | Register & Login (Email) | US-002, US-004, US-005 |
| F02 | Role Selection | US-003 |
| F03 | Talent Profile | US-009 |
| F04 | Company Profile | US-022 |
| F05 | Job Posting (Create) | US-025 |
| F06 | Job Search & Filter | US-013 |
| F07 | Talent Search & Filter | US-023 |
| F08 | Job Application | US-014 |
| F09 | Booking System | US-028, US-029, US-030 |
| F10 | Payment (Midtrans) | US-031 |
| F11 | Escrow (Hold & Release) | US-030 |
| F12 | Basic Dashboard (Talent & Client) | US-008, US-021 |

### P1 — MVP Important (Sebaiknya ada saat launch)

| ID | Fitur | User Story |
|---|---|---|
| F13 | Portfolio Upload | US-010 |
| F14 | Chat (Realtime) | US-034, US-035 |
| F15 | Notifications | US-036 |
| F16 | Rating & Review | US-020, US-033 |
| F17 | KTP Verification | US-012 |
| F18 | Wallet & Withdrawal | US-018, US-019 |
| F19 | Admin: Verifications | US-039, US-040 |
| F20 | Admin: Dashboard | US-038 |

### P2 — Post-MVP

| ID | Fitur | Target |
|---|---|---|
| F21 | Google OAuth Login | Bulan 2 |
| F22 | Forgot Password | Bulan 2 |
| F23 | Invoice PDF Generation | Bulan 2 |
| F24 | Email Notifications | Bulan 2 |
| F25 | Admin: Disputes | Bulan 2 |
| F26 | Advanced Analytics | Bulan 3 |
| F27 | PWA Support | Bulan 3 |
| F28 | AI Talent Matching | Bulan 4+ |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Metrik | Target |
|---|---|
| Page Load (First Contentful Paint) | < 1.5 detik |
| Page Load (Largest Contentful Paint) | < 3 detik |
| API Response Time | < 500ms (avg) |
| Time to Interactive | < 3.5 detik |
| Image Load | Lazy loading, WebP format, CDN |

### 5.2 Security

- HTTPS wajib (otomatis via Vercel)
- Data encryption at rest (Supabase default)
- Input validation dengan Zod di semua endpoints
- Row Level Security (RLS) di semua tabel database
- Midtrans webhook divalidasi dengan signature verification
- File upload: validasi tipe dan ukuran file
- Rate limiting pada auth endpoints
- Environment variables tidak pernah di-expose ke client (kecuali NEXT_PUBLIC_)

### 5.3 Accessibility

- WCAG 2.1 Level AA target
- Semantic HTML (heading hierarchy, landmarks)
- Alt text untuk semua gambar
- Keyboard navigation support
- Color contrast ratio >= 4.5:1
- Focus indicators visible
- Form labels dan error messages yang jelas

### 5.4 Scalability

| Fase | Users | Infrastruktur |
|---|---|---|
| Fase 1 (0-500 users) | Supabase Free, Vercel Free | Cukup |
| Fase 2 (500-5.000 users) | Supabase Pro, Vercel Pro | Upgrade |
| Fase 3 (5.000+ users) | Supabase Team, caching layer | Optimize |

### 5.5 Responsive Breakpoints

| Breakpoint | Device | Layout |
|---|---|---|
| 375px | iPhone SE | Mobile (single column) |
| 390px | iPhone 14 | Mobile (single column) |
| 768px | iPad | Tablet (2 columns) |
| 1024px | Laptop | Desktop (sidebar + content) |
| 1280px | Desktop | Desktop (wide sidebar + content) |

---

## 6. Business Rules

### 6.1 Komisi & Pembayaran

- Komisi talent: 10% dari fee talent (dipotong saat escrow release)
- Komisi klien: 5% dari fee talent (ditambahkan ke total bayar)
- Total komisi platform: 15% per transaksi
- Escrow: dana ditahan platform sampai klien konfirmasi job selesai
- Payment expiry: 24 jam setelah booking dibuat
- Minimum withdrawal: Rp 50.000
- Withdrawal processing: 1-3 hari kerja (manual transfer oleh admin)

### 6.2 Verifikasi

- Talent HARUS verified (KTP + selfie) untuk bisa apply job
- Client disarankan verified (dokumen legal) untuk meningkatkan trust, tapi tidak wajib untuk posting job
- Admin memproses verifikasi dalam 1x24 jam (target)

### 6.3 Rating & Review

- Hanya client yang bisa review talent
- Hanya setelah booking status "confirmed" (job selesai dikonfirmasi)
- 1 review per booking (tidak bisa edit/hapus)
- Rating 1-5 bintang overall + 4 sub-rating opsional
- Rating talent dihitung otomatis (average dari semua review)

### 6.4 Booking & Cancellation

- Booking bisa di-cancel oleh client sebelum payment (status: pending)
- Setelah payment, cancellation harus melalui dispute
- Talent tidak bisa cancel booking yang sudah paid (harus melalui dispute)
- Booking otomatis cancelled jika payment expired (24 jam)

### 6.5 Dispute

- Dispute hanya bisa diajukan setelah booking status "paid" atau "in_progress"
- Kedua pihak (talent & client) bisa ajukan dispute
- Admin menyelesaikan dispute
- Resolusi: dana ke talent (release escrow) ATAU dana ke client (refund)

---

> **TALENTARA PRD v1.0**
> PT. LAMBE TURAH GROUP | 2025
