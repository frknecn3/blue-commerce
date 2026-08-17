import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../route';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

describe('GET /api/health', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 and healthy status when database is reachable', async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([{ '?column?': 1 }] as any);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.status).toBe('healthy');
    expect(data.services.database.status).toBe('healthy');
    expect(data.services.database.provider).toBe('PostgreSQL');
    expect(data.system.memory).toBeDefined();
    expect(data.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });

  it('returns 503 and degraded status when database is unreachable', async () => {
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(new Error('Connection timeout'));

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(503);
    expect(data.status).toBe('degraded');
    expect(data.services.database.status).toBe('disconnected');
  });
});
