'use client'
import { debounce } from '@/utils/clientOnlyUtils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { ChangeEvent, useCallback } from 'react'
import { FaSearch } from 'react-icons/fa'

type Props = {
    placeholder?: string
}

const SearchInput = ({ placeholder = 'value' }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            const params = new URLSearchParams(searchParams.toString());

            if (value) params.set('q', value);
            else params.delete('q');

            if (Number(searchParams.get('page')) > 1) params.set('page', "1");

            router.replace(`${pathname}?${params.toString()}`);
        }, 300),
        [pathname, router, searchParams]
    );

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.currentTarget.value.trim());
    };

    return (
        <div className="relative w-full sm:w-72">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border border-sky-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 shadow-xs transition-all">
                <FaSearch className="text-slate-400 text-xs shrink-0" />
                <input
                    defaultValue={searchParams.get('q') || ''}
                    className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none"
                    placeholder={placeholder}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
};

export default SearchInput;