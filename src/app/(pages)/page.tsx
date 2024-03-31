import ProductCard from "../../components/ProductCard";
import "../../components/css/index.css";
import { getProducts, getUser } from "../../utils/utils";
import { hotbarElements, ProductParams, ReviewParams } from "../../constants/constants";
import React from "react";
import SelectComponent from "../../components/SelectComponent";
import SortComponent from "../../components/SortComponent";
import Link from "next/link";
import { FaRegStar, FaStar } from "react-icons/fa";
import Review from "../../components/Review";
import FeaturedProductButton from "../../components/FeaturedProduct/FeaturedProductButton";

const MainPage = async ({
  searchParams,
}: {
  searchParams: { sort: string; category: string };
}) => {
  const q = {
    sort: searchParams.sort || "",
    category: searchParams.category || "",
  };
  const products = await getProducts(q);
  

  const featuredProduct: ProductParams = products[5] /*Math.floor(Math.random() * products.length) */
  const randomReview:ReviewParams = featuredProduct&&featuredProduct.reviews&&!searchParams.category?featuredProduct.reviews[0]:null

  return (
    <main className="">

      
        <div className="flex bg-white justify-center text-[1.5rem] text-gray-500 px-[10rem] w-full h-[7.5vh] items-center border-b border-t">
          {hotbarElements.map((element,i)=>{
          return <div className={`${i!==0?'border-l-4':''} border-gray-300 p-2 px-6 group  `}>
            <a className="group-hover:text-red-300 transition-all" href={element.value}>{element.label}</a>
          </div>
          })}
        </div>





      <div className="flex justify-between px-6">
        <h1 className="text-[2rem] mx-[10vw] my-8 font-semibold">
          Popular Products
        </h1>
        <div className="flex gap-4 items-center">
          <SortComponent />
          <SelectComponent />
        </div>
      </div>

      {/* Popular Products Section */}
      <div className="grid-container mx-[3vw] mb-10 pr-6 mt-5">
        {Array.isArray(products) ? (
          products.map(
            (product: ProductParams, i: number): React.ReactNode => (
              <ProductCard key={i} params={product} />
            )
          )
        ) : (
          <div>Error loading products.</div>
        )}
      </div>

      {/* Featured Products Section */}
      {!searchParams.category ? (
          <div className="mx-[5vw]">
            <h1 className="text-[2rem] mx-[5vw] font-semibold ">
              Featured Product
            </h1>

            <div className="w-full h-[50vh] bg-slate-100 p-10 mt-5 rounded-[1.5rem] shadow-xl flex justify-between gap-10 hover:translate-y-[-5px] transition-all">
              <div>
                
              <Link href={`/product/${featuredProduct.id}`}>
                <div className="relative">
                  <div className="w-[20vw] h-[40vh]">
                    <img
                      src={featuredProduct.photoURL}
                      alt="product image"
                      className="rounded-[2rem] w-full h-full shadow-xl "
                    />
                  </div>


                  <div className="bg-green-500 opacity-90 rounded-md rounded-br-[2rem] absolute bottom-0 right-0">
                     <h1 className="text-white opacity-100 text-[3rem]">18% OFF</h1>
                  </div>
                </div>
                
              </Link>

                
              </div>

              <div className="w-auto h-[40vh]">

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
                  <span className="text-black">{featuredProduct.stars?.count?`Out of ${featuredProduct.stars.count} reviews`:'No reviews yet'}</span>
 
                </div>

                <div className="">
                  <FeaturedProductButton featuredProduct={featuredProduct} />
                </div>
              </div>

            </div>
          </div>
      ) : (
        <div></div>
      )}
    </main>
  );
};

export default MainPage;
