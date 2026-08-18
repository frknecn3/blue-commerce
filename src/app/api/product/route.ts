import { prisma } from "@/lib/prisma";
import APIError from "@/types/api";
import { res, withErrorHandler } from "@/utils/serverUtils";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

// RIGHT NOW THIS IS NOT USED

type HandlerParams = {
    params: { page: number, limit: number, query: string }
}

async function getHandler(req: NextRequest, { params }: HandlerParams) {

    const searchParams = req.nextUrl.searchParams;

    // Get a specific parameter (e.g., /api/search?query=laptop)
    const query = searchParams.get('query') || '';
    const limit = Number(searchParams.get('limit'));
    const page = Number(searchParams.get('page'));

    const totalProducts = await prisma.product.count();
    const totalPages = Math.ceil(totalProducts / limit);

    if (page && page > totalPages) throw new APIError('Page number cannot exceed max pages', 400, 'ERR_EXCEED_PAGE')

    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: query,
                mode: 'insensitive'
            }
        },
        skip: (limit ?? (page - 1) * limit) | 0,
        take: limit | 20,
        orderBy: {
            createdAt: 'desc'
        }
    })

    console.log(products.length)

    return res(200, 'Products have been successfully sent.', products)
}


export const GET = withErrorHandler(getHandler)