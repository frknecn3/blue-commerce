import { ProductParams, User } from "../constants/constants";

export const initialState:{
    cart:ProductParams[],
    user:User|{}
} = {
    cart:[],
    user:{}
}

export const generalReducer = (state:{cart:ProductParams[],user:User|{}}=initialState,action:{type:String,payload?:{user:{},cart:ProductParams[]}}) =>{
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