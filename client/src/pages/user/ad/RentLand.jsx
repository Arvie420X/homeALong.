import React from 'react'
import AdForm from '../../../components/forms/AdForm'
import Sidebar from '../../../components/nav/Sidebar'

const RentLand = () => {
  return (
    <div>
        <Sidebar />
        <div className='flex justify-center'>
        <div className='mt-14 text-4xl text-[#2B3467]'>
          <h1>Rent <span className='text-[#EB455F]'>Land</span></h1>
        </div>
        </div>
        <AdForm action="Rent" type="Land" />
    </div>
  )
}

export default RentLand;