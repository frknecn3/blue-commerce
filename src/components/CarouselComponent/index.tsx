'use client'
import React, { useEffect, useState } from "react";
import { ProductParams } from "../../constants/constants";
import ArrowAnimation from "./ArrowAnimation";
import { Product } from "../../generated/prisma";
import { ProductWithCategory } from "../../types/product";
import Link from "next/link";
import Image from "next/image";
import { shimmer, toBase64 } from "@/utils/clientOnlyUtils";

const CarouselComponent = ({ product }: { product: ProductWithCategory }): React.ReactNode => {

  const [photo, setPhoto] = useState<string | null>(null);
  const photos = ['aircleaner.jpg', 'coffee.jpg', 'vacuum.jpg'];

  // Select the photo once on the client to prevent server/client mismatch
  useEffect(() => {
    const randomPhoto = photos[Math.floor(photos.length * Math.random())];
    setPhoto(randomPhoto);
  }, []);

  return (
    <Link href={`/product/${product.id}`} className='block w-full aspect-[16/7] relative overflow-hidden rounded-lg'>
      {photo ?
        <Image fill sizes="(max-width:768px) 100vw, 50vw" placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`} src={`/assets/banners/${photo}`} className="w-full h-full object-cover rounded-lg" alt="carousel photo" />
        : <div
          className="absolute inset-0 w-full h-full bg-slate-200 animate-pulse rounded-lg"
          style={{ backgroundImage: `url(data:image/svg+xml;base64,${toBase64(shimmer(600, 300))})` }}
        />
      }
    </Link>
  );
};

export default CarouselComponent;
