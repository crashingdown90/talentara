/**
 * Extract client IP address from request headers.
 * Uses x-forwarded-for (set by reverse proxies like CloudFlare, Nginx).
 * Falls back to "unknown" if no IP is found.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  );
}
