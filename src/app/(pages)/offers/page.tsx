import React from 'react';
import { prisma } from '@/lib/prisma';
import { SerializeProduct } from '@/utils/clientOnlyUtils';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/generated/prisma';
import { Serialized } from '@/types/product';
import Link from 'next/link';
import { FaTag, FaBolt, FaPercent, FaShippingFast } from 'react-icons/fa';

const OffersPage = async () => {
    const dbProducts = await prisma.product.findMany({
        where: { stock: { gt: 0 }, status: 'ACTIVE' },
        include: { category: true },
        take: 18,
    });

    const products: Serialized<Product>[] = dbProducts.map((prod) => SerializeProduct(prod));

    return (
        <main className="min-h-screen bg-slate-100/70 py-8 px-4 sm:px-6 lg:px-10 max-w-[1480px] mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4">
                <Link href="/" className="hover:text-blue-600">Home</Link>
                <span>/</span>
                <span className="text-slate-900 font-bold">Special Offers</span>
            </nav>

            {/* Campaign Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white rounded-lg p-6 sm:p-10 mb-8 border border-slate-800 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-extrabold px-3 py-1 rounded uppercase tracking-wider mb-2">
                        <FaBolt className="text-yellow-400 animate-pulse" />
                        <span>Flash Campaigns</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-wider">Special Offers & Deals</h1>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
                        Save up to 40% on top tech, kitchenware, laptops, and everyday essentials. Limited stock availability!
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                    <div className="bg-slate-800/80 border border-slate-700 p-3 rounded text-center">
                        <FaPercent className="text-blue-400 text-lg mx-auto mb-1" />
                        <span className="text-xs font-bold block text-white">Up to 40% Off</span>
                    </div>
                    <div className="bg-slate-800/80 border border-slate-700 p-3 rounded text-center">
                        <FaShippingFast className="text-blue-400 text-lg mx-auto mb-1" />
                        <span className="text-xs font-bold block text-white">Free Express Shipping</span>
                    </div>
                </div>
            </div>

            {/* Offers Product Catalog */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-6">
                <h2 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FaTag className="text-blue-600" />
                    <span>Active Deal Products</span>
                </h2>
                <span className="text-xs font-bold text-slate-500">{products.length} Offers Available</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
                {products.map((product, idx) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        rating={4.9}
                        reviewCount={32 + idx * 4}
                        badge={idx % 2 === 0 ? "SPECIAL DEAL" : "30% OFF"}
                    />
                ))}
            </div>
        </main>
    );
};

export default OffersPage;
