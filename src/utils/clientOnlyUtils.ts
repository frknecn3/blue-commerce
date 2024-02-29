'use client'

import { signOut, User } from "firebase/auth";
import { auth } from "../firebase/config";

export const getActiveUserFromStorage = ():User => {
    if (typeof window !== 'undefined') {
      // Check if the code is running in a browser environment
      return JSON.parse(localStorage.getItem('user'));
    }
  
    return null; // Return an appropriate value if not in a browser environment
  };

  export const handleLogOut = async():Promise<void> =>{
    await signOut(auth)
    localStorage.removeItem('user')
    localStorage.removeItem('cart')
    localStorage.setItem('tempCart',JSON.stringify([]))
  }

  