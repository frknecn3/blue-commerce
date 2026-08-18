import TableControls from '@/components/Admin/ProductsTable/TableControls'
import UsersTable from '@/components/Admin/UsersTable'
import SearchInput from '@/components/Admin/UsersTable/SearchInput'
import { prisma } from '@/lib/prisma'
import React from 'react'

export const dynamic = 'force-dynamic';

type Props = {
    searchParams: {
        q?: string,
        page?: string,
        limit?: string,
        sort?: string,
        order?: 'asc' | 'desc' | ''
    }
}

const UsersPage = async ({ searchParams }: Props) => {
    const page = Number(searchParams.page) || 1;
    const query = searchParams.q || '';
    const limit = Number(searchParams.limit) || 10;

    const whereClause = query ? { name: { contains: query, mode: "insensitive" as const } } : {};

    const [data, totalAmount] = await Promise.all([
        prisma.user.findMany({
            where: whereClause,
            take: limit,
            skip: (page - 1) * limit,
        }),
        prisma.user.count({
            where: whereClause
        })
    ]);

    return (
        <div className='flex-[4] flex flex-col h-full mx-auto max-w-[1400px] px-4 py-6'>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Users Administration</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Manage customer and seller accounts across the platform.</p>
                </div>
                <SearchInput placeholder='Search user name...' />
            </div>

            <UsersTable data={data} />
            <TableControls totalAmount={totalAmount || 0} />
        </div>
    )
}

export default UsersPage