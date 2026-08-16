import { Category, Product, Store } from '@/generated/prisma'
import Link from 'next/link'
import React from 'react'
import ControlBar from './ControlBar'
import { FaCircle } from 'react-icons/fa'
import { SerializedProduct } from '@/types/product'
import Image from 'next/image'
import { shimmer, toBase64 } from '@/utils/clientOnlyUtils'

type Props = {
    product: SerializedProduct & {
        seller: Store,
        category: Category
    }
}

const DetailRow = ({ fieldKey, children }: { fieldKey: string, children?: React.ReactNode }) => {
    return (
        <div className='flex flex-col'>
            <div className='flex'>
                <div className='flex-1 font-semibold'>{fieldKey}:</div>
                <div className='flex-1 inline-flex items-center gap-1'>{children}</div>
            </div>
        </div>
    )
}

const ViewProductDetails = ({ product }: Props) => {
    return (
        <div className='mx-[5vw] pt-[3vh] lg:mx-[15vw] flex flex-col'>
            <div className='flex gap-4 pb-4'>
                <Link className='hover:text-blue-400' href={`/admin/product`}>Products</Link>
                &gt;
                <Link className='hover:text-blue-400' href={`#`}>{product?.name}</Link>
            </div>
            <div className='flex bg-neutral-50 shadow-md border rounded-xl p-[50px] relative  flex-wrap flex-col lg:flex-row'>
                <div className='flex-1 relative'>
                    <Image fill sizes="(max-width: 768px) 100vw, 50vw" placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`}
                        src={product?.imageUrl}
                        alt=""
                        className='rounded-md shadow-lg aspect-square m-auto mb-0 max-lg:mb-10'
                    />
                </div>
                <div className='flex-[2] flex flex-col lg:border-l-2 md:ml-4'>

                    <ControlBar product={product} />

                    <h1 className='text-center text-xl font-semibold'>Product Details</h1>
                    <div className='flex pt-4 pl-8 flex-col text-lg  gap-[1.2rem]'>
                        <DetailRow fieldKey='Name'>
                            {product.name}
                        </DetailRow>

                        <DetailRow fieldKey='Slug'>
                            {product.nameSlug || ''}
                        </DetailRow>

                        <DetailRow fieldKey='ID'>
                            {product.id || ''}
                        </DetailRow>

                        <DetailRow fieldKey='Date Created'>
                            {new Date(product.createdAt).toLocaleDateString()} - {new Date(product.createdAt).toLocaleTimeString()}
                        </DetailRow>

                        <DetailRow fieldKey='Last Updated'>
                            {new Date(product.updatedAt).toLocaleDateString()} - {new Date(product.updatedAt).toLocaleTimeString()}
                        </DetailRow>

                        <DetailRow fieldKey='Status'>
                            <FaCircle size={10} color={product.status === 'ACTIVE' ? 'lightgreen' : product.status === 'DRAFT' ? 'orange' : 'red'} />
                            {product.status}
                        </DetailRow>

                        <DetailRow fieldKey='Category'>
                            {product.category.name}
                        </DetailRow>

                        <DetailRow fieldKey='Stock'>
                            {product.stock}
                        </DetailRow>

                        <DetailRow fieldKey='Seller'>
                            <div className='relative aspect-square w-6 h-6'>
                                <Image fill sizes="(max-width: 768px) 100vw, 50vw" placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`} src={product.seller.avatar || ''} className='w-6 rounded-full mr-1 border-gray-400 border' alt="" />
                            </div>
                            {product.seller.storeName}
                        </DetailRow>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewProductDetails