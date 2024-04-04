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
    <div className="p-1 bg-[#ffffff] flex justify-center items-center rounded-xl py-5 border h-[80vh]">
      <a href={`/product/${id}`}>
        <div className="md:w-[20vw] md:h-[35vh] w-[80vw] h-[40vh] relative">
          <img src={photoURL} className="rounded-xl w-full h-full" alt="carousel photo" />
          <ArrowAnimation />
        </div>
        <div className="flex justify-center"><span className="text-center">{name}</span></div>
      </a>
    </div>
  );
};

export default CarouselComponent;
