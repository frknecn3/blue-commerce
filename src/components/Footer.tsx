import React from 'react'
import Link from 'next/link'
import { FiShoppingBag } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className='w-full bg-blue-600 text-blue-100 border-t border-blue-500 py-6'>
      <div className='max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium'>
        <div className='flex items-center gap-2'>
          <span className='grid h-6 w-6 place-items-center rounded bg-white text-blue-600 text-xs'>
            <FiShoppingBag />
          </span>
          <span className='font-bold text-white'>BluE-Commerce</span>
          <span>© 2026 | All rights reserved.</span>
        </div>

        <div className='flex items-center gap-6'>
          <Link href="/support" className='hover:text-white transition-colors'>Customer Support</Link>
          <Link href="/offers" className='hover:text-white transition-colors'>Special Offers</Link>
          <Link href="/become-seller" className='hover:text-white transition-colors'>Become a Seller</Link>
        </div>

        <div>
          <p className='text-blue-200'>Made with precision by Furkan Ercan</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer