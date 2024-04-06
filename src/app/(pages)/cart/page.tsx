import React from 'react'
import CartDiv from './cart'

const Cart = () => {
 


    return (
        <div className='mx-[2rem] my-[1rem] p-[2rem] bg-gradient-to-b from-blue-400 to-blue-100 shadow-md rounded-xl text-white relative'>
            <div className='h-[25%] text-white text-[40px] text-center'> Your Shopping Cart</div>
            <CartDiv />
        </div>
    )
}

export default Cart