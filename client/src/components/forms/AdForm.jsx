import React, { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import CurrencyInput from 'react-currency-input-field';
import ImageUpload from './ImageUpload';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';

const AdForm = ({action, type}) => {

    // context
    const [auth, setAuth] = useAuth();
    //state
    const [ad, setAd] = useState({
        photos: [],
        uploading: false,
        price: "",
        address: "",
        bedrooms: "",
        bathrooms: "",
        carpark: "",
        landsize:"",
        title:"",
        description: "",
        loading: false,
        type,
        action,
    });

    // hooks
    const navigate = useNavigate();

    const handleClick = async (e) => {
        try {
            e.preventDefault();
            setAd({ ...ad, loading: true });
            const { data } = await axios.post("/ad", ad);
            console.log("Ad created response =>", data);
            if (data?.error) {
                toast.error(data.error);
                setAd({ ...ad, loading: false });
            } else {
                // data { user, ad } (if the context and LS is not updated the ads created will not appear)

                // update user in context
                setAuth({ ...auth, user: data.user })
                // update user in local storage
                const fromLS = JSON.parse(localStorage.getItem("auth"));
                fromLS.user = data.user;
                localStorage.setItem("auth", JSON.stringify(fromLS));

                toast.success("Ad created successfully.");
                setAd({ ...ad, loading: false });
                // navigate("/dashboard"); soft redirext and doesn't reload the page

                //reload page on redirect
                window.location.href = "/dashboard";
            }
        } catch (error) {
            console.log(error);
        }
    };

    const GOOGLE_PLACES_KEY = import.meta.env.VITE_GOOGLE_PLACES_KEY;

  return (
    <div className='w-full'>

        <div className='flex justify-center'>
        <form className='w-[75%] sm:w-1/2 md:w-3/4 lg:w-9/12 shadow-lg p-6 rounded-md'>
            <div className='w-full p-3 my-3'>
                <ImageUpload ad={ad} setAd={setAd} />
            </div>

            <div className='w-full px-3'>
                <GooglePlacesAutocomplete 
                    apiKey={GOOGLE_PLACES_KEY} 
                    apiOptions="ph" 
                    selectProps={{ 
                        defaultInputValue: ad?.address,
                        placeholder: "Search for address...",
                        onChange: ({ value }) => {
                        setAd({ ...ad, address: value.description })
                        },
                    }} 
                />  
            </div>

            <div className='w-full px-3'>
                <CurrencyInput
                className='w-full px-4 py-2 my-3  border rounded-md focus:outline-none text-xs md:text-lg'
                placeholder='Enter price'
                defaultValue={ad.price}
                        onValueChange={(value) => setAd({...ad, price: value})}
                />
            </div>

            {type === "House" ? (
                <>
                    <div className='w-full  px-3'>
                        <input
                        className='w-full px-4 py-2 my-3  border rounded-md focus:outline-none text-xs md:text-lg'      
                        type="number"
                        min="0"
                        placeholder='Enter how many bedrooms'
                        value={ad.bedrooms}
                        onChange={(e) => setAd({...ad, bedrooms: e.target.value})}
                        />
                    </div>

                    <div className='w-full  px-3'>
                        <input
                        className='w-full px-4 py-2 my-3  border rounded-md focus:outline-none text-xs md:text-lg'
                        type="number"
                        min="0"
                        placeholder='Enter how many bathrooms'
                        value={ad.bathrooms}
                        onChange={(e) => setAd({...ad, bathrooms: e.target.value})}
                        />
                    </div>

                    <div className='w-full  px-3'>
                        <input
                        className='w-full px-4 py-2 my-3  border rounded-md focus:outline-none text-xs md:text-lg'
                        type="number"
                        min="0"
                        placeholder='Enter how many carpark'
                        value={ad.carpark}
                        onChange={(e) => setAd({...ad, carpark: e.target.value})}
                        />
                    </div>
                </>
            ): (
                ""
            )}

            <div className='w-full  px-3'>
                <input
                className='w-full px-4 py-2 my-3  border rounded-md focus:outline-none text-xs md:text-lg'
                type="text"
                placeholder='Enter size of land'
                value={ad.landsize}
                onChange={(e) => setAd({...ad, landsize: e.target.value})}
                />
            </div>

            <div className='w-full  px-3'>
                <input
                className='w-full px-4 py-2 my-3  border rounded-md focus:outline-none text-xs md:text-lg'
                type="text"
                placeholder='Enter title'
                value={ad.title}
                onChange={(e) => setAd({...ad, title: e.target.value})}
                />
            </div>

            <div className='w-full px-3'>
                <textarea
                className='w-full px-4 py-2 my-3  border rounded-md focus:outline-none text-xs md:text-lg'
                placeholder='Enter description'
                value={ad.description}
                onChange={(e) => setAd({...ad, description: e.target.value})}
                />
            </div>

            <div className='w-full px-3'>
                <button onClick={handleClick} className={`${ad.loading ? "bg-[#BAD7E9]" : "bg-[#EB455F]"} hover:bg-[#BAD7E9] text-white p-2 m-2 rounded-md`}>
                    {ad.loading ? "Loading..." : "Submit"}
                </button>
            </div>
        </form>
        </div>

    </div>
    


  )
}

export default AdForm;