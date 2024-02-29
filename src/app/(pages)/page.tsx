
import ProductCard from "../../components/ProductCard";
import '../../components/css/index.css'
import {getProducts} from '../../utils/utils'
import { ProductParams } from "../../constants/constants";
import React from "react";



const page = async () => {

    const products = await getProducts()

    return (
        <div className="grid-container">
            {Array.isArray(products)?products?.map((product:ProductParams,i:number):React.ReactNode=>(<ProductCard key={i} params={product}/>)):<div>Error loading products.</div>}
        </div>
    );
}

export default page;