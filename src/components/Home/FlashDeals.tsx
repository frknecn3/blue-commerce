'use client';

import React, { useState, useEffect } from 'react';
import SafeImage from '@/components/Common/SafeImage';
import Link from 'next/link';
import { FiZap, FiClock, FiArrowRight } from 'react-icons/fi';
import { Serialized } from '@/types/product';
import { Product } from '@/generated/prisma';
import { shimmer, toBase64 } from '@/utils/clientOnlyUtils';

interface FlashDealsProps {
  products: Serialized<Product>[];
}

export default function FlashDeals({ products }: FlashDealsProps) {
  // 6-hour static countdown timer that ticks dynamically
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 43,
    seconds: 22,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.slice(0, 4);

  if (dealProducts.length === 0) return null;

  const formatNumber = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="w-full my-8 bg-gradient-to-br from-rose-500 via-rose-600 to-amber-600 rounded-2xl p-5 sm:p-6 text-white shadow-md">
      {/* Header with Title & Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-amber-300 text-xl shadow-inner">
            <FiZap className="animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
                Flash Deals of the Day
              </h3>
              <span className="bg-amber-400 text-rose-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs animate-pulse">
                Save Up to 45%
              </span>
            </div>
            <p className="text-xs text-rose-100 font-normal mt-0.5">
              Limited inventory at exclusive promotional prices.
            </p>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 self-start sm:self-auto">
          <FiClock className="text-rose-200 text-sm" />
          <span className="text-xs font-semibold text-rose-100 mr-1">Ends in:</span>
          <div className="flex items-center gap-1 font-mono text-xs font-bold">
            <span className="bg-white text-rose-700 px-1.5 py-0.5 rounded shadow-xs">
              {formatNumber(timeLeft.hours)}
            </span>
            <span>:</span>
            <span className="bg-white text-rose-700 px-1.5 py-0.5 rounded shadow-xs">
              {formatNumber(timeLeft.minutes)}
            </span>
            <span>:</span>
            <span className="bg-white text-rose-700 px-1.5 py-0.5 rounded shadow-xs">
              {formatNumber(timeLeft.seconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Deal Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {dealProducts.map((product, idx) => {
          const discountPercent = 25 + (idx * 5); // 25%, 30%, 35%, 40%
          const originalPrice = (Number(product.price) * (1 + discountPercent / 100)).toFixed(2);
          const stockRemaining = Math.max(2, (product.stock % 8) + 2);

          return (
            <div
              key={product.id}
              className="bg-white text-slate-900 rounded-xl p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
            >
              {/* Top Badge & Image */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-2 py-0.5 rounded">
                    -{discountPercent}% OFF
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                    🔥 {stockRemaining} Left
                  </span>
                </div>

                <Link
                  href={`/product/${product.id}`}
                  className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center block mb-3 border border-slate-100"
                >
                  <SafeImage
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <Link
                  href={`/product/${product.id}`}
                  className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors block"
                >
                  {product.name}
                </Link>
              </div>

              {/* Price & Stock Progress */}
              <div className="mt-3">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-base font-extrabold text-slate-900">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 line-through font-medium">
                    ${originalPrice}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-3">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (stockRemaining / 10) * 100)}%` }}
                  ></div>
                </div>

                <Link
                  href={`/product/${product.id}`}
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-900 hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                >
                  <span>Claim Deal</span>
                  <FiArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
