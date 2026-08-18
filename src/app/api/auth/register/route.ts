import { prisma } from "@/lib/prisma";
import { RegisterUserSchema } from "@/lib/zod";
import APIError from "@/types/api";
import { res, withErrorHandler } from "@/utils/serverUtils";
import { NextRequest } from "next/server";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import emailjs from '@emailjs/nodejs';
import { rateLimiter } from "@/lib/rateLimiter";
import { logger } from "@/lib/logger";
import { Prisma } from "@/generated/prisma";

export const dynamic = 'force-dynamic';

emailjs.init({
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
    privateKey: process.env.EMAILJS_PRIVATE_KEY || ''
});

const postHandler = async (req: NextRequest) => {
    // 1. Robust IP Rate Limiting (Left-most client IP from forwarded proxy header)
    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : req.ip || '127.0.0.1';
    
    const rateLimitResult = rateLimiter.check(`register:${clientIp}`, 5, 10 * 60 * 1000);
    if (!rateLimitResult.allowed) {
        throw new APIError('Too many registration attempts. Please try again later.', 429, 'ERR_RATE_LIMIT_EXCEEDED');
    }

    const body = await req.json();
    const validatedFields = RegisterUserSchema.safeParse(body);

    if (!validatedFields.success) {
        const messages = validatedFields.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        throw new APIError('Missing or invalid fields in register user body.', 400, 'ERR_MISSING_INVALID_FIELDS', messages);
    }

    const data = validatedFields.data;

    // 2. Efficient O(1) Unique Index Lookup
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    });

    if (existingUser && existingUser.status !== 'PENDING') {
        throw new APIError('A user with this email already exists.', 409, 'ERR_USER_EXISTS');
    }

    // 3. Hash password before entering database transaction
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const randomActivationCode = crypto.randomBytes(20).toString('hex');
    const activationLink = `${req.nextUrl.origin}/register/confirm/${randomActivationCode}`;

    // 4. Atomic Transactional Account & Cart Creation with Batch Insertion
    let createdUser;
    try {
        createdUser = await prisma.$transaction(async (tx) => {
            // Remove previous unconfirmed pending account for this email if present
            if (existingUser && existingUser.status === 'PENDING') {
                await tx.user.delete({
                    where: { id: existingUser.id }
                });
            }

            // Create new pending user
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    password: hashedPassword,
                    phone: data.phone,
                    role: 'USER',
                    status: 'PENDING',
                    country: data.country,
                    defaultDeliveryLocation: data.defaultDeliveryLocation,
                    newsletter: data.newsletter,
                    activateAccountCode: randomActivationCode,
                }
            });

            // Create associated cart
            const cart = await tx.cart.create({
                data: {
                    userId: user.id
                }
            });

            // Batch insert validated cart items in a single round-trip
            if (data.cart && data.cart.length > 0) {
                const productIds = data.cart.map((item) => item.productId);
                const validProducts = await tx.product.findMany({
                    where: { id: { in: productIds } },
                    select: { id: true }
                });
                const validProductSet = new Set(validProducts.map((p) => p.id));

                const cartItemsToCreate = data.cart
                    .filter((item) => validProductSet.has(item.productId))
                    .map((item) => ({
                        cartId: cart.id,
                        productId: item.productId,
                        quantity: item.quantity,
                    }));

                if (cartItemsToCreate.length > 0) {
                    await tx.cartItem.createMany({
                        data: cartItemsToCreate
                    });
                }
            }

            return user;
        });
    } catch (err: any) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new APIError('A user with this email already exists.', 409, 'ERR_USER_EXISTS');
        }
        throw err;
    }

    // 5. Asynchronous Email Dispatch (Decoupled from Database State to Prevent Orphan Deletion Bugs)
    let emailSent = true;
    try {
        await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
            { mail: createdUser.email, activationLink }
        );
    } catch (emailError: any) {
        emailSent = false;
        logger.error('Activation email dispatch failed during registration', {
            userId: createdUser.id,
            email: createdUser.email,
            error: emailError?.message || emailError
        });
    }

    // 6. Sanitized Response Payload (Strictly Excludes Password Hash & Security Tokens)
    const sanitizedUser = {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        role: createdUser.role,
        status: createdUser.status,
    };

    return res(
        201,
        emailSent
            ? 'User successfully registered. Please check your email to activate your account.'
            : 'User successfully registered. Activation email delivery delayed; please request a resend if not received shortly.',
        {
            user: sanitizedUser,
            emailSent,
        }
    );
};

export const POST = withErrorHandler(postHandler);