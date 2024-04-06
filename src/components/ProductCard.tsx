"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ProductParams } from "../constants/constants";
import { addToCart, getCart, reloadCart } from "../utils/utils";
import "./css/index.css";
import { v4 as randomUUID } from "uuid";
import { FaRegStar, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const ProductCard = ({ params }: { params: ProductParams }) => {
  const dispatch = useDispatch();
  const [id, setId] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDivHovered, setIsDivHovered] = useState(false);

  useEffect(() => {
    const userExists = JSON.parse(localStorage.getItem("user"));
    const randomID = randomUUID();
    setId(userExists ? JSON.parse(localStorage.getItem("user")).uid : randomID);
  }, []);

  return (
    <div
      style={{ zIndex: `${isHovered ? "9999999999" : "1"}` }}
      className={` relative grid-container group`}
      onMouseEnter={() => {
        setIsDivHovered(true);
      }}
      onMouseLeave={() => {
        setIsDivHovered(false);
      }}
    >
      <div className="flex-col items-center justify-between hover:translate-y-[-5px] hover:shadow-black transition-all bg-gradient-to-b from-blue-100 to-white  p-4 shadow-md rounded-xl border-gray-500 flex max-w-[200px]">
        <a className="text-center" href={`/product/${params.id}`}>
          <div className="w-[7.5rem] h-[7.5rem] lg:h-[10rem] lg:w-[10rem] flex justify-center items-center">
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
              }  transition-all w-full h-full relative rounded-xl  object-scale-up border-2 border-gray-300 shadow-sm`}
            />
          </div>

          <div className="flex items-center justify-center h-16 my-2">
            {params ? (
              <p className="font-semibold text-center p-1 overflow-auto">
                {params.name}
              </p>
            ) : (
              <span>Loading Product...</span>
            )}
          </div>
          <div className="flex justify-center items-center text-yellow-500">
            {[...Array(5)].map((_, index) => {
              return index < (params.stars?.stars || 3) ? (
                <FaStar key={index} />
              ) : (
                <FaRegStar key={index} />
              );
            })}

            <span className="text-black px-1">{params.stars?.count || 0}</span>
          </div>
          <div className="text-center w-full">
            <h1 className="md:text-[2rem] text-[1rem] font-semibold">
              ${params?.price}
            </h1>
          </div>
        </a>
        <div className="flex flex-col justify-center items-center gap-2">
          <motion.div
            animate={{ scale: isDivHovered ? 1.07 : 1 }}
            transition={{ duration: 0.2 }}
            className="text-white flex z-10 lg:flex-row flex-col text-[9px] font-semibold text-nowrap gap-[4px] px-2"
          >
            <div className="p-[0.125rem] lg:p-1 rounded-2xl bg-orange-400 text-center">
              <span>Trending</span>
            </div>
            <div className="p-[0.125rem] lg:p-1 rounded-2xl bg-blue-400 text-center">
              <span>24H Delivery</span>
            </div>
            <div className="p-[0.125rem] lg:p-1 rounded-2xl bg-green-400 text-center">
              <span>1Y Warranty</span>
            </div>
          </motion.div>
          <motion.button
            animate={{
              y: isDivHovered ? 0 : 10,
              opacity: isDivHovered ? 100 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="bg-green-500 
             text-white inline-block 
            justify-self-center md:p-2 md:m-2 m-1 p-1 rounded-xl hover:brightness-125 
            focus-within:bg-white focus-within:text-black 
            border-black text-[0.7rem] md:text-[1rem]"
            onClick={() => {
              addToCart(id, params.id), reloadCart(id, dispatch);
            }}
          >
            ADD TO CART
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
