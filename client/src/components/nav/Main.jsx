import { NavLink, useNavigate } from "react-router-dom";
import { TbHomeSearch } from "react-icons/tb";

import {DropdownMenu, DropdownUser} from "./Dropdown";
import { useAuth } from "../../context/auth";

const Main = () => {

    // context
    const [auth, setAuth] = useAuth();
    // rendering the user dropdown or the signin & join button
    const loggedIn = auth.user !== null && auth.token !== "" & auth.refreshToken !== "";

    // hooks
    const navigate = useNavigate();

    const handlePostCLick = () => {
        if (loggedIn) {
            navigate("ad/create");
        } else {
            navigate("/login");
        }
    };

    return (
       <header className="bg-white">
            <nav className="p-3 my-5">
                <div className="flex justify-between items-center w-[75%]  mx-auto">
                    <div className="flex justify-start items-center sm:w-1/2 md:w-1/4 lg:w-1/5">
                        {loggedIn ? (
                        <div className="w-1/12 md:w-1/6 mr-4 sm:mr-8 z-10 bg-white">
                            <DropdownMenu />
                        </div>
                        ) : (
                        ""
                        )} 
                        <NavLink to="/">
                            <div className="flex justify-start items-center gap-4">
                                <h1 className="text-xl md:text-3xl font-bold text-[#2B3467]"><span className="font-bold text-[#EB455F]">home</span>Along<span className="text-[#BAD7E9]">.</span></h1>
                            </div>
                        </NavLink>
                    </div>
                        <div className="sm:block md:hidden lg:block nav-links duration-500 md:static absolute bg-white md:min-h-fit min-h-[60vh] left-0 top-[-100%] md:w-auto  w-full flex items-center px-5">
                            <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8">
                                <li>
                                    <NavLink className="text-[#2B3467] hover:text-[#EB455F] text-3xl" to="/search"><TbHomeSearch /></NavLink>
                                </li>
                                <li>
                                    <NavLink className="text-[#2B3467] hover:text-[#EB455F]" to="/buy">Buy</NavLink>
                                </li>
                                <li>
                                    <NavLink className="text-[#2B3467] hover:text-[#EB455F]" to="/rent">Rent</NavLink>
                                </li>
                                <li>
                                    <a onClick={handlePostCLick} className="pointer text-[#2B3467] hover:text-[#EB455F]">Post ad</a>
                                </li>
                                <li>
                                    <NavLink className="text-[#2B3467] hover:text-[#EB455F]" to="/agents">Agents</NavLink>
                                </li>
                            </ul>
                        </div>
                    
                    <div className="flex items-center gap-3">
                    {loggedIn ? (
                        <DropdownUser />
                        ) : (
                        ""
                    )}
                    {!loggedIn ? (
                    <>    
                        <button className="bg-white text-[#2B3467] px-2 py-1 rounded-md hover:bg-[#EFEFEF]">
                            <NavLink className="hover:text-gray-500" to="/login">Sign in</NavLink>
                        </button>
                        <button className="hidden md:block bg-[#EB455F] text-[white] px-5 py-2 rounded-md hover:bg-[#BAD7E9]">
                            <NavLink className="hover:text-gray-500" to="/register">Join</NavLink>
                        </button>
                    </>
                    ) : (
                        ""
                    )}    
                    </div>
                    {!loggedIn ? (
                        <>
                            {window.location.pathname !== '/register' ? (
                                <div className="sm: block md:hidden lg:hidden fixed bottom-0 left-0 right-0 py-4 px-10 z-10">
                                    <NavLink className="hover:text-gray-500" to="/register">
                                        <button className="w-full mx-auto bg-[#EB455F] hover:bg-[#BAD7E9] text-white font-bold py-2 px-4 rounded">
                                            Join
                                        </button>
                                    </NavLink>
                                </div>
                                ) : (
                                ""
                            )}
                        </>
                    ) : (
                        ""
                    )} 
                </div>
            </nav>
        </header>

    )
}

export default Main;