'use client'

import { useDispatch } from 'react-redux'
import { ProductParams, User } from '../../constants/constants'
import { getActiveUserFromStorage } from '../../utils/clientOnlyUtils'
import { addToAnonymousCart, addToCart, reloadCart } from '../../utils/utils'
import { useEffect, useState } from 'react'

const FeaturedProductButton = ({featuredProduct}:{featuredProduct:ProductParams}) => {
  const dispatch = useDispatch()

    const user = getActiveUserFromStorage()

  
  return (
    <button onClick={()=>{try{user?addToCart(user.uid,featuredProduct.id):addToAnonymousCart(featuredProduct.id),reloadCart(user.uid,dispatch)}catch(err){console.log(err)}}} className="p-4 rounded-xl w-full relative text-white hover:translate-y-[-2px] hover:brightness-125 transition-all bg-green-500">
      <div className="flex justify-content-end items-end"><span className="line-through opacity-50 absolute left-4 top-4">${Math.floor(featuredProduct.price*1.2)}</span></div> <div className="mt-4 ml-4"><span> ${featuredProduct.price}</span></div>
    </button>
  )
}

export default FeaturedProductButton