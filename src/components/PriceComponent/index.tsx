'use client'
import React, { useEffect, useState } from 'react'
import { ProductParams } from '../../constants/constants'
import '../css/index.css'

const PriceComponent = ({currentProduct}:{currentProduct:ProductParams}) => {


  return (
    <div className={`w-full z-30 flex flex-col text-center price-component`}>
        <span className="text-[2.5rem] md:text-[3rem] font-semibold">${currentProduct.price}</span>
        <span className="text-base md:text-[1.5rem] font-normal text-gray-600">Up to 12 installments</span>
    </div>
  )
}

export default PriceComponent