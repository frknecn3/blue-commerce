import { signOut } from 'firebase/auth'
import React from 'react'
import Links from '../constants/constants'
import { auth } from '../firebase/config'
import { handleLogOut } from '../utils/clientOnlyUtils'

const Sidebar = ({setSidebar,sidebar}) => {
  return (
    <div style={{'zIndex':'10001','right':`${sidebar?'7vw':'-50vw'}`}} className={`fixed top-0 pt-[10vh] bg-blue-500 text-white inline-block w-[50vw] lg:w-[15vw] h-[100vh] overflow-clip transition-all p-4`} >
        <button className='mb-[3vh] rounded-[50%] bg-red-700 w-[3rem] h-[3rem] font-bold text-[30px]' onClick={()=>setSidebar(false)}>X</button>
            <ul className='flex gap-6 flex-col'>
                {Links.map((link,i)=>(<li key={i}><a className='flex justify-start items-center uppercase border-b-[3px] border-blue-900 hover:border-b-[5px] text-[23px] hover:border-white hover:text-shadow-white transition-all font-semibold' href={link.href}>{link.logo}{link.name}</a></li>))}
                <li><a href='/'><button onClick={()=>{handleLogOut()}} className='flex justify-start items-center uppercase border-b-[3px] border-blue-900 hover:border-b-[5px] text-[23px] hover:border-white hover:text-shadow-white transition-all font-semibold'>LOG OUT</button></a></li>
            </ul>
        </div>
  )
}

export default Sidebar