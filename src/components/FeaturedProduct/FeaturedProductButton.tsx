'use client'

import { ProductParams, User } from '../../constants/constants'
import { getActiveUserFromStorage } from '../../utils/clientOnlyUtils'
import { addToCart } from '../../utils/utils'

const FeaturedProductButton = ({featuredProduct}:{featuredProduct:ProductParams}) => {

  const user = getActiveUserFromStorage().uid
  
  return (
    <button onClick={()=>{addToCart(user,featuredProduct.id)}} className="p-4 rounded-xl w-full relative text-white hover:translate-y-[-2px] hover:brightness-125 transition-all bg-green-500">
      <div className="flex justify-content-end items-end"><span className="line-through opacity-50 absolute left-4 top-4">${featuredProduct.price*1.2}</span></div> <div className="mt-4 ml-4"><span> ${featuredProduct.price}</span></div>
    </button>
  )
}

export default FeaturedProductButton