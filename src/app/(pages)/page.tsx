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
    <main className="">

      
        <div className="flex bg-white justify-center text-[1.5rem] text-gray-500 px-[10rem] w-full h-[7.5vh] items-center border-b border-t">
          {hotbarElements.map((element,i)=>{
          return <div key={element.label} className={`${i!==0?'border-l-4':''} border-gray-300 p-2 px-6 group  `}>
            <a className="group-hover:text-red-300 transition-all" href={element.value}>{element.label}</a>
          </div>
          })}
        </div>

        {/* CAROUSEL */}
        <div className="flex flex-col text-[2rem] font-semibold gap-4 justify-center items-center my-5">
          <span>Special Offers For Today</span>
          <Slider items={products} style={'w-[75%] h-[60vh] mx-[20vw]'}/>
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
        {Array.isArray(products) ? (products.map((product: ProductParams, i: number): React.ReactNode => (<ProductCard key={product.id} params={product} />))) : (<div>Error loading products.</div>)}
      </div>


      {/* Featured Products Section */}
      {!searchParams.category ? (
          <div className="mx-[5vw]">
            <h1 className="text-[2rem] mx-[5vw] font-semibold ">
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
