"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaCartPlus, FaStar, FaRegStar } from "react-icons/fa";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch } from "../redux/hooks";
import { addToCart } from "../redux/slices/cartSlice";
import {
  addToFavorites,
  removeFromFavorites,
  selectFavoriteById,
} from "../redux/slices/favoriteSlice";
import { openCartModal } from "@/redux/slices/uiSlice";
import { RootState } from "@/redux/store";
import { shimmer, toBase64 } from "@/utils/clientOnlyUtils";
import Loader from "./Loader";
import { Serialized } from "@/types/product";
import { Product } from "@/generated/prisma";

import SafeImage from "./Common/SafeImage";

// Optional extras a caller can pass if the product was fetched with reviews.
type ProductCardProps = {
  product: Serialized<Product>;
  rating?: number; // 0–5 average
  reviewCount?: number;
  badge?: string; // e.g. "Trending", "New"
};

const ProductCard = ({ product, rating, reviewCount, badge }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const isFavorite = useSelector(
    (state: RootState) => !!selectFavoriteById(state, product.id),
  );

  const handleAddToCart = async () => {
    setLoading(true);
    const res = await dispatch(addToCart({ productId: product.id, quantity: 1 }));
    setLoading(false);
    if (res.meta.requestStatus === "fulfilled") dispatch(openCartModal());
  };

  const handleFavorite = async () => {
    setLoading(true);
    await dispatch(
      isFavorite ? removeFromFavorites(product.id) : addToFavorites(product.id),
    );
    setLoading(false);
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= 5;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-sky-100 bg-white transition-all duration-150 hover:border-blue-400 hover:shadow-md">
      {/* Top-left badge */}
      {badge && (
        <span className="absolute left-2.5 top-2.5 z-20 rounded bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white shadow-xs">
          {badge}
        </span>
      )}

      {/* Favorite */}
      <button
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={handleFavorite}
        className="absolute right-2.5 top-2.5 z-20 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-slate-600 shadow-sm border border-sky-100 transition hover:scale-110 hover:text-red-600"
      >
        {isFavorite ? <IoHeart className="text-red-600" size={16} /> : <IoHeartOutline size={16} />}
      </button>

      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative block">
        <div className="relative flex h-44 items-center justify-center overflow-hidden bg-sky-50/50 p-4">
          {loading && (
            <div className="absolute inset-0 z-30 grid place-items-center bg-white/60">
              <Loader />
            </div>
          )}
          <SafeImage
            width={200}
            height={200}
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
          {isOutOfStock && (
            <span className="absolute bottom-2 left-2 rounded bg-slate-800/90 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
              Out of stock
            </span>
          )}
          {isLowStock && (
            <span className="absolute bottom-2 left-2 rounded bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
              Low Stock: {product.stock}
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-3">
        <div className="flex flex-col">
          <Link href={`/product/${product.id}`} className="block">
            <h3
              title={product.name}
              className="line-clamp-2 h-9 text-left text-xs font-bold leading-snug text-slate-800 transition-colors group-hover:text-blue-600 break-words overflow-hidden"
            >
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="mt-1.5 flex items-center gap-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) =>
                i < Math.round(rating ?? 4.8) ? (
                  <FaStar key={i} size={10} />
                ) : (
                  <FaRegStar key={i} size={10} className="text-slate-300" />
                ),
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-500">
              ({reviewCount ?? 28})
            </span>
          </div>
        </div>

        {/* Price + Add to cart */}
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-sky-100 pt-2.5">
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base font-extrabold text-slate-900 leading-none truncate">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.15 }}
            disabled={isOutOfStock || loading}
            onClick={handleAddToCart}
            className="flex items-center gap-1 rounded bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 shrink-0"
          >
            <FaCartPlus size={12} />
            <span>Add</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;