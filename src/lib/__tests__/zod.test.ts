import { describe, it, expect } from 'vitest';
import { ProductSchema, AddItemSchema, RegisterUserSchema } from '../zod';

describe('Zod Validation Schemas', () => {
    it('validates a correct product payload', () => {
        const payload = {
            name: 'Test Headphones',
            description: 'High quality sound',
            category: 'electronics-id',
            seller: 'seller-id',
            stock: 10,
            price: 99.99,
            status: 'ACTIVE',
        };
        const result = ProductSchema.safeParse(payload);
        expect(result.success).toBe(true);
    });

    it('rejects product with negative price', () => {
        const payload = {
            name: 'Invalid Product',
            description: 'Bad price',
            category: 'electronics-id',
            seller: 'seller-id',
            stock: 5,
            price: -10,
        };
        const result = ProductSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });

    it('validates AddItemSchema with valid CUID and positive quantity', () => {
        const payload = {
            productId: 'cjld2cyuq0000t3rmniod1foy',
            quantity: 2,
        };
        const result = AddItemSchema.safeParse(payload);
        expect(result.success).toBe(true);
    });

    describe('RegisterUserSchema Password Requirements', () => {
        const validUserBase = {
            name: 'John Doe',
            email: 'john@example.com',
            confirmPassword: 'Password1',
            phone: '1234567890',
            country: 'US',
            defaultDeliveryLocation: 'New York',
            cart: [],
            terms: 'true'
        };

        it('accepts password with at least 8 chars, 1 uppercase, and 1 number', () => {
            const result = RegisterUserSchema.safeParse({
                ...validUserBase,
                password: 'Password1'
            });
            expect(result.success).toBe(true);
        });

        it('rejects password shorter than 8 characters', () => {
            const result = RegisterUserSchema.safeParse({
                ...validUserBase,
                password: 'Pass1'
            });
            expect(result.success).toBe(false);
        });

        it('rejects password missing uppercase letter', () => {
            const result = RegisterUserSchema.safeParse({
                ...validUserBase,
                password: 'password1'
            });
            expect(result.success).toBe(false);
        });

        it('rejects password missing number', () => {
            const result = RegisterUserSchema.safeParse({
                ...validUserBase,
                password: 'Password'
            });
            expect(result.success).toBe(false);
        });
    });
});
