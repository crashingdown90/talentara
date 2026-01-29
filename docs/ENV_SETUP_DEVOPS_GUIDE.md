# Environment Setup & DevOps Guide

**TALENTARA — Platform Marketplace Talent Digital**
**Versi:** 1.0 | **Tanggal:** Januari 2025

---

## 1. Prerequisites

### 1.1 Software yang Dibutuhkan

| Software | Versi | Cara Install |
|---|---|---|
| Node.js | v20+ LTS | `nvm install 20` atau download di nodejs.org |
| npm | v10+ | Bundled dengan Node.js |
| Git | Latest | `brew install git` (Mac) / download di git-scm.com |
| VS Code | Latest | Download di code.visualstudio.com |
| Supabase CLI | Latest | `npm install -g supabase` |
| Vercel CLI | Latest | `npm install -g vercel` |

### 1.2 Install Node.js via NVM

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# Restart terminal, lalu:
nvm install 20
nvm use 20
nvm alias default 20

# Verifikasi
node --version   # v20.x.x
npm --version    # v10.x.x
```

### 1.3 VS Code Extensions (Recommended)

| Extension | Fungsi |
|---|---|
| ESLint | JavaScript/TypeScript linting |
| Prettier | Code formatting |
| Tailwind CSS IntelliSense | Autocomplete Tailwind classes |
| Auto Rename Tag | Rename paired HTML/JSX tags |
| GitLens | Git blame, history |
| Error Lens | Inline error display |
| Thunder Client | REST API testing (alternatif Postman) |

### 1.4 Akun yang Dibutuhkan

| Service | URL | Plan |
|---|---|---|
| GitHub | github.com | Free |
| Supabase | supabase.com | Free tier |
| Midtrans | midtrans.com | Sandbox (gratis) |
| Cloudinary | cloudinary.com | Free tier |
| Resend | resend.com | Free tier |
| Vercel | vercel.com | Hobby (free) |

---

## 2. Project Setup dari Nol

### 2.1 Create Next.js Project

```bash
# Buat project
npx create-next-app@latest talentara \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd talentara
```

### 2.2 Install Dependencies

```bash
# Production dependencies
npm install \
  @supabase/ssr \
  @supabase/supabase-js \
  midtrans-client \
  resend \
  zustand \
  zod \
  react-hook-form \
  @hookform/resolvers \
  class-variance-authority \
  clsx \
  tailwind-merge \
  lucide-react \
  date-fns

# Dev dependencies
npm install -D \
  vitest \
  @vitejs/plugin-react
```

### 2.3 Setup shadcn/ui

```bash
# Initialize
npx shadcn@latest init

# Saat ditanya pilih:
# Style: New York
# Base color: Zinc
# CSS variables: Yes

# Install komponen yang dibutuhkan
npx shadcn@latest add \
  button input card dialog select badge avatar \
  tabs table skeleton toast dropdown-menu sheet \
  separator label textarea form
```

### 2.4 Setup Folder Structure

```bash
# Components
mkdir -p src/components/{ui,layout,auth,talent,client,jobs,bookings,payments,chat,reviews,shared}

# Library
mkdir -p src/lib/{supabase,midtrans,cloudinary,email/templates,utils,validations}

# Hooks, Stores, Types
mkdir -p src/{hooks,stores,types}

# Supabase migrations
mkdir -p supabase/migrations

# Public assets
mkdir -p public/images
```

### 2.5 Setup Environment File

```bash
# Copy template
cp .env.example .env.local
```

Buat file `.env.example`:

```env
# =============================
# APP
# =============================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=TALENTARA

# =============================
# SUPABASE
# =============================
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# =============================
# MIDTRANS
# =============================
MIDTRANS_SERVER_KEY=
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false

# =============================
# CLOUDINARY
# =============================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# =============================
# RESEND (Email)
# =============================
RESEND_API_KEY=

# =============================
# CONFIG
# =============================
NEXT_PUBLIC_COMMISSION_TALENT=0.10
NEXT_PUBLIC_COMMISSION_CLIENT=0.05
```

---

## 3. Supabase Setup

### 3.1 Buat Project Baru

1. Buka [supabase.com](https://supabase.com) → Login/Sign Up
2. Klik **"New Project"**
3. Isi form:
   - **Organization:** Pilih atau buat baru
   - **Project name:** `talentara`
   - **Database password:** (catat password ini!)
   - **Region:** Southeast Asia (Singapore) — terdekat ke Indonesia
4. Klik **"Create new project"**
5. Tunggu ~2 menit sampai project ready

### 3.2 Catat Credentials

Di Supabase Dashboard → **Settings** → **API**:

| Key | Di mana | Copy ke .env.local |
|---|---|---|
| Project URL | Settings > API > URL | `NEXT_PUBLIC_SUPABASE_URL` |
| anon public key | Settings > API > Project API keys | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| service_role key | Settings > API > Project API keys | `SUPABASE_SERVICE_ROLE_KEY` |

> **PENTING:** `service_role key` SANGAT RAHASIA. Jangan pernah expose ke frontend atau commit ke Git!

### 3.3 Setup Database Schema

**Opsi 1: Via SQL Editor (Recommended untuk pertama kali)**

1. Buka Supabase Dashboard → **SQL Editor**
2. Klik **"New query"**
3. Copy-paste SQL dari `IMPLEMENTATION_GUIDE.md` bagian **3.2 SQL Schema Lengkap**
4. Klik **"Run"**
5. Verifikasi di **Table Editor** — harus ada 16 tabel

**Opsi 2: Via Migration Files**

```bash
# Buat migration files satu per satu
# Edit setiap file dengan SQL yang sesuai

# Lalu push ke Supabase
npx supabase db push
```

**Urutan Migration:**
1. `00001_create_profiles.sql` — profiles table
2. `00002_create_talents.sql` — talents + portfolios + experiences
3. `00003_create_companies.sql` — companies table
4. `00004_create_jobs.sql` — jobs + applications
5. `00005_create_bookings.sql` — bookings table
6. `00006_create_payments.sql` — payments + escrow
7. `00007_create_chat.sql` — chat_rooms + messages
8. `00008_create_notifications.sql` — notifications
9. `00009_create_withdrawals.sql` — withdrawals
10. `00010_create_disputes.sql` — disputes
11. `00011_create_rls_policies.sql` — Row Level Security
12. `00012_create_triggers.sql` — triggers + functions
13. `00013_create_indexes.sql` — performance indexes

### 3.4 Setup Authentication

1. Dashboard → **Authentication** → **Providers**
2. **Email** provider: sudah enabled by default
3. Dashboard → **Authentication** → **URL Configuration**:
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs:** Tambahkan:
     - `http://localhost:3000/api/auth/callback`
     - `http://localhost:3000/**` (untuk development)

**Setup Google OAuth (Optional, P2):**
1. Buka [console.cloud.google.com](https://console.cloud.google.com)
2. Buat project baru atau pilih existing
3. **APIs & Services** → **Credentials** → **Create credentials** → **OAuth 2.0 Client ID**
4. Application type: **Web application**
5. Authorized redirect URIs: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
6. Copy **Client ID** dan **Client Secret**
7. Di Supabase → **Authentication** → **Providers** → **Google** → Enable → Paste credentials

### 3.5 Setup Storage Buckets

1. Dashboard → **Storage** → **New bucket**
2. Buat 3 buckets:

| Bucket | Public | Deskripsi |
|---|---|---|
| `avatars` | Yes | Foto profil user |
| `portfolios` | Yes | Portfolio talent (foto/video) |
| `documents` | No | KTP, dokumen legal (private) |

3. Set policies untuk setiap bucket:

**Bucket `avatars` (SQL di SQL Editor):**
```sql
-- Allow authenticated uploads
CREATE POLICY "Avatar upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.role() = 'authenticated'
  );

-- Allow public read
CREATE POLICY "Avatar public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Allow own delete
CREATE POLICY "Avatar delete own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Bucket `portfolios`:** Sama seperti avatars
**Bucket `documents`:** Hanya authenticated upload, admin-only read

### 3.6 Enable Realtime

1. Dashboard → **Database** → **Replication**
2. Enable realtime untuk tabel:
   - `chat_messages`
   - `notifications`
3. Atau via SQL:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

### 3.7 Generate TypeScript Types

```bash
# Install Supabase CLI jika belum
npm install -g supabase

# Login
npx supabase login

# Generate types
npx supabase gen types typescript \
  --project-id YOUR_PROJECT_ID \
  > src/types/database.ts

# Atau tambahkan ke package.json scripts:
# "db:types": "supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts"
```

---

## 4. Midtrans Setup

### 4.1 Daftar Akun

1. Buka [midtrans.com](https://midtrans.com) → **Daftar**
2. Lengkapi form registrasi
3. Setelah login → otomatis masuk ke **Sandbox Environment**

### 4.2 Ambil API Keys

1. Dashboard → **Settings** → **Access Keys**
2. Catat:

| Key | Contoh Format | Copy ke .env.local |
|---|---|---|
| Server Key | `SB-Mid-server-XXXXXXX` | `MIDTRANS_SERVER_KEY` |
| Client Key | `SB-Mid-client-XXXXXXX` | `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` |

> **SB-** prefix artinya Sandbox. Production key tidak ada prefix SB.

### 4.3 Setup Webhook (Payment Notification URL)

1. Dashboard → **Settings** → **Configuration**
2. **Payment Notification URL:** (kosongkan dulu untuk local dev)

**Untuk Local Development — Gunakan ngrok:**

```bash
# Install ngrok
npm install -g ngrok

# Atau download di ngrok.com dan buat akun (gratis)

# Jalankan Next.js dev server dulu
npm run dev

# Di terminal baru, jalankan ngrok
ngrok http 3000

# Output:
# Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000

# Copy URL ngrok ke Midtrans Dashboard:
# Payment Notification URL: https://abc123.ngrok-free.app/api/payments/webhook
```

> **PENTING:** ngrok URL berubah setiap restart (free tier). Update di Midtrans Dashboard jika restart.

### 4.4 Enable Payment Methods

1. Dashboard → **Settings** → **Snap Preferences**
2. Di Sandbox, semua metode sudah aktif secara default:
   - Bank Transfer: BCA, BNI, BRI, Mandiri, Permata
   - E-Wallet: GoPay, ShopeePay
   - QRIS
   - Credit Card (Visa, Mastercard)

### 4.5 Sandbox Test Data

**Credit Card:**

| Field | Value |
|---|---|
| Card Number | `4811 1111 1111 1114` |
| CVV | `123` |
| Exp Date | Any future date (contoh: `12/25`) |
| OTP | `112233` |

**Bank Transfer:**
1. Pilih bank transfer saat Snap popup
2. Copy nomor VA yang diberikan
3. Buka [Midtrans Sandbox Simulator](https://simulator.sandbox.midtrans.com/)
4. Pilih **Bank Transfer** → Pilih bank → Masukkan nomor VA → **Pay**
5. Webhook akan dikirim ke notification URL

**GoPay / QRIS:**
1. Scan QR code yang muncul di Snap
2. Buka Midtrans Sandbox Simulator
3. Pilih GoPay/QRIS → Scan/input → **Pay**

### 4.6 Add Midtrans Script di Layout

Di `src/app/layout.tsx`, tambahkan Midtrans Snap script:

```tsx
// Tambahkan di <head> atau sebelum </body>
<Script
  src="https://app.sandbox.midtrans.com/snap/snap.js"
  data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
  strategy="lazyOnload"
/>
```

> **Production:** Ganti `app.sandbox.midtrans.com` → `app.midtrans.com`

---

## 5. Cloudinary Setup

### 5.1 Buat Akun

1. Buka [cloudinary.com](https://cloudinary.com) → **Sign Up Free**
2. Setelah login → Dashboard

### 5.2 Catat Credentials

| Key | Di mana | Copy ke .env.local |
|---|---|---|
| Cloud Name | Dashboard > top-right | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` |
| API Key | Settings > Access Keys | `CLOUDINARY_API_KEY` |
| API Secret | Settings > Access Keys | `CLOUDINARY_API_SECRET` |

### 5.3 Buat Upload Preset

1. Dashboard → **Settings** → **Upload** → **Upload presets**
2. Klik **"Add upload preset"**
3. Isi:
   - **Preset name:** `talentara_unsigned`
   - **Signing Mode:** **Unsigned** (agar bisa upload dari frontend)
   - **Folder:** `talentara`
   - **Allowed formats:** `jpg, jpeg, png, webp, mp4`
   - **Max file size:** `10000000` (10MB) untuk image, `52428800` (50MB) untuk video
4. **Save**
5. Copy preset name ke `.env.local`: `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=talentara_unsigned`

### 5.4 Free Tier Limits

| Metrik | Limit |
|---|---|
| Storage | 25 GB |
| Bandwidth | 25 GB/bulan |
| Transformations | 25.000/bulan |
| Video | Hingga 500MB total |

> Cukup untuk MVP. Upgrade saat kebutuhan meningkat (~$89/bulan untuk Plus plan).

### 5.5 Image Transformation Cheatsheet

```
// Avatar thumbnail (150x150, crop face)
/w_150,h_150,c_fill,g_face,q_auto,f_auto/

// Portfolio card (400x300)
/w_400,h_300,c_fill,q_auto,f_auto/

// Portfolio full (max 1200px width, auto quality)
/w_1200,c_limit,q_auto,f_auto/

// KTP preview (600px, blur sensitive areas)
/w_600,q_auto,f_auto/
```

---

## 6. Resend Email Setup

### 6.1 Buat Akun & API Key

1. Buka [resend.com](https://resend.com) → **Sign Up**
2. Dashboard → **API Keys** → **Create API Key**
3. Copy ke `.env.local`: `RESEND_API_KEY=re_XXXXXXXXX`

### 6.2 Sender Configuration

**Development:**
- Gunakan `onboarding@resend.dev` sebagai sender (gratis, tanpa verifikasi)

**Production:**
1. Dashboard → **Domains** → **Add Domain**
2. Masukkan domain: `talentara.com`
3. Tambahkan DNS records yang diberikan (MX, TXT/SPF, DKIM)
4. Tunggu verifikasi (~10 menit - 24 jam)
5. Setelah verified, gunakan `noreply@talentara.com` sebagai sender

### 6.3 Free Tier Limits

| Metrik | Limit |
|---|---|
| Emails/hari | 100 |
| Emails/bulan | 3.000 |
| Domains | 1 |

> Cukup untuk fase awal. Upgrade ke Pro ($20/bulan) untuk 50.000 email/bulan.

### 6.4 Email Templates yang Dibutuhkan

| Template | Trigger | Prioritas |
|---|---|---|
| Welcome | Setelah registrasi | P1 |
| Email Verification | Setelah registrasi | P0 (handled by Supabase) |
| Booking Confirmed | Payment sukses → talent | P1 |
| Payment Receipt | Payment sukses → client | P1 |
| Payment Released | Escrow released → talent | P1 |
| Verification Approved | Admin approve → talent/company | P1 |
| Verification Rejected | Admin reject → talent/company | P1 |
| New Review | Review submitted → talent | P2 |
| Withdrawal Processed | Admin process withdrawal | P1 |

---

## 7. Git Workflow

### 7.1 Initial Repository Setup

```bash
# Di folder project talentara/
git init
git add .
git commit -m "chore: initial project setup with Next.js 15 + TypeScript + Tailwind"

# Buat repo di GitHub (via web atau CLI)
gh repo create talentara --private --source=. --remote=origin --push

# Atau manual:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/talentara.git
git push -u origin main
```

### 7.2 Branching Strategy

```
main ─────────────────────────────────── (production)
  │
  └── develop ────────────────────────── (development integration)
        │
        ├── feature/auth ─────────────── (fitur authentication)
        ├── feature/talent-profile ────── (fitur profil talent)
        ├── feature/booking ──────────── (fitur booking)
        ├── fix/payment-webhook ───────── (bug fix)
        └── hotfix/critical-error ─────── (production hotfix)
```

**Aturan:**
- `main` — Production. **Protected branch.** Hanya merge dari `develop` (release) atau `hotfix/`
- `develop` — Development. Semua feature branch merge ke sini
- `feature/xxx` — Fitur baru, branch dari `develop`
- `fix/xxx` — Bug fix, branch dari `develop`
- `hotfix/xxx` — Critical fix, branch dari `main`

### 7.3 Git Workflow Harian

```bash
# 1. Pastikan develop up-to-date
git checkout develop
git pull origin develop

# 2. Buat feature branch
git checkout -b feature/auth

# 3. Coding... commit berkala
git add src/app/(auth)/login/page.tsx src/components/auth/login-form.tsx
git commit -m "feat(auth): implement login page UI"

git add src/app/api/auth/login/route.ts
git commit -m "feat(auth): implement login API endpoint"

# 4. Push feature branch
git push -u origin feature/auth

# 5. Buat Pull Request di GitHub (develop ← feature/auth)
gh pr create --base develop --title "feat(auth): implement authentication" --body "..."

# 6. Setelah review → Merge PR

# 7. Hapus feature branch
git checkout develop
git pull origin develop
git branch -d feature/auth
```

### 7.4 Commit Message Convention

Format: `type(scope): description`

| Type | Kapan Digunakan | Contoh |
|---|---|---|
| `feat` | Fitur baru | `feat(auth): implement talent registration` |
| `fix` | Bug fix | `fix(payment): handle expired webhook correctly` |
| `docs` | Dokumentasi | `docs(readme): update setup instructions` |
| `style` | Formatting (no logic change) | `style(ui): fix button alignment on mobile` |
| `refactor` | Restructure code | `refactor(api): extract validation logic` |
| `test` | Tambah/update test | `test(commission): add edge case tests` |
| `chore` | Maintenance | `chore(deps): update supabase to v2.45` |

### 7.5 .gitignore

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Build
.next/
out/
build/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Vercel
.vercel

# IDE
.vscode/settings.json
.idea/
*.swp
*.swo
.DS_Store

# Supabase
supabase/.temp/

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Testing
coverage/
```

---

## 8. Vercel Deployment

### 8.1 Connect GitHub Repository

1. Buka [vercel.com](https://vercel.com) → Login dengan GitHub
2. **"Add New..."** → **"Project"**
3. **Import Git Repository** → Pilih `talentara`
4. **Configure Project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./`
   - **Build Command:** `next build` (default)
   - **Output Directory:** `.next` (default)
5. **Environment Variables:** Tambahkan SEMUA env vars (lihat bagian 7.1)
6. Klik **"Deploy"**

### 8.2 Set Environment Variables di Vercel

Dashboard → Project → **Settings** → **Environment Variables**

Tambahkan SEMUA variables dari `.env.local`. Untuk setiap variable, pilih environments:
- **Production** ✅
- **Preview** ✅
- **Development** ✅

> **PENTING:** Untuk production, ganti value dengan production credentials:
> - Supabase: Gunakan production project (atau sama jika belum scale)
> - Midtrans: Ganti Sandbox key → Production key
> - NEXT_PUBLIC_APP_URL: `https://talentara.com`

### 8.3 Custom Domain

1. Dashboard → Project → **Settings** → **Domains**
2. Add domain: `talentara.com`
3. Vercel akan memberikan DNS records:

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

4. Tambahkan records di domain registrar (Niagahoster, Namecheap, dll)
5. Tunggu propagasi DNS (~5 menit - 48 jam)
6. SSL otomatis by Vercel (Let's Encrypt)

### 8.4 Auto-Deploy

| Trigger | Deploy Target | URL |
|---|---|---|
| Push to `main` | Production | `talentara.com` |
| Push to `develop` | Preview | `develop-talentara.vercel.app` |
| Pull Request | Preview | `pr-123-talentara.vercel.app` |

Setiap PR otomatis mendapat preview URL untuk testing sebelum merge.

---

## 9. Local Development Workflow

### 9.1 Daily Development

```bash
# Start development server (with Turbopack for faster builds)
npm run dev

# Browser buka: http://localhost:3000

# Run tests (in another terminal)
npm run test

# Type check
npx tsc --noEmit

# Lint check
npm run lint

# Test production build locally
npm run build && npm start
```

### 9.2 Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "db:push": "supabase db push",
    "db:reset": "supabase db reset",
    "db:types": "supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts"
  }
}
```

### 9.3 Database Changes Workflow

```bash
# 1. Buat file migration baru
touch supabase/migrations/00014_add_new_field.sql

# 2. Tulis SQL di file tersebut
# ALTER TABLE talents ADD COLUMN skill_tags TEXT[];

# 3. Push ke Supabase
npm run db:push

# 4. Regenerate TypeScript types
npm run db:types

# 5. Commit
git add supabase/migrations/00014_add_new_field.sql src/types/database.ts
git commit -m "feat(db): add skill_tags field to talents table"
```

### 9.4 Testing Payment (Midtrans Sandbox)

**Step-by-step:**

1. **Pastikan ngrok running** dan notification URL sudah di-set di Midtrans Dashboard

2. **Buat booking di app** (login sebagai client → booking talent)

3. **Klik "Bayar"** → Midtrans Snap popup muncul

4. **Pilih metode pembayaran** (contoh: Bank Transfer → BCA)

5. **Copy nomor Virtual Account** yang diberikan

6. **Buka Midtrans Simulator:**
   - URL: `https://simulator.sandbox.midtrans.com/`
   - Pilih **Bank Transfer** → **BCA**
   - Masukkan **nomor VA**
   - Klik **"Pay"**

7. **Webhook dikirim ke app:**
   - Check terminal/logs: `POST /api/payments/webhook` → 200
   - Payment status → `paid`
   - Booking status → `paid`
   - Escrow → `held`

8. **Verifikasi di app:**
   - Buka booking detail
   - Status harus berubah: "Paid" / "Confirmed"
   - Talent menerima notifikasi

### 9.5 Testing Realtime Chat

1. Buka **2 browser window** (atau 1 normal + 1 incognito)
2. **Window 1:** Login sebagai talent
3. **Window 2:** Login sebagai client
4. Buka chat room yang sama di kedua window
5. Kirim pesan dari Window 1 → **Harus muncul realtime di Window 2** tanpa refresh
6. Kirim pesan dari Window 2 → **Harus muncul realtime di Window 1**

---

## 10. Monitoring & Logging

### 10.1 Vercel Analytics (Built-in)

1. Dashboard → Project → **Analytics**
2. Monitor Web Vitals:
   - **LCP** (Largest Contentful Paint) — target < 3s
   - **FID** (First Input Delay) — target < 100ms
   - **CLS** (Cumulative Layout Shift) — target < 0.1
   - **TTFB** (Time to First Byte) — target < 500ms

### 10.2 Vercel Logs

1. Dashboard → Project → **Logs**
2. Filter by: Function, Edge, Build, Static
3. Real-time logs untuk debugging production issues

### 10.3 Supabase Dashboard Monitoring

| Metrik | Di mana |
|---|---|
| Database size | Dashboard > Database > Database Size |
| API requests | Dashboard > Reports > API |
| Auth users | Dashboard > Authentication > Users |
| Storage usage | Dashboard > Storage > Usage |
| Realtime connections | Dashboard > Reports > Realtime |

### 10.4 Error Tracking — Sentry (Post-MVP)

```bash
# Install
npx @sentry/wizard@latest -i nextjs

# Atau manual:
npm install @sentry/nextjs

# Follow setup wizard
# - Masukkan Sentry DSN
# - Configure sentry.server.config.ts
# - Configure sentry.client.config.ts
# - Configure sentry.edge.config.ts
```

Free tier: 5.000 errors/bulan — cukup untuk MVP.

### 10.5 Uptime Monitoring — UptimeRobot (Free)

1. Buka [uptimerobot.com](https://uptimerobot.com) → Sign Up (free)
2. **Add New Monitor:**
   - Type: HTTP(S)
   - URL: `https://talentara.com`
   - Monitoring Interval: 5 minutes
3. Set alert via email
4. Free tier: 50 monitors, 5 min interval

---

## 11. Security Checklist

### Pre-Launch Checklist

| # | Item | Status |
|---|---|---|
| 1 | `.env.local` ada di `.gitignore` | [ ] |
| 2 | `SUPABASE_SERVICE_ROLE_KEY` hanya digunakan di server-side code | [ ] |
| 3 | Midtrans webhook divalidasi dengan SHA-512 signature | [ ] |
| 4 | RLS (Row Level Security) enabled di SEMUA tabel Supabase | [ ] |
| 5 | Input validation (Zod) di semua API Route Handlers | [ ] |
| 6 | File upload validasi: tipe file + ukuran max | [ ] |
| 7 | CSP headers configured untuk Midtrans script | [ ] |
| 8 | HTTPS enforced (otomatis di Vercel) | [ ] |
| 9 | Tidak ada `console.log` sensitive data di production | [ ] |
| 10 | Rate limiting pada auth endpoints (register, login) | [ ] |
| 11 | CORS configured jika diperlukan | [ ] |
| 12 | Admin routes dilindungi middleware (role check) | [ ] |
| 13 | SQL injection protection (parameterized queries — default Supabase) | [ ] |
| 14 | XSS protection (React default escape + CSP) | [ ] |

---

## 12. Troubleshooting

### Supabase Connection Error

**Gejala:** `Failed to fetch`, `Network Error`
**Solusi:**
- Cek `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di `.env.local`
- Pastikan URL format: `https://xxxxx.supabase.co` (tanpa trailing slash)
- Cek Supabase Dashboard apakah project masih active

### Midtrans Webhook Not Received

**Gejala:** Payment sukses di Midtrans tapi status di app tidak berubah
**Solusi:**
- Pastikan ngrok masih running: `ngrok http 3000`
- Cek notification URL di Midtrans Dashboard sudah benar
- Cek terminal logs: ada request masuk ke `/api/payments/webhook`?
- Test manual: `curl -X POST http://localhost:3000/api/payments/webhook -d '...'`

### Cloudinary Upload Fails

**Gejala:** Upload error 400/401
**Solusi:**
- Cek `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` dan `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- Pastikan upload preset mode: **Unsigned**
- Cek file size tidak melebihi limit (10MB image, 50MB video)
- Cek format file diizinkan (jpg, png, webp, mp4)

### Auth Cookies Not Set

**Gejala:** Login sukses tapi redirect ke login lagi
**Solusi:**
- Pastikan `@supabase/ssr` digunakan (bukan `@supabase/auth-helpers-nextjs` yang deprecated)
- Cek middleware.ts — cookies harus di-pass correctly
- Clear browser cookies dan coba lagi
- Cek Console: ada error cookies di browser?

### RLS Policy Blocking Queries

**Gejala:** Query return empty array/null padahal data ada
**Solusi:**
- Cek di Supabase SQL Editor tanpa RLS: `SELECT * FROM table_name;`
- Cek RLS policies: Dashboard → Authentication → Policies
- Pastikan user yang login punya akses sesuai policy
- Test dengan service_role key (bypass RLS) untuk debugging

### TypeScript Type Errors After DB Change

**Gejala:** Type mismatch setelah alter table
**Solusi:**
```bash
# Regenerate types
npm run db:types

# Restart TypeScript server di VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Hydration Mismatch Error

**Gejala:** `Text content does not match server-rendered HTML`
**Solusi:**
- Pastikan tidak ada conditional rendering berdasarkan `window` atau `localStorage` di initial render
- Gunakan `useEffect` untuk client-only logic
- Gunakan `dynamic import` dengan `{ ssr: false }` untuk client-only components

### Build Error di Vercel

**Gejala:** Local build OK, Vercel build fails
**Solusi:**
- Cek environment variables di Vercel Dashboard sudah lengkap
- Cek Vercel build logs untuk error spesifik
- Test locally: `npm run build` — harus pass tanpa error
- Pastikan semua `NEXT_PUBLIC_` vars ada di Vercel (diperlukan saat build time)

---

## 13. Production Launch Checklist

### 1 Minggu Sebelum Launch

- [ ] Semua fitur P0 berfungsi dan tested
- [ ] Database schema final (tidak ada breaking change setelah launch)
- [ ] Midtrans production keys sudah di-set
- [ ] Domain sudah pointing ke Vercel
- [ ] SSL aktif (otomatis)
- [ ] Supabase auth redirect URLs include production domain
- [ ] Cloudinary production preset configured
- [ ] Resend domain verified

### Hari Launch

- [ ] Final deploy ke production
- [ ] Test registrasi (talent & client) di production
- [ ] Test payment flow di production (real payment kecil)
- [ ] Test chat realtime di production
- [ ] Monitor Vercel logs untuk errors
- [ ] Monitor Supabase dashboard untuk anomali
- [ ] UptimeRobot configured
- [ ] Tim siap untuk hotfix jika ada issue

### Post-Launch (Minggu 1)

- [ ] Monitor daily active users
- [ ] Collect user feedback
- [ ] Fix critical bugs (jika ada)
- [ ] Onboard 50 talent pertama
- [ ] Onboard 5 klien pertama
- [ ] Review analytics: page load times, error rates

---

> **TALENTARA ENV Setup & DevOps Guide v1.0**
> PT. LAMBE TURAH GROUP | 2025
