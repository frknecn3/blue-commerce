'use client'
import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useRouter } from 'next/navigation'
import CartModalProduct from './CartModalProduct'
import { calculateTotalCost } from '../../utils/clientOnlyUtils'
import { closeCartModal } from '../../redux/slices/uiSlice'
import { useAppDispatch } from '@/redux/hooks'
import { IoIosClose } from 'react-icons/io'
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi'

type Props = {}

const CartModal = (props: Props) => {
    const dispatch = useAppDispatch()
    const cart = useSelector((store: RootState) => store.cartReducer.cart)
    const cartModalOpen = useSelector((state: RootState) => state.uiReducer.cartModalOpen)
    const router = useRouter()
    const modalRef = useRef<HTMLDivElement>(null)

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                const target = e.target as HTMLElement
                if (!target.closest('.cart-trigger')) {
                    dispatch(closeCartModal())
                }
            }
        }
        if (cartModalOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [cartModalOpen, dispatch])

    if (!cartModalOpen) return null

    const total = calculateTotalCost(cart)

    return (
        <>
            {/* Backdrop overlay for mobile */}
            <div
                onClick={() => dispatch(closeCartModal())}
                className="fixed inset-0 z-[100000] bg-slate-900/30 backdrop-blur-xs md:hidden"
            />

            {/* Modal Box */}
            <div
                ref={modalRef}
                className="fixed md:absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-full md:left-auto md:right-0 md:translate-x-0 md:translate-y-0 md:mt-2.5 z-[100001] w-[90vw] max-w-sm md:w-96 bg-white text-slate-800 border border-sky-100 rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
                    <div className="flex items-center gap-2">
                        <FiShoppingBag className="text-base text-sky-200" />
                        <h3 className="font-bold text-sm text-white">Shopping Cart</h3>
                        <span className="bg-white/20 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                            {cart.length}
                        </span>
                    </div>

                    <button
                        onClick={() => dispatch(closeCartModal())}
                        aria-label="Close cart"
                        className="grid h-7 w-7 place-items-center rounded-md bg-blue-700/80 border border-blue-500 text-white hover:bg-blue-700 transition-colors"
                    >
                        <IoIosClose className="text-xl" />
                    </button>
                </div>

                {/* Items List */}
                <div className="max-h-[300px] overflow-y-auto p-3 divide-y divide-sky-50 no-scrollbar">
                    {cart.length > 0 ? (
                        cart.map((item, i) => (
                            <CartModalProduct cartItem={item} key={item.id || i} />
                        ))
                    ) : (
                        <div className="py-8 px-4 flex flex-col items-center justify-center text-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-blue-600 text-xl">
                                <FiShoppingBag />
                            </div>
                            <span className="text-xs font-semibold text-slate-800">Your cart is empty</span>
                            <span className="text-[11px] text-slate-500">Explore products and add items to your cart.</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="p-3.5 bg-sky-50/70 border-t border-sky-100 flex flex-col gap-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-600">Subtotal</span>
                            <span className="font-bold text-sm text-slate-900">${total}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => {
                                    dispatch(closeCartModal())
                                    router.push('/cart')
                                }}
                                className="w-full bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs py-2 px-3 rounded-md border border-slate-200 shadow-xs transition-colors text-center"
                            >
                                View Cart
                            </button>

                            <button
                                onClick={() => {
                                    dispatch(closeCartModal())
                                    router.push('/checkout')
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-3 rounded-md shadow-xs transition-colors flex items-center justify-center gap-1 text-center"
                            >
                                <span>Checkout</span>
                                <FiArrowRight className="text-xs" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default CartModal