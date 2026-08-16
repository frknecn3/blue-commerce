import StoresTable from '@/components/Admin/StoresTable'
import TableControls from '@/components/Admin/ProductsTable/TableControls'
import SearchInput from '@/components/Admin/UsersTable/SearchInput'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import React from 'react'

type Props = {
    searchParams: {
        q?: string,
        page?: string,
        limit?: string,
        sort?: string,
        order?: 'asc' | 'desc' | ''
    }
}

const StoresPage = async ({ searchParams }: Props) => {
    const page = Number(searchParams.page) || 1;
    const query = searchParams.q || '';
    const limit = Number(searchParams.limit) || 10;
    const sort = searchParams.sort;
    const order = searchParams.order;

    const whereClause = query ? { storeName: { contains: query, mode: "insensitive" as const } } : {};

    const [data, totalAmount] = await Promise.all([
        prisma.store.findMany({
            where: whereClause,
            include: {
                owner: true,
                products: true,
                _count: {
                    select: { products: true }
                }
            },
            take: limit,
            skip: (page - 1) * limit,
            orderBy:
                sort === 'productCount'
                    ? { products: { _count: (order as 'asc' | 'desc') || 'asc' } }
                    : sort
                        ? { [sort]: order || 'asc' }
                        : undefined
        }),
        prisma.store.count({
            where: whereClause
        })
    ]);

    return (
        <div className='flex-[4] flex flex-col h-full mx-auto max-w-[1400px] px-4 py-6'>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Stores Management</h1>
                    <p className="text-xs text-slate-500 mt-0.5">View and manage all registered merchant stores.</p>
                </div>
                <SearchInput placeholder='Search store name...' />
            </div>

            <StoresTable data={data} />
            <TableControls totalAmount={totalAmount || 0} />
        </div>
    )
}

export default StoresPage