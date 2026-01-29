/**
 * API request/response logging utility.
 *
 * Provides structured logging for API route handlers with:
 * - Request method, path, IP, user agent
 * - Response status code and duration
 * - Error details (on failure)
 *
 * Usage in API routes:
 *   import { withLogging } from "@/lib/utils/api-logger";
 *
 *   export const POST = withLogging(async (request: Request) => {
 *     // your handler logic...
 *     return NextResponse.json({ success: true });
 *   });
 */

import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error";
  method: string;
  path: string;
  status: number;
  duration_ms: number;
  ip: string;
  user_agent: string;
  error?: string;
}

type RouteHandler = (
  request: Request,
  context?: { params?: Promise<Record<string, string>> }
) => Promise<Response>;

// ---------------------------------------------------------------------------
// Logger
// ---------------------------------------------------------------------------

function formatLog(entry: LogEntry): string {
  const { timestamp, level, method, path, status, duration_ms, ip } = entry;
  const prefix = level === "error" ? "[ERROR]" : level === "warn" ? "[WARN]" : "[INFO]";
  return `${prefix} ${timestamp} ${method} ${path} ${status} ${duration_ms}ms ip=${ip}${entry.error ? ` error="${entry.error}"` : ""}`;
}

function getRequestInfo(request: Request) {
  const url = new URL(request.url);
  return {
    method: request.method,
    path: url.pathname,
    ip:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown",
    user_agent: request.headers.get("user-agent") || "unknown",
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Wraps an API route handler with request/response logging.
 *
 * Logs every request with method, path, status, duration, and IP.
 * Catches unhandled errors and returns a 500 response.
 *
 * @param handler - The API route handler function
 * @returns Wrapped handler with logging
 */
export function withLogging(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    const start = performance.now();
    const reqInfo = getRequestInfo(request);

    try {
      const response = await handler(request, context);
      const duration_ms = Math.round(performance.now() - start);

      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: response.status >= 500 ? "error" : response.status >= 400 ? "warn" : "info",
        ...reqInfo,
        status: response.status,
        duration_ms,
      };

      if (response.status >= 500) {
        console.error(formatLog(entry));
      } else if (response.status >= 400) {
        console.warn(formatLog(entry));
      } else {
        console.log(formatLog(entry));
      }

      // Add server timing header for observability
      const headers = new Headers(response.headers);
      headers.set("Server-Timing", `total;dur=${duration_ms}`);

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (error) {
      const duration_ms = Math.round(performance.now() - start);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: "error",
        ...reqInfo,
        status: 500,
        duration_ms,
        error: errorMessage,
      };

      console.error(formatLog(entry));

      return NextResponse.json(
        {
          success: false,
          error: "INTERNAL_ERROR",
          message: "Terjadi kesalahan server",
        },
        { status: 500 }
      );
    }
  };
}
