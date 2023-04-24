import React from 'react'
import SearchForm from '../components/forms/SearchForm'
import { useSearch } from '../context/search';
import AdCard from '../components/cards/AdCard';

const Search = () => {
  //context
  const [search, setSearch] = useSearch();


  return (
    <div>
        <SearchForm />

        {search.results?.length > 0 ? (
          <>
          <div className="container">
            <div className="flex justify-center text-3xl p-5 mt-12">
              <p className="text-[#2B3467]">Found <span className="text-[#EB455F]">{search.results?.length}</span> results</p>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5">
            {search.results?.map((item) => (
              <div className="hoverable" key={item._id}>
                <AdCard ad={item} />
              </div>
            ))}

          </div>  
        </div>
          </>
          ) : (
          <>
            <div className="flex justify-center text-[#2B3467] text-sm p-3  md:text-2xl md:p-5 h-full">
              <div className="h-96 my-3 flex items-center">
                <h2>No properties found!</h2>
              </div>
            </div>
          </>
        )}
    </div>
  )
}

export default Search