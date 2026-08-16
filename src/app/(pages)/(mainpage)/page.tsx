import { hotbarElements, ribbons } from "../../../constants/constants";
import React, { Suspense } from "react";
import Slider from "../../../components/Carousel";
import { prisma } from "../../../lib/prisma";
import { Category, Product } from "../../../generated/prisma";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import SkeletonLoader from "@/components/Common/SkeletonLoader";
import Image from "next/image";
import { SerializeProduct, shimmer, toBase64 } from "@/utils/clientOnlyUtils";
import { Serialized } from "@/types/product";

const MainPage = async ({
  searchParams,
}: {
  searchParams: { sort: string; category: string };
}) => {
  const products: Serialized<Product>[] = (
    await prisma.product.findMany({
      where: {
        stock: { gt: 0 },
        status: "ACTIVE",
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  ).map((product: Product) => (SerializeProduct(product)));

  return (
    <main className="w-full min-h-screen bg-slate-100/70 pb-16">
      {/* Category Hotbar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1480px] mx-auto flex justify-center overflow-x-auto text-xs font-bold text-slate-700 py-2.5 px-4 sm:px-6 lg:px-10 gap-6 no-scrollbar">
          {hotbarElements.map((element, i) => (
            <Link
              key={element.label}
              href={element.value}
              className="hover:text-blue-600 transition-colors whitespace-nowrap uppercase tracking-wider text-[11px]"
            >
              {element.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Sharp Category Ribbon Strip */}
      <div className="bg-white border-b border-slate-200 shadow-xs py-3">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex overflow-x-auto gap-3 py-1 no-scrollbar justify-start md:justify-center">
            {ribbons.map((ribbon, i) => (
              <Link
                key={i}
                href={(ribbon as any).href || '#'}
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 shrink-0 hover:border-blue-600 hover:bg-blue-50/30 transition-all duration-150 group"
              >
                <div className="relative w-6 h-6 shrink-0">
                  <Image
                    fill
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`}
                    src={ribbon.url}
                    alt={ribbon.title}
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 whitespace-nowrap">
                  {ribbon.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* HERO BANNER - Focused Single Hero Carousel */}
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 my-4">
        <Suspense
          fallback={
            <div className="w-full p-8 bg-white rounded-lg shadow-sm border border-slate-200">
              <SkeletonLoader />
            </div>
          }
        >
          <CarouselSection />
        </Suspense>
      </div>

      {/* High Density Popular Products Section */}
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 mt-6">
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-5">
          <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
            Popular Products
          </h2>
          <Link href="/products" className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">
            View All Products →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product: Serialized<Product>, i: number) => (
              <ProductCard
                key={product.id}
                product={product}
                rating={4.8}
                reviewCount={18 + (i * 2)}
                badge={i % 4 === 0 ? "POPULAR" : i % 3 === 0 ? "FREE SHIPPING" : undefined}
              />
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-slate-500 font-semibold bg-white rounded-md border border-slate-200">
              No products found in catalog.
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
export default MainPage;

type Props = {};

const CarouselSection = async (props: Props) => {
  const count = 5;
  const randomProducts = (
    await prisma.$queryRaw<
      (Omit<Product, "category"> & { category: Category })[]
    >`
  SELECT p.*, c.name AS catName FROM "Product" p 
  JOIN "Category" c ON p."categoryId" = c.id 
  WHERE p.stock > 0 AND p.status = 'ACTIVE'::"ProductStatus"
  ORDER BY RANDOM() 
  LIMIT ${Number(count)}`
  ).map((product) => ({ ...product, price: Number(product.price) }));

  const dealProduct = randomProducts.length > 0 ? randomProducts[0] : null;

  return (
    <div className="grid grid-cols-12 gap-4 items-stretch">
      {/* Reduced Width Hero Slider (68% width on desktop) */}
      <div className="col-span-12 lg:col-span-8 min-w-0 rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm">
        <Slider items={randomProducts} />
      </div>

      {/* Right Column Stacked Widgets (32% width) */}
      <div className="col-span-12 lg:col-span-4 hidden lg:flex flex-col gap-3 justify-between">
        {/* Widget 1: Deal of the Day */}
        <div className="bg-slate-900 text-white rounded-lg p-4 border border-slate-800 shadow-sm flex flex-col justify-between flex-1">
          <div className="flex items-center justify-between">
            <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
              FEATURED CAMPAIGN
            </span>
            <span className="text-[11px] font-bold text-slate-400">LIMITED TIME</span>
          </div>

          <div className="my-2">
            <h4 className="font-extrabold text-sm text-white line-clamp-1">
              {dealProduct ? dealProduct.name : "Smart Noise-Cancelling Headphones"}
            </h4>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-black text-white">
                ${dealProduct ? Number(dealProduct.price).toFixed(2) : "189.99"}
              </span>
              <span className="text-xs text-slate-400 line-through font-semibold">
                ${dealProduct ? (Number(dealProduct.price) * 1.25).toFixed(2) : "239.99"}
              </span>
            </div>
          </div>

          <Link
            href={dealProduct ? `/product/${dealProduct.id}` : "/products"}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase py-2 px-3 rounded text-center block transition-colors"
          >
            Explore Campaign Deal →
          </Link>
        </div>

        {/* Widget 2: Marketplace Perks */}
        <div className="bg-white text-slate-900 rounded-lg p-4 border border-slate-200 shadow-sm flex flex-col justify-between flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              FAST EXPRESS SHIPPING
            </span>
            <span className="text-[10px] font-extrabold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              FREE
            </span>
          </div>

          <p className="text-xs text-slate-600 font-medium my-2 leading-relaxed">
            Same-day dispatch for orders placed before 14:00. Guaranteed authentic products.
          </p>

          <Link
            href="/become-seller"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase py-2 px-3 rounded text-center block transition-colors"
          >
            Become a Seller →
          </Link>
        </div>
      </div>
    </div>
  );
};

