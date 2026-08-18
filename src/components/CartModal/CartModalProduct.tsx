'use client'
import React, { useState } from 'react'
import { FiTrash2, FiLoader } from 'react-icons/fi'
import SafeImage from '@/components/Common/SafeImage'
import Link from 'next/link'
import { shimmer, toBase64 } from '@/utils/clientOnlyUtils'
import { useAppDispatch } from '@/redux/hooks'
import { CartUIItem, removeItem } from '@/redux/slices/cartSlice'
import { closeCartModal } from '@/redux/slices/uiSlice'
import { toast } from 'sonner'

type Props = {
  cartItem: CartUIItem;
}

const CartModalProduct = ({ cartItem }: Props) => {
  const dispatch = useAppDispatch()
  const [isRemoving, setIsRemoving] = useState(false)
  const product = cartItem?.product

  if (!product) return null

  const handleRemove = async () => {
    setIsRemoving(true)
    try {
      const res = await dispatch(removeItem(cartItem.id))
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
    <div className={`flex items-center gap-3 py-2 px-1 rounded-lg transition-all group ${
      isRemoving ? 'opacity-50 pointer-events-none bg-sky-50/70' : 'hover:bg-sky-50/50'
    }`}>
      {/* Product Image */}
      <Link
        href={`/product/${product.id}`}
        onClick={() => dispatch(closeCartModal())}
        className="relative w-12 h-12 shrink-0 bg-sky-50/60 border border-sky-100 rounded-md overflow-hidden p-1 flex items-center justify-center"
      >
        <SafeImage
          fill
          sizes="48px"
          src={product.imageUrl}
          className="object-contain p-0.5 group-hover:scale-105 transition-transform"
          alt={product.name || 'Product'}
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <Link
          href={`/product/${product.id}`}
          onClick={() => dispatch(closeCartModal())}
          className="text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors"
        >
          {product.name}
        </Link>
        <span className="text-[11px] text-slate-500 font-medium mt-0.5">
          {isRemoving ? (
            <span className="text-blue-600 font-medium flex items-center gap-1">
              <FiLoader className="animate-spin text-[10px]" /> Removing...
            </span>
          ) : (
            `Qty: ${cartItem.quantity || 1}`
          )}
        </span>
      </div>

      {/* Price */}
      <div className="text-right shrink-0">
        <span className="text-xs font-bold text-slate-900 block">
          ${(Number(product.price || 0) * (cartItem.quantity || 1)).toFixed(2)}
        </span>
      </div>

      {/* Remove Button with Spinner */}
      <button
        type="button"
        title="Remove item"
        aria-label="Remove item"
        disabled={isRemoving}
        className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition-colors shrink-0 disabled:cursor-not-allowed"
        onClick={handleRemove}
      >
        {isRemoving ? (
          <FiLoader className="text-sm text-blue-600 animate-spin" />
        ) : (
          <FiTrash2 className="text-sm" />
        )}
      </button>
    </div>
  )
}

export default CartModalProduct