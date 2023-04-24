import React, { useEffect, useState }  from "react";
import Sidebar from "../../components/nav/Sidebar";
import { useAuth } from "../../context/auth";
import axios from "axios";
import UserAdCard from "../../components/cards/UserAdCard";

const Dashboard = () => {
  //context
  const [auth, setAuth] = useAuth();
  //state
  const [ads, setAds] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const seller = auth?.user?.role?.includes("Seller"); // for validating if the user is a Seller

  useEffect(() => {
    fetchAd();
  }, [auth.token !== ""]);

  useEffect(() => {
    if(page === 1) return;
    fetchAd();
  }, [page])

  const fetchAd = async () => {
    try {
      const { data } = await axios.get(`/user-ads/${page}`);
      // console.log("🚀 ~ file: Dashboard.jsx:25 ~ fetchAd ~ data:", data);
      setAds([...ads, ...data.ads]);
      setTotal(data.total);
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

      {!seller ? (
  <div className="text-[#2B3467]">
    <h2>Hey {auth?.user.name ? auth?.user.name : auth?.user.username}, Welcome to <span className="text-[#EB455F]">Home</span>ALong<span className="text-[#BAD7E9]">.</span></h2>
  </div>
      ) : (
      <div className="container">
        <div className="text-3xl p-5 mt-12">
          <p className="text-[#2B3467]">Total <span className="text-[#EB455F]">{total}</span> ads found</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5">
        {ads?.map((ad) => (
          <div className="hoverable" key={ad._id}>
            <UserAdCard ad={ad} />
          </div>
        ))}
      </div>

      {ads.length < total ? (
        <div className="flex justify-center my-10 p-2">
          <button
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 text-white bg-[#EB455F] hover:bg-[#2B3467] rounded-md focus:outline-none focus:shadow-outline]"
            onClick={(e) => {
              e.preventDefault();
              setPage(page + 1);
            }}
            >
            {loading ? "Loading..." : `${ads?.length} / ${total} Load more`}
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
    )}
      </div>
    </div>    
  )
}


export default Dashboard;