import React from 'react'
import { IoBedOutline } from 'react-icons/io5';
import { BiArea } from "react-icons/bi";
import { GiHomeGarage } from "react-icons/gi";
import { TbBath } from "react-icons/tb";

const AdFeatures = ({ ad, showCarpark }) => {
  return (
    <div className='flex justify-between items-center gap-1'>
        {ad?.bedrooms ? (
        <span className='flex items-center p-2 text-[#EB455F]'>
            <IoBedOutline /> <h1 className='mx-2 text-sm text-[#2B3467]'>{ad.bedrooms}</h1>
        </span>
        ) : (
        ""
        )}
  
        {ad?.bathrooms ? (
        <span className='flex items-center p-2 text-[#EB455F]'>
            <TbBath /> <h1 className='mx-2 text-sm text-[#2B3467]'>{ad.bathrooms}</h1>
        </span>
        ) : (
        ""
        )}
        {showCarpark && ad?.carpark ? (
        <span className='flex items-center p-2 text-[#EB455F]'>
            <GiHomeGarage  /> <h1 className='mx-2 text-sm text-[#2B3467]'>{ad.carpark}  </h1>
        </span>
        ) : (
        ""
        )}
        {ad?.landsize ? (
        <span className='flex items-center p-2 text-[#EB455F]'>
            <BiArea  /> <h1 className='mx-2 text-sm text-[#2B3467]'>{ad.landsize}  </h1>
        </span>
        ) : (
        ""
        )}
    </div>
  )
}

export default AdFeatures