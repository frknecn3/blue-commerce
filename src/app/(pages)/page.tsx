import ProductCard from "../../components/ProductCard";
import "../../components/css/index.css";
import { getProducts} from "../../utils/utils";
import { hotbarElements, ProductParams, ReviewParams } from "../../constants/constants";
import React from "react";
import SelectComponent from "../../components/SelectComponent";
import SortComponent from "../../components/SortComponent";
import FeaturedProduct from "../../components/FeaturedProduct";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Slider from "../../components/Carousel";

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
  

  const featuredProduct: ProductParams = products[Math.floor(Math.random() * products.length)] /*Math.floor(Math.random() * products.length) */
  const randomReview:ReviewParams = featuredProduct&&featuredProduct.reviews&&!searchParams.category?featuredProduct.reviews[0]:null

  return (
    <main className="w-[100vw]">

      
        <div className="flex bg-white justify-center overflow-x-scroll md:overflow-hidden font-semibold text-[0.7rem] lg:text-[1.5rem] text-gray-500 h-[7.5vh] items-center border-b border-t">
          {hotbarElements.map((element,i)=>{
          return <div key={element.label} className={`${i!==0?'border-l-4':''} border-gray-300 p-2  group  `}>
            <a className="group-hover:text-red-300 transition-all" href={element.value}>{element.label}</a>
          </div>
          })}
        </div>

        {/* CAROUSEL */}
        <div className="flex flex-col w-[100vw] text-[1.5rem] md:text-[2rem] font-semibold gap-4 justify-center items-center my-0 md:my-5">
          <span>Special Offers For Today</span>
          <Slider items={products} style={'w-[100vw] md:w-[75vw] h-full py-1'}/>
        </div>





      <div className="flex justify-center">
      <div className="flex flex-col md:flex-row justify-between w-full">
        <h1 className=" text-[1.5rem] md:text-[2rem] md:mx-[10vw] my-8 text-center font-semibold">
          Popular Products
        </h1>
        <div className="flex flex-col md:flex-row gap-4 justify-end items-center w-full md:mx-[10vw]">
          <SortComponent />
          <SelectComponent />
        </div>
      </div>
      </div>



      {/* Popular Products Section */}
      <div className="flex justify-center">
      <div className="grid-container mx-[3vw] mb-10 md:px-6 px-6 w-[90vw] mt-5">
        {Array.isArray(products) ? (products.map((product: ProductParams, i: number): React.ReactNode => (<ProductCard key={product.id} params={product} />))) : (<div>Error loading products.</div>)}
      </div>
      </div>


      {/* Featured Products Section */}
      {!searchParams.category ? (
          <div className="w-[100vw] flex justify-center flex-col">
            <h1 className="text-[2rem] text-center font-semibold ">
              Featured Product
            </h1>

            <FeaturedProduct featuredProduct={featuredProduct} randomReview={randomReview}/>
          </div>
      ) : (
        <div></div>
      )}




    </main>
  );
};

export default MainPage;
