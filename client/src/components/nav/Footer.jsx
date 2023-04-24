import React from 'react'

const Footer = () => {
  return (
    <div className='bg-[#2B3467] text-white p-4 mt-10 text-center'>
      <div className='container mx-auto'>
        <h4 className='text-xl mb-2 text-[#FCFFE7]'>Buy, Sell or Rent Properties</h4>
        <p>
          &copy; {new Date().getFullYear()} <span className='text-[#EB455F]'>home</span>Along<span className='text-[#BAD7E9]'>.</span> - All rights reserved
        </p>
      </div>
    </div>
  )
}

export default Footer