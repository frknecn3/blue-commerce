"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cartSlice";
import { addToFavorites, removeFromFavorites } from "@/redux/slices/favoriteSlice";
import { SerializedProduct } from "@/types/product";

const ProductButtons = ({ product, style }: { product: SerializedProduct, style?: string }) => {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isAddClicked, setIsAddClicked] = useState<boolean>(false);
  const [isFavClicked, setIsFavClicked] = useState<boolean>(false);
  const favorites = useAppSelector(state => state.favoriteReducer.ids);
  const isFavorited = favorites.includes(product.id);

  const maxStock = Math.max(0, product.stock ?? 0);
  const isOutOfStock = maxStock <= 0;

  const handleDecrease = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity(prev => Math.min(maxStock, prev + 1));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) {
      setQuantity(1);
    } else if (val > maxStock) {
      setQuantity(maxStock);
    } else {
      setQuantity(val);
    }
  };

  return (
    <div className={`${style} gap-2`}>
      {/* Quantity Selector */}
      {!isOutOfStock && (
        <>
          <div className="flex items-center justify-center text-slate-800 text-sm px-4 py-1 max-lg:px-0">
            <div className="flex w-full justify-center items-center gap-2">
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50 h-8">
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={quantity <= 1 || isAdding}
                  className="px-2.5 h-full text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={maxStock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={isAdding}
                  className="w-10 h-full text-center text-xs font-bold text-slate-800 outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={quantity >= maxStock || isAdding}
                  className="px-2.5 h-full text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

          </div>
          <p className="text-xs text-slate-400 font-normal ml-2 text-center">(Max:<span className="ml-1">{maxStock})</span></p>


        </>
      )}

      <button
        disabled={isAdding || isOutOfStock}
        className="bg-green-500 max-lg:text-xs shadow-md relative p-2 lg:p-4 max-lg:m-0 m-4 flex flex-1 justify-center items-center rounded-xl hover:translate-y-[-5px] transition-all disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer disabled:cursor-not-allowed"
        onClick={async () => {
          if (isAdding || isOutOfStock) return;
          setIsAdding(true);
          try {
            const confirm = await dispatch(addToCart({ productId: product.id, quantity }));
            if (confirm.meta.requestStatus == 'fulfilled') {
              setIsAddClicked(true);
              setTimeout(() => setIsAddClicked(false), 2000);
            }
          } finally {
            setIsAdding(false);
          }
        }}
      >
        <motion.span
          whileTap={{ scale: 0.9 }}
          animate={{ y: isAddClicked ? 30 : 0, opacity: isAddClicked ? 0 : 100 }}
          transition={{ duration: 0.3 }}
        >
          {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
        </motion.span>

        <motion.span
          whileTap={{ scale: 0.9 }}
          animate={{ y: isAddClicked ? 0 : -30, opacity: isAddClicked ? 100 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          ITEM ADDED
        </motion.span>
      </button>

      <button
        onClick={async () => dispatch(!isFavorited ? addToFavorites(product.id) : removeFromFavorites(product.id))}
        className="bg-blue-500 max-lg:text-xs shadow-md p-2 lg:p-4 max-lg:m-0 m-4 rounded-xl flex flex-1 justify-center items-center hover:translate-y-[-5px] text-center transition-all cursor-pointer">
        <motion.span
          whileTap={{ scale: 0.9 }}
          animate={{ y: isFavClicked ? 30 : 0, opacity: isFavClicked ? 0 : 100 }}
          transition={{ duration: 0.3 }}
        >
          {!isFavorited ? 'ADD TO WISHLIST' : 'REMOVE FROM WISHLIST'}
        </motion.span>
      </button>
    </div>
  );
};

export default ProductButtons;
