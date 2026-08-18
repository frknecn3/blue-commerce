import ProductsTable from '@/components/Admin/ProductsTable'
import TableControls from '@/components/Admin/ProductsTable/TableControls'
import SearchInput from '@/components/Admin/UsersTable/SearchInput'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import React from 'react'
import { FaPlus } from 'react-icons/fa'

export const dynamic = 'force-dynamic';

type Props = {
    searchParams: {
        q?: string,
        page?: string,
        limit?: string,
        sort?: string,
        order?: 'asc' | 'desc'
    }
}

const ProductsPage = async ({ searchParams }: Props) => {
    const page = Number(searchParams.page) || 1;
    const query = searchParams.q || '';
    const limit = Number(searchParams.limit) || 10;
    const sort = searchParams.sort;
    const order = searchParams.order;

    const whereClause = query ? { name: { contains: query, mode: "insensitive" as const } } : {};

    const [data, totalAmount] = await Promise.all([
        prisma.product.findMany({
            where: whereClause,
            take: limit,
            skip: (page - 1) * limit,
            orderBy: sort ? { [sort]: order || 'asc' } : undefined
        }),
        prisma.product.count({
            where: whereClause
        })
    ]);

    const serializedData = data.map((item) => ({ ...item, price: item.price.toNumber() }));

    return (
        <div className='flex-[4] flex flex-col h-full mx-auto max-w-[1400px] px-4 py-6'>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Products Catalog</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Control, edit, and audit products in the database.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <SearchInput placeholder='Search product name...' />
                    <Link
                        href='/admin/product/create'
                        className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-md shadow-xs transition-colors shrink-0'
                    >
                        <FaPlus className="text-xs" />
                        <span>Create Product</span>
                    </Link>
                </div>
            </div>

            <ProductsTable data={serializedData} />
            <TableControls totalAmount={totalAmount || 0} />
        </div>
    )
}

export default ProductsPage