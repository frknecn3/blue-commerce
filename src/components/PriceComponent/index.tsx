'use client'
import React, { useEffect, useState } from 'react'
import { ProductParams } from '../../constants/constants'

const PriceComponent = ({currentProduct}:{currentProduct:ProductParams}) => {
    
    const [width,setWidth] = useState<number>(NaN)
    useEffect(()=>{
        const w = window.innerWidth
        setWidth(w)
    },[window.innerWidth])


  return (
    <div className={`w-full z-30 flex flex-col text-center  ${width<768?'fixed bottom-[9.9vh] border-t bg-white border-gray-400 left-0':'static'}`}>
        <span className="text-[2rem] md:text-[3rem] font-semibold">${currentProduct.price}</span>
        <span className="text-base md:text-[1.5rem] font-normal text-gray-600">Up to 12 installments</span>
    </div>
  )
}

export default PriceComponent