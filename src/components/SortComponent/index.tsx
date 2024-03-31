'use client'
import React from 'react'
import Select from 'react-select'
import { Option } from '../../constants/constants'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { handleSortCategory } from '../../utils/utils'

const SortComponent = () => {

    const router = useRouter()
    const params = useSearchParams()
    const pathname = usePathname()
    






    
  const sortOptions:Option[] = [
    {label:'Ascending by Price',value:'ascendingprice'},
    {label:'Descending by Price',value:'descendingprice'}
  ]
  
  
    return (
    <Select className='z-[3]' options={sortOptions} onChange={(e)=>handleSortCategory(e,router,params,pathname)}/>
  )
}

export default SortComponent