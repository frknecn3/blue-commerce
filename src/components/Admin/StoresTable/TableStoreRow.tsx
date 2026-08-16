'use client'
import { Store } from '@/generated/prisma'
import { shimmer, toBase64 } from '@/utils/clientOnlyUtils'
import Image from 'next/image'
import React from 'react'
import { FaStore } from 'react-icons/fa'

type StoreWithCount = Store & {
  _count?: {
    products: number;
  };
};

type Props = {
    item: StoreWithCount;
}

const TableStoreRow = ({ item }: Props) => {
    return (
        <tr className="hover:bg-sky-50/40 transition-colors text-xs font-medium text-slate-800">
            {/* Avatar */}
            <td className="px-4 py-3 text-center">
                <div className="relative w-10 h-10 mx-auto rounded-md bg-sky-50/60 border border-sky-100 overflow-hidden flex items-center justify-center p-0.5">
                    {item.avatar ? (
                        <Image
                            fill
                            sizes="40px"
                            placeholder="blur"
                            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(40, 40))}`}
                            src={item.avatar}
                            className="object-cover"
                            alt={item.storeName}
                        />
                    ) : (
                        <FaStore className="text-blue-500 text-sm" />
                    )}
                </div>
            </td>

            {/* Store Name */}
            <td className="px-4 py-3 font-semibold text-slate-900">
                <span>{item.storeName}</span>
            </td>

            {/* Status */}
            <td className="px-4 py-3">
                {item.status === 'ACTIVE' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        {item.status}
                    </span>
                )}
            </td>

            {/* Product Count */}
            <td className="px-4 py-3 text-right font-bold text-slate-900">
                {item._count?.products ?? 0}
            </td>
        </tr>
    );
};

export default TableStoreRow;