
import { ReactNode } from "react";
import ProductButtons from "../../../../components/ProductButtons";
import { ProductParams, ReviewParams } from "../../../../constants/constants";
import { addToCart, getSpecificProduct, getUser } from "../../../../utils/utils";
import Reviews from "./reviews";
import { IoStar,IoStarOutline } from "react-icons/io5";
import Review from "../../../../components/Review";
import PriceComponent from "../../../../components/PriceComponent";



const productId = async ({ params }: { params: { productId: string } }) => {
    const currentProduct = await getSpecificProduct(params.productId)
    const seller = await getUser(currentProduct.seller)

    return (
        <div className="mt-20 md:mt-16 lg:mt-0">
            
            <div className="lg:w-auto md:mx-[3rem] 2xl:mx-[10rem] mx-4 mt-4 flex lg:flex-row flex-col justify-center  items-center bg-white border-2 border-gray-300 rounded-t-xl">
                <div className="w-full rounded-xl md:w-full h-full flex justify-center items-center p-4 bg-white">
                    <img src={currentProduct.photoURL} className="w-full h-[40vh] lg:h-[60vh] rounded-xl" alt="" />
                </div>
                <div className="w-full flex flex-col justify-center lg:items-stretch items-center lg:gap-8 gap-16 bg-gray-200 p-2 md:p-10 2xl:p-20 h-full rounded-tr-xl">
                    <div className="mb-8">
                        <p className="text-[1.5rem] md:text-[2.5rem] font-semibold">{currentProduct.name}</p>
                        <a href={`/profile/${seller.userID}`}><div className="flex text-gray-600 text-[1.5rem] items-center gap-2">Listed by {seller.name}<img src={seller.photoURL} className="w-[30px] rounded-[50%]" alt="" /></div></a>
                    </div>
                    
                    {/* Price and Stars */}
                    <div className="flex flex-col lg:flex-row justify-between md:gap-10 lg:leading-[3rem]">
                        <div className="flex flex-col">
                        <PriceComponent currentProduct={currentProduct}/>
                        </div>

                        <div className="flex text-[2rem] md:text-[2.5rem] lg:text-[3rem] flex-col">
                                <div className="text-yellow-400 flex items-center h-[40px]"><span className="text-black font-semibold mr-2">{currentProduct.stars?.stars}</span>{[...Array(5)].map((_, index) => {return index<(currentProduct.stars?.stars||3)?<IoStar key={index}/>:<IoStarOutline key={index}/>;})}</div>
                                <span className="text-center text-gray-500">{currentProduct.stars?.count} Reviews</span>
                        </div>
                    </div>

                    <div className="h-full flex items-center md:text-[1rem] lg:text-[1.5rem] text-center">
                        <p>{currentProduct.desc}</p>
                    </div>

                    <div>
                        <ProductButtons product={params?.productId} />
                    </div>
                </div>

            </div>
            {/* Reviews */}
            <div className="mx-4 lg:mx-0 lg:w-auto md:mx-[3rem] 2xl:mx-[10rem] flex flex-col justify-center lg:items-stretch items-center bg-white border-2 border-gray-300 rounded-b-xl">
                <div className="w-full text-[1.7rem] font-semibold p-2 text-center capitalize"><h1>Reviews About The Product</h1></div>
                <div>
                    <Reviews currentProduct={currentProduct}/>
                </div>
            </div>
        </div>
    );
}

export default productId;