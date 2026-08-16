'use client';
import { Product } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSearchbarVisible } from '@/redux/slices/uiSlice';
import { RootState } from '@/redux/store';
import { SerializedProduct } from '@/types/product';
import { debounce, shimmer, toBase64 } from '@/utils/clientOnlyUtils';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { FaChevronRight, FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import SkeletonLoader from '../Common/SkeletonLoader';

type Props = {
    product: SerializedProduct
}

// import satırına ekle:

const HeaderProduct = ({ product }: Props) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    return (
        <div
            onMouseUp={() => { dispatch(setSearchbarVisible(false)); router.push(`/product/${product.id}`) }}
            className='group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-lg border-b border-gray-100 p-2 pl-3 transition-colors last:border-b-0 hover:bg-blue-50'
        >
            {/* Sol kenarda hover'da beliren mavi vurgu çubuğu */}
            <span className='absolute left-0 top-0 h-full w-1 -translate-x-full bg-blue-500 transition-transform duration-300 group-hover:translate-x-0' />

            <div className='relative aspect-square h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-50 ring-1 ring-gray-200'>
                <Image fill sizes="(max-width: 768px) 100vw, 50vw" placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`} src={product.imageUrl} className='object-cover transition-transform duration-300 group-hover:scale-110' alt="" />
            </div>

            <div className='flex min-w-0 flex-1 flex-col'>
                <span className='line-clamp-2 text-pretty text-sm font-medium text-gray-800 group-hover:text-blue-700 lg:text-base'>
                    {product.name}
                </span>
            </div>

            {product.price != null && (
                <span className='shrink-0 text-sm font-semibold text-blue-700 lg:text-base'>
                    ${Number(product.price).toFixed(2)}
                </span>
            )}

            <FaChevronRight className='shrink-0 text-xs text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-500' />
        </div>
    )
}

const HeaderSearchbar = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [foundProducts, setFoundProducts] = useState<SerializedProduct[]>([])
    const dispatch = useAppDispatch();
    const { headerSearchbarVisible: isVisible } = useAppSelector((state: RootState) => state.uiReducer)
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (query === '') { setFoundProducts([]); dispatch(setSearchbarVisible(false)); return };
        setLoading(true);
        (async () => {
            const req = await axios.get(`/api/product?query=${query}`);
            const found = req.data.data as SerializedProduct[];
            console.log(found)
            setFoundProducts(found);
            setLoading(false);
            dispatch(setSearchbarVisible(true));
        })();
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // If the click is NOT inside our wrapper ref, close it
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                dispatch(setSearchbarVisible(false));
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const onSearch = debounce(async (e: ChangeEvent<HTMLInputElement>) => {
        {
            dispatch(setSearchbarVisible(true));
            setQuery(e.target.value)
            // const searchInput = formRef.current as HTMLInputElement
            // const encodedSearchQuery = encodeURI(searchInput.value)
            // formRef.current.value.trim() === "" ? router.push('/') : router.push(`/search?q=${encodedSearchQuery}`)
        }
    }, 300)

    return (
        <div className='relative w-full' ref={wrapperRef}>
            <form id='searchbar' onSubmit={(e) => { e.preventDefault(); }} className='relative flex items-center'>
                <input
                    onInput={onSearch}
                    type="search"
                    className={`w-full rounded-md border border-blue-300 bg-white py-2.5 pl-4 pr-12 text-sm text-slate-800 outline-none transition-all duration-150 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 ${isVisible ? 'rounded-b-none border-b-0' : ''} z-[21] shadow-xs`}
                    placeholder='Search for products, categories...'
                />
                <button
                    type='submit'
                    aria-label='Search'
                    className='absolute right-1.5 top-1/2 grid h-7 w-8 -translate-y-1/2 transform place-items-center rounded bg-blue-600 text-xs font-bold text-white transition-colors hover:bg-blue-700'
                >
                    <FaSearch />
                </button>
            </form>
            {
                isVisible && !loading ?
                    <div className='display-products absolute z-20 flex max-h-[70vh] w-[200%] flex-col overflow-y-auto rounded-b-xl border-2 border-t-0 border-gray-200 bg-white p-2 text-black shadow-xl ring-1 ring-black/5 md:w-[150%] xl:w-full'>
                        {
                            foundProducts.slice(0, 8).map((prod) => <HeaderProduct product={prod} key={prod.id} />)
                        }
                        {
                            foundProducts.length > 8 && <div className='px-2 pt-3 text-sm font-medium text-blue-600'>+{foundProducts.length - 8} more results</div>
                        }
                        {
                            foundProducts.length == 0 && <div className='flex flex-col items-center gap-2 py-6 text-center text-sm text-gray-400'><FaSearch className='text-xl opacity-40' />No products matching your query were found.</div>
                        }
                    </div>
                    :
                    isVisible && loading &&
                    <div className='display-products absolute z-20 flex min-h-8 w-[200%] flex-col rounded-b-xl border-2 border-t-0 border-gray-200 bg-white p-4 text-black shadow-xl ring-1 ring-black/5 md:w-[150%] xl:w-full'>
                        <SkeletonLoader />
                    </div>
            }
        </div>
    )
}

export default HeaderSearchbar