import '../../../components/css/index.css'
import { ProductParams } from '../../../constants/constants';

export const TotalComponent= ({calculateTotalCost, displayCart}:{calculateTotalCost:(a:ProductParams[])=>number,displayCart:ProductParams[]})=>{
    return (

    <div className='total-component text-center p-2'>
      <p>SELECTED PRODUCTS ({displayCart.length}) </p>
      <p className='text-[3rem]'>{calculateTotalCost(displayCart)}</p>
      <button disabled={displayCart.length>0?false:true} className='p-3 bg-blue-600 text-white rounded-xl hover:brightness-125 hover:translate-y-[-3px] transition-all'>CHECKOUT</button>
    </div>
  );
  }