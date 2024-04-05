import React from 'react'

const Footer = () => {
  return (
    <div style={{'zIndex':`9999999999`}} className='bottom-0 w-[100vw] h-auto p-1 md:p-8 text-white flex justify-between items-center md:h-[10vh] bg-blue-400 border-t-8 border-blue-100'>
        <div className='text-[0.7rem] md:text-[1rem] p-4'>
            <p>2024 | All rights reserved.</p>
        </div>
        <div className='flex md:flex-row flex-col gap-4 text-[0.5rem] md:text-[1rem] p-4'>
          <img src="https://images.hepsiburada.net/assets/footer/bonus-card.svg" alt="" />
          <img src="https://images.hepsiburada.net/assets/footer/maximum.svg" alt="" />
          <img src="https://images.hepsiburada.net/assets/footer/world.svg" alt="" />
          <img src="https://images.hepsiburada.net/assets/footer/ziraat.svg" alt="" />
          <img src="https://images.hepsiburada.net/assets/footer/card-finans.svg" alt="" />
          <img src="https://images.hepsiburada.net/assets/footer/axess.svg" alt="" />
        </div>
        <div className='p-4'>
            <p className='text-[0.7rem] md:text-[1rem] '>Made by Furkan Ercan</p>
        </div>
    </div>
  )
}

export default Footer