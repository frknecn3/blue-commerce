'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ProductParams } from '../../../constants/constants'
import { RootState, store } from '../../../redux/store'
import {getCart,reloadCart, removeFromCart } from '../../../utils/utils'
import { FaTrash } from "react-icons/fa";
import {TotalComponent} from './TotalComponent'

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
                        }, 0); return <span>${totalPrice}</span>;
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
        <div className='h-full lg:w-[75%] w-full p-1 lg:p-4 flex flex-col items-center'>
            {displayCart&&displayCart.length>0 ? displayCart?.map((product, i) => (

                <div key={i} className='w-full rounded-xl mb-[10px] flex items-center h-full text-black'>
                    <div className='overflow-hidden w-full h-full text-[1.5rem] gap-8 lg:gap-0 m-4 p-4 bg-white rounded-xl shadow-md grid place-items-center justify-items-center lg:grid-cols-4'>
                        <a href={`/product/${product.id}`}><div className='w-[12vw] h-[12vh] lg:w-[15rem] lg:h-[15rem] object-contain shadow-md m-4 rounded-md'><img src={product?.photoURL} alt="" className='object-contain rounded-xl w-full h-full p-2' /></div></a> 
                        <span className='text-center'>{product?.name}</span>
                        <span>${product?.price}</span>
                        <button className='text-[3rem] text-red-600' onClick={() => { removeFromCart(id, product?.id), reloadCart(id, dispatch) }}><FaTrash /></button>
                    </div>
                </div>

            )) : <div className='text-[30px] flex flex-col items-center justify-center text-center'>Your Cart is Currently Empty
            <a className='rounded-xl bg-white text-blue-400 p-4' href='/'>Go Back to Shopping</a></div>}
        </div>
        <TotalComponent   calculateTotalCost={calculateTotalCost} displayCart={displayCart}  />
    </div>
  )
}

  export default CartDiv