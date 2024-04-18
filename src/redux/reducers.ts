import { ProductParams, User } from "../constants/constants";

export const initialStateGeneralReducer:{
    cart:ProductParams[],
    user:User|{}
} = {
    cart:[],
    user:{}
}

export const generalReducer = (state:{cart:ProductParams[],user:User|{}}=initialStateGeneralReducer,action:{type:String,payload?:{user:{},cart:ProductParams[]}}) =>{
    switch (action.type){
        case 'UPDATE_USER':
            const updatedDoc = {...state,cart:action.payload.cart,user:action.payload.user}
            console.log(updatedDoc)
            return updatedDoc;
        case 'DELETE':
            console.log(state)
            return state;
        case 'ADD':
            console.log(state)
            return state;
        default:
            return state
    }
}

const initialCartDisplayReducer: { cartDisplay: boolean } = { cartDisplay: false };

export const cartDisplayReducer = (
  state: { cartDisplay: boolean } = initialCartDisplayReducer,
  action: { type: string }
) => {
  switch (action.type) {
    case "OPEN_CART_MODAL":
      return { ...state, cartDisplay: true };
    case "CLOSE_CART_MODAL":
      return { ...state, cartDisplay: false };
    default:
      return state;
  }
};