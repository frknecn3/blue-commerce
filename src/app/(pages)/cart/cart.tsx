'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ProductParams } from '../../../constants/constants'
import { RootState, store } from '../../../redux/store'
import {getCart,reloadCart, removeFromCart } from '../../../utils/utils'
import { FaTrash } from "react-icons/fa";
import {TotalComponent} from './TotalComponent'
import '../../../components/css/index.css'
import { calculateTotalCost } from '../../../utils/clientOnlyUtils'

const CartDiv = () => {

    const [id, setId] = useState(null)
    const cart = useSelector((store: RootState) => store.generalReducer.cart)
    const [displayCart,setDisplayCart] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        const fetch = async () => {
            const user = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null
            setId(user?user.uid:0);
            setDisplayCart(await getCart(user?.uid||null))
        }
        fetch()

    }, [])

    useEffect(()=>{
        setDisplayCart(cart)
    },[cart])



  return (
    <div className='flex h-full'>
        <div className='h-full lg:w-[75%] min-h-[40vh] w-full p-1 lg:p-4 flex flex-col items-center bg-white rounded-xl m-4'>
            {displayCart&&displayCart.length>0 ? displayCart?.map((product, i) => (

                <div key={i} className='w-full mb-[10px] flex items-center h-full border-b-4 border-gray-200 text-black'>
                    <div className='overflow-hidden w-full h-full text-[1.5rem] gap-8 lg:gap-0 m-4 lg:m-4 p-4 bg-white border-gray-500 rounded-xl item-grid flex-col lg:flex-row'>
                        <a href={`/product/${product.id}`}><div className='w-[77vw] h-[40vh] lg:w-[15rem] lg:h-[15rem] object-contain shadow-md rounded-md lg:m-2'><img src={product?.photoURL} alt="" className='object-contain rounded-xl w-full h-full lg:p-2' /></div></a> 
                        <span className='text-center font-bold text-2xl'>{product?.name}</span>
                        <span className='font-semibold text-4xl'>${product?.price}</span>
                        <button className='text-[3rem] text-red-600' onClick={() => { removeFromCart(id, product?.id), reloadCart(id, dispatch) }}><FaTrash /></button>
                    </div>
                </div>

            )) : <div className='text-[1rem] lg:text-[2rem] gap-8 flex flex-col items-center text-blue-400 justify-center text-center'>Your Cart is Currently Empty
            <a className='rounded-xl bg-blue-400 text-white p-4' href='/'>Go Back to Shopping</a>
            </div>}
        </div>
        <TotalComponent   calculateTotalCost={calculateTotalCost} displayCart={displayCart}  />
    </div>
  )
}

  export default CartDiv