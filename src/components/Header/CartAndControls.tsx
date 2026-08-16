'use client';
import { toggleCartModal } from '@/redux/slices/uiSlice'
import React from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import CartModal from '../CartModal'
import { RootState } from '@/redux/store'

type Props = {}

const CartAndControls = (props: Props) => {
    const dispatch = useDispatch()
    const cart = useSelector((store: RootState) => store.cartReducer.cart)

    return (
        <div className='relative z-10'>
            <button
                onClick={() => dispatch(toggleCartModal())}
                aria-label="View Shopping Cart"
                className="cart-trigger group inline-flex items-center justify-center gap-2 rounded-md bg-blue-700/80 border border-blue-500 px-3.5 py-2 text-xs font-semibold text-white transition-all duration-150 hover:bg-blue-700 hover:border-blue-400 active:scale-95 shadow-xs cursor-pointer"
            >
                <div className="relative">
                    <FaShoppingCart className="text-sm transition-transform duration-150 group-hover:scale-110" />
                    {cart.length > 0 && (
                        <span className="absolute -top-2 -right-2.5 grid h-4 min-w-4 place-items-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-slate-900 shadow-xs leading-none">
                            {cart.length}
                        </span>
                    )}
                </div>
                <span className="hidden lg:inline font-semibold">Cart</span>
            </button>
            <CartModal />
        </div>
    )
}

export default CartAndControls