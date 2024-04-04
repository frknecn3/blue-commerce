'use client'

import { useDispatch,} from "react-redux";
import { getActiveUserFromStorage } from "../utils/clientOnlyUtils";
import { addToCart, reloadCart } from "../utils/utils";


const ProductButtons = ({product}:{product:string}) => {

    const dispatch = useDispatch()
    const user = getActiveUserFromStorage()
    return (
        <div className="w-full h-auto md:text-[1rem] lg:text-[1.5rem] flex-grow text-white flex flex-col lg:flex-row justify-center gap-[3rem]">
        
        <button className="bg-green-500 p-8 flex justify-center items-center rounded-xl hover:translate-y-[-5px] transition-all" onClick={()=>{try{addToCart(user.uid,product),reloadCart(user.uid,dispatch)}catch(err){console.log(err)}}}><span>ADD TO CART</span></button>
        <button className="bg-blue-500 p-8 rounded-xl flex justify-center items-center hover:translate-y-[-5px] text-center transition-all"><span>ADD TO WISHLIST</span></button>
        
    </div>
    );
}

export default ProductButtons;