import { Fragment, useEffect, useRef, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { NavLink, useNavigate } from 'react-router-dom'

import { IoIosArrowDropdown } from "react-icons/io";
import { IoCreate } from "react-icons/io5";
import { TbChecklist } from "react-icons/tb";
import { GrInfo } from "react-icons/gr";
import { BsPersonSquare } from "react-icons/bs";
import { RiSettings4Fill } from "react-icons/ri";

import { sellPrices, rentPrices } from '../../helpers/priceList.jsx';

import { useAuth } from "../../context/auth";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function DropdownUser() {

  // context
  const [auth, setAuth] = useAuth();

  // hooks
  const navigate = useNavigate();

  const logout = () => {
    setAuth({ user: null, token: "", refreshToken: ""});
    localStorage.removeItem("auth");
    navigate("/login")
  };


  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#2B3467] shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {auth?.user?.name ? auth.user.name : auth.user.username}
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <NavLink
                  href=""
                  to="/dashboard"
                  className={classNames(
                    active ? 'bg-gray-100 text-[#EB455F]' : 'text-[#2B3467]',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  <ion-icon name="analytics-outline"></ion-icon><span className='ml-2'>Dashboard</span>
                </NavLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NavLink
                  href=""
                  to="/user/wishlist"
                  className={classNames(
                    active ? 'bg-gray-100 text-[#EB455F]' : 'text-[#2B3467]',
                    'px-4 py-2 text-sm flex'
                  )}
                >
                  <TbChecklist /> <span className='ml-2'>Wishlist</span>
                </NavLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NavLink
                  href=""
                  to="/user/enquiries"
                  className={classNames(
                    active ? 'bg-gray-100 text-[#EB455F]' : 'text-[#2B3467]',
                    'px-4 py-2 text-sm flex'
                  )}
                >
                  <GrInfo /> <span className='ml-2'>Enquiries</span>
                </NavLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NavLink
                  href=""
                  to="/ad/create"
                  className={classNames(
                    active ? 'bg-gray-100 text-[#EB455F]' : 'text-[#2B3467]',
                    'px-4 py-2 text-sm flex'
                  )}
                >
                  <IoCreate /> <span className='ml-2'>Create Ad</span>
                </NavLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NavLink
                  href=""
                  to="user/profile"
                  className={classNames(
                    active ? 'bg-gray-100 text-[#EB455F]' : 'text-[#2B3467]',
                    'px-4 py-2 text-sm flex'
                  )}
                >
                  <BsPersonSquare /> <span className='ml-2'>Profile</span>
                </NavLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NavLink
                  href=""
                  to="/user/settings"
                  className={classNames(
                    active ? 'bg-gray-100 text-[#EB455F]' : 'text-[#2B3467]',
                    'px-4 py-2 text-sm flex'
                  )}
                >
                  <RiSettings4Fill /> <span className='ml-2'>Settings</span>
                </NavLink>
              )}
            </Menu.Item>
            <form method="POST" action="#">
              <Menu.Item>
                {({ active }) => (
                  <a onClick={logout}
                    className={classNames(
                      active ? 'bg-gray-100 text-[#EB455F]' : 'text-[#2B3467]',
                      'block w-full px-4 py-2 text-left text-sm'
                    )} href=""><ion-icon name="log-out-outline"></ion-icon><span className='ml-2'>Sign out</span></a>
                )}
              </Menu.Item>
            </form>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

// Left
export function DropdownMenu() {

  const [open, setOpen] = useState(false);

  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if(!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return() =>{
      document.removeEventListener("mousedown", handler);
    }
  })

    return (
      <div className='block lg:hidden'>
        <div className='menu-container' ref={menuRef}>
          <div className='menu-trigger text-[#2B3467]' onClick={()=>{setOpen(!open)}}>
            {
              !open ?
              <ion-icon name='apps' className="text-3xl cursor-pointer"></ion-icon>
              :
              <ion-icon name='close' className="text-3xl cursor-pointer"></ion-icon>
            }
            
          </div>
          
          <div className={`dropdown-menu ${open? 'active' : 'inactive'} md:absolute md:right-0 md:w-48 lg:w-56 shadow-lg`}>
            <ul>
              <DropdownItem isPrices={true}/>
            </ul>
          </div>

        </div>
      </div>
    )
}

function DropdownItem({ isPrices, search, setSearch }){
    
  return(
    <li className = 'dropdownItem'>
       {/* <ion-icon name={props.name} className="text-3xl cursor-pointer" />
      <a> {props.text} </a> */}
      <Menu>
        <Menu.Item>
 
            {isPrices ? (
              <>
              <NavLink
                to="/buy"
                href=""
                className='block px-4 py-2 text-sm text-[#2B3467] hover:text-[#EB455F]'
              >
                Buy
              </NavLink>
              <NavLink
                to="/rent"
                href=""
                className='block px-4 py-2 text-sm text-[#2B3467] hover:text-[#EB455F]'
              >
                Rent
              </NavLink>
              <NavLink
                to="/ad/create"
                href=""
                className='block px-4 py-2 text-sm text-[#2B3467] hover:text-[#EB455F]'
              >
                Post Ad
              </NavLink>
              <NavLink
                to="/agents"
                href=""
                className='block px-4 py-2 text-sm text-[#2B3467] hover:text-[#EB455F]'
              >
                Agents
              </NavLink>
              </>
            ) : (
              <ul className='block px-4 py-2 text-sm text-[#2B3467]'>
                {search.action === "Buy" ? (
                  <>
                  {sellPrices.map((item) => (
                    <li key={item._id}>
                      <NavLink
                        to={item.link}
                        className={`block py-1 hover:text-[#EB455F] ${
                                    search.price === item.name ? 'text-[#EB455F]' : 'text-[#2B3467]'
                                  }`}
                        activeclassname='text-[#EB455F]'
                      >
                        <a onClick={() => {
                          setSearch({ ...search, price: item.name, priceRange: item.array})
                        }}
                        
                        >{item.name}</a>
                      </NavLink>
                    </li>
                  ))}
                  </>
                ) : (
                  <>
                  {rentPrices.map((item) => (
                    <li key={item._id}>
                      <NavLink
                        to={item.link}
                        className={`block py-1 hover:text-[#EB455F] ${
                                    search.price === item.name ? 'text-[#EB455F]' : 'text-[#2B3467]'
                                  }`}
                        activeclassname='text-[#EB455F]'
                      >
                        <a onClick={() => {
                          setSearch({ ...search, price: item.name, priceRange: item.array})
                        }}>{item.name}</a>
                      </NavLink>
                    </li>
                  ))}
                  </>
                )}
              </ul>

            )}
            
      
        </Menu.Item>
      </Menu>
      
    </li>
  );
}

// Prices
export function DropdownPrices({ search, setSearch }) {

  const [open, setOpen] = useState(false);

  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if(!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return() =>{
      document.removeEventListener("mousedown", handler);
    }
  })

  return (
    <div className='block z-10 '>
      <div className='menu-container' ref={menuRef}>
        <div className='menu-trigger flex justify-center items-center gap-1' onClick={()=>{setOpen(!open)}}>
        <h1>Prices</h1> <IoIosArrowDropdown />
        </div>
        
        <div className={`dropdown-menu ${open? 'active' : 'inactive'} md:absolute md:right-0 md:w-48 lg:w-56 shadow-lg mt-4 mr-10`}>
          <ul>
            {/* <DropdownItem name='close' text='cooking'/>
            <DropdownItem name='apps' text='eat'/> */}
            <DropdownItem isPrices={false} search={search} setSearch={setSearch} />
          </ul>
        </div>
  
      </div>
    </div>
  )
  
}