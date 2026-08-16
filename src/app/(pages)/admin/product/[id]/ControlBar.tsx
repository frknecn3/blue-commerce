'use client'
import { activateProduct, hardDeleteProduct, softDeleteProduct } from '@/app/actions/productActions';
import { SerializedProduct } from '@/types/product';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { FaArchive, FaEdit } from 'react-icons/fa'
import { GiConfirmed } from "react-icons/gi";
import { MdDeleteForever, MdPublish } from 'react-icons/md';
import { toast } from 'sonner';

type Props = {
    product: SerializedProduct
}

const ControlBar = ({ product }: Props) => {
    const sParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [editMode, setEditMode] = useState<'EDIT' | 'VIEW'>(sParams.get('mode') as ('EDIT' | 'VIEW') || 'VIEW');

    const handleModeToggle = (newMode: 'EDIT' | 'VIEW') => {
        setEditMode(newMode);
        const params = new URLSearchParams(sParams.toString());
        params.set('mode', newMode);
        router.replace(`${pathname}?${params.toString()}`);
    };

    const handleHardDelete = async () => {
        if (confirm('WARNING: Are you sure you want to delete this product permanently? This action is irreversible.')) {
            const res = await hardDeleteProduct(product.id);
            if (res.success) {
                router.replace('/admin/product');
                toast.success('Product successfully deleted.');
            }
        }
    };

    return (
        <div className='control-bar absolute top-0 right-0 bg-white p-2 m-1 rounded-md flex gap-2 shadow-md border border-sky-100'>
            {editMode === 'VIEW' ? (
                <button
                    className='inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded text-white text-xs font-semibold hover:scale-105 transition-all w-24 justify-center shadow-xs'
                    onClick={() => handleModeToggle('EDIT')}
                >
                    <FaEdit />
                    <span>Edit</span>
                </button>
            ) : (
                <button
                    className='inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded text-white text-xs font-semibold hover:scale-105 transition-all w-24 justify-center shadow-xs'
                    onClick={() => handleModeToggle('VIEW')}
                >
                    <GiConfirmed />
                    <span>Confirm</span>
                </button>
            )}

            {editMode === 'VIEW' && (
                product.status === 'ACTIVE' ? (
                    <button
                        onClick={async () => {
                            await softDeleteProduct(product.id);
                            toast.success('Product archived.');
                        }}
                        className='inline-flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-1.5 rounded hover:scale-105 transition-all shadow-xs'
                    >
                        <FaArchive />
                        <span>Archive</span>
                    </button>
                ) : (
                    <button
                        onClick={async () => {
                            await activateProduct(product.id);
                            toast.success('Product published.');
                        }}
                        className='inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded hover:scale-105 transition-all shadow-xs'
                    >
                        <MdPublish />
                        <span>Publish</span>
                    </button>
                )
            )}

            {product.status === 'ARCHIVED' && (
                <button
                    onClick={handleHardDelete}
                    className='inline-flex items-center gap-1 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold px-3 py-1.5 rounded hover:scale-105 transition-all shadow-xs'
                >
                    <MdDeleteForever />
                    <span>Delete</span>
                </button>
            )}
        </div>
    );
};

export default ControlBar;