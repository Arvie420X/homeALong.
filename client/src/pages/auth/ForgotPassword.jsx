import React, { useState } from 'react';
import axios from "axios";
// import { API } from '../config';
import toast from "react-hot-toast";
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  
  // hooks
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.table({email, password});
      setLoading(true);
      const { data } = await axios.post(`/forgot-password`, { email }); //configure the url globally instead of using this `${API}/pre-register`
      console.log(data);
      if(data?.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        toast.success('Please check your email for your password reset link.');
        setLoading(false);
        navigate('/')
      }
    } catch (error) {
      toast.error('Something went wrong. Try again.');
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-20 w-full">
        <div className="flex justify-center">
            <div className="w-100 h-30">
                <div className='py-3 text-2xl text-[#BAD7E9]'>Forgot Password</div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 mb-4 leading-tight border rounded-md appearance-none focus:outline-none focus:shadow-outline"
                        required
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button disabled={loading} className="w-full px-4 py-2 font-bold text-white bg-[#2B3467] rounded-md hover:bg-[#EB455F] focus:outline-none focus:shadow-outline">{loading ? "Waiting..." : "Submit"}</button>
                </form>
                <div className='text-[#EB455F] hover:text-[#BAD7E9] py-3'>
                <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    </div>
  
  )
}

export default ForgotPassword;