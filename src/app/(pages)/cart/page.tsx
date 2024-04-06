import React from 'react'
import CartDiv from './cart'

const Cart = () => {
 


    return (
        <div className='mx-[5rem] my-[1rem] p-[2rem] bg-gradient-to-b from-blue-400 to-blue-100 shadow-md rounded-xl text-white'>
            <div className='h-[25%] text-white text-[40px] text-center'> Your Shopping Cart</div>
            <CartDiv />
        </div>
    )
}

export default Cart