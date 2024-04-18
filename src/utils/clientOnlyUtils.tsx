import { signOut, User } from "firebase/auth";
import { auth } from "../firebase/config";
import { ProductParams } from "../constants/constants";

export const getActiveUserFromStorage = ():User => {
    if (typeof window !== 'undefined') {
      // Check if the code is running in a browser environment
      const user:User = JSON.parse(localStorage.getItem('user'));
      return  user;
    }
  };

  export const handleLogOut = async():Promise<void> =>{
    await signOut(auth)
    localStorage.removeItem('user')
    localStorage.removeItem('cart')
    localStorage.setItem('tempCart',JSON.stringify([]))
  }

  export const calculateTotalCost =
  (cart: ProductParams[]):any => {
      if (cart) {
          try {
              const totalPrice =
                  cart.reduce((accumulator, item) => {
                      if (item && item.price) { return accumulator + Number(item.price); } return accumulator;
                  }, 0); return <span>${totalPrice}</span>;
          }
          catch (err) { console.log(err) }
      }
  };