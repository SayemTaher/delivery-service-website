import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";


const NavBar = () => {
    const {user} = useContext(AuthContext)
    const navigation = <div className="flex items-center gap-2">

        <li><Link>Home</Link></li>
        <li><Link>Dashboard</Link></li>
        {
            !user && <li><Link to='/register'>Register</Link></li>
        }
        <li><Link><button className="btn btn-ghost btn-circle">
            <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
        </button></Link></li>
        

    </div >
    return (
        <div >
            <div className="navbar flex items-center justify-between  bg-base-100">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            {navigation}
                        </ul>
                    </div>
                    <a className="btn btn-ghost text-xl">Fast Track</a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {navigation}
                    </ul>
                </div>


                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full"> 
                        {
                            user? <img alt="Tailwind CSS Navbar component" src={user.photoUrl} /> 
                            : <img alt="Tailwind CSS Navbar component" src="https://i.ibb.co/nC23FQB/Screenshot-2024-04-15-at-15-53-08.png" />
                        }
                            
                        </div>
                    </div>
                    {
                        user? <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li><Link to='/dashboard'>Dashboard</Link></li>
                        <li><button>Logout</button></li>
                    </ul> : 
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    
                    
                    <li><Link to='/login'> <button>Login</button></Link></li>
                </ul>
                    }
                    
                </div>

            </div>

        </div>
    );
};

export default NavBar;