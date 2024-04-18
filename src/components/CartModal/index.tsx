'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import CartModalProduct from './CartModalProduct'
import { ProductParams } from '../../constants/constants'
import { getCart } from '../../utils/utils'
import { calculateTotalCost } from '../../utils/clientOnlyUtils'

type Props = {}

const CartModal = (props: Props) => {

    const isCartOpen = useSelector((store: RootState) => store.cartDisplayReducer.cartDisplay)
    const dispatch = useDispatch()
    const cart = useSelector((store: RootState) => store.generalReducer.cart)
    const [displayCart,setDisplayCart] = useState<ProductParams[]>(null)
    const router:AppRouterInstance = useRouter()


    useEffect(()=>{
        const fetch = async () => {
            const user = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null
            setDisplayCart(await getCart(user?.uid||null))
        }
        fetch()

    },[])
    

    useEffect(()=>{
        setDisplayCart(cart)
    },[cart])



  return (
    
    isCartOpen?(<>
    <div className='bg-white text-black border flex flex-col justify-between overflow-hidden border-black rounded-xl h-[40vh] w-[30vw] absolute bottom-[-42vh] z-[200000]'>
        <div className='flex justify-between items-center text-xl font-semibold px-4 py-2 border-b'><div/>
            <span>CART</span> 
            <div className='bg-red-700 rounded-full cursor-pointer relative w-8 h-8' onClick={()=>dispatch({type:'CLOSE_CART_MODAL'})}>
                
                <span
                className='text-white'
                 style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}>X</span>
            </div>
        </div>


        <div className='h-3/5 px-4 my-5 overflow-auto'>
            
            {displayCart?.map((i)=>{
                
                return(

                <CartModalProduct product={i}/>

            )})}
        
        </div>


        <div className='flex bg-gray-200 border-t-2 justify-between border-gray-300 px-4 py-2'>
            <button className='bg-orange-400 rounded-xl text-white p-2' onClick={()=>{router.push('/cart'),dispatch({type:'CLOSE_CART_MODAL'})}}>GO TO CART</button>
            <span className='p-2 rounded-xl text-white bg-blue-300'>TOTAL PRICE: {calculateTotalCost(displayCart)}</span>
        </div>
    </div>
    </>):''
  )
}

export default CartModal