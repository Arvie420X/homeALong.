import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import HouseLoader from '../components/Loader/HouseLoader';

import { FaUserTie } from "react-icons/fa";
import { ImPhone } from "react-icons/im";
import { HiOutlineMail } from "react-icons/hi";
import { IoIosBusiness } from "react-icons/io";
import { GrLocation } from "react-icons/gr";
import AdCard from '../components/cards/AdCard';

const AgentView = () => {
    // state
    const [agent, setAgent] = useState(null);
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const params = useParams();
    // console.log(params.username);

    useEffect(() => {
        if(params?.username) fetchAgent();
    }, [params?.username]);

    const fetchAgent = async () => {
        try {
            const { data } = await axios.get(`/agent/${params.username}`);
            console.log('data user =>', data.user);
            console.log('data ads =>', data.ads);
            setAgent(data.user);
            setAds(data.ads);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    if (loading) {
        return (
          <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#BAD7E9] bg-opacity-75 z-50'>
            <div className='text-white text-4xl'>
              <HouseLoader className='w-20 h-20' />
            </div>
          </div>
        )
      }
      
  return (
    <div>
<div className='block md:flex justify-center items-center p-5 mt-10'>
    
    <div className='md:mr-10'>
      <img className='rounded-lg' src={agent?.photo.Location} alt={`${agent?.name}-${agent?._id}`} />
    </div>

    <div className='w-96 h-96 flex md:justify-center items-center p-5'>
      <div>
        <div className='flex justify-start items-center text-5xl my-4 py-3'><FaUserTie className='mr-5 text-[#2B3467]' /><h1 className='text-[#EB455F]'>{agent?.name ? agent?.name : agent?.username}</h1></div>
        <div className='flex justify-start items-center text-lg my-4'><HiOutlineMail className='mr-5 text-[#2B3467]' /><h1 className='text-[#BAD7E9]'>{agent?.email}</h1></div>
        <div className='flex justify-start items-center text-lg my-4'><ImPhone className='mr-5 text-[#2B3467]' /><h1 className='text-[#BAD7E9]'>{agent?.phone}</h1></div>
        <div className='flex justify-start items-center text-lg my-4'><IoIosBusiness className='mr-5 text-[#2B3467]' /><h1 className='text-[#BAD7E9]'>{agent?.company}</h1></div> 
        <div className='flex justify-start items-center text-lg my-4'><GrLocation className='mr-5 text-[#2B3467]' /><h1 className='text-[#BAD7E9]'>{agent?.address}</h1></div>
      </div>
    </div>

  </div>

      <div className='flex justify-center mt-5 mb-16'>
        <div>
          <div className='flex justify-center text-2xl mb-2 text-[#EB455F]'>
            <h1>About</h1>
          </div>
          <div className='w-44 md:w-96'>
            <hr />
          </div>
          <div className='flex justify-center mt-4 text-[#2B3467]'>
            <p>{agent?.about}</p>
          </div>
          
        </div>
      </div>

      <div className='flex justify-center mt-16'>
        <div>
          <div className='flex justify-center text-2xl mb-2 text-[#EB455F]'>
            <h1>Properties</h1>
          </div>
          <div className='w-44 md:w-96'>
            <hr />
          </div>
        </div>
      </div>

      <div className='flex justify-center mt-5'>
       
        <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-5 p-5">
            {ads?.map((item) => (
              <div className="hoverable" key={item._id}>
                <AdCard ad={item} />
              </div>
            ))}
          </div>
      </div>
      

    </div>
    
  )
}

export default AgentView