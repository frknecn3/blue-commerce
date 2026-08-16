interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class MemoryRateLimiter {
  private storage = new Map<string, RateLimitRecord>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Periodically clean up expired entries every 5 minutes
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  /**
   * Check if an action is allowed for a given key.
   * @param key Unique identifier (e.g. `ip:endpoint` or `user:id`)
   * @param limit Max allowed requests within the window
   * @param windowMs Window duration in milliseconds
   */
  public check(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = this.storage.get(key);

    if (!record || now >= record.resetTime) {
      // First request or window expired
      const newRecord: RateLimitRecord = {
        count: 1,
        resetTime: now + windowMs,
      };
      this.storage.set(key, newRecord);
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: newRecord.resetTime,
      };
    }

    if (record.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
      };
    }

    record.count += 1;
    return {
      allowed: true,
      remaining: limit - record.count,
      resetTime: record.resetTime,
    };
  }

  /**
   * Reset a specific key (e.g. on successful login)
   */
  public reset(key: string): void {
    this.storage.delete(key);
  }

  /**
   * Clear all records
   */
  public clear(): void {
    this.storage.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.storage.entries()) {
      if (now >= record.resetTime) {
        this.storage.delete(key);
      }
    }
  }
}

export const rateLimiter = new MemoryRateLimiter();
