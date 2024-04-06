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
    <div className="p-1 bg-[#ffffff] flex flex-col justify-center items-center rounded-xl py-5 border h-auto shadow-md">
        <div className="md:w-[20vw] md:h-[35vh] w-[80vw] h-[25vh] relative">
          <a href={`/product/${product.id}`}>
            <img src={photoURL} className="rounded-xl w-full h-full" alt="carousel photo" />
            <ArrowAnimation />
          </a>
          
        </div>
        
        <p className="text-center">{name}</p>
    </div>
  );
};

export default CarouselComponent;
