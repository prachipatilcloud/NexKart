import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { IoMdArrowRoundBack } from "react-icons/io";


const Search = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSearchPage, setIsSearchPage] = useState(false);
    const [isMobile] = useState();

    useEffect(() => {
        const isSearch = location.pathname === '/search';
        setIsSearchPage(isSearch);
    },[location])


    const redirectToSearchPage = (e) => {
        navigate('/search');
    }
    

  return (
    <div className='w-full min-w-[300px] lg:min-w-[500px] h-12 rounded-lg px-2 border
    flex items-center justify-between overflow-hidden shadow-md text-neutral-600 bg-slate-100 group focus-within:border-[#ffbf00]'>
        <div className='flex items-center flex-1'>
            <div>
                
                {
                    (isMobile && isSearchPage) ? (
                        <Link to={"/"} className='flex items-center justify-center h-full p-3 m-1 group-focus-within:text-color-[#ffbf00] bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 ease-in-out'> 
                            <IoMdArrowRoundBack size={22} />
                        </Link>
                    ) : (
                        <button className='flex items-center justify-center h-full p-3 group-focus-within:text-color-[#ffbf00]'>
                            <IoSearch size={22}/>
                        </button>
                    )
                }

                
            </div>

            <div className='w-full h-full'>
                {
                    !isSearchPage ? (
                        //not in search Page
                        <div className='flex-1 w-full h-full flex items-center' onClick={redirectToSearchPage} >
                            <TypeAnimation
                                sequence={[
                                    'Search "milk"',
                                    1000,
                                    'Search "bread"',
                                    1000,
                                    'Search "sugar"',
                                    1000,
                                    'Search "paneer"',
                                    1000,
                                    'Search "chocolate"',
                                    1000,
                                    'Search "curd"',
                                    1000,
                                    'Search "rice"',
                                    1000,
                                    'Search "chips"',
                                    1000
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                            />
                        </div>
                    ) : (
                        //in search page
                        <div className='w-full h-full'>
                            <input 
                                type="text"
                                placeholder='Search for atta dal and more...' 
                                autoFocus={true}
                                className='w-full h-full bg-transparent px-2 rounded-lg outline-none text-sm text-neutral-800'
                                 />
                        </div>
                        
                    )
                }
            </div>

            
        </div>
    </div>
  );
};

export default Search;