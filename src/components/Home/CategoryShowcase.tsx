import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowUpRight } from 'react-icons/fi';
import { shimmer, toBase64 } from '@/utils/clientOnlyUtils';

const categoriesData = [
  {
    title: 'Smartphones & Tech',
    slug: 'phones',
    image: '/assets/categories/phones.jpg',
    badge: 'Popular',
    gradient: 'from-blue-900/80 via-blue-900/40 to-transparent',
  },
  {
    title: 'Laptops & Workstations',
    slug: 'laptops',
    image: '/assets/categories/laptops.jpg',
    badge: 'Top Tier',
    gradient: 'from-slate-900/80 via-slate-900/40 to-transparent',
  },
  {
    title: 'Gaming & Consoles',
    slug: 'gaming',
    image: '/assets/categories/gaming.jpg',
    badge: 'Trending',
    gradient: 'from-purple-900/80 via-purple-900/40 to-transparent',
  },
  {
    title: 'Audio & Headphones',
    slug: 'headphones',
    image: '/assets/categories/headphones.jpg',
    badge: 'Hi-Fi',
    gradient: 'from-indigo-900/80 via-indigo-900/40 to-transparent',
  },
  {
    title: 'Smartwatches & Fitness',
    slug: 'smartwatch',
    image: '/assets/categories/smartwatch.jpg',
    badge: 'New Gen',
    gradient: 'from-teal-900/80 via-teal-900/40 to-transparent',
  },
  {
    title: 'Fashion & Apparel',
    slug: 'fashion',
    image: '/assets/categories/fashion.jpg',
    badge: 'New Look',
    gradient: 'from-rose-900/80 via-rose-900/40 to-transparent',
  },
];

export default function CategoryShowcase() {
  return (
    <section className="w-full my-8">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-sky-200">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Shop by Featured Categories
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Curated collections selected for performance, design, and value.
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <span>All Categories</span>
          <FiArrowUpRight className="text-xs" />
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {categoriesData.map((cat, idx) => (
          <Link
            key={idx}
            href={`/category/${cat.slug}`}
            className="group relative aspect-4/5 rounded-xl overflow-hidden bg-slate-100 border border-sky-100/80 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all duration-300 flex flex-col justify-end p-3.5"
          >
            {/* Background Image */}
            <Image
              fill
              sizes="(max-width: 768px) 50vw, 16vw"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(150, 150))}`}
              src={cat.image}
              alt={cat.title}
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient}`} />

            {/* Content on bottom */}
            <div className="relative z-10">
              <span className="inline-block bg-white/20 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded mb-1 border border-white/30">
                {cat.badge}
              </span>
              <h4 className="text-xs font-bold text-white leading-tight group-hover:text-sky-200 transition-colors">
                {cat.title}
              </h4>
              <span className="text-[10px] text-sky-100 font-medium flex items-center gap-0.5 mt-1 group-hover:translate-x-1 transition-transform">
                Explore →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
