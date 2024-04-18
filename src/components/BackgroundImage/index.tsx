import React from 'react'
import './style.css'

type Props = {}

const BackgroundImage = (props: Props) => {
  return (
    <div className='bg-image -z-10 absolute top-0 bottom-0 left-0 right-0'>
      <div className='w-full relative h-full'>
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white opacity-0">

        </div>
      </div>
    </div>
  )
}

export default BackgroundImage