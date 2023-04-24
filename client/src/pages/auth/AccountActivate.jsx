import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import { useAuth } from "../../context/auth";


const AccountActivate = () => {

  // context
  const [auth, setAuth] = useAuth();

  // hooks
  const  decodedToken  = useParams();
  const base64token = decodedToken.token
  const token = decodeURIComponent(
    atob(base64token.replace(/-/g, '+').replace(/_/g, '/'))
      .split('')
      .map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  // console.log(token);

  const navigate = useNavigate();

  useEffect(() => {
    if(token) requestActivation();
  }, [token]);

  const requestActivation = async() => {
    try {
      const { data } = await axios.post('/register', { token });
      if(data?.error) {
        toast.error(data.error);
      } else {
        // save in local storage
        localStorage.setItem("auth", JSON.stringify(data));
        // save in context
        setAuth(data);

        toast.success("Successfully logged in. Welcome to homeAlong!");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Try again.")
    }
  }

    return (
        <div className="flex justify-center h-screen">
        <div className="self-center text-3xl text-[#2B3467]">Please <span className="text-[#EB455F]">wait</span>...</div>
      </div>
    )
};

export default AccountActivate;