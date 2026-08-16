import { prisma } from "@/lib/prisma";
import { RegisterUserSchema } from "@/lib/zod";
import APIError from "@/types/api";
import { res, withErrorHandler } from "@/utils/serverUtils"
import { NextRequest } from "next/server";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import emailjs from '@emailjs/nodejs';
import { rateLimiter } from "@/lib/rateLimiter";

emailjs.init({
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
    privateKey: process.env.EMAILJS_PRIVATE_KEY!
});

const postHandler = async (req: NextRequest) => {
    // 1. Rate limiting: 5 registration attempts per 10 minutes per IP
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimitResult = rateLimiter.check(`register:${clientIp}`, 5, 10 * 60 * 1000);
    if (!rateLimitResult.allowed) {
        throw new APIError('Too many registration attempts. Please try again later.', 429, 'ERR_RATE_LIMIT_EXCEEDED');
    }

    const body = await req.json();
    const validatedFields = RegisterUserSchema.safeParse(body);

    if (!validatedFields.success) {
        const messages = validatedFields.error.issues.map((err) => `${err.path}: ${err.message}`)
        throw new APIError('Missing/invalid fields in register user body.', 400, 'ERR_MISSING_INVALID_FIELDS', messages);
    }

    const data = validatedFields.data;

    // check for already existing user email
    const userExists = await prisma.user.findFirst({
        where: {
            email: data.email
        }
    });

    if (userExists) {
        if (userExists.status !== 'PENDING') throw new APIError('A User with this email already exists.', 400, 'ERR_USER_EXISTS');

        await prisma.user.delete({
            where: { id: userExists.id }
        });
    }

    // check if passwords match
    if (data.password !== data.confirmPassword) throw new APIError("Passwords don't match", 400, 'ERR_PASS_DONT_MATCH');

    // 2. Hash password with bcrypt before persisting to DB
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // create the activation link
    const randomHash = crypto.randomBytes(20).toString('hex');
    const link = `${req.nextUrl.origin}/register/confirm/${randomHash}`;

    // create a pending user
    const user = await prisma.user.create({
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
            activateAccountCode: randomHash,
        }
    });

    // create cart
    const cart = await prisma.cart.create({
        data: {
            userId: user.id
        }
    });

    if (data.cart && data.cart.length > 0) {
        const products = await prisma.product.findMany({
            where: { id: { in: data.cart.map(i => i.productId) } }
        });

        const productSet = new Set(products.map(p => p.id));

        for (const item of data.cart) {
            if (!productSet.has(item.productId)) continue;

            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: item.productId,
                    quantity: Number(item.quantity) ?? 1
                }
            });
        }
    }

    try {
        await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
            { mail: user.email, activationLink: link }
        );
    } catch (emailError) {
        // Rollback on email failure
        await prisma.user.delete({
            where: { id: user.id }
        });

        throw new APIError(
            'User account initialized, but activation email failed to send. Please try again.',
            500,
            'ERR_EMAIL_SEND_FAILED'
        );
    }

    return res(201, 'User successfully created - pending email activation.', user);
};

export const POST = withErrorHandler(postHandler);