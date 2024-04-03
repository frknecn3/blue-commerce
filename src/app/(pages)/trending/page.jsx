
import React from 'react'
import {getProducts} from '../../../utils/utils'
import CarouselComponent from '../../../components/CarouselComponent'
const Trending = async() => {

    const products = await getProducts()


  return (
    <div className='mx-10 my-5'>
        <h1 className='text-3xl my-3'>Today's Trending Products</h1>
        {products.map((item,i)=>(
        <div key={i} className='bg-[#ffffff] p-1 my-1 '>
            <CarouselComponent product={item} key={i}/>
        </div>
        ))}
    </div>
  )
}

export default Trending