import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findUnique: vi.fn(),
    },
    favorite: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

describe('/api/favorite API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/favorite', () => {
    it('returns 401 if user is not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce(null);

      const req = new NextRequest('http://localhost:3000/api/favorite');
      const res = await GET(req, {} as any);

      expect(res.status).toBe(401);
    });

    it('returns favorites list for authenticated user', async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: 'user-123', name: 'John Doe', email: 'john@example.com' },
      } as any);

      const mockFavorites = [
        {
          id: 'fav-1',
          ownerId: 'user-123',
          productId: 'prod-1',
          item: { id: 'prod-1', name: 'Gaming Chair', price: 199.99 },
        },
      ];

      vi.mocked(prisma.favorite.findMany).mockResolvedValueOnce(mockFavorites as any);

      const req = new NextRequest('http://localhost:3000/api/favorite');
      const res = await GET(req, {} as any);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.data).toEqual(mockFavorites);
    });
  });

  describe('POST /api/favorite', () => {
    it('returns 401 if user is not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce(null);

      const req = new NextRequest('http://localhost:3000/api/favorite', {
        method: 'POST',
        body: JSON.stringify({ productId: 'prod-1' }),
      });

      const res = await POST(req, {} as any);
      expect(res.status).toBe(401);
    });

    it('returns 404 if product does not exist', async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: 'user-123', name: 'John Doe', email: 'john@example.com' },
      } as any);

      vi.mocked(prisma.product.findUnique).mockResolvedValueOnce(null);

      const req = new NextRequest('http://localhost:3000/api/favorite', {
        method: 'POST',
        body: JSON.stringify({ productId: 'non-existent-id' }),
      });

      const res = await POST(req, {} as any);
      expect(res.status).toBe(404);
    });

    it('adds product to favorites and returns 201', async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: 'user-123', name: 'John Doe', email: 'john@example.com' },
      } as any);

      const mockProduct = { id: 'prod-1', name: 'Mechanical Keyboard' };
      const mockFavoriteResult = {
        id: 'fav-1',
        ownerId: 'user-123',
        productId: 'prod-1',
        item: mockProduct,
      };

      vi.mocked(prisma.product.findUnique).mockResolvedValueOnce(mockProduct as any);
      vi.mocked(prisma.favorite.upsert).mockResolvedValueOnce(mockFavoriteResult as any);

      const req = new NextRequest('http://localhost:3000/api/favorite', {
        method: 'POST',
        body: JSON.stringify({ productId: 'prod-1' }),
      });

      const res = await POST(req, {} as any);
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.data).toEqual(mockFavoriteResult);
    });
  });
});
