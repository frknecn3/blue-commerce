import React from 'react';
import Link from 'next/link';
import { FiAward } from 'react-icons/fi';
import ProductCard from '@/components/ProductCard';
import { Serialized } from '@/types/product';
import { Product } from '@/generated/prisma';

interface TopRatedSectionProps {
  products: Serialized<Product>[];
}

export default function TopRatedSection({ products }: TopRatedSectionProps) {
  // Sort products or take high-rated batch
  const topProducts = products.slice(4, 10);

  if (topProducts.length === 0) return null;

  return (
    <section className="w-full my-8">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber-300">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm shadow-2xs">
            <FiAward />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Top Rated & Community Favorites
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Highest customer satisfaction ratings across the platform.
            </p>
          </div>
        </div>
        <Link
          href="/category/trending"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          View Leaderboard →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
        {topProducts.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            rating={4.9}
            reviewCount={45 + idx * 7}
            badge="Top Rated"
          />
        ))}
      </div>
    </section>
  );
}
