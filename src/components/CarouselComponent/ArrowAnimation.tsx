import React from "react";
import { motion } from "framer-motion";
import { MdDiscount } from "react-icons/md";

const ArrowAnimation = () => {
  return (
    <motion.div
      className="text-white text-[30px]"
      style={{
        position: "absolute",
        right: '-2rem',
        bottom: "-0.5rem",
        zIndex:'10000000',
        display: "flex",
        flexDirection:'column',
        backgroundColor:'rgba(100,255,100)',
        opacity:'8  0%',
        padding:'5px',
        borderRadius:'10px',
        gap:'0',
        alignItems: "center",
        justifyContent: "center", // Align items horizontally
      }}
      animate={{
        y: [-7, 7], // The arrow will move up 10 pixels and then down 10 pixels
      }}
      transition={{
        duration: 0.7, // Duration for each animation cycle
        repeat: Infinity, // Repeat the animation infinitely
        repeatType: "reverse", // Reverse the animation direction on each repeat
      }}
    >
      <div className="w-auto h-auto text-[1rem]">DISCOUNT</div> {/* Text */}
      <div className=""><MdDiscount size={30} className="text-center" /> {/* Chevron */}</div>
    </motion.div>
  );
};

export default ArrowAnimation;