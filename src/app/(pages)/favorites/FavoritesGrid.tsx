'use client'
import { SerializedFavorite } from '@/types/product'
import Link from 'next/link'
import React from 'react'
import { FaHeart, FaShoppingBag } from 'react-icons/fa'
import FavoriteCard from './FavoritesCard'

type Props = {
    favorites: SerializedFavorite[]
}

const FavoritesGrid = ({ favorites }: Props) => {
    return (
        <main className="min-h-screen bg-sky-50/40 py-8 px-4 sm:px-6 lg:px-10 max-w-[1480px] mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4">
                <Link href="/" className="hover:text-blue-600">Home</Link>
                <span>/</span>
                <span className="text-blue-900 font-bold">My Favorites</span>
            </nav>

            {/* Page Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 text-white rounded-lg p-6 sm:p-8 mb-6 shadow-sm border border-blue-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                        <FaHeart className="text-xl text-rose-300" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">My Favorites</h1>
                        <p className="text-xs sm:text-sm text-sky-100 mt-1 font-normal">
                            All your saved wishlist products in one place.
                        </p>
                    </div>
                </div>

                <div className="bg-white/20 backdrop-blur-xs border border-white/30 px-4 py-2 rounded text-xs font-semibold text-white shadow-xs">
                    {favorites.length} {favorites.length === 1 ? 'Item' : 'Items'} Saved
                </div>
            </div>

            {/* Products Grid / Empty State */}
            {favorites.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
                    {favorites.map((fav) => (
                        <FavoriteCard key={fav.id} fav={fav} />
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-sky-100 rounded-lg p-12 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
                    <div className="w-14 h-14 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-rose-400 text-2xl shadow-inner">
                        <FaHeart />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">Your favorites list is empty</h3>
                    <p className="text-xs text-slate-500 max-w-sm">
                        You haven't saved any items to your favorites yet. Tap the heart icon on any product to save it here.
                    </p>
                    <Link
                        href="/"
                        className="mt-2 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-6 rounded-md shadow-xs transition-colors"
                    >
                        <FaShoppingBag className="text-xs" />
                        <span>Start Shopping</span>
                    </Link>
                </div>
            )}
        </main>
    )
}

export default FavoritesGrid