# API Contract & Specification

**TALENTARA — Platform Marketplace Talent Digital**
**Versi:** 1.0 | **Tanggal:** Januari 2025

---

## 1. API Overview

### 1.1 Base Configuration

| Atribut | Detail |
|---|---|
| Base URL | `/api` |
| Protocol | HTTPS |
| Format | JSON (`application/json`) |
| Authentication | Supabase JWT via HTTP-only cookies |
| File Upload | `multipart/form-data` |

### 1.2 Standard Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operasi berhasil"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Deskripsi error dalam bahasa Indonesia"
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 234,
    "total_pages": 12
  }
}
```

### 1.3 HTTP Status Codes

| Code | Arti | Kapan Digunakan |
|---|---|---|
| 200 | OK | Request berhasil |
| 201 | Created | Resource baru berhasil dibuat |
| 400 | Bad Request | Request body/params tidak valid |
| 401 | Unauthorized | Belum login / token expired |
| 403 | Forbidden | Tidak punya akses ke resource ini |
| 404 | Not Found | Resource tidak ditemukan |
| 409 | Conflict | Duplikat (misal: sudah apply ke job ini) |
| 422 | Unprocessable Entity | Validasi gagal |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### 1.4 Common Headers

```
Content-Type: application/json
Cookie: sb-access-token=xxx; sb-refresh-token=xxx (auto by Supabase)
```

---

## 2. Authentication

### POST `/api/auth/register`

Mendaftarkan user baru sebagai Talent atau Client.

**Auth:** Tidak perlu

**Request Body:**
```json
{
  "email": "dina@email.com",
  "password": "password123",
  "full_name": "Dina Permata",
  "phone": "081234567890",
  "role": "talent"
}
```

| Field | Type | Required | Validasi |
|---|---|---|---|
| email | string | Ya | Format email valid, unique |
| password | string | Ya | Min 8 karakter |
| full_name | string | Ya | Min 2 karakter, max 100 |
| phone | string | Ya | Format Indonesia: +62/62/08xx |
| role | string | Ya | `talent` atau `client` |

**Response 201:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-xxx",
      "email": "dina@email.com"
    },
    "profile": {
      "id": "uuid-xxx",
      "role": "talent",
      "full_name": "Dina Permata"
    }
  },
  "message": "Registrasi berhasil. Silakan cek email untuk verifikasi."
}
```

**Error Responses:**
```json
// 400 - Email sudah terdaftar
{ "success": false, "error": "EMAIL_EXISTS", "message": "Email sudah terdaftar" }

// 422 - Validasi gagal
{ "success": false, "error": "VALIDATION_ERROR", "message": "Password minimal 8 karakter" }
```

**Side Effects:**
- Buat record di `auth.users` (Supabase Auth)
- Buat record di `profiles`
- Jika talent → buat record di `talents` (category: 'spg')
- Jika client → buat record di `companies` (company_name placeholder)
- Kirim email verifikasi

---

### POST `/api/auth/login`

Login dengan email dan password.

**Auth:** Tidak perlu

**Request Body:**
```json
{
  "email": "dina@email.com",
  "password": "password123"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-xxx",
      "email": "dina@email.com",
      "role": "talent"
    }
  },
  "message": "Login berhasil"
}
```

**Error:**
```json
// 401
{ "success": false, "error": "INVALID_CREDENTIALS", "message": "Email atau password salah" }
```

**Side Effects:** Set HTTP-only cookies (access_token, refresh_token)

---

### POST `/api/auth/logout`

**Auth:** Ya

**Response 200:**
```json
{ "success": true, "message": "Logout berhasil" }
```

**Side Effects:** Clear auth cookies

---

### GET `/api/auth/me`

Mendapatkan profil user yang sedang login, termasuk data role-specific.

**Auth:** Ya

**Response 200 (Talent):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-xxx",
    "email": "dina@email.com",
    "role": "talent",
    "full_name": "Dina Permata",
    "phone": "081234567890",
    "avatar_url": "https://res.cloudinary.com/...",
    "is_verified": true,
    "talent": {
      "id": "uuid-talent",
      "category": "spg",
      "gender": "female",
      "height_cm": 165,
      "weight_kg": 52,
      "city": "Semarang",
      "bio": "Berpengalaman 3 tahun...",
      "daily_rate": 400000,
      "rating_avg": 4.80,
      "rating_count": 23,
      "wallet_balance": 1440000,
      "verification_status": "verified",
      "is_available": true
    }
  }
}
```

**Response 200 (Client):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-xxx",
    "email": "budi@company.com",
    "role": "client",
    "full_name": "Budi Santoso",
    "phone": "081234567890",
    "avatar_url": null,
    "is_verified": true,
    "company": {
      "id": "uuid-company",
      "company_name": "PT ABC Indonesia",
      "company_type": "corporate",
      "industry": "Consumer Goods",
      "city": "Semarang",
      "company_logo_url": "https://...",
      "verification_status": "verified"
    }
  }
}
```

---

## 3. Talents

### GET `/api/talents`

Mencari dan filter talent. Public endpoint.

**Auth:** Tidak perlu

**Query Parameters:**

| Param | Type | Default | Deskripsi |
|---|---|---|---|
| search | string | - | Cari nama/bio |
| category | string | - | `spg`, `usher`, `both` |
| city | string | - | Nama kota |
| gender | string | - | `male`, `female` |
| min_rating | number | - | Rating minimum (1-5) |
| min_height | number | - | Tinggi minimum (cm) |
| min_age | number | - | Usia minimum |
| max_age | number | - | Usia maksimum |
| is_available | boolean | - | Hanya yang available |
| is_verified | boolean | - | Hanya yang verified |
| sort_by | string | `newest` | `rating`, `fee_low`, `fee_high`, `newest` |
| page | number | 1 | Halaman |
| limit | number | 20 | Per halaman (max 50) |

**Contoh Request:**
```
GET /api/talents?category=spg&city=Semarang&min_rating=4&sort_by=rating&page=1&limit=20
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-talent-1",
      "profile_id": "uuid-profile-1",
      "full_name": "Dina Permata",
      "avatar_url": "https://...",
      "category": "spg",
      "gender": "female",
      "city": "Semarang",
      "daily_rate": 400000,
      "rating_avg": 4.80,
      "rating_count": 23,
      "is_verified": true,
      "is_available": true,
      "total_jobs_completed": 12
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 234,
    "total_pages": 12
  }
}
```

---

### GET `/api/talents/:id`

Detail lengkap talent beserta portfolio, experience, dan review summary.

**Auth:** Tidak perlu

**Response 200:**
```json
{
  "success": true,
  "data": {
    "talent": {
      "id": "uuid-talent",
      "full_name": "Dina Permata",
      "avatar_url": "https://...",
      "category": "spg",
      "gender": "female",
      "date_of_birth": "2003-05-15",
      "height_cm": 165,
      "weight_kg": 52,
      "city": "Semarang",
      "province": "Jawa Tengah",
      "bio": "Berpengalaman 3 tahun sebagai SPG...",
      "daily_rate": 400000,
      "rating_avg": 4.80,
      "rating_count": 23,
      "total_jobs_completed": 12,
      "is_verified": true,
      "is_available": true
    },
    "portfolios": [
      {
        "id": "uuid-portfolio-1",
        "media_type": "image",
        "media_url": "https://res.cloudinary.com/...",
        "thumbnail_url": "https://res.cloudinary.com/.../w_150,h_150/...",
        "caption": "Brand Activation Unilever",
        "event_name": "Unilever Fair 2024"
      }
    ],
    "experiences": [
      {
        "id": "uuid-exp-1",
        "company_name": "PT Unilever Indonesia",
        "event_name": "Unilever Fair 2024",
        "role": "SPG",
        "description": "Promosi produk baru...",
        "start_date": "2024-03-15",
        "end_date": "2024-03-17"
      }
    ],
    "review_summary": {
      "avg": 4.80,
      "count": 23,
      "distribution": { "5": 15, "4": 6, "3": 2, "2": 0, "1": 0 },
      "avg_professionalism": 4.9,
      "avg_punctuality": 4.7,
      "avg_appearance": 4.8,
      "avg_communication": 4.6
    }
  }
}
```

---

### PUT `/api/talents/profile`

Update profil talent.

**Auth:** Talent only

**Request Body (partial update):**
```json
{
  "category": "spg",
  "gender": "female",
  "date_of_birth": "2003-05-15",
  "height_cm": 165,
  "weight_kg": 52,
  "city": "Semarang",
  "province": "Jawa Tengah",
  "bio": "Berpengalaman 3 tahun...",
  "daily_rate": 400000,
  "is_available": true
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "...updated talent object" },
  "message": "Profil berhasil diperbarui"
}
```

---

### POST `/api/talents/portfolio`

Upload portfolio item.

**Auth:** Talent only
**Content-Type:** `multipart/form-data`

**Request:**
| Field | Type | Required | Validasi |
|---|---|---|---|
| file | File | Ya | JPG/PNG/WebP (max 10MB), MP4 (max 50MB) |
| media_type | string | Ya | `image` atau `video` |
| caption | string | Tidak | Max 200 karakter |
| event_name | string | Tidak | Max 200 karakter |

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-portfolio",
    "media_type": "image",
    "media_url": "https://res.cloudinary.com/...",
    "thumbnail_url": "https://res.cloudinary.com/.../w_150/...",
    "caption": "Brand Activation",
    "event_name": "Event XYZ"
  },
  "message": "Portfolio berhasil diupload"
}
```

---

### POST `/api/talents/verify`

Submit KTP dan selfie untuk verifikasi identitas.

**Auth:** Talent only
**Content-Type:** `multipart/form-data`

**Request:**
| Field | Type | Required |
|---|---|---|
| ktp_number | string | Ya (16 digit) |
| ktp_photo | File | Ya (JPG/PNG, max 5MB) |
| selfie_photo | File | Ya (JPG/PNG, max 5MB) |

**Response 200:**
```json
{
  "success": true,
  "data": { "verification_status": "pending" },
  "message": "Verifikasi berhasil diajukan. Proses review 1x24 jam."
}
```

---

### GET `/api/talents/dashboard`

Dashboard stats untuk talent.

**Auth:** Talent only

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total_jobs_completed": 12,
    "active_bookings": 2,
    "rating_avg": 4.80,
    "wallet_balance": 1440000,
    "verification_status": "verified",
    "recent_bookings": [
      {
        "id": "uuid-booking",
        "booking_code": "TLNT-20250115-A3F2",
        "job_title": "SPG Brand Activation",
        "company_name": "PT ABC",
        "start_date": "2025-01-15",
        "end_date": "2025-01-16",
        "status": "confirmed",
        "talent_payout": 720000
      }
    ],
    "recommended_jobs": [
      {
        "id": "uuid-job",
        "title": "SPG Product Launch",
        "company_name": "PT XYZ",
        "location_city": "Semarang",
        "daily_rate": 450000,
        "start_date": "2025-02-01",
        "total_slots": 3,
        "filled_slots": 1
      }
    ]
  }
}
```

---

### GET `/api/talents/wallet`

Saldo dan riwayat transaksi wallet talent.

**Auth:** Talent only

**Query:** `page`, `limit`, `type` (earning/withdrawal)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "balance": 1440000,
    "transactions": [
      {
        "id": "uuid-tx",
        "type": "earning",
        "amount": 720000,
        "description": "Booking TLNT-20250115-A3F2 - SPG Brand Activation",
        "created_at": "2025-01-17T10:00:00Z"
      },
      {
        "id": "uuid-tx-2",
        "type": "withdrawal",
        "amount": -500000,
        "description": "Penarikan ke BCA - 1234567890",
        "status": "completed",
        "created_at": "2025-01-18T14:00:00Z"
      }
    ]
  },
  "pagination": { "page": 1, "limit": 20, "total": 15, "total_pages": 1 }
}
```

---

## 4. Companies

### PUT `/api/companies/profile`

**Auth:** Client only

**Request Body:**
```json
{
  "company_name": "PT ABC Indonesia",
  "company_type": "corporate",
  "industry": "Consumer Goods",
  "npwp": "01.234.567.8-901.000",
  "nib": "1234567890123",
  "address": "Jl. Pemuda No. 123",
  "city": "Semarang",
  "province": "Jawa Tengah",
  "website": "https://abc.co.id"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "...updated company" },
  "message": "Profil perusahaan berhasil diperbarui"
}
```

---

### GET `/api/companies/dashboard`

**Auth:** Client only

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total_jobs_posted": 8,
    "active_bookings": 3,
    "total_spending": 5040000,
    "verification_status": "verified",
    "recent_bookings": [ "..." ],
    "active_jobs": [ "..." ]
  }
}
```

---

## 5. Jobs

### GET `/api/jobs`

Mencari dan filter lowongan. Public.

**Query Parameters:**

| Param | Type | Default | Deskripsi |
|---|---|---|---|
| search | string | - | Keyword (judul, deskripsi) |
| category | string | - | `spg`, `usher`, `both` |
| city | string | - | Kota |
| min_fee | number | - | Fee minimum/hari |
| max_fee | number | - | Fee maksimum/hari |
| start_date | string | - | Tanggal mulai (YYYY-MM-DD) |
| end_date | string | - | Tanggal selesai |
| status | string | `open` | `open`, `in_progress` |
| sort_by | string | `newest` | `newest`, `fee_high`, `fee_low`, `date` |
| page | number | 1 | |
| limit | number | 20 | Max 50 |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-job",
      "title": "SPG Product Launch Samsung",
      "company": {
        "id": "uuid-company",
        "company_name": "PT Samsung Indonesia",
        "company_logo_url": "https://...",
        "is_verified": true
      },
      "category": "spg",
      "location_city": "Semarang",
      "start_date": "2025-02-01",
      "end_date": "2025-02-02",
      "daily_rate": 450000,
      "total_slots": 5,
      "filled_slots": 2,
      "status": "open",
      "created_at": "2025-01-20T08:00:00Z"
    }
  ],
  "pagination": { "..." }
}
```

---

### POST `/api/jobs`

Buat lowongan baru.

**Auth:** Client only

**Request Body:**
```json
{
  "title": "SPG Product Launch Samsung",
  "description": "Dibutuhkan SPG untuk product launch Samsung Galaxy S25...",
  "category": "spg",
  "job_type": "one_time",
  "location_city": "Semarang",
  "location_address": "Mall Paragon, Lt. 1",
  "start_date": "2025-02-01",
  "end_date": "2025-02-02",
  "start_time": "09:00",
  "end_time": "21:00",
  "daily_rate": 450000,
  "total_slots": 5,
  "gender_requirement": "female",
  "min_height_cm": 160,
  "min_age": 18,
  "max_age": 28,
  "dress_code": "Kemeja putih, rok hitam, high heels",
  "requirements": "Pengalaman SPG min 1 tahun, komunikatif"
}
```

| Field | Type | Required | Validasi |
|---|---|---|---|
| title | string | Ya | Min 5, max 200 |
| description | string | Ya | Min 20 |
| category | string | Ya | `spg`, `usher`, `both` |
| job_type | string | Tidak | Default `one_time` |
| location_city | string | Ya | |
| start_date | string | Ya | Format YYYY-MM-DD, harus masa depan |
| end_date | string | Ya | >= start_date |
| daily_rate | number | Ya | > 0 |
| total_slots | number | Ya | >= 1 |

**Response 201:**
```json
{
  "success": true,
  "data": { "id": "uuid-job", "...created job" },
  "message": "Lowongan berhasil dibuat"
}
```

---

### POST `/api/jobs/:id/apply`

Talent melamar ke lowongan.

**Auth:** Talent only (harus verified)

**Request Body:**
```json
{
  "cover_message": "Saya tertarik dengan posisi ini. Saya memiliki pengalaman..."
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-application",
    "job_id": "uuid-job",
    "talent_id": "uuid-talent",
    "status": "pending",
    "applied_at": "2025-01-21T10:00:00Z"
  },
  "message": "Lamaran berhasil dikirim"
}
```

**Errors:**
```json
// 403 - Talent belum verified
{ "success": false, "error": "NOT_VERIFIED", "message": "Anda harus verifikasi KTP terlebih dahulu" }

// 409 - Sudah apply
{ "success": false, "error": "ALREADY_APPLIED", "message": "Anda sudah melamar ke lowongan ini" }

// 400 - Slot penuh
{ "success": false, "error": "SLOTS_FULL", "message": "Slot lowongan sudah penuh" }
```

**Side Effects:** Notifikasi ke client: "Lamaran baru untuk [Job Title]"

---

### PUT `/api/jobs/:id/applications/:appId`

Client menerima atau menolak lamaran.

**Auth:** Client only (job owner)

**Request Body:**
```json
{ "status": "accepted" }
```

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid-app", "status": "accepted" },
  "message": "Lamaran diterima"
}
```

**Side Effects:**
- Notifikasi ke talent: "Lamaran Anda diterima untuk [Job Title]!"
- Jika accepted → update filled_slots di job

---

## 6. Bookings

### POST `/api/bookings`

Buat booking talent.

**Auth:** Client only

**Request Body:**
```json
{
  "job_id": "uuid-job",
  "talent_id": "uuid-talent",
  "start_date": "2025-02-01",
  "end_date": "2025-02-02",
  "notes": "Harap datang 30 menit sebelumnya"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-booking",
    "booking_code": "TLNT-20250125-B4E1",
    "job_id": "uuid-job",
    "talent_id": "uuid-talent",
    "company_id": "uuid-company",
    "start_date": "2025-02-01",
    "end_date": "2025-02-02",
    "total_days": 2,
    "daily_rate": 450000,
    "talent_fee": 900000,
    "talent_commission": 90000,
    "client_commission": 45000,
    "platform_revenue": 135000,
    "total_amount": 945000,
    "talent_payout": 810000,
    "status": "pending",
    "notes": "Harap datang 30 menit sebelumnya"
  },
  "message": "Booking berhasil dibuat. Silakan lakukan pembayaran."
}
```

**Business Rules:**
- `total_days` = dihitung dari start_date & end_date
- `talent_fee` = daily_rate x total_days
- `talent_commission` = talent_fee x 10%
- `client_commission` = talent_fee x 5%
- `platform_revenue` = talent_commission + client_commission
- `total_amount` = talent_fee + client_commission (dibayar client)
- `talent_payout` = talent_fee - talent_commission (diterima talent)

---

### POST `/api/bookings/:id/complete`

Client konfirmasi job selesai. Release escrow ke talent wallet.

**Auth:** Client only (booking owner)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "booking_status": "confirmed",
    "escrow_status": "released",
    "talent_payout": 810000
  },
  "message": "Job selesai dikonfirmasi. Dana telah dirilis ke talent."
}
```

**Side Effects:**
1. Update booking status → `confirmed`
2. Update escrow → `released`
3. Add talent_payout ke talent wallet_balance
4. Increment talent total_jobs_completed
5. Notifikasi talent: "Pembayaran Rp 810.000 telah masuk ke wallet Anda"

---

## 7. Payments

### POST `/api/payments/create`

Buat Midtrans Snap transaction untuk booking.

**Auth:** Client only

**Request Body:**
```json
{ "booking_id": "uuid-booking" }
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "snap_token": "66e4fa55-fdac-4ef9-91b5-733b97d1b862",
    "redirect_url": "https://app.sandbox.midtrans.com/snap/v2/vtweb/66e4fa55..."
  },
  "message": "Token pembayaran berhasil dibuat"
}
```

---

### POST `/api/payments/webhook`

Midtrans webhook notification handler.

**Auth:** Tidak (divalidasi via Midtrans signature)

**Request Body (dari Midtrans):**
```json
{
  "transaction_time": "2025-01-25 10:00:00",
  "transaction_status": "settlement",
  "transaction_id": "midtrans-tx-id",
  "status_message": "midtrans payment notification",
  "status_code": "200",
  "signature_key": "sha512hash...",
  "payment_type": "bank_transfer",
  "order_id": "TLNT-1706166000-uuid",
  "merchant_id": "GXXX",
  "gross_amount": "945000.00",
  "fraud_status": "accept",
  "currency": "IDR"
}
```

**Response 200:**
```json
{ "status": "ok" }
```

**Business Logic:**
- `settlement` / `capture` + `fraud_status: accept` → Payment SUCCESS
  - Update payment status → `paid`
  - Update booking status → `paid`
  - Create escrow_transaction (status: `held`)
  - Kirim notifikasi ke talent
- `expire` → Payment EXPIRED
  - Update payment → `expired`
  - Update booking → `cancelled`
- `cancel` / `deny` → Payment FAILED
  - Update payment → `failed`

---

## 8. Withdrawals

### POST `/api/withdrawals`

Talent request tarik saldo ke rekening bank.

**Auth:** Talent only

**Request Body:**
```json
{
  "amount": 500000,
  "bank_name": "BCA",
  "bank_account_number": "1234567890",
  "bank_account_name": "DINA PERMATA"
}
```

| Field | Type | Required | Validasi |
|---|---|---|---|
| amount | number | Ya | Min 50.000, max wallet_balance |
| bank_name | string | Ya | BCA, BNI, BRI, Mandiri, CIMB, etc. |
| bank_account_number | string | Ya | 10-16 digit |
| bank_account_name | string | Ya | Min 3 karakter |

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-withdrawal",
    "amount": 500000,
    "bank_name": "BCA",
    "bank_account_number": "1234567890",
    "status": "pending"
  },
  "message": "Penarikan berhasil diajukan. Diproses dalam 1-3 hari kerja."
}
```

**Side Effects:** Kurangi wallet_balance sebesar amount (langsung)

**Errors:**
```json
// 400 - Saldo tidak cukup
{ "success": false, "error": "INSUFFICIENT_BALANCE", "message": "Saldo tidak mencukupi" }

// 400 - Dibawah minimum
{ "success": false, "error": "BELOW_MINIMUM", "message": "Minimum penarikan Rp 50.000" }
```

---

## 9. Chat

### POST `/api/chat/rooms`

Buat atau dapatkan room chat antara 2 user.

**Auth:** Ya

**Request Body:**
```json
{
  "participant_id": "uuid-other-user",
  "booking_id": "uuid-booking"
}
```

**Response 200 (existing) / 201 (baru):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-room",
    "participant": {
      "id": "uuid-other",
      "full_name": "Budi Santoso",
      "avatar_url": "https://...",
      "role": "client"
    },
    "booking_id": "uuid-booking",
    "last_message": null,
    "last_message_at": null
  }
}
```

---

### POST `/api/chat/rooms/:id/messages`

Kirim pesan.

**Auth:** Ya (participant of room)

**Request Body:**
```json
{
  "message": "Halo, saya tertarik dengan booking ini",
  "message_type": "text"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-msg",
    "room_id": "uuid-room",
    "sender_id": "uuid-me",
    "message": "Halo, saya tertarik dengan booking ini",
    "message_type": "text",
    "is_read": false,
    "created_at": "2025-01-25T10:30:00Z"
  }
}
```

**Side Effects:**
- Update chat_rooms.last_message & last_message_at
- Kirim notification ke participant lain
- Supabase Realtime broadcast pesan baru

---

## 10. Reviews

### POST `/api/reviews`

Client memberikan review untuk talent setelah job selesai.

**Auth:** Client only

**Request Body:**
```json
{
  "booking_id": "uuid-booking",
  "rating": 5,
  "comment": "Sangat profesional dan komunikatif!",
  "professionalism": 5,
  "punctuality": 4,
  "appearance": 5,
  "communication": 5
}
```

| Field | Type | Required | Validasi |
|---|---|---|---|
| booking_id | string | Ya | Booking harus status `confirmed` |
| rating | number | Ya | 1-5 |
| comment | string | Tidak | Max 500 karakter |
| professionalism | number | Tidak | 1-5 |
| punctuality | number | Tidak | 1-5 |
| appearance | number | Tidak | 1-5 |
| communication | number | Tidak | 1-5 |

**Response 201:**
```json
{
  "success": true,
  "data": { "id": "uuid-review", "..." },
  "message": "Review berhasil dikirim"
}
```

**Side Effects:**
- Trigger: update talent rating_avg dan rating_count
- Notifikasi talent: "Anda mendapat review baru: 5 bintang!"

**Errors:**
```json
// 400 - Booking belum selesai
{ "success": false, "error": "BOOKING_NOT_CONFIRMED", "message": "Job harus dikonfirmasi selesai sebelum review" }

// 409 - Sudah review
{ "success": false, "error": "ALREADY_REVIEWED", "message": "Anda sudah memberikan review untuk booking ini" }
```

---

## 11. Notifications

### GET `/api/notifications`

**Auth:** Ya

**Query:** `page`, `limit`, `is_read` (true/false)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "unread_count": 3,
    "notifications": [
      {
        "id": "uuid-notif",
        "type": "booking_confirmed",
        "title": "Booking Baru!",
        "message": "Anda mendapat booking baru. Kode: TLNT-20250115-A3F2",
        "data": { "booking_id": "uuid-booking" },
        "is_read": false,
        "created_at": "2025-01-25T10:00:00Z"
      }
    ]
  },
  "pagination": { "..." }
}
```

### PUT `/api/notifications/read-all`

**Auth:** Ya

**Response 200:**
```json
{ "success": true, "message": "Semua notifikasi ditandai sudah dibaca" }
```

---

## 12. Admin

### GET `/api/admin/dashboard`

**Auth:** Admin only

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total_talents": 1200,
    "total_clients": 85,
    "total_bookings": 432,
    "total_revenue": 51840000,
    "pending_talent_verifications": 12,
    "pending_company_verifications": 3,
    "pending_withdrawals": 5,
    "open_disputes": 2,
    "monthly_stats": [
      { "month": "2025-01", "bookings": 45, "revenue": 5400000 }
    ]
  }
}
```

### PUT `/api/admin/verify/talent/:id`

**Auth:** Admin only

**Request Body:**
```json
{ "status": "verified", "notes": "KTP dan selfie valid" }
```

**Side Effects:**
- Update talents.verification_status
- Update profiles.is_verified
- Notifikasi talent: "Verifikasi Anda telah disetujui!"

### PUT `/api/admin/disputes/:id`

**Auth:** Admin only

**Request Body:**
```json
{
  "status": "resolved_talent",
  "resolution": "Talent telah menyelesaikan pekerjaan sesuai kesepakatan"
}
```

**Side Effects:**
- Jika `resolved_talent` → release escrow ke talent
- Jika `resolved_client` → refund ke client (manual process)
- Notifikasi kedua pihak

---

> **TALENTARA API Contract v1.0**
> PT. LAMBE TURAH GROUP | 2025
