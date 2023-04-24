import React, { useState } from 'react'
import Sidebar from '../../components/nav/Sidebar'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Settings = () => {

    //state
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(password !== passwordConfirmation) {
                setLoading(false);
                toast.error("Your password and confirmation password must match!");
            } else {
                setLoading(true);
                const { data } = await axios.put('/update-password', {
                password,
                });
                if(data?.error) {
                    toast.error(data.error);
                    setLoading(false);
                } else {
                    setLoading(false);
                    toast.success("Password updated successfully.")
                }
            }
            
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

  return (
    <div>
        <Sidebar />
        <div className='container p-10 mx-auto mt-24'>
            <div className='flex justify-center'>
                <h1 className='text-[#2B3467] text-3xl'>Update <span className='text-[#EB455F]'>Password</span></h1>
            </div>
            <div className='flex justify-center mb-40'>
                <div className="w-100 h-60 flex items-center">
                    
                    <form onSubmit={handleSubmit}>
                        <input
                            type='password'
                            placeholder='Enter your password'
                            className='w-full px-4 py-2 mb-4 leading-tight border rounded-md appearance-none focus:outline-none focus:shadow-outline'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type='password'
                            placeholder='Confirm password'
                            className='w-full px-4 py-2 mb-4 leading-tight border rounded-md appearance-none focus:outline-none focus:shadow-outline'
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                        />
                       
                        <div className='flex justify-center'>
                            <button 
                                type='submit' 
                                className='w-full px-4 py-2 font-bold text-white bg-[#2B3467] rounded-md hover:bg-[#EB455F] focus:outline-none focus:shadow-outline' 
                                disabled={loading}>
                                {loading ? "Processing..." : "Update password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Settings