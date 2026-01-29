/**
 * Audit logging utility for tracking admin and system actions.
 *
 * All admin actions (verification, withdrawal processing, dispute resolution)
 * should be logged via this utility for security compliance and debugging.
 *
 * Logs are stored in the `audit_logs` table and are immutable (no updates/deletes).
 * Only admins can read audit logs via RLS policy.
 *
 * IMPORTANT: Only use server-side. Uses the admin Supabase client.
 */

import { getSupabaseAdmin } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AuditAction =
  | "talent.verify"
  | "talent.reject"
  | "company.verify"
  | "company.reject"
  | "withdrawal.approve"
  | "withdrawal.reject"
  | "dispute.resolve"
  | "dispute.close"
  | "profile.suspend"
  | "profile.reactivate"
  | "booking.cancel_admin"
  | "payment.refund"
  | "system.config_change";

export type AuditTargetType =
  | "talent"
  | "company"
  | "profile"
  | "withdrawal"
  | "dispute"
  | "booking"
  | "payment"
  | "system";

export interface AuditLogEntry {
  /** ID of the user performing the action */
  actorId: string;
  /** Role of the actor (admin, system) */
  actorRole: string;
  /** The action performed */
  action: AuditAction;
  /** Type of the target entity */
  targetType: AuditTargetType;
  /** ID of the target entity (if applicable) */
  targetId?: string;
  /** Additional details about the action */
  details?: Record<string, unknown>;
  /** IP address of the request */
  ipAddress?: string;
  /** User agent of the request */
  userAgent?: string;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Record an audit log entry.
 *
 * @param entry - The audit log data
 * @returns The created audit log record, or null on error
 */
export async function logAuditEvent(entry: AuditLogEntry) {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.from("audit_logs").insert({
      actor_id: entry.actorId,
      actor_role: entry.actorRole,
      action: entry.action,
      target_type: entry.targetType,
      target_id: entry.targetId || null,
      details: entry.details || {},
      ip_address: entry.ipAddress || null,
      user_agent: entry.userAgent || null,
    }).select("id, created_at").single();

    if (error) {
      console.error("Failed to write audit log:", error);
      return null;
    }

    return data;
  } catch (err) {
    // Audit logging should never break the main flow
    console.error("Audit log error:", err);
    return null;
  }
}

/**
 * Helper to extract request context (IP, user agent) from a Request object.
 */
export function getRequestContext(request: Request) {
  return {
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown",
    userAgent: request.headers.get("user-agent") || "unknown",
  };
}
