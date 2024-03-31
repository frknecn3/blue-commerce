import React from 'react'

const Footer = () => {
  return (
    <div style={{'zIndex':`9999999999`}} className='bottom-0 w-full p-8 text-white flex justify-between items-center h-[10vh] bg-blue-400 border-t-8 border-blue-100'>
        <div>
            <span>2024 | All rights reserved.</span>
        </div>
        <div className='flex gap-4'>
          <img src="https://images.hepsiburada.net/assets/footer/bonus-card.svg" alt="" />
          <img src="https://images.hepsiburada.net/assets/footer/maximum.svg" alt="" />
          <img src="https://images.hepsiburada.net/assets/footer/world.svg" alt="" />
          <img src="https://images.hepsiburada.net/assets/footer/ziraat.svg" alt="" />
          <img src="https://images.hepsiburada.net/assets/footer/card-finans.svg" alt="" />
          <img src="https://images.hepsiburada.net/assets/footer/axess.svg" alt="" />
        </div>
        <div>
            <span>Made by Furkan Ercan</span>
        </div>
    </div>
  )
}

export default Footer