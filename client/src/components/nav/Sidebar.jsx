import React from 'react'
import { NavLink } from 'react-router-dom'


const Sidebar = () => {
  return (
    <div className='bg-[#EB455F]'>

    <div className='flex justify-center'>
        <nav className="shadow-md w-full md:w-4/6">
            <div className="flex justify-between px-4 py-2 sm:px-6 sm:py-3">
                <div className="font-bold text-white hover:text-[#BAD7E9] text-xs md:text-base">
                    <NavLink to="/dashboard">
                        Dashboard
                    </NavLink>
                </div>
                <div className="font-bold text-white hover:text-[#BAD7E9] text-xs md:text-base">
                    <NavLink to="/user/wishlist">
                        Wishlist
                    </NavLink>
                </div>
                <div className="font-bold text-white hover:text-[#BAD7E9] text-xs md:text-base">
                    <NavLink to="/user/enquiries">
                        Enquiries
                    </NavLink>
                </div>
                <div className="font-bold text-white hover:text-[#BAD7E9] text-xs md:text-base">
                    <NavLink to="/ad/create">
                        Create Ad
                    </NavLink>
                </div>
                <div className="font-bold text-white hover:text-[#BAD7E9] text-xs md:text-base">
                    <NavLink to="/user/profile">
                        Profile
                    </NavLink>
                </div>
                <div className="font-bold text-white hover:text-[#BAD7E9] text-xs md:text-base">
                    <NavLink to="/user/settings">
                        Settings
                    </NavLink>
                </div>
            </div>
        </nav>

    </div>

    </div>
   
  )
}

export default Sidebar