import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rateLimiter } from '../rateLimiter';

describe('MemoryRateLimiter', () => {
  beforeEach(() => {
    rateLimiter.clear();
  });

  it('allows requests within the defined threshold', () => {
    const key = 'test-ip-1';
    const limit = 3;
    const windowMs = 1000;

    const req1 = rateLimiter.check(key, limit, windowMs);
    expect(req1.allowed).toBe(true);
    expect(req1.remaining).toBe(2);

    const req2 = rateLimiter.check(key, limit, windowMs);
    expect(req2.allowed).toBe(true);
    expect(req2.remaining).toBe(1);

    const req3 = rateLimiter.check(key, limit, windowMs);
    expect(req3.allowed).toBe(true);
    expect(req3.remaining).toBe(0);
  });

  it('blocks requests exceeding the threshold', () => {
    const key = 'test-ip-blocked';
    const limit = 2;
    const windowMs = 1000;

    rateLimiter.check(key, limit, windowMs); // 1
    rateLimiter.check(key, limit, windowMs); // 2

    const blockedReq = rateLimiter.check(key, limit, windowMs);
    expect(blockedReq.allowed).toBe(false);
    expect(blockedReq.remaining).toBe(0);
  });

  it('resets the rate limit window after window expiration', () => {
    const key = 'test-ip-reset';
    const limit = 1;
    const windowMs = 500;

    const req1 = rateLimiter.check(key, limit, windowMs);
    expect(req1.allowed).toBe(true);

    const blocked = rateLimiter.check(key, limit, windowMs);
    expect(blocked.allowed).toBe(false);

    // Fast-forward time
    vi.setSystemTime(Date.now() + 600);

    const reqAfterExpiry = rateLimiter.check(key, limit, windowMs);
    expect(reqAfterExpiry.allowed).toBe(true);
    vi.useRealTimers();
  });

  it('allows manual reset for a specific key', () => {
    const key = 'test-ip-manual-reset';
    rateLimiter.check(key, 1, 10000);
    expect(rateLimiter.check(key, 1, 10000).allowed).toBe(false);

    rateLimiter.reset(key);
    expect(rateLimiter.check(key, 1, 10000).allowed).toBe(true);
  });
});
