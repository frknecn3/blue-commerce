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
        <main className="min-h-screen bg-sky-50/40 py-8 px-4 sm:px-6 lg:px-10 max-w-[1480px] mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4">
                <Link href="/" className="hover:text-blue-600">Home</Link>
                <span>/</span>
                <span className="text-blue-900 font-bold">Special Offers</span>
            </nav>

            {/* Campaign Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 text-white rounded-lg p-6 sm:p-8 mb-6 border border-blue-500 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 bg-white text-blue-700 text-xs font-bold px-2.5 py-1 rounded mb-2 shadow-xs">
                        <FaBolt className="text-amber-500" />
                        <span>Flash Deals</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Special Offers & Deals</h1>
                    <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl font-normal">
                        Save up to 40% on top tech, kitchenware, laptops, and everyday essentials.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                    <div className="bg-white/20 backdrop-blur-xs border border-white/30 p-3 rounded text-center shadow-xs">
                        <FaPercent className="text-sky-200 text-lg mx-auto mb-1" />
                        <span className="text-xs font-semibold block text-white">Up to 40% Off</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-xs border border-white/30 p-3 rounded text-center shadow-xs">
                        <FaShippingFast className="text-sky-200 text-lg mx-auto mb-1" />
                        <span className="text-xs font-semibold block text-white">Free Express Shipping</span>
                    </div>
                </div>
            </div>

            {/* Offers Product Catalog */}
            <div className="flex items-center justify-between border-b border-blue-600 pb-2 mb-6">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FaTag className="text-blue-600" />
                    <span>Active Deal Products</span>
                </h2>
                <span className="text-xs font-medium text-slate-500">{products.length} Offers Available</span>
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
