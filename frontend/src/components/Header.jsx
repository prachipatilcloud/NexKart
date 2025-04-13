import React from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";
import { useMobile } from '../hooks/useMobile'


const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();

  const isSearchPage = location.pathname === '/search';

  return (
    <div>
      <header className='h-24 lg:h-20 sticky top-0 lg:shadow-md flex items-center flex-col justify-center gap-1 bg-white z-10'>
        {
          !(isSearchPage && isMobile) && (
            <div className='container mx-auto flex items-center px-2 justify-between'>
              {/* logo */}
              <div className='h-full'>
                <Link to={"/"} className='h-full flex justify-center items-center'>
                  <img 
                    src={logo} 
                    alt="logo"
                    width={170}
                    height={60} 
                    className='hidden lg:block'/>

                  <img 
                    src={logo} 
                    alt="logo"
                    width={170}
                    height={60} 
                    className='lg:hidden'/>
                </Link>
              </div>

              {/* search */}

              <div className='hidden lg:block'>
                <Search />
              </div>

              {/* login and my cart */}
              <div>
                <button className='text-neutral-600 lg:hidden flex items-center justify-center h-12 w-12 rounded-full hover:bg-slate-100 transition-all duration-200 ease-in-out'>
                  <FaUserCircle size={27}/>
                </button>
                <div className='hidden lg:block'>
                  login and my cart
                </div>
              </div>

            </div>
          )
        }
          
          <div className='container mx-auto flex items-center h-full px-2 justify-between lg:hidden '>
            <Search />
          </div>
      </header>
    </div>
  )
}

export default Header