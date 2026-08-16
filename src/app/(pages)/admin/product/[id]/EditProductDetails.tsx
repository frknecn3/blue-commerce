'use client';
import { Category, Store } from '@/generated/prisma'
import Link from 'next/link'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import ControlBar from './ControlBar'
import { SerializedProduct } from '@/types/product';
import SelectWithSearch from '@/components/Common/SelectWithSearch';
import { editProductAdmin } from '@/app/actions/productActions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { shimmer, toBase64 } from '@/utils/clientOnlyUtils';

type Props = {
    product: SerializedProduct,
    categories: Category[],
    stores: Store[]
}

type ProductDetailInputProps = {
    fieldKey: string,
    placeholder: string,
    value: string,
    fn?: (val: string) => void,
    disabled?: boolean
    id?: string,
}

const ProductDetailInput = ({ fieldKey, id, value, placeholder, fn, disabled }: ProductDetailInputProps) => {
    return (
        <div className='flex flex-col'>
            <div className='flex'>
                <label className='w-full font-semibold '>{fieldKey}:</label>
                <div className='w-full'>
                    <input id={id} name={id} value={value} disabled={disabled || false} onChange={(e) => fn ? fn(e.currentTarget.value) : ''} placeholder={`Enter ${placeholder}`} className={`border border-gray-400 rounded-md box-border py-1 w-full pl-2 ${disabled && 'text-gray-400'}`} />
                </div>
            </div>
        </div>
    )
}

const statusOptions = [
    {
        label: 'DRAFT',
        value: 'DRAFT'
    },
    {
        label: 'ACTIVE',
        value: 'ACTIVE'
    },
    {
        label: 'ARCHIVED',
        value: 'ARCHIVED'
    }
]


const EditProductDetails = ({ product, categories, stores }: Props) => {

    const router = useRouter();

    const [name, setName] = useState(product.name);
    const [stock, setStock] = useState(product.stock.toString());
    const [category, setCategory] = useState<string>(categories.find((cat) => cat.id === product.categoryId)?.id || '');
    const [store, setStore] = useState<string>(stores.find((store) => store.id === product.sellerId)?.id || '');
    const [status, setStatus] = useState<string>(product.status)

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const obj = Object.fromEntries(form);
        console.log(obj)

        const result = await editProductAdmin(product.id, form);

        console.log("RESULT: ", result)

        if (result.success) {
            toast.success('Product has been successfully updated.')
            router.refresh()
        };

        if (!result.success) toast.error(result.message);
    }

    return (
        <form onSubmit={handleFormSubmit} className='mx-[5vw] pt-[3vh] lg:mx-[15vw] flex flex-col'>
            <div className='flex gap-4 pb-4'>
                <Link className='hover:text-blue-400' href={`/admin/product`}>Products</Link>
                &gt;
                <Link className='hover:text-blue-400' href={`#`}>{product?.name}</Link>
            </div>
            <div className='flex bg-neutral-50 shadow-md border rounded-xl p-[50px] relative flex-wrap flex-col'>
                <div className="flex">
                    <div className='flex-1 relative aspect-square '>
                        <Image fill sizes="(max-width: 768px) 100vw, 50vw" placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`}
                            src={product?.imageUrl}
                            alt=""
                            className='rounded-md shadow-lg aspect-square m-auto mb-0 max-lg:mb-10'
                        />
                    </div>
                    <div className='flex-[2] flex flex-col lg:border-l-2 md:ml-4'>

                        <ControlBar product={product} />

                        <h1 className='text-center text-xl font-semibold'>Product Details</h1>
                        <div className='flex pt-4 pl-8 flex-col text-lg  gap-2'>
                            <ProductDetailInput fieldKey='Name' id='name' value={name} fn={setName} placeholder='product name' />
                            <ProductDetailInput fieldKey='Slug' value={product.nameSlug || ''} placeholder='Slug' disabled />
                            <ProductDetailInput fieldKey='ID' value={product.id || ''} placeholder='ID' disabled />
                            <ProductDetailInput fieldKey='Date Created' value={`${new Date(product.createdAt).toLocaleDateString()} - ${new Date(product.createdAt).toLocaleTimeString()}` || ''} placeholder='Date Created' disabled />
                            <ProductDetailInput fieldKey='Date Updated' value={`${new Date(product.updatedAt).toLocaleDateString()} - ${new Date(product.updatedAt).toLocaleTimeString()}` || ''} placeholder='Date Updated' disabled />
                            <ProductDetailInput fieldKey='Stock' id='stock' value={stock} fn={setStock} placeholder='stock' />
                            <div className='flex items-center'>
                                <label htmlFor="" className='flex-1 font-semibold'>Status:</label>
                                <SelectWithSearch classes='flex-1 block' id='status' items={statusOptions} onChange={setStatus} placeholder='Select item status...' defaultSelected={status} />
                            </div>
                            <div className='flex items-center'>
                                <label htmlFor="" className='flex-1 font-semibold'>Category:</label>
                                <SelectWithSearch classes='flex-1 block' id='category' items={categories.map((cat) => ({ label: cat.name, value: cat.id }))} onChange={setCategory} placeholder='Select new category...' defaultSelected={category} />
                            </div>
                            <div className='flex items-center'>
                                <label htmlFor="" className='flex-1 font-semibold'>Store:</label>
                                <SelectWithSearch classes='flex-1 block' id='seller' items={stores.map((store) => ({ label: store.storeName, value: store.id }))} onChange={setStore} placeholder='Select seller store...' defaultSelected={store} />
                            </div>

                        </div>
                    </div>
                </div>

                <div>
                    AMOGUS
                </div>
            </div>
        </form>
    )
}

export default EditProductDetails