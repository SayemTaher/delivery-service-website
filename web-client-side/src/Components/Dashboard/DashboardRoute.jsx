import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProvider';
import { Helmet } from 'react-helmet-async';
import { FaHome, FaListUl, FaUserEdit, FaUsers } from 'react-icons/fa';
import { ImSpoonKnife } from 'react-icons/im';
import { GiNotebook } from 'react-icons/gi';
import { RiUserReceived2Line } from 'react-icons/ri';
import { MdPayment, MdRestaurantMenu, MdShoppingCart } from 'react-icons/md';
import { VscPreview } from 'react-icons/vsc';
import NavBar from '../Navigation/NavBar';
import Footer from '../Navigation/Footer';
import { LuBox } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { RiLogoutCircleLine } from "react-icons/ri";

const DashboardRoute = () => {
    const { user, logOut } = useContext(AuthContext);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const handleSignOut = ( ) => {
        logOut()
        .then(() => {
            toast.success('Successfully logged out')
            navigate('/')

        })
        .catch(err => {
            toast.error(err.message)
        })
    }


    useEffect(() => {
        if (user) {
            fetch(`http://localhost:3000/user/${user?.email}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    setUserRole(data.role); // Access role property from data
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching user role:', error);
                    setError(error);
                    setLoading(false);
                });
        }
    }, [user]);

    return (
        <div >
            <Helmet>
                <title>Fast Track | Dashboard</title>
            </Helmet>
            <div className="w-64 flex border-2 justify-between flex-col min-h-screen">
                <div className='bg-white rounded-xl flex flex-col items-center p-5 h-[300px] '>
                <div className="flex  items-center  border-b-2  pb-5">
                        <LuBox className="text-5xl font-bold text-orange-700"></LuBox>

                    <a className="btn btn-ghost text-lg">Fast Track <sup className="border-2 text-xs text-orange-600 flex justify-center items-center p-2 h-[20px] w-[20px] text-center  rounded-full">R</sup></a>
                    </div>
                    <div className='flex border-b-2  pb-5 flex-col gap-2 m-5 text-center items-center justify-center'>
                        <h2 className='font-bold text-xl text-blue-700'>{user?.displayName}</h2>
                        <h3 className='text-sm text-gray-500 '>{user?.email}</h3>
                        <h4 className='font-bold'>Role <sup className='uppercase font-semibold bg-green-100 text-green-500 p-1 rounded-xl'>{userRole}</sup> </h4>
                        
                    </div>
                    
                </div>
                <ul className=" menu rounded-xl p-5  justify-center gap-5">
                    {userRole === 'admin' && (
                        <>
                            <li>
                                <NavLink to="/dashboard/adminHome">
                                    <FaHome /> Admin Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/adminDeliveryMan">
                                    <ImSpoonKnife /> Delivery Riders
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/adminParcels">
                                    <FaUserEdit /> All Parcels
                                </NavLink>
                            </li>
        
                            <li>
                                <NavLink to="/dashboard/AdminAllUsers">
                                    <FaUsers /> All Users
                                </NavLink>
                            </li>
                        </>
                    )}
                    {userRole === 'delivery' && (
                        <>
                            <li>
                                <NavLink to="/dashboard/MyDelivery">
                                    <RiUserReceived2Line /> My Delivery
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/MyReviews">
                                    <VscPreview /> My Reviews
                                </NavLink>
                            </li>
                        </>
                    )}
                    {userRole === 'user' && (
                        <>
                           
                            <li>
                                <NavLink to="/dashboard/BookParcels">
                                    <MdShoppingCart /> Book a parcel
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/MyParcels">
                                    <FaListUl /> My Parcels
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/MyProfile">
                                    <MdPayment /> My Profile
                                </NavLink>
                            </li>
                        </>
                    )}

                    <div className="divider"></div>
                    <li>
                        <NavLink to="/">
                            <FaHome /> Home
                        </NavLink>
                    </li>
                   
                </ul>
                <div>
                    <div className='flex bg-white p-1 rounded-full  gap-5 justify-between items-center  mb-2'>
                        <img className='h-[50px] w-[50px] rounded-full' src={user?.photoURL} alt="" />
                       {
                        user ?  <button className='text-red-600 border-2 border-red-300 shadow-md font-bold  p-2 w-[100px] rounded-full text-center flex items-center gap-2 ' onClick={handleSignOut}><RiLogoutCircleLine></RiLogoutCircleLine> Logout</button>
                        :  <Link to='/login'><button className='text-green-600 border-2 border-green-300 shadow-md font-bold  p-2 w-[100px] rounded-full text-center flex items-center gap-2 ' ><RiLogoutCircleLine></RiLogoutCircleLine> Login</button></Link>
                       }

                    </div>
                    
                </div>
            </div>
            
           
        </div>
    );
};

export default DashboardRoute;
