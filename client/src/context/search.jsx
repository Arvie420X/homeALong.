import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const location = useLocation();

  // Set initial state
  const [search, setSearch] = useState({
    address: "",
    action: "",
    type: "House",
    price: "",
    priceRange: [0, 1000000],
    results: [],
    page: "",
    loading: false,
  });

  // Update action value when location changes between '/' and '/rent'
  useEffect(() => {
    if(location.pathname === '/buy' || location.pathname === '/rent') {
      const newAction = location.pathname === '/buy' ? 'Buy' : 'Rent';
      setSearch((prevSearch) => ({ ...prevSearch, action: newAction }));
    }
    
  }, [location]);

  return (
    <SearchContext.Provider value={[search, setSearch]}>
      {children}
    </SearchContext.Provider>
  );
};

const useSearch = () => useContext(SearchContext);

export { useSearch, SearchProvider };
