import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import HouseLoader from '../Loader/HouseLoader';

const RedirectRoute = () => {
    // state
    const [count, setCount] = useState(3);
    const [loading, setLoading] = useState(true);

    // hooks
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount) => --currentCount);
        }, 1000);
        // redirect once count is equal to 0
        count === 1 && (navigate('/'), setLoading(false));

        // cleanup
        return () => clearInterval(interval);
    }, [count]);

    if (loading) {
        return (
            <div className='fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-[#BAD7E9] bg-opacity-75 z-50'>
            <div className='text-white text-4xl'>
                <HouseLoader className='w-20 h-20' />
            </div>
            <div className='flex justify-center items-center text-3xl text-white mt-4'>
                <h2>Please login. Redirecting in {count} second.</h2>
            </div>
        </div>
        
        )
      }

}

export default RedirectRoute