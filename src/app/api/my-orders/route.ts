import { prisma } from "@/lib/prisma";
import APIError from "@/types/api";
import { getUser, res, withErrorHandler } from "@/utils/serverUtils";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

type Params = {
    params: { userId: string }
}

const getHandler = async (req: NextRequest) => {

    const user = await getUser();

    if (!user) throw new APIError('Please log in again.', 406, 'ERR_NO_USER');

    const orders = await prisma.order.findMany({
        where: {
            ownerId: user.id
        },
        include: {
            items: {
                include: { product: true }
            }
        }
    })

    return res(200, 'Your orders were successfully fetched.', orders);
}


export const GET = withErrorHandler(getHandler);