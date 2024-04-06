'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ProductParams } from '../../../constants/constants'
import { RootState, store } from '../../../redux/store'
import {getCart,reloadCart, removeFromCart } from '../../../utils/utils'
import { FaTrash } from "react-icons/fa";

const CartDiv = () => {

    const [id, setId] = useState(null)
    const cart = useSelector((store: RootState) => store.cart)
    const [displayCart,setDisplayCart] = useState([])
    const dispatch = useDispatch()

    const calculateTotalCost =
        (cart: ProductParams[]):any => {
            if (cart) {
                try {
                    const totalPrice =
                        cart.reduce((accumulator, item) => {
                            if (item && item.price) { return accumulator + Number(item.price); } return accumulator;
                        }, 0); return <span>{totalPrice}$</span>;
                }
                catch (err) { console.log(err) }
            }
        };

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
        console.log(cart)
        console.log(displayCart)
    },[cart])



  return (
    <div className='flex h-full'>
    <div className='h-full w-[75%] p-4 flex flex-col items-center'>
        {displayCart&&displayCart.length>0 ? displayCart?.map((product, i) => (

            <div key={i} className='w-[75%] rounded-xl mb-[40px] flex items-center  h-[10rem] m-4 p-2 text-black shadow-md'>
                <div className='overflow-hidden w-full h-[12rem] px-10 py-4 text-[30px] bg-white rounded-xl grid place-items-center justify-items-center grid-cols-4'>
                    <a href={`/product/${product.id}`}><img src={product?.photoURL} alt="" className=' rounded-xl w-[95%] h-[95%] p-2' /></a> 
                    <span className='text-start'>{product?.name}</span>
                    <span>{product?.price}</span>
                    <button onClick={() => { removeFromCart(id, product?.id), reloadCart(id, dispatch) }}><FaTrash /></button>
                </div>
            </div>

        )) : <div className='text-[30px] flex flex-col items-center justify-center text-center'>Your Cart is Currently Empty
        <a className='rounded-xl bg-white text-blue-400 p-4' href='/'>Go Back to Shopping</a></div>}
    </div>
    <div className='bg-gray-600 flex p-4 m-4 w-[25%] text-[25px] h-full rounded-md'>
        Total Cost: {calculateTotalCost(displayCart)}
    </div>
</div>
  )
}

export default CartDiv