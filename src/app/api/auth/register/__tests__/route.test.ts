import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import emailjs from '@emailjs/nodejs';
import { rateLimiter } from '@/lib/rateLimiter';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
            delete: vi.fn(),
            create: vi.fn(),
        },
        cart: {
            create: vi.fn(),
        },
        cartItem: {
            createMany: vi.fn(),
        },
        product: {
            findMany: vi.fn(),
        },
        $transaction: vi.fn((cb) => cb(prisma)),
    },
}));

vi.mock('@emailjs/nodejs', () => ({
    default: {
        init: vi.fn(),
        send: vi.fn(),
    },
}));

vi.mock('bcryptjs', () => ({
    default: {
        hash: vi.fn().mockResolvedValue('$2a$10$mockHashedPassword12345'),
    },
}));

describe('POST /api/auth/register', () => {
    const validBody = {
        name: 'Alice Smith',
        email: 'alice@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        phone: '1234567890',
        country: 'US',
        defaultDeliveryLocation: 'Seattle',
        newsletter: true,
        terms: true,
        cart: [
            { productId: 'prod_1', quantity: 2 },
            { productId: 'prod_2', quantity: 1 },
        ],
    };

    beforeEach(() => {
        vi.clearAllMocks();
        rateLimiter.clear();
    });

    it('successfully registers a user and returns a sanitized payload without password hash', async () => {
        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
        vi.mocked(prisma.user.create).mockResolvedValueOnce({
            id: 'user_123',
            email: 'alice@example.com',
            name: 'Alice Smith',
            password: '$2a$10$mockHashedPassword12345',
            phone: '1234567890',
            role: 'USER',
            status: 'PENDING',
            activateAccountCode: 'secret_code_123',
        } as any);
        vi.mocked(prisma.cart.create).mockResolvedValueOnce({ id: 'cart_123', userId: 'user_123' } as any);
        vi.mocked(prisma.product.findMany).mockResolvedValueOnce([
            { id: 'prod_1' },
            { id: 'prod_2' },
        ] as any);
        vi.mocked(prisma.cartItem.createMany).mockResolvedValueOnce({ count: 2 });
        vi.mocked(emailjs.send).mockResolvedValueOnce({ status: 200, text: 'OK' } as any);

        const req = new NextRequest('http://localhost:3000/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(validBody),
            headers: {
                'x-forwarded-for': '192.168.1.100, 10.0.0.1',
            },
        });

        const response = await POST(req, {} as any);
        const json = await response.json();

        expect(response.status).toBe(201);
        expect(json.data.user.id).toBe('user_123');
        expect(json.data.user.email).toBe('alice@example.com');
        expect(json.data.user.password).toBeUndefined();
        expect(json.data.user.activateAccountCode).toBeUndefined();
        expect(json.data.emailSent).toBe(true);

        // Verify batch cart creation
        expect(prisma.cartItem.createMany).toHaveBeenCalledWith({
            data: [
                { cartId: 'cart_123', productId: 'prod_1', quantity: 2 },
                { cartId: 'cart_123', productId: 'prod_2', quantity: 1 },
            ],
        });
    });

    it('rejects registration when email already exists with ACTIVE status', async () => {
        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
            id: 'existing_user',
            email: 'alice@example.com',
            status: 'ACTIVE',
        } as any);

        const req = new NextRequest('http://localhost:3000/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(validBody),
        });

        const response = await POST(req, {} as any);
        const json = await response.json();

        expect(response.status).toBe(409);
        expect(json.data.status).toBe('ERR_USER_EXISTS');
        expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('rejects registration when passwords do not match', async () => {
        const req = new NextRequest('http://localhost:3000/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                ...validBody,
                confirmPassword: 'MismatchPassword1',
            }),
        });

        const response = await POST(req, {} as any);
        const json = await response.json();

        expect(response.status).toBe(400);
        expect(json.data.status).toBe('ERR_MISSING_INVALID_FIELDS');
    });

    it('does not delete user if email delivery fails, returning emailSent: false', async () => {
        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
        vi.mocked(prisma.user.create).mockResolvedValueOnce({
            id: 'user_456',
            email: 'alice@example.com',
            name: 'Alice Smith',
            password: '$2a$10$mockHashedPassword12345',
            role: 'USER',
            status: 'PENDING',
        } as any);
        vi.mocked(prisma.cart.create).mockResolvedValueOnce({ id: 'cart_456', userId: 'user_456' } as any);
        vi.mocked(prisma.product.findMany).mockResolvedValueOnce([]);
        vi.mocked(emailjs.send).mockRejectedValueOnce(new Error('EmailJS Service Timeout'));

        const req = new NextRequest('http://localhost:3000/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(validBody),
        });

        const response = await POST(req, {} as any);
        const json = await response.json();

        expect(response.status).toBe(201);
        expect(json.data.emailSent).toBe(false);
        expect(json.data.user.id).toBe('user_456');
        // Critical: User must NOT be deleted on email timeout
        expect(prisma.user.delete).not.toHaveBeenCalled();
    });
});
