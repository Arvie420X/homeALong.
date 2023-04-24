import React, { useState }  from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/nav/Sidebar";
import { useAuth } from "../../../context/auth";

const AdCreate = () => {
  // const [auth, setAuth] = useAuth();

  const [sell, setSell] = useState(false);
  const [rent, setRent] = useState(false);

  // hooks
  const navigate = useNavigate();

  const handleSell = () => {
    setSell(true);
    setRent(false);
  }
  const handleRent = () => {
    setRent(true);
    setSell(false);
  }

  const [hoveredDiv, setHoveredDiv] = useState(null);

  const handleMouseEnter = (divId) => {
    setHoveredDiv(divId);
  };

  const handleMouseLeave = () => {
    setHoveredDiv(null);
  };

  const divStyle = {
    textDecoration: 'none',
  };

  const hoveredDivStyle = {
    textDecoration: 'underline',
  };
  
  return (
    <div>
      <Sidebar />
      <div className="w-[70%]  mx-auto mt-12 mb-64">
        

        <div className="text-3xl p-5 mt-10 text-[#2B3467]">
          <h1 className="subtitle">Find your dream <span className="text-[#EB455F]">home</span>: explore endless options.</h1>
        </div>
        <div className="flex justify-start items-start">
          <div className="w-24 p-10 flex justify-center">
            <button onClick={handleSell} style={{border: sell ? '2px solid #2B3467' : ''}} className="bg-white hover:text-[white] hover:bg-[#2B3467] rounded-full border border-gray-500 px-7 py-3">
              <h2 style={{ color: sell ? '#BAD7E9' : '#EB455F'}}>Sell</h2>
            </button>
          </div>

          <div className="w-24 p-10 flex justify-center">
            <button onClick={handleRent} style={{border: rent ? '2px solid #2B3467' : ''}} className="bg-white {rent ? text-[#EB455F] : text-[#BAD7E9]} hover:text-[white] hover:bg-[#2B3467] rounded-full border border-gray-500 px-7 py-3">
              <h2 style={{ color: rent ? '#BAD7E9' : '#EB455F'}}>Rent</h2>
            </button>
          </div>
        </div>
        
        <div>
        {sell && (
              <div className="flex justify-evenly flex-col sm:flex-row sm:items-center">
                <div id="div1" onMouseEnter={() => handleMouseEnter('div1')} onMouseLeave={handleMouseLeave} onClick={() => navigate('/ad/create/sell/House')} className="bg-white rounded-lg shadow-lg p-4 pointer mx-2 my-1 sm:mx-0 sm:mr-2 md:mr-4">
                  <h1 className="text-[#2B3467] text-xl py-1">Selling Home Made Easy: Expert Guidance Every Step of the Way</h1>
                  <h1 className="subtitle text-[#BAD7E9] text-sm py-1">Our Experts Can Help You Find the Right Buyer</h1>
                  <p style={hoveredDiv === 'div1' ? hoveredDivStyle : divStyle} className="text-[#EB455F] text-base py-1 hover:underline">Proceed <ion-icon name="arrow-forward-circle-outline"></ion-icon></p>
                </div>
                <div id="div1" onMouseEnter={() => handleMouseEnter('div2')} onMouseLeave={handleMouseLeave} onClick={() => navigate('/ad/create/sell/Land')} className="bg-white rounded-lg shadow-lg p-4 pointer mx-2 my-1 sm:mx-0 sm:ml-2 md:ml-4">
                  <h1 className="text-[#2B3467] text-xl py-1">Unlock Your Property's Full Potential: Sell Your Land for the Best Price with Us</h1>
                  <h1 className="subtitle text-[#BAD7E9] text-sm py-1">Maximize Your Profits with Our Sales Services</h1>
                  <p style={hoveredDiv === 'div2' ? hoveredDivStyle : divStyle} className="text-[#EB455F] text-base py-1 hover:underline">Proceed <ion-icon name="arrow-forward-circle-outline"></ion-icon></p>
                </div>
              </div>
            )}

            {rent && (
              <div className="flex justify-evenly flex-col sm:flex-row sm:items-center">
                <div id="div1" onMouseEnter={() => handleMouseEnter('div3')} onMouseLeave={handleMouseLeave} onClick={() => navigate('/ad/create/rent/House')} className="bg-white rounded-lg shadow-lg p-4 pointer mx-2 my-1 sm:mx-0 sm:ml-2 md:ml-4">
                  <h1 className="text-[#2B3467] text-xl py-1">Maximize Your Rental Income: Rent Your House with Us</h1>
                  <h1 className="subtitle text-[#BAD7E9] text-sm py-1">Rent Your Property to Reliable Tenants Today</h1>
                  <p style={hoveredDiv === 'div3' ? hoveredDivStyle : divStyle} className="text-[#EB455F] text-base py-1 hover:underline">Proceed <ion-icon name="arrow-forward-circle-outline"></ion-icon></p>
                </div>
                <div id="div1" onMouseEnter={() => handleMouseEnter('div4')} onMouseLeave={handleMouseLeave} onClick={() => navigate('/ad/create/rent/Land')} className="bg-white rounded-lg shadow-lg p-4 pointer mx-2 my-1 sm:mx-0 sm:ml-2 md:ml-4">
                  <h1 className="text-[#2B3467] text-xl py-1">Rent Your Land with Confidence: Let Us Handle the Details</h1>
                  <h1 className="subtitle text-[#BAD7E9] text-sm py-1">Rent It Out and Earn Steady Income with Our Help</h1>
                  <p style={hoveredDiv === 'div4' ? hoveredDivStyle : divStyle} className="text-[#EB455F] text-base py-1 hover:underline">Proceed <ion-icon name="arrow-forward-circle-outline"></ion-icon></p>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>    
  )
}


export default AdCreate;