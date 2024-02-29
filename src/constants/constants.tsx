import { IoIosLogIn } from "react-icons/io";
import { FaShoppingBag } from "react-icons/fa";
import { FaFileUpload } from "react-icons/fa";
import { MdOutlineSupportAgent } from "react-icons/md";
import { MdContactSupport } from "react-icons/md";


const Links = [
    {
        name:'Login/Register',
        href:'/login',
        logo:<IoIosLogIn />
    },
    {
        name:'Products',
        href:'/',
        logo:<FaShoppingBag />

    },
    {
        name:'Upload',
        href:'/product/create',
        logo:<FaFileUpload/>
    },
    {
        name:'Contact',
        href:'/Contact',
        logo:<MdOutlineSupportAgent />
    },
    {
        name:'About Us',
        href:'/about',
        logo:<MdContactSupport/>
    },
    
]

export default Links

export class ProductParams {
    version:1
    datePublished:string
    id:string
    name:string
    photoURL:string
    price:string
    quantity:number
    category:string
    seller:string
    desc:string
}

export class User {
    userID:string
    photoURL:string
    allProducts:string[]
    name:string
    cart:string[]
    wishlist:string[]
}

export const categories:string[] = [
    'Entertainment',
    'Technology',
    'Medical',
    'Art',
    'Educational',
    'Kitchenware'
]