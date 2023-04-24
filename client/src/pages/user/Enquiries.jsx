import React, { useEffect, useState }  from "react";
import Sidebar from "../../components/nav/Sidebar";
import { useAuth } from "../../context/auth";
import axios from "axios";
import AdCard from "../../components/cards/AdCard";
import { useLocation } from "react-router-dom";

const Enquiries = () => {
  //context
const [auth, setAuth] = useAuth();
  //state
const [ads, setAds] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
const [loading, setLoading] = useState(false);

// hooks
const location = useLocation();

  useEffect(() => {
    fetchAd();
  }, [auth.token !== ""]);

// the loading more ads is optional
//   useEffect(() => {
//     if(page === 1) return;
//     fetchAd();
//   }, [page])

  const fetchAd = async () => {
    try {
      const { data } = await axios.get(`/enquiries`);
      setAds(data);
    } catch (error) {
      console.log(error);
    }
  }
  // const loadMore = async() => {
  //   try {
  //     setLoading(true);
  //     const { data } = await axios.get(`/user-ads/${page}`);
  //     setAds([...ads, ...data.ads]);
  //     setTotal(data.total)
  //     setLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // }

  return (
    <div>
      <Sidebar />
      <div className="flex justify-center">
      
        {!ads?.length ? (
          <div className="text-[#2B3467] text-sm p-3  md:text-2xl md:p-5 h-full">
              <div className="h-96 my-10 flex items-center">
                <h2>Hey <span className="text-[#EB455F]">{auth?.user.name ? auth?.user.name : auth?.user.username}</span>, You have not enquired any properties yet!</h2>
              </div>
            </div>
        ) : (
        <div className="container">
            <div className="text-3xl p-5 mt-12">
              <p className="text-[#2B3467]">You have enquired <span className="text-[#EB455F]">{ads.length}</span> properties.</p>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5">
            {ads?.map((ad) => (
              <div className="hoverable" key={ad._id}>
                <AdCard ad={ad} />
              </div>
            ))}

          </div>  
        </div>
        )}
      </div>
    </div>    
  )
}


export default Enquiries;