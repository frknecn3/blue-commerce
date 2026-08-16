import React from 'react';
import { prisma } from '@/lib/prisma';
import { SerializeProduct } from '@/utils/clientOnlyUtils';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/generated/prisma';
import { Serialized } from '@/types/product';
import Link from 'next/link';

interface CategoryPageProps {
    params: {
        slug: string;
    };
}

const formatCategoryTitle = (slug: string) => {
    return slug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const CategoryPage = async ({ params }: CategoryPageProps) => {
    const { slug } = params;
    const categoryTitle = formatCategoryTitle(slug);

    // Fetch products matching category name or active products
    const dbProducts = await prisma.product.findMany({
        where: {
            stock: { gt: 0 },
            status: 'ACTIVE',
            OR: [
                { category: { name: { contains: slug, mode: 'insensitive' } } },
                { name: { contains: slug, mode: 'insensitive' } },
                { description: { contains: slug, mode: 'insensitive' } },
            ]
        },
        include: { category: true },
        take: 24,
    });

    // Fallback query if specific query yields no results
    const productsToRender = dbProducts.length > 0 ? dbProducts : await prisma.product.findMany({
        where: { stock: { gt: 0 }, status: 'ACTIVE' },
        include: { category: true },
        take: 12,
    });

    const products: Serialized<Product>[] = productsToRender.map((prod) => SerializeProduct(prod));

    return (
        <main className="min-h-screen bg-sky-50/40 py-8 px-4 sm:px-6 lg:px-10 max-w-[1480px] mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4">
                <Link href="/" className="hover:text-blue-600">Home</Link>
                <span>/</span>
                <Link href="/products" className="hover:text-blue-600">Categories</Link>
                <span>/</span>
                <span className="text-blue-900 font-bold">{categoryTitle}</span>
            </nav>

            {/* Category Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 text-white rounded-lg p-6 sm:p-8 mb-6 shadow-sm border border-blue-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">{categoryTitle}</h1>
                    <p className="text-xs sm:text-sm text-sky-100 mt-1 font-normal">
                        Explore top-rated products in {categoryTitle} with instant shipping.
                    </p>
                </div>
                <div className="bg-white/20 backdrop-blur-xs border border-white/30 px-4 py-2 rounded text-xs font-semibold text-white shadow-xs">
                    Showing {products.length} Products
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
                {products.map((product, idx) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        rating={4.8}
                        reviewCount={15 + idx * 3}
                        badge={idx % 3 === 0 ? 'BESTSELLER' : undefined}
                    />
                ))}
            </div>
        </main>
    );
};

export default CategoryPage;
