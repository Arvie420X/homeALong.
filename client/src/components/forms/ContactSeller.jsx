import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const ContactSeller = ({ ad }) => {
    // context
    const [auth, setAuth] = useAuth();
    // state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState("");

    // hooks
    const navigate = useNavigate();

    const loggedIn = auth.user !== null && auth.token !== "";

    useEffect(() => {
        if(loggedIn) {
            setName(auth.user?.name)
            setEmail(auth.user?.email)
            setPhone(auth.user?.phone)
        }
    }, [loggedIn]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/contact-seller', {
                name,
                email,
                message,
                phone,
                adId: ad._id
            });
            if(data?.error) {
                toast.error(data?.error);
                setLoading(false);
            } else {
                toast.success("Your enquiry has been sent to the seller.");
                setMessage("");
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong, try again.");
            setLoading(false);
        }
    }

  return (
    <div className='container my-7 p-2'>
        <h3 className='text-[#2B3467] text-3xl p-3'>Contact <span className='text-[#EB455F]'>{ad?.postedBy?.name ? ad?.postedBy?.name : ad?.postedBy?.username}</span></h3>

        <form onSubmit={handleSubmit}>
            <textarea 
                name="message" 
                placeholder='Write your message...'
                className={`w-full px-4 py-2 mb-4 leading-tight border rounded-md appearance-none focus:outline-none focus:shadow-outline ${!loggedIn ? 'disabled:opacity-50' : ''}`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                autoFocus={true}
                disabled={!loggedIn}
            />
            <input
                type="text"
                className={`w-full px-4 py-2 mb-4 leading-tight border rounded-md appearance-none focus:outline-none focus:shadow-outline ${!loggedIn ? 'disabled:opacity-50' : ''}`}
                placeholder='Enter your name'
                value={name}   
                onChange={(e) => setName(e.target.value)}
                disabled={!loggedIn}         
            />
            <input
                type="email"
                className={`w-full px-4 py-2 mb-4 leading-tight border rounded-md appearance-none focus:outline-none focus:shadow-outline ${!loggedIn ? 'disabled:opacity-50' : ''}`}
                placeholder='Enter your email   '
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!loggedIn}   
            />
            <input
                type="text"
                className={`w-full px-4 py-2 mb-4 leading-tight border rounded-md appearance-none focus:outline-none focus:shadow-outline ${!loggedIn ? 'disabled:opacity-50' : ''}`}
                placeholder='Enter your phone'
                value={phone}   
                onChange={(e) => setPhone(e.target.value)}
                disabled={!loggedIn}         
            />
            <div className='flex justify-start'>
                <button 
                    type='submit' 
                    className={`${loggedIn ? (!name || !email || loading ? 'disabled:opacity-50 bg-[#CCCCCC]' : 'bg-[#2B3467] hover:bg-[#EB455F]') : 'disabled:opacity-50 bg-[#2B3467] hover:bg-[#EB455F]'} w-full sm:w-auto px-4 py-2 text-white rounded-md focus:outline-none focus:shadow-outline`}
                    disabled={!name || !email || loading}>
                    {loggedIn ? loading ? "Please wait..." : "Send enquiry" : "Login to send enquiry"}
                </button>
            </div>
        </form>
    </div>
  )
}

export default ContactSeller