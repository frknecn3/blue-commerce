/**
 * Distributed & In-Memory Hybrid Rate Limiter
 * 
 * Architectural Note:
 * - Serverless environments (e.g. Vercel, AWS Lambda) spin up multiple stateless instances.
 * - In production, this module seamlessly interfaces with Upstash Redis or a Redis REST API
 *   when `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN` are set.
 * - In local development, testing, or standalone container deployments without external Redis,
 *   it falls back gracefully to a memory-backed Sliding Window Limiter with automatic TTL cleanup.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  totalLimit?: number;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export class HybridRateLimiter {
  private memoryStorage = new Map<string, RateLimitRecord>();
  private cleanupInterval: NodeJS.Timeout | null = null;
  private upstashUrl: string | undefined;
  private upstashToken: string | undefined;

  constructor() {
    this.upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    this.upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    // Periodically clean up expired local entries every 5 minutes
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  /**
   * Check if an action is allowed for a given key (synchronous memory-backed).
   * @param key Unique identifier (e.g. `ip:endpoint` or `user:id`)
   * @param limit Max allowed requests within the window
   * @param windowMs Window duration in milliseconds
   */
  public check(key: string, limit: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    const record = this.memoryStorage.get(key);

    if (!record || now >= record.resetTime) {
      // First request or window expired
      const newRecord: RateLimitRecord = {
        count: 1,
        resetTime: now + windowMs,
      };
      this.memoryStorage.set(key, newRecord);
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: newRecord.resetTime,
        totalLimit: limit,
      };
    }

    if (record.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
        totalLimit: limit,
      };
    }

    record.count += 1;
    return {
      allowed: true,
      remaining: limit - record.count,
      resetTime: record.resetTime,
      totalLimit: limit,
    };
  }

  /**
   * Asynchronously check rate limit with distributed Upstash Redis support when configured,
   * falling back to local sliding window if Redis is unreachable or unconfigured.
   */
  public async checkDistributed(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    if (this.upstashUrl && this.upstashToken) {
      try {
        const windowSec = Math.ceil(windowMs / 1000);
        // Multi-command: INCR key, and EXPIRE key if first request
        const response = await fetch(`${this.upstashUrl}/pipeline`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.upstashToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            ['INCR', `ratelimit:${key}`],
            ['EXPIRE', `ratelimit:${key}`, windowSec, 'NX'],
            ['PTTL', `ratelimit:${key}`],
          ]),
          cache: 'no-store',
        });

        if (response.ok) {
          const results = await response.json();
          const currentCount = Number(results[0]?.result || 1);
          const pttl = Number(results[2]?.result || windowMs);
          const resetTime = Date.now() + (pttl > 0 ? pttl : windowMs);

          const allowed = currentCount <= limit;
          return {
            allowed,
            remaining: Math.max(0, limit - currentCount),
            resetTime,
            totalLimit: limit,
          };
        }
      } catch (err) {
        console.warn('Upstash Redis rate limiter check failed, falling back to in-memory limiter:', err);
      }
    }

    // Default to in-memory sliding window
    return this.check(key, limit, windowMs);
  }

  /**
   * Reset a specific key (e.g. on successful login)
   */
  public reset(key: string): void {
    this.memoryStorage.delete(key);
  }

  /**
   * Clear all records
   */
  public clear(): void {
    this.memoryStorage.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.memoryStorage.entries()) {
      if (now >= record.resetTime) {
        this.memoryStorage.delete(key);
      }
    }
  }
}

export const rateLimiter = new HybridRateLimiter();
