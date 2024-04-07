import React from 'react'
import CartDiv from './cart'

const Cart = () => {
 


    return (
        <div className='lg:mx-[2rem] my-[1rem] mt-[2rem] lg:mb-0 lg:p-[2rem] bg-gradient-to-b from-blue-400 to-blue-100 shadow-md rounded-xl text-white relative'>
            <div className='h-[25%] text-white text-[1rem] mb-4 lg:text-[2.5rem] text-center'> Your Shopping Cart</div>
            <CartDiv />
        </div>
    )
}

export default Cart