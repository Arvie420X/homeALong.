import React, { useState } from 'react'
import { useSearch } from '../../context/search'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Menu, Transition } from '@headlessui/react';
import queryString from 'query-string';

import { DropdownPrices } from '../nav/Dropdown';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchForm = () => {
    // context
    const [search, setSearch] = useSearch();
    // console.log(sellPrices, rentPrices);

    // hooks
    const navigate = useNavigate();

    // state
    const [buyClicked, setBuyClicked] = useState(false);
    // console.log("🚀 ~ file: SearchForm.jsx:17 ~ SearchForm ~ buyClicked:", buyClicked)
    const [rentClicked, setRentClicked] = useState(false);
    // console.log("🚀 ~ file: SearchForm.jsx:19 ~ SearchForm ~ rentClicked:", rentClicked)

    const location = useLocation();
    const isBuy = location.pathname === '/buy';
    const isRent = location.pathname === '/rent'

    const handleSearch = async () => {
        setSearch({ ...search, loading: true });
        try {
          const { results, page, price, ...rest } = search;
          const query = queryString.stringify(rest);
          const { data } = await axios.get(`/search?${query}`);
          console.log('data you are looking for =>', data);
          if (data.length > 0) {
            setSearch((prev) => ({ ...prev, results: data, loading: false }));
            if (search?.page !== "/search") {
              navigate("/search");
            } else {
              setSearch((prev) => ({ ...prev, page: window.location.pathname }));
            }
          } else {
            console.log("No results found.");
            setSearch({ ...search, loading: false });
          }
        } catch (error) {
          console.log(error);
          setSearch({ ...search, loading: false });
        }
      };
      
      const GOOGLE_PLACES_KEY = import.meta.env.VITE_GOOGLE_PLACES_KEY;
    
  return (
    <div className='flex justify-center'>
        <div className='relative h-screen'>

        <div id='background-photo' className='flex justify-center'>
            <div className='absolute top-10 md:text-2xl text-gray-700 p-3'>
                <h1>Find the property of your dreams</h1>
            </div>

            {/* Large and Medium screen */}
            <div className='searchBar absolute md:top-6 bg-white lg:w-1/2 lg:h-32 md:w-2/3 md:h-28 mt-20 rounded-md'>

                <div className='buttonDiv flex justify-center h-10 items-center'>
                    <div className='buttonDiv2 flex justify-around w-full p-2 mt-2'>

                        {
                            <> 
                                {
                                    isBuy || isRent ? 
                                                    (
                                    <>
                                    <div className='flex justify-center w-32'>
                                        {isBuy ?
                                        <button 
                                        // onClick={() => setSearch({...search, action: "Buy", price: ""})} 
                                        className=' text-[#EB455F]'>Buy</button> 
                                        : 
                                        <button
                                        // onClick={() => setSearch({...search, action: "Buy", price: ""})} 
                                        className=' text-[#2B3467]'>Buy</button>}
                                    </div>

                                    <div className='flex justify-center w-32 text-[#2B3467]'>
                                        {isRent ?
                                        <button 
                                        // onClick={() => setSearch({...search, action: "Rent", price: ""})} 
                                        className=' text-[#EB455F]'>Rent</button> 
                                        : 
                                        <button
                                        // onClick={() => setSearch({...search, action: "Rent", price: ""})} 
                                        className=' text-[#2B3467]'>Rent</button>}
                                    </div>
                            </>
                            ) : (
                            <>
                            <div className='flex justify-center w-32'>
                                        {buyClicked ?
                                        <button 
                                        onClick={() => {
                                        setSearch({...search, action: "Buy", price: ""});
                                        setBuyClicked(true);
                                        setRentClicked(false);
                                        }
                                        } 
                                        className=' text-[#EB455F]'>Buy</button> 
                                        : 
                                        <button
                                        onClick={() => {  
                                        setSearch({...search, action: "Buy", price: ""});
                                        setBuyClicked(true);
                                        setRentClicked(false);
                                        }
                                        } 
                                        className=' text-[#2B3467]'>Buy</button>}
                                    </div>

                                    <div className='flex justify-center w-32 text-[#2B3467]'>
                                        {rentClicked ?
                                        <button 
                                        onClick={() => {  
                                        setSearch({...search, action: "Rent", price: ""});
                                        setRentClicked(true);
                                        setBuyClicked(false);
                                        }
                                        } 
                                        className=' text-[#EB455F]'>Rent</button> 
                                        : 
                                        <button
                                        onClick={() => {  
                                        setSearch({...search, action: "Rent", price: ""});
                                        setRentClicked(true);
                                        setBuyClicked(false);
                                        }
                                        } 
                                        className=' text-[#2B3467]'>Rent</button>}
                                    </div>
                            </>
                            )}  </>
                        }





                        <div className='flex justify-center w-32 text-[#2B3467]'>
                            {search.type === 'House' ?
                             <button 
                             onClick={() => setSearch({...search, type: "House", price: ""})} 
                             className=' text-[#EB455F]'>House</button> 
                             : 
                             <button
                             onClick={() => setSearch({...search, type: "House", price: ""})}
                             className=' text-[#2B3467]'>House</button>}
                        </div>

                        <div className='flex justify-center w-32 text-[#2B3467]'>
                            {search.type === 'Land' ?
                             <button 
                             onClick={() => setSearch({...search, type: "Land", price: ""})} 
                             className=' text-[#EB455F]'>Land</button> 
                             : 
                             <button
                             onClick={() => setSearch({...search, type: "Land", price: ""})}
                             className=' text-[#2B3467]'>Land</button>}
                        </div>

                    </div>
                </div>

                <div className='flex justify-center items-center'>
                    <div className='searchSelection flex justify-around w-full px-2'>

               
                        <div className='flex justify-center lg:w-32 md:w-20 sm:w-1'>
                            {(buyClicked || isBuy) && <hr className='bg-[#EB455F] w-44 h-1 flex items-start' />}
                        </div>
                        <div className='flex justify-center lg:w-32 md:w-20 sm:w-1'>
                            {(rentClicked || isRent) && <hr className='bg-[#EB455F] w-44 h-1 flex items-start' />}
                        </div>
                        <div className='flex justify-center lg:w-32 md:w-20 sm:w-1'>
                            {search.type === 'House' && <hr className='bg-[#EB455F] w-44 h-1 flex items-start' />}
                        </div>
                        <div className='flex justify-center lg:w-32 md:w-20 sm:w-1'>
                            {search.type === 'Land' && <hr className='bg-[#EB455F] w-44 h-1 flex items-start' />}
                        </div>

                    </div>
                </div>
                
                
                <div>
                    <div className=''>
                        <hr className='text-black w-full flex items-end' />
                    </div>
                </div>

                <div className='searchContainer flex justify-center lg:mt-5 md:mt-2'>
                    <div className='flex items-center'>
                        <div className='placeSearch flex justify-between items-center'>

                            <div className='googleSearch lg:w-96 lg:mr-5 md:w-64 md:mr-2'>
                                <GooglePlacesAutocomplete 
                                    apiKey={GOOGLE_PLACES_KEY} 
                                    apiOptions="ph" 
                                    selectProps={{ 
                                        defaultInputValue: search?.address,
                                        placeholder: "Search for address...",
                                        onChange: ({ value }) => {
                                        setSearch({ ...search, address: value.description })
                                        },
                                    }} 
                                />
                            </div>

                            <div className='priceSearchButton flex items-center'>
                                <button className="bg-white hover:text-[white] hover:bg-[#2B3467] rounded-full border border-gray-500 lg:py-1 lg:px-7 md:py-1 md:px-4 h-10 md:h-12 mr-2">
                                    <DropdownPrices search={search} setSearch={setSearch}/>
                                </button>
                                <button 
                                className="bg-[#EB455F] text-[white] hover:bg-[#C21010] rounded-full border lg:py-1 lg:px-4 md:py-1 md:px-4 h-10 md:h-12"
                                onClick={handleSearch}
                                >
                                    <h2 className='lg:text-lg md:text-sm sm:text-xs'>Search</h2>
                                </button>  
                            </div>
                    
                        </div>

                    
                    </div>


                </div>
                {/* <pre className='text-black'>{JSON.stringify(search, null, 4)}</pre> */}
            </div>


        </div>

        </div>
        
    </div>
  )
}

export default SearchForm