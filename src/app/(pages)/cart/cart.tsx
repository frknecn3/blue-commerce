'use client'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { FaBoxOpen, FaMinus, FaPlus, FaShieldAlt, FaTrash, FaTruck } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import Link from 'next/link';
import { useAppDispatch } from '@/redux/hooks';
import { addToCart, CartUIItem, decrementItem, removeItem } from '@/redux/slices/cartSlice';
import { CartItemWithProduct } from '@/types/product';
import Image from 'next/image';
import { shimmer, toBase64 } from '@/utils/clientOnlyUtils';
import { toast } from 'sonner';
interface CartItemProps {
    item: CartUIItem
    disabled: boolean
}

export const CartItem = ({ item, disabled }: CartItemProps) => {
    const dispatch = useAppDispatch()
    const [isRemoving, setIsRemoving] = useState(false)
    const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const handleRemove = async () => {
        setIsRemoving(true)
        try {
            const res = await dispatch(removeItem(item.id)) as any
            if (res.meta.requestStatus === 'fulfilled') {
                toast.success('Item removed from cart.')
            } else {
                toast.error('Failed to remove item.')
                setIsRemoving(false)
            }
        } catch (error) {
            setIsRemoving(false)
        }
    }

    return (
        <div className={`flex flex-col sm:flex-row gap-4 py-6 first:pt-0 last:pb-0 items-start sm:items-center justify-between transition-opacity ${isRemoving ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Image & Main Info Info */}
            <div className="flex gap-4 w-full sm:w-auto">
                <div className=" relative w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <Image fill sizes="(max-width: 768px) 100vw, 50vw" placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`} src={item.product.imageUrl} alt={item.product.name} className="aspect-square object-contain max-h-full max-w-full" />
                </div>

                <div className="flex flex-col justify-between py-1">
                    <div>
                        <Link href={`/product/${item.product.id}`}>
                            <h3 className="hover:text-blue-600 font-semibold text-slate-800 text-sm sm:text-base line-clamp-2 leading-snug">
                                {item.product.name}
                            </h3>
                        </Link>
                        <p className="text-xs text-slate-400 mt-1">ID: {item.id}</p>
                    </div>

                    <div className="text-sm font-bold text-slate-900 sm:hidden mt-2">
                        ${formatter.format(item.product.price * item.quantity)}
                    </div>
                </div>
            </div>

            {/* Actions Block (Controls + Delete + Desk Price) */}
            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                {/* Quantity Control Buttons */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 h-10 overflow-hidden shadow-sm">
                    <button
                        onClick={() => dispatch(decrementItem(item.id))}
                        disabled={disabled || isRemoving}
                        className="px-3 h-full text-slate-500 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-50 transition-colors"
                        title="Reduce quantity"
                    >
                        <FaMinus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-sm font-semibold text-slate-800 min-w-[2.5rem] text-center select-none">
                        {item.quantity}
                    </span>
                    <button
                        onClick={() => { dispatch(addToCart({ productId: item.product.id })) }}
                        disabled={disabled || isRemoving || item.quantity >= item.product.stock}
                        className="px-3 h-full text-slate-500 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-50 transition-colors"
                        title="Increase quantity"
                    >
                        <FaPlus className="w-3 h-3" />
                    </button>
                </div>

                {/* Total Item Price (Desktop Only) */}
                <div className="hidden sm:block text-right min-w-[5rem]">
                    <span className="text-base font-bold text-slate-900 block">
                        ${formatter.format(item.product.price * item.quantity)}
                    </span>
                    {item.quantity > 1 && (
                        <span className="text-xs text-slate-400 block mt-0.5">
                            (${formatter.format(item.product.price)} each)
                        </span>
                    )}
                </div>

                {/* Remove Trash Button */}
                <button
                    onClick={handleRemove}
                    disabled={disabled || isRemoving}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40"
                    title="Remove item from cart"
                >
                    {isRemoving ? (
                        <FiLoader className="w-4 h-4 text-blue-600 animate-spin" />
                    ) : (
                        <FaTrash className="w-4 h-4" />
                    )}
                </button>
            </div>
        </div>
    )
}
/* ==========================================================================
   EXTRACT_END: components/CartItem.tsx
   ========================================================================== */


/* ==========================================================================
   EXTRACT_START: components/TotalComponent.tsx
   ========================================================================== */
interface TotalComponentProps {
    cart: Array<{ price: number; quantity: number }>
}

export const TotalComponent = ({ cart }: TotalComponentProps) => {
    const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const subtotal = cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
    const shipping = subtotal > 150 ? 0 : 9.99
    const tax = subtotal * 0.08 // Estimated 8% sales tax
    const total = subtotal + shipping + tax

    return (
        <div className="space-y-4">
            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">${formatter.format(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 items-center">
                    <span>Shipping</span>
                    <span className={`font-medium ${shipping === 0 ? 'text-green-600 uppercase text-xs font-bold' : 'text-slate-900'}`}>
                        {shipping === 0 ? 'Free Shipping' : `$${formatter.format(shipping)}`}
                    </span>
                </div>
                <div className="flex justify-between text-slate-600">
                    <span>Estimated Tax</span>
                    <span className="font-medium text-slate-900">${formatter.format(tax)}</span>
                </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
                <div className="flex justify-between items-baseline">
                    <span className="text-base font-bold text-slate-900">Total</span>
                    <div className="text-right">
                        <span className="text-2xl font-black text-slate-900">${formatter.format(total)}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">VAT & Customs fees included</p>
                    </div>
                </div>
            </div>

            <Link href={'/checkout'} className="w-full inline-flex justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm mt-2 text-sm">
                Proceed to Checkout
            </Link>

            {/* Marketing Trust Badges */}
            <div className="border-t border-slate-100 pt-4 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-slate-500">
                    <FaTruck className="text-slate-400 w-3.5 h-3.5" />
                    <span>Free shipping on all orders over $150</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-500">
                    <FaShieldAlt className="text-slate-400 w-3.5 h-3.5" />
                    <span>Secure encrypted checkout handling</span>
                </div>
            </div>
        </div>
    )
}

const CartDiv = () => {
    const { cart, loading } = useSelector((store: RootState) => store.cartReducer)
    const priceCart = cart.map((item) => { return { price: item.product.price, quantity: item.quantity } })
    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 mt-20 md:mt-16 lg:mt-0">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Cart Items List */}
                    <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        {cart && cart.length > 0 ? (
                            <div className="divide-y divide-slate-100 p-4 lg:p-6 space-y-4">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`transition-opacity duration-200 ${loading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}
                                    >
                                        <CartItem item={{ ...item, quantity: item.quantity }} disabled={loading} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Empty Cart State */
                            <div className="flex flex-col items-center justify-center py-16 px-4 text-center min-h-[45vh]">
                                <div className="text-slate-300 text-7xl mb-6 animate-pulse">
                                    <FaBoxOpen />
                                </div>
                                <h2 className="text-xl font-semibold text-slate-800 mb-2">
                                    Your Cart is Currently Empty
                                </h2>
                                <p className="text-slate-500 text-sm max-w-sm mb-8">
                                    Looks like you haven't added anything to your cart yet. Explore our products to find something you like!
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-sm"
                                >
                                    Go Back to Shopping
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Order Summary Sidebar */}
                    {cart && cart.length > 0 && (
                        <div className="lg:col-span-4 sticky top-24">
                            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
                                    Order Summary
                                </h2>
                                <TotalComponent cart={priceCart} />
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default CartDiv