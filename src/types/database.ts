/**
 * Supabase Database Types
 *
 * Manually written to match all 13 migration files.
 * Replace with auto-generated types when available:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "talent" | "client" | "admin";
export type TalentCategory = "spg" | "usher" | "both";
export type Gender = "male" | "female";
export type VerificationStatus = "pending" | "verified" | "rejected";
export type BookingStatus = "pending" | "paid" | "in_progress" | "completed" | "confirmed" | "cancelled" | "disputed";
export type PaymentStatus = "pending" | "paid" | "expired" | "failed" | "refunded";
export type EscrowStatus = "held" | "released" | "refunded" | "disputed";
export type JobStatus = "draft" | "open" | "in_progress" | "completed" | "cancelled";
export type JobType = "one_time" | "recurring" | "long_term";
export type ApplicationStatus = "pending" | "accepted" | "rejected" | "withdrawn";
export type WithdrawalStatus = "pending" | "processing" | "completed" | "rejected";
export type DisputeStatus = "open" | "investigating" | "resolved_talent" | "resolved_client" | "closed";
export type MessageType = "text" | "image" | "system";
export type GenderRequirement = "male" | "female" | "any";
export type MediaType = "image" | "video";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        };
        Insert: {
          id: string;
          role: UserRole;
          full_name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          is_verified?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          is_verified?: boolean;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      talents: {
        Row: {
          id: string;
          profile_id: string;
          category: TalentCategory;
          gender: Gender | null;
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
        };
        Insert: {
          id?: string;
          profile_id: string;
          category: TalentCategory;
          gender?: Gender | null;
          date_of_birth?: string | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          city?: string | null;
          province?: string | null;
          address?: string | null;
          bio?: string | null;
          ktp_number?: string | null;
          ktp_photo_url?: string | null;
          selfie_photo_url?: string | null;
          verification_status?: VerificationStatus;
          rating_avg?: number;
          rating_count?: number;
          total_jobs_completed?: number;
          wallet_balance?: number;
          daily_rate?: number | null;
          is_available?: boolean;
        };
        Update: {
          id?: string;
          profile_id?: string;
          category?: TalentCategory;
          gender?: Gender | null;
          date_of_birth?: string | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          city?: string | null;
          province?: string | null;
          address?: string | null;
          bio?: string | null;
          ktp_number?: string | null;
          ktp_photo_url?: string | null;
          selfie_photo_url?: string | null;
          verification_status?: VerificationStatus;
          daily_rate?: number | null;
          is_available?: boolean;
        };
      };
      talent_portfolios: {
        Row: {
          id: string;
          talent_id: string;
          media_type: MediaType;
          media_url: string;
          thumbnail_url: string | null;
          caption: string | null;
          event_name: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          talent_id: string;
          media_type: MediaType;
          media_url: string;
          thumbnail_url?: string | null;
          caption?: string | null;
          event_name?: string | null;
          sort_order?: number;
        };
        Update: {
          talent_id?: string;
          media_type?: MediaType;
          media_url?: string;
          thumbnail_url?: string | null;
          caption?: string | null;
          event_name?: string | null;
          sort_order?: number;
        };
      };
      talent_experiences: {
        Row: {
          id: string;
          talent_id: string;
          company_name: string;
          event_name: string | null;
          role: string;
          description: string | null;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          talent_id: string;
          company_name: string;
          event_name?: string | null;
          role: string;
          description?: string | null;
          start_date?: string | null;
          end_date?: string | null;
        };
        Update: {
          talent_id?: string;
          company_name?: string;
          event_name?: string | null;
          role?: string;
          description?: string | null;
          start_date?: string | null;
          end_date?: string | null;
        };
      };
      companies: {
        Row: {
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
        };
        Insert: {
          id?: string;
          profile_id: string;
          company_name: string;
          company_type?: string | null;
          industry?: string | null;
          npwp?: string | null;
          nib?: string | null;
          address?: string | null;
          city?: string | null;
          province?: string | null;
          website?: string | null;
          company_logo_url?: string | null;
          legal_doc_url?: string | null;
          verification_status?: VerificationStatus;
        };
        Update: {
          profile_id?: string;
          company_name?: string;
          company_type?: string | null;
          industry?: string | null;
          npwp?: string | null;
          nib?: string | null;
          address?: string | null;
          city?: string | null;
          province?: string | null;
          website?: string | null;
          company_logo_url?: string | null;
          legal_doc_url?: string | null;
          verification_status?: VerificationStatus;
        };
      };
      jobs: {
        Row: {
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
          gender_requirement: GenderRequirement | null;
          min_height_cm: number | null;
          min_age: number | null;
          max_age: number | null;
          dress_code: string | null;
          requirements: string | null;
          status: JobStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          title: string;
          description: string;
          category: TalentCategory;
          job_type?: JobType;
          location_city: string;
          location_address?: string | null;
          start_date: string;
          end_date: string;
          start_time?: string | null;
          end_time?: string | null;
          daily_rate: number;
          total_slots?: number;
          filled_slots?: number;
          gender_requirement?: GenderRequirement | null;
          min_height_cm?: number | null;
          min_age?: number | null;
          max_age?: number | null;
          dress_code?: string | null;
          requirements?: string | null;
          status?: JobStatus;
        };
        Update: {
          company_id?: string;
          title?: string;
          description?: string;
          category?: TalentCategory;
          job_type?: JobType;
          location_city?: string;
          location_address?: string | null;
          start_date?: string;
          end_date?: string;
          start_time?: string | null;
          end_time?: string | null;
          daily_rate?: number;
          total_slots?: number;
          filled_slots?: number;
          gender_requirement?: GenderRequirement | null;
          min_height_cm?: number | null;
          min_age?: number | null;
          max_age?: number | null;
          dress_code?: string | null;
          requirements?: string | null;
          status?: JobStatus;
        };
      };
      job_applications: {
        Row: {
          id: string;
          job_id: string;
          talent_id: string;
          cover_message: string | null;
          status: ApplicationStatus;
          applied_at: string;
          responded_at: string | null;
        };
        Insert: {
          id?: string;
          job_id: string;
          talent_id: string;
          cover_message?: string | null;
          status?: ApplicationStatus;
          applied_at?: string;
          responded_at?: string | null;
        };
        Update: {
          job_id?: string;
          talent_id?: string;
          cover_message?: string | null;
          status?: ApplicationStatus;
          responded_at?: string | null;
        };
      };
      bookings: {
        Row: {
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
        };
        Insert: {
          id?: string;
          booking_code?: string;
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
          status?: BookingStatus;
          notes?: string | null;
        };
        Update: {
          job_id?: string;
          talent_id?: string;
          company_id?: string;
          start_date?: string;
          end_date?: string;
          total_days?: number;
          daily_rate?: number;
          talent_fee?: number;
          talent_commission?: number;
          client_commission?: number;
          platform_revenue?: number;
          total_amount?: number;
          talent_payout?: number;
          status?: BookingStatus;
          notes?: string | null;
        };
      };
      payments: {
        Row: {
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
          midtrans_response: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          midtrans_order_id?: string | null;
          midtrans_transaction_id?: string | null;
          payment_type?: string | null;
          amount: number;
          status?: PaymentStatus;
          snap_token?: string | null;
          snap_redirect_url?: string | null;
          paid_at?: string | null;
          expired_at?: string | null;
          midtrans_response?: Json | null;
        };
        Update: {
          booking_id?: string;
          midtrans_order_id?: string | null;
          midtrans_transaction_id?: string | null;
          payment_type?: string | null;
          amount?: number;
          status?: PaymentStatus;
          snap_token?: string | null;
          snap_redirect_url?: string | null;
          paid_at?: string | null;
          expired_at?: string | null;
          midtrans_response?: Json | null;
        };
      };
      escrow_transactions: {
        Row: {
          id: string;
          payment_id: string;
          booking_id: string;
          talent_id: string;
          amount: number;
          talent_payout: number;
          platform_fee: number;
          status: EscrowStatus;
          held_at: string;
          released_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          payment_id: string;
          booking_id: string;
          talent_id: string;
          amount: number;
          talent_payout: number;
          platform_fee: number;
          status?: EscrowStatus;
          held_at?: string;
          released_at?: string | null;
        };
        Update: {
          payment_id?: string;
          booking_id?: string;
          talent_id?: string;
          amount?: number;
          talent_payout?: number;
          platform_fee?: number;
          status?: EscrowStatus;
          released_at?: string | null;
        };
      };
      reviews: {
        Row: {
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
        };
        Insert: {
          id?: string;
          booking_id: string;
          reviewer_id: string;
          talent_id: string;
          rating: number;
          comment?: string | null;
          professionalism?: number | null;
          punctuality?: number | null;
          appearance?: number | null;
          communication?: number | null;
        };
        Update: {
          booking_id?: string;
          reviewer_id?: string;
          talent_id?: string;
          rating?: number;
          comment?: string | null;
          professionalism?: number | null;
          punctuality?: number | null;
          appearance?: number | null;
          communication?: number | null;
        };
      };
      chat_rooms: {
        Row: {
          id: string;
          booking_id: string | null;
          participant_1: string;
          participant_2: string;
          last_message: string | null;
          last_message_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id?: string | null;
          participant_1: string;
          participant_2: string;
          last_message?: string | null;
          last_message_at?: string | null;
        };
        Update: {
          booking_id?: string | null;
          participant_1?: string;
          participant_2?: string;
          last_message?: string | null;
          last_message_at?: string | null;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          room_id: string;
          sender_id: string;
          message: string;
          message_type: MessageType;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          sender_id: string;
          message: string;
          message_type?: MessageType;
          is_read?: boolean;
        };
        Update: {
          room_id?: string;
          sender_id?: string;
          message?: string;
          message_type?: MessageType;
          is_read?: boolean;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          data: Json | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          data?: Json | null;
          is_read?: boolean;
        };
        Update: {
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          data?: Json | null;
          is_read?: boolean;
        };
      };
      withdrawals: {
        Row: {
          id: string;
          talent_id: string;
          amount: number;
          bank_name: string;
          bank_account_number: string;
          bank_account_name: string;
          status: WithdrawalStatus;
          admin_notes: string | null;
          processed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          talent_id: string;
          amount: number;
          bank_name: string;
          bank_account_number: string;
          bank_account_name: string;
          status?: WithdrawalStatus;
          admin_notes?: string | null;
          processed_at?: string | null;
        };
        Update: {
          talent_id?: string;
          amount?: number;
          bank_name?: string;
          bank_account_number?: string;
          bank_account_name?: string;
          status?: WithdrawalStatus;
          admin_notes?: string | null;
          processed_at?: string | null;
        };
      };
      disputes: {
        Row: {
          id: string;
          booking_id: string;
          raised_by: string;
          reason: string;
          evidence_urls: string[] | null;
          status: DisputeStatus;
          resolution: string | null;
          resolved_by: string | null;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          booking_id: string;
          raised_by: string;
          reason: string;
          evidence_urls?: string[] | null;
          status?: DisputeStatus;
          resolution?: string | null;
          resolved_by?: string | null;
          resolved_at?: string | null;
        };
        Update: {
          booking_id?: string;
          raised_by?: string;
          reason?: string;
          evidence_urls?: string[] | null;
          status?: DisputeStatus;
          resolution?: string | null;
          resolved_by?: string | null;
          resolved_at?: string | null;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string;
          actor_role: string;
          action: string;
          target_type: string;
          target_id: string | null;
          details: Json;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id: string;
          actor_role: string;
          action: string;
          target_type: string;
          target_id?: string | null;
          details?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      talent_category: TalentCategory;
      gender: Gender;
      verification_status: VerificationStatus;
      booking_status: BookingStatus;
      payment_status: PaymentStatus;
      escrow_status: EscrowStatus;
      job_status: JobStatus;
      job_type: JobType;
      application_status: ApplicationStatus;
      withdrawal_status: WithdrawalStatus;
      dispute_status: DisputeStatus;
      message_type: MessageType;
      media_type: MediaType;
    };
  };
}

/** Helper type: Extract Row type for a given table */
export type TableRow<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

/** Helper type: Extract Insert type for a given table */
export type TableInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

/** Helper type: Extract Update type for a given table */
export type TableUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
