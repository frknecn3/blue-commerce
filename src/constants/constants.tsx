import { IoIosLogIn } from "react-icons/io";
import { FaShoppingBag } from "react-icons/fa";
import { FaFileUpload } from "react-icons/fa";
import { MdOutlineSupportAgent } from "react-icons/md";
import { MdContactSupport } from "react-icons/md";


const Links = [
    {
        name: 'Products',
        href: '/',
        logo: <FaShoppingBag />

    },
    // {
    //     name: 'Upload',
    //     href: '/product/create',
    //     logo: <FaFileUpload />
    // },
    // {
    //     name: 'Contact',
    //     href: '/Contact',
    //     logo: <MdOutlineSupportAgent />
    // },
    // {
    //     name: 'About Us',
    //     href: '/about',
    //     logo: <MdContactSupport />
    // },

]

export default Links

export interface ProductParams {
    version: number
    datePublished: string
    id: string
    name: string
    photoURL: string
    price: number
    quantity: number
    category: string
    seller: string
    desc: string
    reviews: ReviewParams[]
    stars: {
        count: number
        stars: number
    }
}

export interface ReviewParams {
    text: string
    rating: 1 | 2 | 3 | 4 | 5
    sender: string
    photoURL?: string
    userObj?: User
}

export interface User {
    // constructor(userID?:string,photoURL?:string,allProducts?:string[],name?:string,cart?:string[],wishlist?:string[]){
    //     this.userID = userID||''
    //     this.photoURL=photoURL||''
    // }

    userID: string
    photoURL: string
    allProducts: string[]
    name: string
    cart: string[]
    wishlist: string[]
}

export const categories: string[] = [
    '',
    'Entertainment',
    'Technology',
    'Medical',
    'Art',
    'Educational',
    'Kitchenware'
]

export type Option = {
    value: string
    label: string
}

export const SelectOptions: Option[] = categories.map((category) => { return { value: category, label: category } })


export const hotbarElements = [
    {
        value: '/category/trending',
        label: 'Trending'
    },
    {
        value: '/category/newest',
        label: 'Newest Products'
    },
    {
        value: '/offers',
        label: 'Special Offers'
    },
    {
        value: '/category/promoted',
        label: 'Promoted Products'
    },
    {
        value: '/category/fast-delivery',
        label: 'Same-day Delivery'
    },
    {
        value: '/category/supermarket',
        label: 'Supermarket'
    },
    {
        value: '/category/gaming-pcs',
        label: 'Gaming PCs'
    },
    {
        value: '/category/pet-shop',
        label: 'Pet Shop'
    },
]


export const ribbons = [
    {
        url: '/assets/categories/phones.jpg',
        zoom: "1",
        title: "Phones",
        href: "/category/phones"
    },
    {
        url: '/assets/categories/laptops.jpg',
        zoom: "1",
        title: "Laptops",
        href: "/category/laptops"
    },
    {
        url: '/assets/categories/gaming.jpg',
        zoom: "1",
        title: "Gaming",
        href: "/category/gaming"
    },
    {
        url: '/assets/categories/smartwatch.jpg',
        zoom: "1",
        title: "Smartwatches",
        href: "/category/smartwatches"
    },
    {
        url: '/assets/categories/headphones.jpg',
        zoom: "1",
        title: "Audio",
        href: "/category/audio"
    },
    {
        url: '/assets/categories/fashion.jpg',
        zoom: "1",
        title: "Fashion",
        href: "/category/fashion"
    },
    {
        url: '/assets/categories/furniture.jpg',
        zoom: "1",
        title: "Furniture",
        href: "/category/furniture"
    },
    {
        url: '/assets/categories/books.jpg',
        zoom: "1",
        title: "Books",
        href: "/category/books"
    },
]

export const countries = [
    {
        label: 'United States of America',
        value: 'US'
    },
    {
        label: 'Türkiye',
        value: 'TR'
    },
    {
        label: 'The United Kingdom',
        value: 'GB'
    }
    ,
    {
        label: 'Spain',
        value: 'ES'
    },
    {
        label: 'Germany',
        value: 'DE'
    }
]