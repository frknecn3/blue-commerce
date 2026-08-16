'use client';
import { useConfirm } from "@/context/ConfirmContext";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cartSlice";
import { removeFromFavorites } from "@/redux/slices/favoriteSlice";
import { SerializedFavorite } from "@/types/favorite";
import { shimmer, toBase64 } from "@/utils/clientOnlyUtils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaTrash, FaCartPlus } from "react-icons/fa";
import { IoHeart } from "react-icons/io5";
import { FiLoader, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { openCartModal } from "@/redux/slices/uiSlice";

type Props = {
    fav: SerializedFavorite
}

const FavoriteCard = ({ fav }: Props) => {
    const [isRemoving, setIsRemoving] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const dispatch = useAppDispatch();
    const ask = useConfirm();

    const isOutOfStock = fav.item.stock <= 0;
    const isLowStock = !isOutOfStock && fav.item.stock <= 5;

    const handleRemoveFromFavorites = async () => {
        const confirmed = await ask('Are you sure you want to remove this item from your favorites?');
        if (confirmed) {
            setIsRemoving(true);
            try {
                const res = await dispatch(removeFromFavorites(fav.productId));
                if (res.meta.requestStatus === 'fulfilled') {
                    toast.success('Item removed from favorites.');
                } else {
                    toast.error(`Error: ${res.payload || 'Failed to remove item.'}`);
                    setIsRemoving(false);
                }
            } catch (err) {
                setIsRemoving(false);
            }
        }
    };

    const handleAddToCart = async () => {
        setIsAdding(true);
        const res = await dispatch(addToCart({ productId: fav.item.id, quantity: 1 }));
        setIsAdding(false);
        if (res.meta.requestStatus === "fulfilled") {
            dispatch(openCartModal());
        }
    };

    return (
        <div className={`group relative flex h-full flex-col overflow-hidden rounded-lg border border-sky-100 bg-white transition-all duration-150 hover:border-blue-400 hover:shadow-md shadow-xs ${
            isRemoving ? 'opacity-50 pointer-events-none' : ''
        }`}>
            {/* Remove Favorite Button */}
            <button
                aria-label="Remove from favorites"
                disabled={isRemoving}
                onClick={handleRemoveFromFavorites}
                className="absolute right-2.5 top-2.5 z-20 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-rose-500 shadow-sm border border-sky-100 transition hover:scale-110 hover:bg-rose-50 disabled:opacity-50"
                title="Remove from favorites"
            >
                {isRemoving ? (
                    <FiLoader className="animate-spin text-sm text-blue-600" />
                ) : (
                    <IoHeart className="text-rose-500" size={16} />
                )}
            </button>

            {/* Product Image */}
            <Link href={`/product/${fav.item.id}`} className="relative block">
                <div className="relative flex h-44 items-center justify-center overflow-hidden bg-sky-50/50 p-4">
                    <Image
                        width={200}
                        height={200}
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(200, 200))}`}
                        src={fav.item.imageUrl}
                        alt={fav.item.name}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    {isOutOfStock && (
                        <span className="absolute bottom-2 left-2 rounded bg-slate-800/90 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                            Out of stock
                        </span>
                    )}
                    {isLowStock && (
                        <span className="absolute bottom-2 left-2 rounded bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                            Low Stock: {fav.item.stock}
                        </span>
                    )}
                </div>
            </Link>

            {/* Body */}
            <div className="flex flex-1 flex-col p-3">
                <Link href={`/product/${fav.item.id}`} className="flex-1">
                    <h3 className="line-clamp-2 min-h-[2.25rem] text-left text-xs font-bold leading-tight text-slate-800 transition-colors group-hover:text-blue-600">
                        {fav.item.name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="mt-2 mb-3">
                    <span className="text-sm sm:text-base font-bold text-slate-900 leading-none">
                        ${Number(fav.item.price).toFixed(2)}
                    </span>
                </div>

                {/* Actions Button */}
                <div className="mt-auto flex items-center gap-2 border-t border-sky-100 pt-2.5">
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock || isAdding || isRemoving}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-3 shadow-xs transition-colors disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {isAdding ? (
                            <FiLoader className="animate-spin text-xs" />
                        ) : (
                            <FaCartPlus size={12} />
                        )}
                        <span>Add to Cart</span>
                    </button>

                    <button
                        onClick={handleRemoveFromFavorites}
                        disabled={isRemoving}
                        aria-label="Remove item"
                        title="Remove from favorites"
                        className="grid h-8 w-8 shrink-0 place-items-center rounded bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors disabled:opacity-50"
                    >
                        {isRemoving ? (
                            <FiLoader className="animate-spin text-xs text-blue-600" />
                        ) : (
                            <FiTrash2 className="text-sm" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FavoriteCard;