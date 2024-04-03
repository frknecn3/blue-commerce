'use client'
import React from "react";
import { ProductParams } from "../../constants/constants";
import ArrowAnimation from "./ArrowAnimation";

const CarouselComponent = ({ product }: { product: ProductParams }) => {
  const {
    price,
    category,
    datePublished,
    desc,
    id,
    name,
    photoURL,
    quantity,
    reviews,
    seller,
    stars,
    version,
  } = product;

  return (
    <div className="p-1 bg-[#ffffff] flex justify-center rounded-xl py-5 border">
      <a href={`/product/${id}`}>
        <div className="w-[20vw] h-[35vh] relative">
          <img src={photoURL} className="rounded-xl w-full h-full" alt="carousel photo" />
          <ArrowAnimation />
        </div>
        <div className="w-[20vw]"><p className="text-center text-wrap text-ellipsis">{name}</p></div>
      </a>
    </div>
  );
};

export default CarouselComponent;
