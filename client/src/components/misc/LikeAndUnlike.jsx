import React from 'react'
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { useAuth } from "../../context/auth.jsx"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const LikeAndUnlike = ({ ad }) => {

    // context
    const [auth, setAuth] = useAuth();
    // hooks
    const navigate = useNavigate();

    const handleLike = async () => {
        try {
            if(auth?.user === null) {
                navigate('/login', {
                    state: `/ad/${ad.slug}`, // to render the user to the intended page
                });
                return;
            }
            const { data } = await axios.post('/wishlist', { adId: ad._id });
            // console.log("🚀 ~ file: LikeAndUnlike.jsx:22 ~ handleLike ~ data:", data)
            setAuth({ ...auth, user: data });
            const fromLS = JSON.parse(localStorage.getItem("auth"));
            fromLS.user = data;
            localStorage.setItem('auth', JSON.stringify(fromLS));
            toast.success('Added to your wishlist');
        } catch (error) {
            console.log(error);
        }
    }

    const handleUnlike = async () => {
        try {
            if(auth?.user === null) {
                navigate('/login', {
                    state: `/ad/${ad.slug}`, // to render the user to the intended page
                });
                return;
            }
            const { data } = await axios.delete(`/wishlist/${ad._id}`);
            // console.log("🚀 ~ file: LikeAndUnlike.jsx:41 ~ handleUnlike ~ data:", data)
            setAuth({ ...auth, user: data });
            const fromLS = JSON.parse(localStorage.getItem("auth"));
            fromLS.user = data;
            localStorage.setItem('auth', JSON.stringify(fromLS));
            toast.success('Remove from wishlist');
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div>
        {auth?.user?.wishlist?.includes(ad?._id) ? (
            <span>
                <IoMdHeart onClick={() => handleUnlike(ad)} className='pointer text-4xl text-[#EB455F]' />
            </span>
        ) : (
            <span>
                <IoMdHeartEmpty onClick={() => handleLike(ad)} className='pointer text-4xl text-[#EB455F] opacity-50' />
            </span>
        )} 
    </div>
  )
}

export default LikeAndUnlike