'use client'
import { activateProduct, hardDeleteProduct, softDeleteProduct } from '@/app/actions/productActions';
import { SerializedProduct } from '@/types/product';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
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

    useEffect(() => {

        const params = new URLSearchParams(sParams.toString());
        params.set('mode', editMode)
        router.replace(`${pathname}?${params}`);

    }, [editMode])


    const handleHardDelete = async () => {
        if (confirm('WARNING: Are you sure you want to delete this product permanently? This action is irreversible.')) {
            const res = await hardDeleteProduct(product.id);
            if (res.success) { router.replace('/admin/product'); toast.success('Product successfully deleted.') }

        }
    }

    return (
        <div className='control-bar absolute top-0 right-0 bg-white p-2 m-1 rounded-md flex gap-2 shadow-md'>
            {
                editMode === 'VIEW' ?
                    <button className='inline-flex items-center gap-1 bg-orange-400 px-2 py-1 rounded text-white hover:scale-105 transition-all hover:bg-orange-500 w-24 justify-center'
                        onClick={() => setEditMode('EDIT')}><FaEdit />Edit</button>
                    :
                    <button className='inline-flex items-center gap-1 bg-green-400 px-2 py-1 rounded text-white hover:scale-105 transition-all hover:bg-green-500 w-24 justify-center'
                        onClick={() => setEditMode('VIEW')}><GiConfirmed />Confirm</button>
            }
            {
                editMode === 'VIEW' && (product.status === 'ACTIVE' ?
                    <button onClick={() => softDeleteProduct(product.id)} className='inline-flex items-center gap-1 bg-red-700 text-white px-2 py-1 rounded hover:scale-105 transition-all hover:bg-red-900'><FaArchive />Archive</button>
                    :
                    <button onClick={() => activateProduct(product.id)} className='inline-flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded hover:scale-105 transition-all hover:bg-green-700'><MdPublish />Publish</button>
                )
            }
            {
                product.status === 'ARCHIVED' &&
                <button onClick={handleHardDelete} className='inline-flex items-center gap-1 bg-red-700 text-white px-2 py-1 rounded hover:scale-105 transition-all hover:bg-red-900'><MdDeleteForever />Delete</button>

            }
        </div>
    )
}

export default ControlBar