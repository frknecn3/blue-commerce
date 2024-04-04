import Link from 'next/link';
import React from 'react'
import { ProductParams, ReviewParams } from '../../constants/constants';
import Review from '../Review';
import FeaturedProductButton from './FeaturedProductButton';
import { FaRegStar, FaStar } from 'react-icons/fa';

type FeaturedProductProps = {
  featuredProduct:ProductParams
  randomReview:ReviewParams
}

const FeaturedProduct = ({featuredProduct,randomReview}:FeaturedProductProps) => {
  return (
    <div className="w-[90vw] mx-auto md:h-auto bg-slate-100 p-10 mt-5 rounded-[1.5rem] shadow-xl flex md:flex-row flex-col justify-center md:justify-between gap-10 hover:translate-y-[-5px] transition-all">
   
      
    <Link href={`/product/${featuredProduct.id}`}>
      <div className="relative h-full flex items-center">
        <div className="lg:w-[20vw] lg:h-[40vh] w-full mx-4 h-[30vh]">
          <img
            src={featuredProduct.photoURL}
            alt="product image"
            className="rounded-[2rem] w-full h-full shadow-xl "
          />
        </div>


        <div className="bg-green-500 opacity-90 rounded-md rounded-br-[2rem] absolute bottom-0 right-4">
           <h1 className="text-white opacity-100 md:text-[3rem] text-[2rem]">18% OFF</h1>
        </div>
      </div>
      
    </Link>

      

    <div className="w-auto h-[40vh] hidden lg:block">

      <h1 className="text-[1.5rem] font-bold h-auto">
        {featuredProduct.name}
      </h1>
      
      <div className="h-auto flex-grow">
        <p className="text-[1rem] text-truncate text-ellipsis text-gray-600">
          {featuredProduct.desc.slice(0,100)}...
        </p>
      </div>

      {randomReview&&<div className="flex-grow">
        <Review i={1} userRef={randomReview.sender} review={randomReview}/></div>}

    </div>

    <div className="w-auto text-[2rem] flex flex-col justify-around items-center text-yellow-400">
      <div className="flex flex-col items-center justify-center">
        <span className="flex">{[...Array(5)].map((_, index) => {return index<(featuredProduct.stars?.stars||3)?<FaStar key={index}/>:<FaRegStar key={index}/>;})}</span>
        <span className="text-black text-center">{featuredProduct.stars?.count?`Out of ${featuredProduct.stars.count} reviews`:'No reviews yet'}</span>
        
      </div>

      <div className="">
        <FeaturedProductButton featuredProduct={featuredProduct} />
      </div>
    </div>

  </div>
  )
}

export default FeaturedProduct