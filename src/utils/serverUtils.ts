import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../lib/prisma";
import { Cart } from "../generated/prisma";
import APIError from "../types/api";
import { ZodError } from "zod";
import { ActionResponse } from "@/app/actions/productActions";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@/generated/prisma/runtime/client";
import { authOptions } from "@/lib/auth";

export const res = <T>(
    status: number,
    message?: string,
    data?: T,
    errCode?: string,
): NextResponse | Response => {
    if (status !== 204) return NextResponse.json(
        { message, ...(data !== undefined && { data }) },
        { status }
    );
    else return new Response(null, { status: 204 })
};

export const getCustomServerSession = async () => await getServerSession(authOptions);

// define api func type
type ApiHandler<T> = (req: NextRequest, params: T) => Promise<Response>;

export const withErrorHandler = <T>(handler: ApiHandler<T>) => {
    return async (req: NextRequest, params: T) => {
        try {
            return await handler(req, params);
        } catch (err) {
            if (process.env.NODE_ENV !== 'test' && !(err instanceof APIError)) {
                console.error("Global Error Handler:", err);
            }

            if (err instanceof APIError) {
                const details = err.details as string[]
                return res<{ status: string, details: string[] }>(err.statusCode, err.message, { status: err.errorCode, details: details });
            }


            if (err instanceof ZodError) {
                return res(400, "Validation error, check details.", err.errors.toString(), "VALIDATION_ERROR");
            }

            // general system errors
            const message = err instanceof Error ? err.message : "Internal server error";
            const status = err instanceof Error ? 400 : 500;

            return res(status, message, "UNKNOWN_ERROR");
        }
    };
};

export const actionRequireAdmin = async (): Promise<User> => {

    const user = await getUser();
    const isAdmin = user?.role === 'ADMIN';

    if (!user || !isAdmin) throw new APIError('User is not an admin', 403, 'UNAUTHORIZED');

    return user;
}

export async function actionCatchAsync(fn: () => Promise<ActionResponse>): Promise<ActionResponse> {
    try {
        return await fn();
    }
    catch (err) {
        let finalError;

        if (err instanceof Error) {
            finalError = err.message
        }

        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {

                return {
                    success: false,
                    message: `A product with this name already exists.`,
                    error: "Unique constraint failed."
                }
            }

            if (err.code === 'P2003') {
                return {
                    success: false,
                    message: "Foreign key constraint failed. Invalid category or seller ID.",
                    error: "Relation error."
                };
            }

            return {
                success: false,
                message: "A database error occurred.",
                error: err.message
            };
        }

        if (err instanceof PrismaClientValidationError) {
            return {
                success: false,
                message: "Database validation failed. Ensure all required fields are provided.",
                error: "Validation error."
            };
        }

        console.log("Unidentifiable Error: ", err);

        return {
            success: false,
            message: "An unidentifiable database error has occurred.",
            error: finalError
        };
    }

}

export async function adminAction(fn: () => Promise<ActionResponse>): Promise<ActionResponse> {
    return actionCatchAsync(async () => {
        await actionRequireAdmin();
        return await fn();
    })
}

export const getUser = async (): Promise<User> => {

    const session = await getCustomServerSession();

    if (!session) { throw new APIError('Please log in again', 401, 'SESSION_EXPIRED') };

    return session.user;
}

export const findCartByUserId = async (uid: string): Promise<Cart> => {

    return await prisma.cart.upsert({
        where: { userId: uid },
        update: {},
        create: { userId: uid }
    })

}
