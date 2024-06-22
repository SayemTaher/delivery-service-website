import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAxiosPublic from '../../AxiosPublic/useAxiosPublic';
import Swal from 'sweetalert2';
import Pagination from './Pagination'; 
import { Helmet } from 'react-helmet-async';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const [usersPerPage] = useState(5); 
    const axiosPublic = useAxiosPublic();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const [usersRes, bookedParcelRes] = await Promise.all([
                    axiosPublic.get('/user'),
                    axiosPublic.get('/allBookedParcel')
                ]);

                // Map booked parcel counts and phone numbers to users
                const userMap = {};
                usersRes?.data?.forEach(user => {
                    userMap[user.email] = { ...user, booked_Parcel: 0, user_Phone_Number: '' };
                });

                bookedParcelRes?.data?.forEach(parcel => {
                    const userEmail = parcel.user_Email;
                    if (userMap[userEmail]) {
                        userMap[userEmail].booked_Parcel++;
                        userMap[userEmail].user_Phone_Number = parcel.user_Phone_Number;
                    }
                });

                const usersWithData = Object.values(userMap);

                setUsers(usersWithData);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Optionally, handle error state or display an error message
                Swal.fire({
                    icon: 'error',
                    title: 'Error fetching users',
                    text: 'Failed to fetch users. Please try again later.',
                });
            }
        };

        fetchUsers();
    }, [axiosPublic]); // Make sure to include axiosPublic in the dependency array if it's used inside useEffect

    const handleMakeAdmin = (user) => {
        axiosPublic.patch(`/user/admin/${user._id}`).then((res) => {
            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    title: "Successful!",
                    text: `${user.name} is now an Admin`,
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
                
               
            }
        });
    };

    const handleMakeDelivery = (user) => {
        axiosPublic.patch(`/user/deliveryMan/${user._id}`).then((res) => {
            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    title: "Successful!",
                    text: `${user.name} is now a Delivery Rider`,
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });

              
            }
        });
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate index of the first and last user on the current page
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div className='flex flex-col  gap-5 m-10'>
            <Helmet><title>Fast Track | All Users</title></Helmet>
            <div className='border-b-2 border-dashed pb-5'>
                <h1 className='text-purple-800 text-2xl font-bold'>
                    Registered Users
                    <sup className='bg-blue-100 text-blue-500 p-2 rounded-md'>{users?.length}</sup>
                </h1>
            </div>
            <div className='border-b-2 pb-5 border-dashed'>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr className='font-bold text-lg text-blue-800'>
                                <th>Serial</th>
                                <th>Name</th>
                                <th>Parcel Booked</th>
                                <th>Phone Number</th>
                                <th>User Role</th>
                                <th><button>Make Delivery Man</button></th>
                                <th><button>Make Admin</button></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user, idx) => (
                                <tr key={user._id}>
                                    <td>{idx + 1}</td>
                                    <td>{user.name}</td>
                                    <td className='text-center font-bold text-orange-500'>{user.booked_Parcel}</td>
                                    <td>{user.user_Phone_Number || 'Not available'}</td>
                                    <td className=' p-1 text-center uppercase font-bold  rounded-md text-purple-600'>{user.role}</td>
                                    <td>
                                        {user.role === 'delivery' ? <button className='btn text-white btn-primary' disabled>Make Delivery Man</button> : <button onClick={()=> handleMakeDelivery(user)} className='btn text-white btn-primary'>Make Delivery Man</button>}
                                    </td>
                                    <td>
                                        {
                                            user.role === 'admin' ? <button className='btn text-white btn-success' disabled>Make Admin</button> : <button onClick={() => handleMakeAdmin(user)} className='btn text-white btn-success' >Make Admin</button>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination 
                usersPerPage={usersPerPage}
                totalUsers={users.length}
                currentPage={currentPage}
                paginate={paginate}
            />
        </div>
    );
};

export default AllUsers;
