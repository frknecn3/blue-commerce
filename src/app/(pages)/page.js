
import ProductCard from "../../components/ProductCard";
import '../../components/css/index.css'
import {getProducts} from '../../utils/utils.ts'



const page = async () => {

    const products = await getProducts()

    return (
        <div className="grid-container">
            {Array.isArray(products)?products?.map((product,i)=>(<ProductCard key={i} params={product}/>)):console.log()}
        </div>
    );
}

export default page;