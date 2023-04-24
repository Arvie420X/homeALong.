import axios from "axios";
import React, { useEffect, useState }  from "react";
import AdCard from "../components/cards/AdCard";
import { useAuth } from "../context/auth";
import SearchForm from "../components/forms/SearchForm";

const Buy = () => {
// state
const [ads, setAds] = useState([]);

useEffect(() => {
    fetchAds();
}, []);

const fetchAds = async () => {
    try {
        const { data } = await axios.get("/ads-for-sell");
        // console.log("🚀 ~ file: Buy.jsx:33 ~ fetchAds ~ data:", data);
        setAds(data);
    } catch (error) {
        console.log(error);
    }
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
          {ads?.map((ad) => (
            <div className="hoverable" key={ad._id}>
              <AdCard ad={ad} key={ad._id} />
            </div>
          ))}
        </div>

    </div>    
  )
}


export default Buy;