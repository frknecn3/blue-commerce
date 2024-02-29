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
import Image from 'next/image';


const Header = () => {

  const [sidebar, setSidebar] = useState(false)
  const headerRef = useRef(null)
  const [user, setUser] = useState<{ uid: string, displayName: string }>(null)
  const cart = useSelector((store: RootState) => store.cart)
  const [cartLen, setCartLen] = useState(0)
  const [prevCartLen, setPrevCartLen] = useState(0);
  const cartText = useRef(null)
  const [searchQuery,setSearchQuery] = useState('')
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




  const onSearch=(e:React.FormEvent)=>{
    e.preventDefault();
    const encodedSearchQuery = encodeURI(searchQuery)
    router.push(`/search?q=${encodedSearchQuery}`)
  }





  return (
    <div className='h-[18vh]'>    <div ref={headerRef} style={{ 'zIndex': '10000' }} className='fixed top-0 w-full h-[20vh] bg-blue-400 text-white flex justify-between items-center border-b-8 border-blue-100 p-4 px-16'>

      <div className='flex items-center justify-center gap-4 h-full'>
        <a href="/" className='flex'><img loading='lazy' src="/a1.png" alt="" className='object-cover w-[6vw] rounded-[50%] border-4 border-black-800' /><h1 className='flex items-center gap-4 font-bold text-[40px]'>
          BluE-Commerce</h1></a>
      </div>


      <div className='w-[30%] relative'>
        <form onSubmit={onSearch}>
          <input onChange={(e)=>{setSearchQuery(e.target.value)}} type="text" className='w-full  rounded-xl border-2 border-gray-500 text-black p-4' placeholder='Search for products...'/>
          <button className='absolute transform top-[50%] right-4 translate-y-[-50%] text-[30px] text-gray-500'><FaSearch/></button>
        </form>
      </div>

      <a href="/cart">
        <div  ref={cartText} className='text-blue-400 cart-text flex items-center hover:brightness-125 hover:translate-y-[-3px] hover:shadow-lg transition-all relative bg-white rounded-xl font-semibold p-2 justify-center'><div className='relative'><span className='text-white text-[20px] font-semibold absolute top-[40%] left-[60%] transform -translate-x-1/2 -translate-y-1/2'>{cartLen}</span><FaShoppingCart className='cart-text text-[40px]' /></div>MY CART</div>
      </a>
      <div className='flex gap-[20px] justify-between items-center'>
        <a href={auth.currentUser?`/profile/${user?.uid}`:'/login'}><div className='flex items-center justify-start gap-4'><FaUser size={'30px'} /><span className='text-[20px]'>{user?.displayName}</span></div></a>
        <button className='' onClick={() => { setSidebar(true) }}><IoIosMenu size={'40px'} /></button>
      </div>

    </div>

      <Sidebar setSidebar={setSidebar} sidebar={sidebar} />
    </div>
  )
}

export default Header