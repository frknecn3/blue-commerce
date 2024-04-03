"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ProductParams } from "../constants/constants";
import { addToCart, getCart, reloadCart } from "../utils/utils";
import "./css/index.css";
import { v4 as randomUUID } from "uuid";
import Image from "next/image";
import { FaRegStar, FaStar } from "react-icons/fa";

const ProductCard = ({ params }: { params: ProductParams }) => {
  const dispatch = useDispatch();
  const [id, setId] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const userExists = JSON.parse(localStorage.getItem("user"));
    const randomID = randomUUID();
    setId(userExists ? JSON.parse(localStorage.getItem("user")).uid : randomID);
  }, []);

  return (
    <div
      style={{ zIndex: `${isHovered ? "9999999999" : "1"}` }}
      className={` relative grid-container px-[30px] group`}
    >
      <div className="flex-col items-center justify-between hover:translate-y-[-5px] hover:shadow-black transition-all bg-blue-100 p-4 shadow-md rounded-xl border-gray-500 flex max-w-[200px]">
        <a className="text-center" href={`/product/${params.id}`}>
          <img
            onMouseEnter={() => {
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
            }}
            src={params?.photoURL}
            style={{ zIndex: `${isHovered ? "9999999999" : "1"}` }}
            alt=""
            className={`${
              isHovered ? "scale-[200%]" : "scale-100"
            }  transition-all w-[200px] h-[150px] relative rounded-xl border-2 border-gray-300 shadow-sm`}
          />

          <div>
            {params ? (
              <h2 className="font-semibold text-center p-2">{params.name}</h2>
            ) : (
              <span>Loading Product...</span>
            )}
          </div>
          <div className="flex justify-center text-yellow-500">
            {[...Array(5)].map((_, index) => {
              return index<(params.stars?.stars||3)?<FaStar key={index}/>:<FaRegStar key={index}/>;
            })}

            <span className="text-black px-1">{params.stars?.count||0}</span>

          </div>
          <div className="text-center w-full">
            <h1 className="text-[25px] font-semibold">${params?.price}</h1>
          </div>
        </a>
        <div className="flex flex-col justify-center items-center gap-2">
          <div className="text-white flex text-[9px] font-semibold text-nowrap gap-[4px] px-2">
            <div className="p-1 rounded-2xl bg-orange-400"><span>Trending</span></div>
            <div className="p-1 rounded-2xl bg-blue-400"><span>24H Delivery</span></div>
            <div className="p-1 rounded-2xl bg-green-400"><span>1Y Warranty</span></div>
          </div>
          <button
            className="bg-green-500 opacity-0 group-hover:opacity-100 text-white inline-block justify-self-center p-2 m-2 rounded-xl hover:brightness-125 focus-within:bg-white focus-within:text-black focus-within:translate-y-[-3px] border-black transition-all"
            onClick={() => {
              addToCart(id, params.id), reloadCart(id, dispatch);
            }}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
