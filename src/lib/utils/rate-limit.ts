/**
 * Rate limiter with pluggable storage backend.
 *
 * - Development / single-instance: uses in-memory Map (default)
 * - Production / multi-instance: uses Redis via REDIS_URL env var
 *
 * The storage backend is selected automatically based on the REDIS_URL
 * environment variable. When set, all rate limit state is stored in Redis
 * so it persists across restarts and works across multiple server instances.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RateLimitConfig {
  /** Maximum number of requests allowed within the window */
  maxRequests: number;
  /** Time window in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

interface RateLimitStore {
  check(key: string, config: RateLimitConfig): Promise<RateLimitResult>;
}

// ---------------------------------------------------------------------------
// In-memory store (development / single-instance fallback)
// ---------------------------------------------------------------------------

interface MemoryEntry {
  count: number;
  resetAt: number;
}

class MemoryRateLimitStore implements RateLimitStore {
  private store = new Map<string, MemoryEntry>();
  private cleanupTimer: ReturnType<typeof setInterval>;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store) {
        if (now > entry.resetAt) {
          this.store.delete(key);
        }
      }
    }, 5 * 60 * 1000);

    // Prevent timer from blocking Node.js shutdown
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  async check(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetAt) {
      const resetAt = now + config.windowSeconds * 1000;
      this.store.set(key, { count: 1, resetAt });
      return { allowed: true, remaining: config.maxRequests - 1, resetAt };
    }

    if (entry.count >= config.maxRequests) {
      return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count++;
    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetAt: entry.resetAt,
    };
  }
}

// ---------------------------------------------------------------------------
// Redis store (production / multi-instance)
// ---------------------------------------------------------------------------

class RedisRateLimitStore implements RateLimitStore {
  private redisUrl: string;

  constructor(redisUrl: string) {
    this.redisUrl = redisUrl;
  }

  /**
   * Uses a simple HTTP-based approach compatible with Upstash Redis REST API.
   * For other Redis providers, replace with a native Redis client (ioredis).
   */
  private async redisCommand(
    ...args: string[]
  ): Promise<{ result: unknown }> {
    const token = process.env.REDIS_TOKEN;
    if (!token) {
      throw new Error("REDIS_TOKEN is required for Redis rate limiting");
    }

    const response = await fetch(`${this.redisUrl}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
    });

    if (!response.ok) {
      throw new Error(`Redis request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async check(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const now = Date.now();
    const resetAt = now + config.windowSeconds * 1000;
    const redisKey = `ratelimit:${key}`;

    try {
      // INCR the counter
      const incrResult = await this.redisCommand("INCR", redisKey);
      const count = Number(incrResult.result);

      // If this is the first request, set expiry
      if (count === 1) {
        await this.redisCommand(
          "PEXPIRE",
          redisKey,
          String(config.windowSeconds * 1000)
        );
      }

      // Get TTL for accurate resetAt
      const ttlResult = await this.redisCommand("PTTL", redisKey);
      const ttl = Number(ttlResult.result);
      const actualResetAt = ttl > 0 ? now + ttl : resetAt;

      if (count > config.maxRequests) {
        return { allowed: false, remaining: 0, resetAt: actualResetAt };
      }

      return {
        allowed: true,
        remaining: config.maxRequests - count,
        resetAt: actualResetAt,
      };
    } catch (error) {
      // If Redis fails, fall back to allowing the request
      // (fail-open to avoid blocking users due to infrastructure issues)
      console.error("Redis rate limit error, failing open:", error);
      return { allowed: true, remaining: config.maxRequests, resetAt };
    }
  }
}

// ---------------------------------------------------------------------------
// Store singleton & public API
// ---------------------------------------------------------------------------

let _store: RateLimitStore | null = null;

function getStore(): RateLimitStore {
  if (!_store) {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      console.log("Rate limiter: using Redis backend");
      _store = new RedisRateLimitStore(redisUrl);
    } else {
      console.log(
        "Rate limiter: using in-memory backend (set REDIS_URL for production)"
      );
      _store = new MemoryRateLimitStore();
    }
  }
  return _store;
}

/**
 * Check if a request is within rate limits.
 *
 * @param key - Unique identifier for the rate limit (e.g., "login:127.0.0.1")
 * @param config - Rate limit configuration
 * @returns Whether the request is allowed
 */
export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  return getStore().check(key, config);
}

// ---------------------------------------------------------------------------
// Preset configurations
// ---------------------------------------------------------------------------

/** Rate limit config: 5 login attempts per 15 minutes per IP */
export const LOGIN_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowSeconds: 15 * 60,
};

/** Rate limit config: 3 registration attempts per 15 minutes per IP */
export const REGISTER_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 3,
  windowSeconds: 15 * 60,
};

/** Rate limit config: 60 API requests per minute per IP (general) */
export const API_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 60,
  windowSeconds: 60,
};
