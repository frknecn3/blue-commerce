'use client'

import { useDispatch,} from "react-redux";
import { getActiveUserFromStorage } from "../utils/clientOnlyUtils";
import { addToCart, reloadCart } from "../utils/utils";


const ProductButtons = ({product}) => {

    const dispatch = useDispatch()
    const user = getActiveUserFromStorage()
    return (
        <div className="w-full h-[5rem] flex-grow text-white flex justify-center gap-[3rem]">
        
        <button className="bg-green-500 p-4 rounded-xl hover:translate-y-[-5px] transition-all" onClick={()=>{try{addToCart(user.uid,product),reloadCart(user.uid,dispatch)}catch(err){console.log(err)}}}>ADD TO CART</button>
        <button className="bg-blue-500 p-4 rounded-xl hover:translate-y-[-5px] transition-all">ADD TO WISHLIST</button>
        
    </div>
    );
}

export default ProductButtons;