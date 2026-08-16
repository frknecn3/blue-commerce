'use client'
import { User } from '@/generated/prisma'
import { shimmer, toBase64 } from '@/utils/clientOnlyUtils'
import Image from 'next/image'
import React from 'react'
import { FaUser } from 'react-icons/fa'

type Props = {
    item: User;
}

const TableUserRow = ({ item }: Props) => {
    return (
        <tr className="hover:bg-sky-50/40 transition-colors text-xs font-medium text-slate-800">
            {/* Avatar */}
            <td className="px-4 py-3 text-center">
                <div className="relative w-9 h-9 mx-auto rounded-full bg-sky-50/60 border border-sky-100 overflow-hidden flex items-center justify-center">
                    {item.avatar ? (
                        <Image
                            fill
                            sizes="36px"
                            placeholder="blur"
                            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(36, 36))}`}
                            src={item.avatar}
                            className="object-cover"
                            alt={item.name}
                        />
                    ) : (
                        <FaUser className="text-slate-400 text-xs" />
                    )}
                </div>
            </td>

            {/* Name */}
            <td className="px-4 py-3 font-semibold text-slate-900">
                <span>{item.name}</span>
            </td>

            {/* Status */}
            <td className="px-4 py-3">
                {item.status === 'ENABLED' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Enabled
                    </span>
                ) : item.status === 'PENDING' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Pending
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Disabled
                    </span>
                )}
            </td>

            {/* Email */}
            <td className="px-4 py-3 text-slate-600">
                <span>{item.email}</span>
            </td>

            {/* Phone */}
            <td className="px-4 py-3 text-slate-600">
                <span>{item.phone || '—'}</span>
            </td>

            {/* Role */}
            <td className="px-4 py-3 text-center">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.role === 'ADMIN'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-600'
                }`}>
                    {item.role}
                </span>
            </td>
        </tr>
    );
};

export default TableUserRow;