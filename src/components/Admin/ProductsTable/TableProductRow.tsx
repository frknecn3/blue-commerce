'use client'
import { activateProduct, softDeleteProduct } from '@/app/actions/productActions'
import { useConfirm } from '@/context/ConfirmContext'
import { SerializedProduct } from '@/types/product'
import { shimmer, toBase64 } from '@/utils/clientOnlyUtils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaTrash, FaCheck, FaExternalLinkAlt } from 'react-icons/fa'
import { toast } from 'sonner'

type Props = {
    item: SerializedProduct;
}

const TableProductRow = ({ item }: Props) => {
    const ask = useConfirm();

    const handleArchive = async () => {
        const confirmed = await ask('Are you sure you want to archive this product?');
        if (confirmed) {
            const res = await softDeleteProduct(item.id);
            if (res.success) {
                toast.success('Product successfully archived.');
            } else {
                toast.error(`Error: ${res.error}`);
            }
        }
    };

    const handlePublish = async () => {
        const confirmed = await ask('Are you sure you want to activate this product for listing?');
        if (confirmed) {
            const res = await activateProduct(item.id);
            if (res.success) {
                toast.success('Product successfully published.');
            } else {
                toast.error(`Error: ${res.error}`);
            }
        }
    };

    const getStatusBadge = () => {
        switch (item.status) {
            case 'ACTIVE':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                    </span>
                );
            case 'DRAFT':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Draft
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Archived
                    </span>
                );
        }
    };

    return (
        <tr className="hover:bg-sky-50/40 transition-colors text-xs font-medium text-slate-800">
            {/* Image */}
            <td className="px-4 py-3 text-center">
                <div className="relative w-10 h-10 mx-auto rounded-md bg-sky-50/60 border border-sky-100 overflow-hidden flex items-center justify-center p-0.5">
                    <Image
                        fill
                        sizes="40px"
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(40, 40))}`}
                        src={item.imageUrl || ''}
                        className="object-contain"
                        alt={item.name}
                    />
                </div>
            </td>

            {/* Name Link */}
            <td className="px-4 py-3 font-semibold text-slate-900">
                <Link
                    href={`/admin/product/${item.id}`}
                    className="hover:text-blue-600 transition-colors line-clamp-1 inline-flex items-center gap-1.5"
                >
                    <span>{item.name}</span>
                    <FaExternalLinkAlt className="text-[9px] text-slate-400" />
                </Link>
            </td>

            {/* Status */}
            <td className="px-4 py-3">
                {getStatusBadge()}
            </td>

            {/* Price */}
            <td className="px-4 py-3 font-bold text-slate-900">
                ${Number(item.price).toFixed(2)}
            </td>

            {/* Stock */}
            <td className="px-4 py-3">
                {item.stock === 0 ? (
                    <span className="text-rose-600 font-bold">Out of Stock</span>
                ) : (
                    <span className="text-slate-700">{item.stock}</span>
                )}
            </td>

            {/* Actions */}
            <td className="px-4 py-3 text-center">
                {item.status === 'ACTIVE' ? (
                    <button
                        onClick={handleArchive}
                        title="Archive product"
                        aria-label="Archive product"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    >
                        <FaTrash className="text-xs" />
                    </button>
                ) : (
                    <button
                        onClick={handlePublish}
                        title="Publish product"
                        aria-label="Publish product"
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                    >
                        <FaCheck className="text-xs" />
                    </button>
                )}
            </td>
        </tr>
    );
};

export default TableProductRow;