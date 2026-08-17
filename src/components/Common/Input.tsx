'use client'
import { debounce } from '@/utils/clientOnlyUtils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'

type Props = {
    id: string,
    type?: string,
    label?: string,
    placeholder?: string,
    optional?: boolean,
    value?: string | number,
    defaultValue?: string | number,
    defaultChecked?: boolean,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
    error?: boolean | string
}

const Input = ({ placeholder = 'value', id, label, type, optional, value, defaultValue, defaultChecked, onChange, error }: Props) => {
    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    return (
        type !== 'checkbox' ?
            <div className='inline-flex flex-col gap-1 w-full'>
                <label htmlFor={id} className='pl-2 text-stone-600 font-medium text-sm'>{label}</label>
                <div className={`border items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                    hasError
                        ? 'border-rose-500 ring-2 ring-rose-100 bg-rose-50/30'
                        : 'border-stone-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'
                }`}>
                    <input
                        className='pt-1 outline-none w-full bg-transparent text-stone-800'
                        placeholder={`${placeholder}`}
                        id={id}
                        type={type || 'text'}
                        name={id}
                        required={!optional}
                        value={value}
                        defaultValue={defaultValue}
                        onChange={onChange}
                    />
                </div>
                {errorMessage && (
                    <span className='text-xs text-rose-500 pl-2 font-medium transition-all duration-150'>
                        {errorMessage}
                    </span>
                )}
            </div>
            :
            <div className='inline-flex flex-col gap-1 w-full'>
                <span className='pl-2 text-stone-600 font-medium text-sm'>{label}</span>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                    hasError
                        ? 'border-rose-500 ring-2 ring-rose-100 bg-rose-50/30'
                        : 'border-stone-300'
                }`}>
                    <input
                        className='outline-none accent-blue-600'
                        placeholder={`${placeholder}`}
                        id={id}
                        type='checkbox'
                        name={id}
                        required={!optional}
                        defaultChecked={defaultChecked}
                        onChange={onChange}
                    />
                    <label htmlFor={id} className='pt-0.5 text-stone-700 cursor-pointer text-sm'>{placeholder}</label>
                </div>
                {errorMessage && (
                    <span className='text-xs text-rose-500 pl-2 font-medium transition-all duration-150'>
                        {errorMessage}
                    </span>
                )}
            </div>
    )
}

export default Input