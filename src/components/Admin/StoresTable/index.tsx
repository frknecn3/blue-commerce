'use client'
import { Store } from '@/generated/prisma';
import React, { useEffect, useState } from 'react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import TableStoreRow from './TableStoreRow';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type StoreWithCount = Store & {
  _count?: {
    products: number;
  };
};

type Props = {
    data: StoreWithCount[];
}

const StoresTable = ({ data }: Props) => {
    const [sort, setSort] = useState<{ key: string, order: string }>({ key: '', order: 'asc' });
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (sort.key) {
            params.set('sort', sort.key);
            params.set('order', sort.order);
        } else {
            params.delete('sort');
            params.delete('order');
        }
        router.replace(`${pathname}?${params.toString()}`);
    }, [sort]);

    const reqSort = (key: string) => {
        let direction = 'asc';
        let newKey = key;

        if (key === sort.key && sort.order === 'asc') direction = 'desc';
        else if (key === sort.key && sort.order === 'desc') {
            newKey = '';
            direction = '';
        } else direction = 'asc';

        setSort({ key: newKey, order: direction });
    };

    const getSortIcon = (name: string) => {
        if (sort.key !== name) return null;
        return sort.order === 'asc' ? <FaArrowDown className="text-[10px]" /> : <FaArrowUp className="text-[10px]" />;
    };

    return (
        <div className="w-full bg-white rounded-xl border border-sky-100 shadow-xs overflow-hidden my-4">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-sky-50/80 border-b border-sky-100 text-xs font-bold text-slate-700 select-none">
                            <th className="px-4 py-3.5 w-16 text-center">Avatar</th>
                            <th
                                className="px-4 py-3.5 cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => reqSort('storeName')}
                            >
                                <div className="inline-flex items-center gap-1.5">
                                    <span>Store Name</span>
                                    {getSortIcon('storeName')}
                                </div>
                            </th>
                            <th
                                className="px-4 py-3.5 cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => reqSort('status')}
                            >
                                <div className="inline-flex items-center gap-1.5">
                                    <span>Status</span>
                                    {getSortIcon('status')}
                                </div>
                            </th>
                            <th
                                className="px-4 py-3.5 cursor-pointer hover:text-blue-600 transition-colors text-right"
                                onClick={() => reqSort('productCount')}
                            >
                                <div className="inline-flex items-center gap-1.5 justify-end">
                                    <span>Products</span>
                                    {getSortIcon('productCount')}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-50">
                        {data.length > 0 ? (
                            data.map((item) => (
                                <TableStoreRow item={item} key={item.id} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-4 py-12 text-center text-xs text-slate-500 font-medium">
                                    No stores found matching the criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoresTable;