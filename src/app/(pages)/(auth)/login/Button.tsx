'use client'
import React from 'react'
import { auth, provider } from '../../../../firebase/config'
import { checkUser, getCart,} from '../../../../utils/utils'
import { signInWithPopup } from 'firebase/auth'
import Image from 'next/image'

const Button = () => {

    const {useRouter} = require('next/navigation')
    const router = useRouter()  
   
     const handleGoogle = () =>{
       signInWithPopup(auth,provider)
       .then(async()=>{router.push('/');checkUser((auth.currentUser));localStorage.setItem('user',JSON.stringify(auth.currentUser));localStorage.setItem('cart',JSON.stringify(await getCart(auth.currentUser.uid)));await getCart(auth.currentUser.uid)})
       .catch((err)=>console.log(err))}



  return (
    <button onClick={handleGoogle} className='flex justify-center items-center bg-black text-white font-semibold text-[20px] p-[10px] rounded-xl border-[5px] transition-all border-transparent hover:border-blue-500 focus:border-black focus:bg-white focus:text-black'>
          <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" width={50} alt="" />
          <span>Log in using Google</span>
        </button>
  )
}

export default Button