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
    version:number
    datePublished:string
    id:string
    name:string
    photoURL:string
    price:number
    quantity:number
    category:string
    seller:string
    desc:string
    reviews:ReviewParams[]
    stars:{
        count:number
        stars:number
    }
}

export class ReviewParams {
    text:string
    rating:1|2|3|4|5
    sender:string
    photoURL?:string
    userObj?:User
}

export class User {
    // constructor(userID?:string,photoURL?:string,allProducts?:string[],name?:string,cart?:string[],wishlist?:string[]){
    //     this.userID = userID||''
    //     this.photoURL=photoURL||''
    // }

    userID:string
    photoURL:string
    allProducts:string[]
    name:string
    cart:string[]
    wishlist:string[]
}

export const categories:string[] = [
    '',
    'Entertainment',
    'Technology',
    'Medical',
    'Art',
    'Educational',
    'Kitchenware'
]

export type Option = {
    value:string
    label:string
}

export const SelectOptions:Option[] = categories.map((category)=>{return{value:category,label:category}})


export const hotbarElements = [
    {
        value:'trending',
        label:'Trending'
    },
    {
        value:'whatsnew',
        label:'Newest Products'
    },
    {
        value:'offers',
        label:'Special Offers'
    },
    {
        value:'promoted',
        label:'Promoted Products'
    },
    {
        value:'fastdelivery',
        label:'Same-day Delivery'
    },
]