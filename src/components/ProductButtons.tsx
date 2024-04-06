"use client";

import { useDispatch } from "react-redux";
import { getActiveUserFromStorage } from "../utils/clientOnlyUtils";
import { addToCart, reloadCart } from "../utils/utils";
import '../components/css/index.css'
import { useState } from "react";
import { motion } from "framer-motion";

const ProductButtons = ({ product }: { product: string }) => {
  const dispatch = useDispatch();
  const user = getActiveUserFromStorage();
  const [isClicked,setIsClicked] = useState<boolean>(false)
  const hasWindow = typeof window !== "undefined";
  const width = hasWindow ? window.innerWidth : null;
  console.log(width)

  return (
    <div className={`product-buttons w-full h-[10vh] md:text-[1rem] lg:text-[1.5rem] flex-grow text-white flex lg:flex-row justify-center gap-[3rem]`}>
      <button
        className="bg-green-500 shadow-md relative p-2 lg:p-4 m-4 flex justify-center items-center rounded-xl hover:translate-y-[-5px] transition-all"
        onClick={() => {
          try {
            addToCart(user.uid, product), reloadCart(user.uid, dispatch);
            setIsClicked(true)
          } catch (err) {
            console.log(err);
          }
        }}
      >
              <motion.span
        onClick={()=>{setIsClicked(true);!isClicked?setTimeout(() => setIsClicked(false), 2000):'';}}
        whileTap={{ scale: 0.9 }}
        animate={{y:isClicked?30:0,opacity:isClicked?0:100}}
        transition={{ duration: 0.3 }}
      >
        ADD TO CART
      </motion.span>
      
      <motion.span
        onClick={()=>{setIsClicked(true);setTimeout(() => setIsClicked(false), 2000);}}
        whileTap={{ scale: 0.9 }}
        animate={{y:isClicked?0:-30,opacity:isClicked?100:0}}
        transition={{ duration: 0.3 }}
        className="absolute"
      >ITEM ADDED</motion.span>
      </button>


      <button className="bg-blue-500 shadow-md p-2 lg:p-4 m-4 rounded-xl flex justify-center items-center hover:translate-y-[-5px] text-center transition-all">
        <span>ADD TO WISHLIST</span>
      </button>

    </div>
  );
};

export default ProductButtons;
