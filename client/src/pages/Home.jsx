import axios from "axios";
import React, { useEffect, useState }  from "react";
import AdCard from "../components/cards/AdCard";
import { useAuth } from "../context/auth";
import SearchForm from "../components/forms/SearchForm";
import HouseLoader from "../components/Loader/HouseLoader";

const Home = () => {
  // context
  const [auth, setAuth] = useAuth();
  // state
  const [adsForSell, setAdsForSell] = useState();
  const [adsForRent, setAdsForRent] = useState();
  const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchAds()
}, []);

const fetchAds = async () => {
  try {
    const { data } = await axios.get("/ads");
    setAdsForSell(data.adsForSell);
    setAdsForRent(data.adsForRent);
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
      <SearchForm />
      
      <div className="flex justify-center">
          <div className="w-full">
            <div className="flex justify-center">
              <h1 className="text-[#2B3467] text-3xl">For <span className="text-[#EB455F]">Sell</span></h1>
            </div>
            <div className="flex justify-center my-5">
              <hr className="w-72" />
            </div>
          </div>
        </div>

      {/* <pre>{JSON.stringify({adsForSell,adsForRent}, null, 4)}</pre> */}
        <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-5 p-5">
          {adsForSell?.map((ad) => (
            <div className="hoverable" key={ad._id}>
              <AdCard ad={ad} key={ad._id} />
            </div>
          ))}
        </div>

      
      <div className="flex justify-center mt-24">
          <div className="w-full">
            <div className="flex justify-center">
              <h1 className="text-[#2B3467] text-3xl">For <span className="text-[#EB455F]">Rent</span></h1>
            </div>
            <div className="flex justify-center my-5">
              <hr className="w-72" />
            </div>
          </div>
        </div>

      {/* <pre>{JSON.stringify({adsForSell,adsForRent}, null, 4)}</pre> */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5">
          {adsForRent?.map((ad) => (
            <div className="h-auto hoverable" key={ad._id}>
              <AdCard ad={ad} key={ad._id} />
            </div>
          ))}
        </div>
      </div>

    </div>    
  )
}


export default Home;