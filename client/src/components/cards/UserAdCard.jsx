import React from 'react';
import { Link } from 'react-router-dom';
import { TbCurrencyPeso } from "react-icons/tb";
import { Badge } from 'antd';
import AdFeatures from './AdFeatures';
import { formatNumber } from '../../helpers/ad';

const UserAdCard = ({ ad }) => {

  return (
    <Link to={`/user/ad/${ad.slug}`}>
        <div className='h-full'>
            <Badge.Ribbon text={`${ad?.type} for ${ad?.action}`} color={`${ad?.action === "Sell" ? "#EB455F" : "#2B3467"}`}>
            <div className='card h-96'>
                <div className="image-container h-56 relative">
                <img
                    className='absolute inset-0 w-full h-full object-cover'
                    src={ad?.photos[0].Location} 
                    alt={`${ad?.type}-${ad?.adress}-${ad?.action}-${ad?.price}`}
                />
                </div>
                <div className='p-5 flex flex-col gap-3'>
                {/* product price  */}
                <h2 className='product-price flex items-center text-[#2B3467]' title=''>
                    <span className='text-[#EB455F]'><TbCurrencyPeso /></span> {formatNumber(ad?.price)}
                </h2>
  
                {/* product adress  */}
                <div>
                    <span className='text-sm flex text-[#2B3467]'>
                    {ad?.address}
                    </span>
                </div>
  
                {/* badge  */}
                <AdFeatures ad={ad} />

                </div>
            </div>
            </Badge.Ribbon>
        </div>
    </Link>
   
  
  )
}

export default UserAdCard