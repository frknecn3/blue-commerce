'use client'
import { useEffect, useRef, useState } from 'react'
import Sidebar from './Sidebar'
import './css/index.css'
import { IoIosMenu } from "react-icons/io";
import { FaSearch, FaUser } from "react-icons/fa";
import { listenCart } from '../utils/utils';
import { useSelector, useDispatch } from 'react-redux'
import { auth } from '../firebase/config';
import { RootState, } from '../redux/store';
import { FaShoppingCart } from "react-icons/fa";
import {v4 as randomUUID } from 'uuid';
import { useRouter } from 'next/navigation';


const Header = () => {

  const [sidebar, setSidebar] = useState(false)
  const headerRef = useRef(null)
  const [user, setUser] = useState<{ uid: string, displayName: string }>(null)
  const cart = useSelector((store: RootState) => store.cart)
  const [cartLen, setCartLen] = useState(0)
  const [prevCartLen, setPrevCartLen] = useState(0);
  const cartText = useRef(null)
  const [searchQuery,setSearchQuery] = useState('')
  const formRef = useRef(null)
  const router=useRouter()





  useEffect(() => {
    const headerInfo = () => {
      const storedCartData = JSON.parse(localStorage.getItem('cart'));
      const cartLength = storedCartData ? storedCartData.length : 0; // Use 0 if the cart data is not available
      setCartLen(cartLength);
    };

    headerInfo()



    const fetch = async () => {

      const currentUser = JSON.parse(localStorage.getItem('user'));
      setUser(currentUser?currentUser:{uid:randomUUID()})
      if (currentUser) {
        await listenCart(currentUser.uid);

      } else {
        console.log("Couldn't fetch current user");
      }
    };

    fetch();

    const header = headerRef.current;
    let prevScrollPos = window.scrollY;

    const scrollHandler = () => {
      let currentScrollPos = window.scrollY;

      if (currentScrollPos > prevScrollPos) {
        header?.classList.add('collapse');
        header?.classList.remove('show');
      } else if (currentScrollPos < prevScrollPos) {
        header?.classList.remove('collapse');
        header?.classList.add('show');
      }

      prevScrollPos = currentScrollPos;
    };

    window.addEventListener('scroll', scrollHandler);

    return () => window.removeEventListener('scroll', scrollHandler);
  }, [auth, cart]); // cart was added later on

  useEffect(() => {

    if (cartLen > prevCartLen) {
      if (cartText.current instanceof HTMLElement) {
        cartText.current.style.color = 'rgb(0,255,0)';
        setTimeout(() => {
          cartText.current.style.color = 'rgb(83, 176, 255)';
        }, 2000);
      }
    } else if (cartLen < prevCartLen) {
      if (cartText.current instanceof HTMLElement) {
        cartText.current.style.color = 'red';
        setTimeout(() => {
          cartText.current.style.color = 'rgb(83, 176, 255)';
        }, 2000);
      }
    }

    // Update the previous cart length
    setPrevCartLen(cartLen);
  }, [cartLen]);




  const onSearch=async(e:React.FormEvent)=>{
    e.preventDefault();
    const searchInput = formRef.current as HTMLInputElement 
    const encodedSearchQuery = encodeURI(searchInput.value)
    formRef.current.value.trim() === ""?router.push('/'):router.push(`/search?q=${encodedSearchQuery}`)
  }





  return (
    <div className='h-[18vh]'>    
    
      <div ref={headerRef} style={{ 'zIndex': '10000' }} className='fixed top-0 w-[100vw] h-[12vh] bg-blue-400 text-white flex justify-between items-center border-b-8 border-blue-100 p-4 px-2 lg:px-8 lg:px-16'>

        <div className='flex items-center justify-center gap-4 h-full lg:flex'>
          <a href="/" className='flex gap-2'><img loading='lazy' src="/a1.png" alt="" className='object-cover w-[4rem] h-auto lg:w-[5rem] rounded-[50%] border-4 border-black-800' /><h1 className='hidden lg:flex items-center gap-4 font-bold lg:text-[22px] lg:text-[30px]'>
            BluE-Commerce</h1></a>
        </div>


        <div className='w-[30%] relative'>
          <form id='searchbar' onSubmit={(e)=>{}}>
            <input ref={formRef} onInput={(e)=>{onSearch(e)}} type="text" className='w-full  rounded-xl border-2 border-gray-500 text-black p-1 lg:p-4' placeholder='Search for products...'/>
            <button className='absolute transform top-[50%] right-4 translate-y-[-50%] text-[30px] text-gray-500'><FaSearch className='hidden lg:block'/></button>
          </form>
        </div>

        <a href="/cart">
          <div  ref={cartText} className='text-blue-400 cart-text flex items-center hover:brightness-125 hover:translate-y-[-3px] hover:shadow-lg transition-all relative bg-white rounded-xl font-semibold p-2 justify-center'><div className='relative'><span className='text-white text-sm lg:text-[20px] font-semibold absolute top-[40%] left-[60%] transform -translate-x-1/2 -translate-y-1/2'>{cartLen}</span><FaShoppingCart className='cart-text text-2xl lg:text-[40px]' /></div><span className='hidden lg:block'>MY CART</span></div>
        </a>
        
        <div className='flex gap-[20px] justify-between items-center'>
          <a href={auth.currentUser?`/profile/${user?.uid}`:'/login'}><div className='flex items-center justify-start gap-4 text-2xl lg:text-[40px]'><FaUser /><span className='text-[20px] hidden lg:block'>{user?.displayName}</span></div></a>
          <button className='text-2xl lg:text-[40px]' onClick={() => { setSidebar(true) }}><IoIosMenu/></button>
        </div>

      </div>

      

      <Sidebar setSidebar={setSidebar} sidebar={sidebar} />
    </div>
  )
}

export default Header