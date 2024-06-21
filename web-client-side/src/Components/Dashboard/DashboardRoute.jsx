import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProvider';
import { Helmet } from 'react-helmet-async';
import { FaHome, FaListUl, FaUserEdit, FaUsers } from 'react-icons/fa';
import { ImSpoonKnife } from 'react-icons/im';
import { RiUserReceived2Line, RiLogoutCircleLine } from 'react-icons/ri';
import { MdPayment, MdShoppingCart } from 'react-icons/md';
import { VscPreview } from 'react-icons/vsc';
import { LuBox } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { FaUser } from "react-icons/fa";

const DashboardRoute = () => {
    const { user, role, logOut, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignOut = () => {
        logOut()
            .then(() => {
                toast.success('Successfully logged out');
                navigate('/');
            })
            .catch(err => {
                toast.error(err.message);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Helmet>
                <title>Fast Track | Dashboard</title>
            </Helmet>
            <div className="flex flex-col lg:flex-row lg:min-h-screen bg-gray-100">
                <div className="w-full lg:w-64 bg-white shadow-lg p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <LuBox className="text-5xl font-bold text-orange-700" />
                            <span className="text-lg font-bold">Fast Track <sup className="border-2 text-xs text-orange-600 p-1 rounded-full">R</sup></span>
                        </div>
                        <div className="text-center bg-gray-100 p-2 mb-5">
                            <img className="w-24 h-24 object-cover rounded-full mx-auto mb-2" src={user?.photoURL} alt="User" />
                            <h2 className="text-xl font-bold text-blue-700">{user?.displayName}</h2>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                            <p className="font-bold mt-2">Role: <span className="uppercase font-semibold bg-green-100 text-green-500 p-1 rounded-xl">{role}</span></p>
                        </div>
                        <ul className="space-y-4">
                            {role === 'admin' && (
                                <>
                                    <li>
                                        <NavLink to="/dashboard/adminHome" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200">
                                            <FaHome /> Admin Home
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/adminDeliveryMan" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200">
                                            <ImSpoonKnife /> Delivery Riders
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/adminParcels" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200">
                                            <FaUserEdit /> All Parcels
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/AdminAllUsers" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200">
                                            <FaUsers /> All Users
                                        </NavLink>
                                    </li>
                                </>
                            )}
                            {role === 'delivery' && (
                                <>
                                    <li>
                                        <NavLink to="/dashboard/MyDelivery" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200">
                                            <RiUserReceived2Line /> My Delivery
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/MyReviews" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200">
                                            <VscPreview /> My Reviews
                                        </NavLink>
                                    </li>
                                </>
                            )}
                            {role === 'user' && (
                                <>
                                    <li>
                                        <NavLink to="/dashboard/BookParcels" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200">
                                            <MdShoppingCart /> Book a Parcel
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/MyParcels" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200">
                                            <FaListUl /> My Parcels
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/MyProfile" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200">
                                            <FaUser></FaUser> My Profile
                                        </NavLink>
                                    </li>
                                </>
                            )}
                            <div className="divider"></div>
                            <li>
                                <NavLink to="/" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200">
                                    <FaHome /> Home
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className="flex items-center justify-between gap-2 p-2 ml-2 mr-2 rounded-full bg-gray-100 mt-4">
                        <img className="w-10 h-10 object-cover rounded-full" src={user?.photoURL} alt="User" />
                        <button
                            className="flex items-center gap-2 text-red-600 font-bold"
                            onClick={handleSignOut}
                        >
                            <RiLogoutCircleLine /> Logout
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default DashboardRoute;
