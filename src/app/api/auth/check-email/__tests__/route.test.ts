import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
    },
  },
}));

describe('POST /api/auth/check-email', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid email format', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/check-email', {
      method: 'POST',
      body: JSON.stringify({ email: 'invalid-email-format' }),
    });

    const res = await POST(req, {} as any);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.data.status).toBe('ERR_INVALID_EMAIL');
    expect(data.message).toBe('Please provide a valid email address.');
  });

  it('returns available: false when an active user with the email exists', async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({
      id: 'user-1',
      email: 'existing@example.com',
      status: 'ENABLED',
    } as any);

    const req = new NextRequest('http://localhost:3000/api/auth/check-email', {
      method: 'POST',
      body: JSON.stringify({ email: 'existing@example.com' }),
    });

    const res = await POST(req, {} as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.data.available).toBe(false);
    expect(data.message).toContain('already exists');
  });

  it('returns available: true when no user with the email exists', async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(null);

    const req = new NextRequest('http://localhost:3000/api/auth/check-email', {
      method: 'POST',
      body: JSON.stringify({ email: 'newuser@example.com' }),
    });

    const res = await POST(req, {} as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.data.available).toBe(true);
  });
});
