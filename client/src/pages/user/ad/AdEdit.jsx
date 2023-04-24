import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import CurrencyInput from 'react-currency-input-field';
import ImageUpload from '../../../components/forms/ImageUpload';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../components/nav/Sidebar';

const AdEdit = ({action, type}) => {
    
    const [ad, setAd] = useState({
        _id: "",
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
    const [loaded, setLoaded] = useState(false);

    // hooks
    const navigate = useNavigate();
    const params = useParams();

    // context
    useEffect(() => {
        if(params?.slug) {
            // console.log(params?.slug);
            fetchAd();
        }
    }, [params?.slug]);

    const fetchAd = async () => {
        try {
            const { data } = await axios.get(`/ad/${params.slug}`);
            setAd(data.ad);
            // console.log(data.ad);
            setLoaded(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            // validation
            if(!ad.photos?.length) {
                toast.error("Photo is required");
                return;
            } else if(!ad.price) {
                toast.error("Price is required");
                return;
            } else if(!ad.description) {
                toast.error("Description is required");
                return;
            } else {
                // make API put request'
                setAd({ ...ad, loading: true });
                const { data } = await axios.put(`/ad/${ad._id}`, ad);
                console.log("Ad created response =>", data);
                if (data?.error) {
                    toast.error(data.error);
                    setAd({ ...ad, loading: false });
                } else {
                    toast.success("Ad updated successfully.");
                    setAd({ ...ad, loading: false });
                    navigate("/dashboard");
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        // console.log('handleDelete function called with event:', e);
        try {
             // make API delete request'
             setAd({ ...ad, loading: true });
             const { data } = await axios.delete(`/ad/${ad._id}`);
            //  console.log("Ad created response =>", data);
             if (data?.error) {
                 toast.error(data.error);
                 setAd({ ...ad, loading: false });
             } else {
                 toast.success("Ad deleted successfully.");
                 setAd({ ...ad, loading: false });
                 navigate("/dashboard");
             }
        } catch (error) {
            console.log(error);
        }
    }

    const GOOGLE_PLACES_KEY = import.meta.env.VITE_GOOGLE_PLACES_KEY;
  return (
    <div>
        <Sidebar />
        <div className='text-3xl text-[#EB455F] p-3 mt-16 flex justify-center'>
           <h1>{ad.title}</h1>
        </div>
        <div className='w-100 h-30 flex justify-center p-4'>
            <form className='w-full sm:w-5/6 md:w-5/6 lg:w-2/3 xl:w-11/12 p-6'>
                <div className='w-full p-3 my-3'>
                    <ImageUpload ad={ad} setAd={setAd} />
                </div>

                <div className='w-full px-3'>
                    {loaded? (<GooglePlacesAutocomplete 
                        apiKey={GOOGLE_PLACES_KEY} 
                        apiOptions="ph" 
                        selectProps={{ 
                            defaultInputValue: ad?.address,
                            placeholder: "Search for address...",
                            onChange: ({ value }) => {
                            setAd({ ...ad, address: value.description })
                            },
                        }} 
                    />) : (
                        ""
                    )}  
                </div>

                <div className='w-full px-3'>
                    {loaded ? (<CurrencyInput
                    className='w-full px-4 py-2 my-3  border rounded-md focus:outline-none'
                    placeholder='Enter price'
                    defaultValue={ad.price}
                    onValueChange={(value) => setAd({...ad, price: value})}
                    />) : (
                        ""
                    )}
                </div>

                {ad.type === "House" ? (
                    <>
                        <div className='w-full  px-3'>
                            <input
                            className='w-full px-4 py-2 my-3  border rounded-md focus:outline-none sm:text-sm md:text-lg'      
                            type="number"
                            min="0"
                            placeholder='Enter how many bedrooms'
                            value={ad.bedrooms}
                            onChange={(e) => setAd({...ad, bedrooms: e.target.value})}
                            />
                        </div>

                        <div className='w-full  px-3'>
                            <input
                            className='w-full px-4 py-2 my-3  border rounded-md focus:outline-none text-base md:text-sm'
                            type="number"
                            min="0"
                            placeholder='Enter how many bathrooms'
                            value={ad.bathrooms}
                            onChange={(e) => setAd({...ad, bathrooms: e.target.value})}
                            />
                        </div>

                        <div className='w-full  px-3'>
                            <input
                            className='w-full px-4 py-2 my-3  border rounded-md focus:outline-none'
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
                    className='w-full px-4 py-2 my-3  border rounded-md focus:outline-none'
                    type="text"
                    placeholder='Enter size of land'
                    value={ad.landsize}
                    onChange={(e) => setAd({...ad, landsize: e.target.value})}
                    />
                </div>

                <div className='w-full  px-3'>
                    <input
                    className='w-full px-4 py-2 my-3  border rounded-md focus:outline-none'
                    type="text"
                    placeholder='Enter title'
                    value={ad.title}
                    onChange={(e) => setAd({...ad, title: e.target.value})}
                    />
                </div>

                <div className='w-full px-3'>
                    <textarea
                    className='w-full px-4 py-2 my-3  border rounded-md focus:outline-none'
                    placeholder='Enter description'
                    value={ad.description}
                    onChange={(e) => setAd({...ad, description: e.target.value})}
                    />
                </div>

                <div className='w-full px-3'>
                    <button onClick={handleClick} className={`${ad.loading ? "bg-[#BAD7E9]" : "bg-[#2B3467]"} hover:bg-[#BAD7E9] text-white p-2 m-2 rounded-md`}>
                        {ad.loading ? "Loading..." : "Submit"}
                    </button>
                    <button onClick={handleDelete} className={`${ad.loading ? "bg-[#BAD7E9]" : "bg-[#EB455F]"} hover:bg-[#BAD7E9] text-white p-2 m-2 rounded-md`}>
                        {ad.loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AdEdit;