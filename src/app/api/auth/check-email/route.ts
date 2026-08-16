import { prisma } from "@/lib/prisma";
import APIError from "@/types/api";
import { res, withErrorHandler } from "@/utils/serverUtils";
import { NextRequest } from "next/server";
import { z } from "zod";

const EmailCheckSchema = z.object({
    email: z.string().email("Please enter a valid email address.")
});

const postHandler = async (req: NextRequest) => {
    const body = await req.json();
    const validated = EmailCheckSchema.safeParse(body);

    if (!validated.success) {
        throw new APIError('Please provide a valid email address.', 400, 'ERR_INVALID_EMAIL');
    }

    const { email } = validated.data;

    const existingUser = await prisma.user.findFirst({
        where: { email }
    });

    if (existingUser && existingUser.status !== 'PENDING') {
        return res(200, 'A user with this email address already exists.', { available: false });
    }

    return res(200, 'Email is available.', { available: true });
};

export const POST = withErrorHandler(postHandler);
