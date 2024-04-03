'use client'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import React from 'react'
import CarouselComponent from "../CarouselComponent";
import { ProductParams } from "../../constants/constants";

const Slider = ({items,style}:{items:ProductParams[],style:string}) => {
    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 1
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 1
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 1
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
      };

    const random = Math.floor(Math.random()*items.length)

  return (
  <Carousel className={style} responsive={responsive} slidesToSlide={1} renderButtonGroupOutside={true} infinite={true} autoPlay={true} autoPlaySpeed={2500}>
    {items.slice(0,10).map((item,i)=>{return <CarouselComponent key={i} product={item} />})}
  </Carousel>
  )
}

export default Slider