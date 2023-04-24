import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'antd';
import AdFeatures from './AdFeatures';
import Logo from '../../preview.png';
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import axios from 'axios';
dayjs.extend(relativeTime);

const UserCard = ({ user }) => {
    // state
    const [count, setCount] = useState();

    useEffect(() => {
        if(user?._id) fetchAdCount();
    }, [user?._id]);

const fetchAdCount = async () => {
    try {
        const { data } = await axios.get(`/agent-ad-count/${user._id}`);
        setCount(data.length)
        
    } catch (error) {
        console.log(error);
    }
}
  return (
    <Link to={`/agent/${user.username}`}>
        <div className='h-full'>
            <Badge.Ribbon text={`${count} listings`} color={`#2B3467`}>
            <div className='card h-96'>
                <div className="image-container h-56 relative">
                <img
                    className='absolute inset-0 w-full h-full object-cover'
                    src={user?.photo.Location ?? Logo} 
                    alt={user.username}
                />
                </div>
                <div className='p-5 flex flex-col gap-3'>
                {/* product price  */}
                <h2 className='product-price flex items-center text-[#EB455F]' title=''>
                    {user?.username ?? user?.name}
                </h2>
  
                {/* product adress  */}
                <div>
                    <span className='text-sm flex text-[#2B3467]'>
                        Joined {dayjs(user.createdAt).fromNow()}
                    </span>
                </div>
  
                {/* badge  */}
                

                </div>
            </div>
            </Badge.Ribbon>
        </div>
    </Link>
   
  
  )
}

export default UserCard