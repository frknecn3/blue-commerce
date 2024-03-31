'use client'
import React from 'react'
import Select from 'react-select'
import { SelectOptions } from '../../constants/constants'
import { useRouter } from 'next/navigation'

const SelectComponent = () => {
  const router = useRouter()

  return (
    <div><Select className='z-[3] w-[11rem]' placeholder='Select Category' options={SelectOptions} onChange={(e)=>{router.push(e.value!==''?`/?category=${e.value}`:'/')}}/></div>
  )
}

export default SelectComponent