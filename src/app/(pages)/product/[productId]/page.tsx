
import { ReactNode } from "react";
import ProductButtons from "../../../../components/ProductButtons";
import { ProductParams, ReviewParams } from "../../../../constants/constants";
import { addToCart, getSpecificProduct, getUser } from "../../../../utils/utils";
import Reviews from "./reviews";
import { IoStar,IoStarOutline } from "react-icons/io5";
import Review from "../../../../components/Review";



const productId = async ({ params }: { params: { productId: string } }) => {
    const currentProduct = await getSpecificProduct(params.productId)
    const seller = await getUser(currentProduct.seller)

    return (
        <div>
            
            <div className="lg:w-auto md:mx-[3rem] lg:mx-[10rem] m-4 flex lg:flex-row flex-col justify-center lg:items-stretch items-center bg-white border-2 border-gray-300 rounded-t-xl">
                <div className="w-full mg:w-full lg:my-[15vh] h-[60vh] flex justify-center bg-white">
                    <img src={currentProduct.photoURL} className="w-[80%] h-full rounded-xl" alt="" />
                </div>
                <div className="lg:w-full flex flex-col lg:gap-2 gap-8 bg-gray-200 p-1 lg:p-20 box-border rounded-tr-xl">
                    <div className="mb-8"><p className="text-[1.5rem] md:text-[2.5rem] font-semibold">{currentProduct.name}</p></div>
                    
                    {/* Price and Stars */}
                    <div className="flex justify-between lg:leading-[3rem]">
                        <div className="flex flex-col">
                        <span className="text-[2rem] md:text-[3rem] font-semibold">${currentProduct.price}</span>
                        <span className="text-[1rem] md:text-[1.5rem] font-normal text-gray-600">Up to 12 installments</span>
                        </div>

                        <div className="flex text-[2rem] flex-col">
                                <div className="text-yellow-400 flex items-center h-[40px]"><span className="text-black font-semibold mr-2">{currentProduct.stars?.stars}</span>{[...Array(5)].map((_, index) => {return index<(currentProduct.stars?.stars||3)?<IoStar key={index}/>:<IoStarOutline key={index}/>;})}</div>
                                <span className="text-[1.5rem] text-center text-gray-500">{currentProduct.stars?.count} Reviews</span>
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
            <div className="lg:w-auto md:mx-[3rem] lg:mx-[10rem] flex flex-col justify-center lg:items-stretch items-center bg-white border-2 border-gray-300 rounded-b-xl">
                <div className="w-full text-[1.7rem] font-semibold p-2 text-center capitalize"><h1>Reviews About The Product</h1></div>
                <div>
                    <Reviews currentProduct={currentProduct}/>
                </div>
            </div>
        </div>
    );
}

export default productId;