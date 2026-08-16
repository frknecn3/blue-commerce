import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  calculateTotalCost,
  shimmer,
  toBase64,
  getGuestCart,
  setGuestCart
} from '../clientOnlyUtils';
import { CartUIItem } from '@/redux/slices/cartSlice';

describe('clientOnlyUtils', () => {
  describe('calculateTotalCost', () => {
    it('returns 0 for an empty cart array', () => {
      const result = calculateTotalCost([]);
      expect(result).toBe(0);
    });

    it('returns 0 for null or undefined input', () => {
      expect(calculateTotalCost(null as any)).toBe(0);
      expect(calculateTotalCost(undefined as any)).toBe(0);
    });

    it('calculates total for a single product with quantity 1', () => {
      const cart: CartUIItem[] = [
        {
          id: 'item-1',
          quantity: 1,
          product: {
            id: 'prod-1',
            name: 'Wireless Mouse',
            imageUrl: '/mouse.jpg',
            price: 29.99,
            stock: 10
          }
        }
      ];
      expect(calculateTotalCost(cart)).toBe(29.99);
    });

    it('calculates total correctly for multiple items with different quantities', () => {
      const cart: CartUIItem[] = [
        {
          id: 'item-1',
          quantity: 2,
          product: {
            id: 'prod-1',
            name: 'T-Shirt',
            imageUrl: '/shirt.jpg',
            price: 19.99, // 2 * 19.99 = 39.98
            stock: 20
          }
        },
        {
          id: 'item-2',
          quantity: 3,
          product: {
            id: 'prod-2',
            name: 'Coffee Mug',
            imageUrl: '/mug.jpg',
            price: 10.50, // 3 * 10.50 = 31.50
            stock: 15
          }
        }
      ];
      expect(calculateTotalCost(cart)).toBe(71.48);
    });
  });

  describe('shimmer and toBase64', () => {
    it('generates a valid SVG shimmer string with given width and height', () => {
      const svg = shimmer(200, 200);
      expect(svg).toContain('<svg');
      expect(svg).toContain('width="200"');
      expect(svg).toContain('height="200"');
      expect(svg).toContain('<linearGradient');
    });

    it('converts a string to valid base64', () => {
      const str = 'Hello World';
      const encoded = toBase64(str);
      expect(encoded).toBe(btoa(str));
    });
  });

  describe('localStorage Guest Cart utilities', () => {
    let mockStorage: Record<string, string> = {};

    beforeEach(() => {
      mockStorage = {};
      vi.stubGlobal('localStorage', {
        getItem: vi.fn((key: string) => mockStorage[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          mockStorage[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete mockStorage[key];
        }),
        clear: vi.fn(() => {
          mockStorage = {};
        })
      });
    });

    it('returns empty array when localStorage has no guest cart', () => {
      const cart = getGuestCart();
      expect(cart).toEqual([]);
    });

    it('sets and retrieves items from the guest cart', () => {
      const testCart = [{ productId: 'prod-123', quantity: 2 }];
      setGuestCart(testCart);
      const retrieved = getGuestCart();
      expect(retrieved).toEqual(testCart);
    });

    it('handles emptying the guest cart by setting empty array', () => {
      setGuestCart([{ productId: 'prod-1', quantity: 1 }]);
      setGuestCart([]);
      expect(getGuestCart()).toEqual([]);
    });
  });
});
