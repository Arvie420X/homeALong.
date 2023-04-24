import axios from "axios";
import React, { useEffect, useState }  from "react";
import UserCard from "../components/cards/UserCard";
import HouseLoader from "../components/Loader/HouseLoader";

const Agents = () => {

  // state
  const [agents, setAgents] = useState();
  const [loading, setLoading] = useState(true)

useEffect(() => {
  fetchAgents()
}, []);

const fetchAgents = async () => {
  try {
    const { data } = await axios.get("/agents");
    setAgents(data);
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

        <div className="flex justify-center">
          <div className="w-full">
            <div className="flex justify-center">
              <h1 className="text-[#EB455F] text-3xl">Agents</h1>
            </div>
            <div className="flex justify-center my-5">
              <hr className="w-72" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-5 p-5">
          {agents?.map((agent) => (
            <div className="hoverable" key={agent._id}>
              <UserCard user={agent} key={agent._id} />
            </div>
          ))}
        </div>

    </div>    
  )
}


export default Agents;