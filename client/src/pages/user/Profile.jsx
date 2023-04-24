import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/nav/Sidebar'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom';
import slugify from 'slugify';
import ProfileUpload from '../../components/forms/ProfileUpload';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
    // context
    const [auth, setAuth] = useAuth();
    //state
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [about, setAbout] = useState("");
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [uploading, setUploading] = useState(false);

    // hook
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.user) {
            setUsername(auth.user?.username);
            setName(auth.user?.name);
            setEmail(auth.user?.email);
            setCompany(auth.user?.company);
            setAddress(auth.user?.address);
            setPhone(auth.user?.phone);
            setAbout(auth.user?.about);
            setPhoto(auth.user?.photo);
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.put('/update-profile', {
                username,
                name,
                email,
                company,
                address,
                phone,
                about,
                photo,
            });
            if(data?.error) {
                toast.error(data.error);
            } else {
                // console.log("update profile response =>", data);
                setAuth({...auth, user: data});

                let fromLS = JSON.parse(localStorage.getItem("auth"));
                fromLS.user = data;
                localStorage.setItem("auth", JSON.stringify(fromLS));
                setLoading(false);
                toast.success("Profile updated successfully.")
            }
            // console.log(
            //     {
            //         username,
            //         name,
            //         email,
            //         company,
            //         address,
            //         phone,
            //         about,
            //         photo,
            //     });
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div>
        <Sidebar />
        <div className='container p-10 mx-auto mb-36'>
            <div className='flex justify-center'>
                <div className="w-100 h-30">

                    <ProfileUpload photo={photo} setPhoto={setPhoto} uploading={uploading} setUploading={setUploading} />

                    <form onSubmit={handleSubmit}>
                        <input
                            type='text'
                            placeholder='Update your username'
                            className='w-full px-4 py-2 mb-4 leading-tight border rounded-md appearance-none focus:outline-none focus:shadow-outline'
                            value={username}
                            onChange={(e) => setUsername(slugify(e.target.value.toLowerCase()))}
                        />
                        <input
                            type='text'
                            placeholder='Enter your name'
                            className='w-full px-4 py-2 mb-4 leading-tight border rounded-md appearance-none focus:outline-none focus:shadow-outline'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type='email'
                            className='w-full px-4 py-2 mb-4 leading-tight border rounded-md appearance-none focus:outline-none focus:shadow-outline disabled:opacity-50'
                            value={email}
                            disabled={true}
                        />
                        <input
                            type='text'
                            placeholder='Enter your company name'
                            className='w-full px-4 py-2 mb-4 leading-tight border rounded-md appearance-none focus:outline-none focus:shadow-outline'
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                        />
                        <input
                            type='text'
                            placeholder='Enter your address'
                            className='w-full px-4 py-2 mb-4 leading-tight border rounded-md appearance-none focus:outline-none focus:shadow-outline'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <input
                            type='text'
                            placeholder='Enter your phone number'
                            className='w-full px-4 py-2 mb-4 leading-tight border rounded-md appearance-none focus:outline-none focus:shadow-outline'
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <textarea
                            placeholder='Write something interesting about yourself...'
                            className='w-full px-4 py-2 mb-4 leading-tight border rounded-md appearance-none focus:outline-none focus:shadow-outline'
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            maxLength={200}
                        />
                        <div className='flex justify-center mt-5'>
                            <button 
                                type='submit' 
                                className='w-3/6 px-4 py-2 font-bold text-white bg-[#2B3467] rounded-md hover:bg-[#EB455F] focus:outline-none focus:shadow-outline' 
                                disabled={loading}>
                                {loading ? "Processing..." : "Update profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile