'use client'
import React, { ReactElement, useEffect, useState } from 'react'
import { getUser } from '../../utils/utils'
import { ReviewParams, User } from '../../constants/constants'
import { FaRegStar, FaStar } from 'react-icons/fa'

const Review = ({i,userRef,review}:{i:number,userRef:User|string,review:ReviewParams}) => {

    const [user,setUser] = useState<User>(new User())

    const [isClient, setIsClient] = useState(false)
 
    useEffect(() => {
      setIsClient(true)
    }, [])
    

    useEffect(()=>{

      (async()=>{
        const fetchedUser = typeof userRef==='string'?await getUser(userRef):userRef
        setUser(fetchedUser)
      })();
    },[])


  return (
    isClient?
    <div className='bg-white rounded-xl mt-1 w-full h-full'>

        <div className="flex items-center justify-end top-4 right-[30px] p-2 w-auto text-center">
        <span className="flex items-center justify-center text-[25px] text-yellow-400">{
          [...Array(5)].map((_, index) => {
            return index<(review.rating||3)?<FaStar key={index}/>:<FaRegStar key={index}/>;
          })
        }</span>
        </div>



        <div key={i} className="relative flex py-1 gap-4  items-center justify-center ">

          <div className="flex flex-col items-center justify-center mx-4 w-[6.8vw]">
              <a href={`/profile/${user?.userID}`}><img src={user?.photoURL} className="w-[6.8vw] rounded-full" alt="" /></a>
              <span className="text-[20px] font-semibold text-center">{user?.name}</span>
          </div>

          <div className="w-full">
              <p className="text-[25px] overflow-auto">{review?.text}</p>
          </div>

        </div>
    </div>
  :''
  )
}

export default Review
