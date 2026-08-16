import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SerializedProduct } from '@/types/product';
import { FaFire, FaChevronRight } from 'react-icons/fa';
import { shimmer, toBase64 } from '@/utils/clientOnlyUtils';

type Props = {
    product?: SerializedProduct | null;
};

const DealsOfTheDay = ({ product }: Props) => {
    // Fallback data if product is not available
    const dealProduct = product || {
        id: 'deal-1',
        name: 'Smart Noise-Cancelling Headphones',
        price: 189.99,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
        description: 'Immersive sound with active noise cancellation and 30-hour battery life.',
    };

    return (
        <div className="w-full h-full bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-4 md:p-5 text-white shadow-md flex flex-col justify-between relative overflow-hidden group">
            {/* Background Accent Graphics */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Header Badge */}
            <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <FaFire className="text-amber-200 animate-pulse text-sm" />
                    <span>Don't Miss Out!</span>
                </div>
                <span className="text-[11px] font-semibold bg-red-600 px-2 py-0.5 rounded-full animate-bounce">
                    Limited Time
                </span>
            </div>

            {/* Product Feature */}
            <div className="flex flex-col items-center my-3 text-center z-10">
                <div className="relative w-36 h-36 md:w-44 md:h-44 aspect-square bg-white rounded-xl p-2 shadow-inner mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <Image
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`}
                        src={dealProduct.imageUrl}
                        alt={dealProduct.name}
                        className="object-contain p-2"
                    />
                </div>
                <h3 className="font-bold text-sm md:text-base line-clamp-1 drop-shadow-sm">
                    {dealProduct.name}
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl md:text-2xl font-black text-white">
                        ${Number(dealProduct.price).toFixed(2)}
                    </span>
                    <span className="text-xs text-amber-100 line-through font-medium">
                        ${(Number(dealProduct.price) * 1.25).toFixed(2)}
                    </span>
                </div>
            </div>

            {/* CTA Button */}
            <Link
                href={product ? `/product/${product.id}` : '#'}
                className="w-full bg-white text-orange-600 font-extrabold text-xs md:text-sm py-2.5 px-4 rounded-xl shadow-sm hover:bg-amber-50 transition-colors flex items-center justify-center gap-2 z-10"
            >
                <span>Shop Campaign Deal</span>
                <FaChevronRight className="text-xs" />
            </Link>
        </div>
    );
};

export default DealsOfTheDay;
