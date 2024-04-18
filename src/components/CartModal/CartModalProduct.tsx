import React, { useEffect } from 'react'
import { ProductParams } from '../../constants/constants'
import { FaTrashAlt } from 'react-icons/fa'
import { reloadCart, removeFromCart } from '../../utils/utils'
import { useDispatch } from 'react-redux'


type Props = {
    product:ProductParams
}

const CartModalProduct = ({product}: Props) => {

  useEffect(()=>{
  },[])

  const dispatch = useDispatch()
  
  const user = JSON.parse(localStorage.getItem("user"));



  return (
    <div className='text-center w-full flex text-xl justify-between items-center px-4 my-2 pt-3 border-t-2'>
      <div className='w-[5rem] h-[5rem]'>
        <img src={product.photoURL} className='object-contain rounded w-full h-full' alt="" />
      </div>

      <div className='flex w-1/4 h-full items-center justify-center'>
        <span className='text-ellipsis text-sm'>{product.name}</span>
      </div>

      <div className='flex w-1/4 h-full items-center justify-center'>
        <span>${product.price}</span>
      </div>

      <button className='flex h-full items-center justify-center' onClick={() => { removeFromCart(user?.uid, product?.id), reloadCart(user?.uid, dispatch) }}>
        < FaTrashAlt/>
      </button>
    </div>
  )
}

export default CartModalProduct