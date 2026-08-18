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
import { FaTruckFast } from "react-icons/fa6";
import TrustBar from "@/components/Home/TrustBar";
import FlashDeals from "@/components/Home/FlashDeals";
import CategoryShowcase from "@/components/Home/CategoryShowcase";
import TopRatedSection from "@/components/Home/TopRatedSection";
import NewsletterBanner from "@/components/Home/NewsletterBanner";

export const dynamic = 'force-dynamic';

const MainPage = async ({
  searchParams,
}: {
  searchParams: { sort?: string; category?: string };
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
  ).map((product: Product) => SerializeProduct(product));

  return (
    <main className="w-full min-h-screen bg-sky-50/40 pb-16">
      {/* 1. Category Hotbar */}
      <div className="bg-white border-b border-sky-100 shadow-xs">
        <div className="max-w-[1480px] mx-auto flex justify-center overflow-x-auto text-xs font-semibold text-slate-700 py-2.5 px-4 sm:px-6 lg:px-10 gap-6 no-scrollbar">
          {hotbarElements.map((element) => (
            <Link
              key={element.label}
              href={element.value}
              className="hover:text-blue-600 transition-colors whitespace-nowrap text-xs"
            >
              {element.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 2. Category Ribbon Strip */}
      <div className="bg-white border-b border-sky-100 shadow-xs py-2.5">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 sm:gap-2.5">
            {ribbons.map((ribbon, i) => (
              <Link
                key={i}
                href={(ribbon as any).href || '#'}
                className="flex items-center justify-center gap-2 bg-sky-50/60 border border-sky-100 rounded-md px-2 py-1.5 hover:border-blue-400 hover:bg-blue-50/60 transition-all duration-150 group shadow-xs text-center"
              >
                <div className="relative w-10 h-10 shrink-0 rounded overflow-hidden">
                  <Image
                    fill
                    sizes="40px"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`}
                    src={ribbon.url}
                    alt={ribbon.title}
                    className="object-cover"
                  />
                </div>
                <span className="text-xs font-medium text-slate-800 group-hover:text-blue-600 truncate">
                  {ribbon.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* 3. HERO BANNER */}
        <div className="my-4">
          <Suspense
            fallback={
              <div className="w-full p-8 bg-white rounded-lg shadow-sm border border-sky-100">
                <SkeletonLoader />
              </div>
            }
          >
            <CarouselSection />
          </Suspense>
        </div>

        {/* 4. Marketplace Trust Bar */}
        <TrustBar />

        {/* 5. Flash Deals with Live Countdown */}
        {products.length > 0 && <FlashDeals products={products} />}

        {/* 6. Shop by Category Visual Showcase */}
        <CategoryShowcase />

        {/* 7. Popular Products Section */}
        <section className="w-full my-8">
          <div className="flex items-center justify-between border-b border-blue-600 pb-2 mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Popular Products
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Most requested items shipped direct from certified merchants.
              </p>
            </div>
            <Link href="/products" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
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
                  badge={i % 4 === 0 ? "Popular" : i % 3 === 0 ? "Free Shipping" : undefined}
                />
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-slate-500 font-medium bg-white rounded-md border border-sky-100">
                No products found in catalog.
              </div>
            )}
          </div>
        </section>

        {/* 8. Top Rated & Community Favorites */}
        {products.length > 4 && <TopRatedSection products={products} />}

        {/* 9. VIP Newsletter & Promo Code Banner */}
        <NewsletterBanner />
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
      {/* Hero Slider */}
      <div className="col-span-12 lg:col-span-8 min-w-0 rounded-lg overflow-hidden border border-sky-100 bg-white shadow-sm">
        <Slider items={randomProducts} />
      </div>

      {/* Right Column Stacked Widgets */}
      <div className="col-span-12 lg:col-span-4 hidden lg:flex flex-col gap-3 justify-between">
        {/* Widget 1: Featured Campaign with semi-transparent product image background */}
        <div className="relative overflow-hidden bg-blue-700 text-white rounded-lg p-4 border border-blue-600 shadow-sm flex flex-col justify-between flex-1">
          {dealProduct?.imageUrl && (
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src={dealProduct.imageUrl}
                alt={dealProduct.name || "Featured product"}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-center opacity-55 scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-blue-800/50 to-blue-700/20" />
            </div>
          )}

          <div className="relative z-10 flex items-center justify-between">
            <span className="bg-white text-blue-700 text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
              Featured Deal
            </span>
            <span className="text-xs font-medium text-blue-100">Limited Time</span>
          </div>

          <div className="relative z-10 my-2">
            <h4 className="font-bold text-sm text-white line-clamp-1">
              {dealProduct ? dealProduct.name : "Smart Noise-Cancelling Headphones"}
            </h4>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-white">
                ${dealProduct ? Number(dealProduct.price).toFixed(2) : "189.99"}
              </span>
              <span className="text-xs text-blue-200 line-through font-medium">
                ${dealProduct ? (Number(dealProduct.price) * 1.25).toFixed(2) : "239.99"}
              </span>
            </div>
          </div>

          <Link
            href={dealProduct ? `/product/${dealProduct.id}` : "/products"}
            className="relative z-10 w-full bg-white hover:bg-sky-50 text-blue-700 font-bold text-xs py-2 px-3 rounded text-center block transition-colors shadow-xs"
          >
            View Deal →
          </Link>
        </div>

        {/* Widget 2: Marketplace Perks with Cargo Truck background icon */}
        <div className="relative overflow-hidden bg-white text-slate-800 rounded-lg p-4 border border-sky-100 shadow-sm flex flex-col justify-between flex-1">
          <div className="absolute -right-3 -bottom-3 pointer-events-none text-sky-200/50">
            <FaTruckFast className="text-[200px] transform -rotate-12" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              Fast Express Delivery
            </span>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Free
            </span>
          </div>

          <p className="relative z-10 text-xs text-slate-600 font-normal my-2 leading-relaxed">
            Same-day dispatch for orders placed before 14:00. Guaranteed authentic products.
          </p>

          <Link
            href="/become-seller"
            className="relative z-10 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-3 rounded text-center block transition-colors shadow-xs"
          >
            Become a Seller →
          </Link>
        </div>
      </div>
    </div>
  );
};
