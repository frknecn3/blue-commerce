import React from 'react'
import Button from './Button'



const login = () => {


  return (
    <div className='flex justify-center items-center w-full box-border'>
      <div className='border-2 border-neutral-500 rounded-xl p-4 flex gap-3 flex-col justify-center items-center'>
        <h1>Already a Member?</h1>

        <div>
          Email Login is Currently Not Available
        </div>

        <Button />
      </div>
    </div>
  )
}

export default login