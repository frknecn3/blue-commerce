import { ReactNode } from "react";
import { ProductParams, ReviewParams } from "../../../../constants/constants";
import Reviews from "./reviews";
import { IoStar, IoStarOutline } from "react-icons/io5";
import Review from "../../../../components/Review";
import PriceComponent from "../../../../components/PriceComponent";
import { prisma } from "../../../../lib/prisma";
import { Prisma, Product } from "../../../../generated/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { shimmer, toBase64 } from "@/utils/clientOnlyUtils";
import ProductButtons from "@/components/ProductButtons";
import { ProductRawWithSeller, SerializedProduct, SerializedProductWithSeller } from "@/types/product";
import ProductJsonLd from "@/components/JsonLd/ProductJsonLd";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
    const product = await prisma.product.findUnique({
        where: { id: params.productId },
        select: { name: true, description: true, imageUrl: true, price: true }
    });

    if (!product) {
        return {
            title: "Product Not Found | BluE-Commerce",
            description: "The requested product could not be found."
        };
    }

    return {
        title: `${product.name} | BluE-Commerce`,
        description: product.description?.slice(0, 160) || `Buy ${product.name} at BluE-Commerce. Best prices and fast delivery.`,
        openGraph: {
            title: `${product.name} | BluE-Commerce`,
            description: product.description?.slice(0, 160) || `Buy ${product.name} at BluE-Commerce.`,
            images: product.imageUrl ? [{ url: product.imageUrl, alt: product.name }] : [],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: product.description?.slice(0, 160) || undefined,
            images: product.imageUrl ? [product.imageUrl] : [],
        }
    };
}

const productId = async ({ params }: { params: { productId: string } }) => {
    const product: ProductRawWithSeller | null = await prisma.product.findUnique({
        where: {
            id: params.productId
        },
        include: {
            seller: true
        }
    })
    if (!product) {
        notFound()
    }
    const currentProduct: SerializedProductWithSeller = { ...product, price: Number(product.price) }



    const seller = currentProduct.seller;

    const images = (currentProduct as any).images || ['/placeholder.jpg'];

    return (
        <div className="min-h-screen bg-slate-50 py-8 max-lg:pb-20 px-4 sm:px-6 lg:px-8 mt-20 md:mt-16 lg:mt-0">
            <ProductJsonLd product={currentProduct} />
            <div className="max-w-7xl mx-auto">

                <nav className="mb-6 text-sm text-slate-500 flex items-center gap-2">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-medium truncate max-w-xs">{currentProduct.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm top-24">
                        <div className="aspect-square relative w-[75%] mx-auto overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center">
                            <Image width={150} height={150} placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`}
                                src={currentProduct.imageUrl}
                                alt={currentProduct.name}
                                className="object-contain w-full h-full max-h-[500px] hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2 mt-4">
                                {images.map((img: string, idx: number) => (
                                    <div key={idx} className="aspect-square border-2 border-slate-200 hover:border-blue-500 rounded-lg overflow-hidden cursor-pointer bg-slate-50">
                                        <Image width={150} height={150} placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`} src={img} alt="" className="object-cover w-full h-full" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div>
                            {/* Seller Link */}
                            {seller && (
                                <Link
                                    href={`/sellers/${seller.id}`}
                                    className="text-xs font-semibold text-blue-600 hover:underline"
                                >
                                    {seller.storeName || 'BluE-Commerce'}
                                </Link>
                            )}
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 leading-tight">
                                {currentProduct.name}
                            </h1>
                        </div>

                        {/* Rating Summary Mockup */}
                        <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
                            <div className="flex text-amber-400">
                                <IoStar className="w-5 h-5" />
                                <IoStar className="w-5 h-5" />
                                <IoStar className="w-5 h-5" />
                                <IoStar className="w-5 h-5" />
                                <IoStarOutline className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-slate-600">(4.0)</span>
                            <span className="text-slate-300">|</span>
                            <a href="#reviews" className="text-sm font-medium text-blue-600 hover:underline">
                                View Reviews
                            </a>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-slate-900 mb-2">Description</h3>
                            <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                                {currentProduct.description || "No description provided for this product."}
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm top-24 flex flex-col">
                        <div>
                            <span className="text-xs font-medium text-slate-400 block mb-1">Total Price</span>
                            {/* Integrated PriceComponent */}
                            <div className="text-2xl font-bold text-slate-900">
                                <PriceComponent currentProduct={currentProduct} />
                            </div>
                        </div>

                        <div className="border-t border-b border-slate-100 py-4 my-2">
                            <div className="flex items-center gap-3 text-sm text-slate-600 mb-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span>In Stock & Ready to Ship</span>
                            </div>
                            <div className="text-xs text-slate-400">
                                Sold and fulfilled by <span className="font-medium text-slate-700">{seller?.storeName || "BlueCommerce"}</span>
                            </div>
                        </div>

                        {/* Integrated ProductButtons component */}
                        <div className="w-full">
                            <ProductButtons style="max-lg:hidden flex flex-wrap flex-col text-white text-md" product={{ ...currentProduct, price: Number(currentProduct.price) }} />
                        </div>
                    </div>

                </div>

                {/* Bottom Section: Reviews Section */}
                <div id="reviews" className="mt-16 border-t border-slate-200 pt-12 max-w-4xl">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                        Customer Feedback
                    </h2>

                    {/* Render your imported Review and Reviews context components here */}
                    <div className="space-y-6">
                        <Reviews currentProduct={currentProduct} />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default productId;