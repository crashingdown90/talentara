// =============================
// User & Profile Types
// =============================

export type UserRole = "talent" | "client" | "admin";
export type VerificationStatus = "pending" | "verified" | "rejected";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// =============================
// Talent Types
// =============================

export type TalentCategory = "spg" | "usher" | "both";

export interface Talent {
  id: string;
  profile_id: string;
  category: TalentCategory;
  gender: "male" | "female" | null;
  date_of_birth: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  city: string | null;
  province: string | null;
  address: string | null;
  bio: string | null;
  ktp_number: string | null;
  ktp_photo_url: string | null;
  selfie_photo_url: string | null;
  verification_status: VerificationStatus;
  rating_avg: number;
  rating_count: number;
  total_jobs_completed: number;
  wallet_balance: number;
  daily_rate: number | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface TalentPortfolio {
  id: string;
  talent_id: string;
  media_type: "image" | "video";
  media_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  event_name: string | null;
  sort_order: number;
  created_at: string;
}

export interface TalentExperience {
  id: string;
  talent_id: string;
  company_name: string;
  event_name: string | null;
  role: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

// =============================
// Company Types
// =============================

export interface Company {
  id: string;
  profile_id: string;
  company_name: string;
  company_type: string | null;
  industry: string | null;
  npwp: string | null;
  nib: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  website: string | null;
  company_logo_url: string | null;
  legal_doc_url: string | null;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

// =============================
// Job Types
// =============================

export type JobStatus = "draft" | "open" | "in_progress" | "completed" | "cancelled";
export type JobType = "one_time" | "recurring" | "long_term";

export interface Job {
  id: string;
  company_id: string;
  title: string;
  description: string;
  category: TalentCategory;
  job_type: JobType;
  location_city: string;
  location_address: string | null;
  start_date: string;
  end_date: string;
  start_time: string | null;
  end_time: string | null;
  daily_rate: number;
  total_slots: number;
  filled_slots: number;
  gender_requirement: "male" | "female" | "any" | null;
  min_height_cm: number | null;
  min_age: number | null;
  max_age: number | null;
  dress_code: string | null;
  requirements: string | null;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  // Relations
  company?: Company;
}

export interface JobApplication {
  id: string;
  job_id: string;
  talent_id: string;
  cover_message: string | null;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  applied_at: string;
  responded_at: string | null;
  // Relations
  job?: Job;
  talent?: Talent;
}

// =============================
// Booking Types
// =============================

export type BookingStatus =
  | "pending"
  | "paid"
  | "in_progress"
  | "completed"
  | "confirmed"
  | "cancelled"
  | "disputed";

export interface Booking {
  id: string;
  booking_code: string;
  job_id: string;
  talent_id: string;
  company_id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  daily_rate: number;
  talent_fee: number;
  talent_commission: number;
  client_commission: number;
  platform_revenue: number;
  total_amount: number;
  talent_payout: number;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  job?: Job;
  talent?: Talent & { profile?: Profile };
  company?: Company;
  payment?: Payment;
}

// =============================
// Payment Types
// =============================

export type PaymentStatus = "pending" | "paid" | "expired" | "failed" | "refunded";

export interface Payment {
  id: string;
  booking_id: string;
  midtrans_order_id: string | null;
  midtrans_transaction_id: string | null;
  payment_type: string | null;
  amount: number;
  status: PaymentStatus;
  snap_token: string | null;
  snap_redirect_url: string | null;
  paid_at: string | null;
  expired_at: string | null;
  midtrans_response: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EscrowTransaction {
  id: string;
  payment_id: string;
  booking_id: string;
  talent_id: string;
  amount: number;
  talent_payout: number;
  platform_fee: number;
  status: "held" | "released" | "refunded" | "disputed";
  held_at: string;
  released_at: string | null;
  created_at: string;
}

// =============================
// Review Types
// =============================

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  talent_id: string;
  rating: number;
  comment: string | null;
  professionalism: number | null;
  punctuality: number | null;
  appearance: number | null;
  communication: number | null;
  created_at: string;
  // Relations
  reviewer?: Profile;
}

// =============================
// Chat Types
// =============================

export interface ChatRoom {
  id: string;
  booking_id: string | null;
  participant_1: string;
  participant_2: string;
  last_message: string | null;
  last_message_at: string | null;
  created_at: string;
  // Relations
  participant_1_profile?: Profile;
  participant_2_profile?: Profile;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  message: string;
  message_type: "text" | "image" | "system";
  is_read: boolean;
  created_at: string;
  // Relations
  sender?: Profile;
}

// =============================
// Notification Types
// =============================

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

// =============================
// Withdrawal Types
// =============================

export interface Withdrawal {
  id: string;
  talent_id: string;
  amount: number;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  status: "pending" | "processing" | "completed" | "rejected";
  admin_notes: string | null;
  processed_at: string | null;
  created_at: string;
}

// =============================
// API Response Types
// =============================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// =============================
// Auth Types
// =============================

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  talent?: Talent;
  company?: Company;
}
