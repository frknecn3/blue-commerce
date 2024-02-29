
import ProductButtons from "../../../../components/ProductButtons";
import { addToCart, getSpecificProduct, getUser} from "../../../../utils/utils";



const productId = async ({ params }: { params: { productId: string } }) => {
    const currentProduct = await getSpecificProduct(params.productId)
    const seller = await getUser(currentProduct.seller)

    return (<>
        <div className="flex justify-around rounded-xl bg-[#ddf5ff] p-4 m-4">
            <div className="flex flex-col w-full gap-4 justify-center items-center">
                <img src={currentProduct?.photoURL} className='rounded-xl w-[25vw]' alt="" />
                <span className="font-semibold text-[25px]">{currentProduct?.name}</span>
            </div>
            <div className=" p-4 w-full h-[30rem] text-[20px] m-4 flex flex-col justify-between items-center">
                <div className="w-full h-[25rem] m-4 flex justify-between flex-grow">
                    <div className="w-[65%] grid p-4 m-4 border-gray-500 border-2 rounded-xl bg-white grid-cols-2">
                        <div className="font-bold border-2 p-2 h-max flex items-center"><span>Price</span></div>
                        <div className=" border-2 p-2 h-max flex items-center">{currentProduct?.price}</div>
                        <div className="font-bold border-2 p-2 h-max flex items-center"><span>Category</span></div>
                        <div className=" border-2 p-2 h-max flex items-center">{currentProduct?.category}</div>
                        <div className="font-bold border-2 p-2 h-max flex items-center"><span>Publish Date</span></div>
                        <div className=" border-2 p-2 h-max flex items-center">{currentProduct?.datePublished.split(' ').slice(1, 4).join(" ")}</div>
                        <div className="font-bold border-2 p-2 h-max flex items-center"><span>Stocks Left</span></div>
                        <div className=" border-2 p-2 h-max flex items-center">{currentProduct?.quantity}</div>
                    </div>

                    <div className="w-[35%] m-4 bg-white rounded-xl p-4 border-2 border-gray-500">
                        <a href={`/profile/${seller?.userID}`}>
                            <div className="rounded-xl border-2 p-4">
                                <img src={seller?.photoURL} className=' z-10 rounded-[50%] w-[5rem]' alt="" />
                                <p>{seller?.name}</p>
                                <p>Sells {seller?.allProducts.length} products.</p>
                            </div>
                        </a>

                    </div>
                </div>
                <ProductButtons product={params?.productId} />
            </div>
        </div>
        
        <div className="flex flex-col justify-center items-center m-[2rem]">
            <div className="bg-blue-500 p-[1rem] rounded-xl"><span className="text-center font-semibold text-[27px]">ABOUT THE PRODUCT</span></div>
            <p className="p-[3rem] text-[25px] text-center">{currentProduct.desc}</p>
        </div>
        </>
    );
}

export default productId;