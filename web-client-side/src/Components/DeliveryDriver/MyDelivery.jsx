import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Providers/AuthProvider';
import useAxiosPublic from '../../AxiosPublic/useAxiosPublic';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';

const MyDeliveryList = () => {
    const { user, loading } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const [parcels, setParcels] = useState([]);

    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosPublic.get('/user');
            return res.data;
        }
    });

    useEffect(() => {
        const fetchParcels = async () => {
            if (!usersLoading && users.length > 0) {
                const loggedInUser = users.find(u => u.email === user.email);
                if (loggedInUser) {
                    try {
                        const res = await axiosPublic.get(`/myParcels/${loggedInUser._id}`);
                        setParcels(res.data);
                    } catch (error) {
                        console.error('Error fetching parcels:', error);
                    }
                }
            }
        };

        fetchParcels();
    }, [user, users, usersLoading, axiosPublic]);

    if (usersLoading || loading) {
        return <div>Loading...</div>;
    }

    const handleCancelOrder = async (data) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosPublic.patch(`/parcelBookingData/${data._id}/status`, { status: 'canceled' });
                    setParcels(parcels.map(item => item._id === data._id ? { ...item, status: 'canceled' } : item));
                    Swal.fire('Canceled!', 'You canceled the order!', 'success');
                } catch (error) {
                    console.error('Error canceling the order:', error);
                    Swal.fire('Error!', 'There was an error canceling the order.', 'error');
                }
            }
        });
    };

    const handleDeliverOrder = (data) => {
        Swal.fire({
            title: "Is the order been delivered?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, It's Delivered!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosPublic.patch(`/parcelBookingData/${data._id}/status`, { status: 'delivered' });
                    setParcels(parcels.map(item => item._id === data._id ? { ...item, status: 'delivered' } : item));
                    Swal.fire('Delivered!', 'You delivered the order!', 'success');
                } catch (error) {
                    console.error('Error delivering the order:', error);
                    Swal.fire('Error!', 'There was an error delivering the order.', 'error');
                }
            }
        });
    };

    return (
        <div className='flex flex-col gap-5 p-5'>
            <Helmet><title>Fast Track | My Delivery</title></Helmet>
            <div className='border-b-2 border-dashed pb-5'>
                <h1 className='flex text-xl font-bold text-blue-800 items-center gap-2'>
                    Manage Your Delivery <sup className='bg-purple-100 p-2 text-purple-600'>{parcels?.length}</sup>
                </h1>
            </div>
            <div className='bg-gray-50 p-5 shadow-md'>
                <div className="overflow-x-auto">
                    <table className="table table-xs">
                        <thead>
                            <tr className='text-sm text-blue-950'>
                                <th>Sender</th>
                                <th>Receiver</th>
                                <th>Senders Phone</th>
                                <th>Requested  Delivery</th>
                                <th>Approx Delivery </th>
                                <th>Receivers Phone </th>
                                <th>Receivers Address</th>
                                <th>Cancel</th>
                                <th>Deliver</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parcels.map((parcel, index) => (
                                <tr key={parcel._id} className='text-center'>
                                    <td>{parcel.user_Name}</td>
                                    <td>{parcel.receiver_Name}</td>
                                    <td>{parcel.user_Phone_Number}</td>
                                    <td className='font-bold text-green-600'>
                                        {new Date(parcel.requested_Delivery_Date).toLocaleDateString()}
                                    </td>
                                    <td className='font-bold text-blue-600'>
                                        {new Date(parcel.approximate_Delivery_Date).toLocaleDateString()}
                                    </td>
                                    <td>{parcel.receivers_Phone}</td>
                                    <td>{parcel.delivery_Address}</td>
                                    <td>
                                        {parcel.status === 'canceled' || parcel.status === 'delivered' ? (
                                            <span className={parcel.status === 'canceled' ? 'text-red-600' : 'text-green-600'}>
                                                {parcel.status.charAt(0).toUpperCase() + parcel.status.slice(1)}
                                            </span>
                                        ) : (
                                            <button className='btn btn-error text-white' onClick={() => handleCancelOrder(parcel)}>Cancel</button>
                                        )}
                                    </td>
                                    <td>
                                        {parcel.status === 'canceled' || parcel.status === 'delivered' ? (
                                            <span className={parcel.status === 'canceled' ? 'text-red-600' : 'text-green-600'}>
                                                {parcel.status.charAt(0).toUpperCase() + parcel.status.slice(1)}
                                            </span>
                                        ) : (
                                            <button className='btn btn-success text-white' onClick={() => handleDeliverOrder(parcel)}>Deliver</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyDeliveryList;
