import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Providers/AuthProvider';
import useAxiosPublic from '../../AxiosPublic/useAxiosPublic';
import axios from 'axios';
import Swal from 'sweetalert2';
import { RiBox3Fill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { GrUpdate } from "react-icons/gr";
import { GiCancel } from "react-icons/gi";
import { MdOutlineReviews } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";

const MyParcels = () => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const [parcelData, setParcelData] = useState([]);
    const [filterStatus, setFilterStatus] = useState(""); // State to hold filter status

    useEffect(() => {
        const fetchParcelData = async () => {
            try {
                const res = await axiosPublic.get(`/parcelBookingData?email=${user?.email}`);
                setParcelData(res.data);
            } catch (error) {
                console.error('Error fetching parcel data:', error);
            }
        };
        fetchParcelData();
    }, [axiosPublic, user?.email]);

    // Function to handle canceling a parcel
    const handleCancel = async (id) => {
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
                    await axiosPublic.patch(`/parcelBookingData/${id}/status`, { status: 'canceled' });
                    // Update local state to reflect the canceled order
                    setParcelData(parcelData.map(item => item._id === id ? { ...item, status: 'canceled' } : item));
                    Swal.fire('Canceled!', 'You canceled the order!', 'success');
                } catch (error) {
                    console.error('Error canceling the order:', error);
                    Swal.fire('Error!', 'There was an error canceling the order.', 'error');
                }
            }
        });
    };

    // Function to handle reviewing a parcel
    const handleReview = (id) => {
        // Review handling logic
    };

    // Function to filter parcels based on status
    const filteredParcelData = parcelData.filter(data => {
        if (filterStatus === "") {
            return true; // Return true for all items if no filter is applied
        } else {
            return data.status === filterStatus;
        }
    });

    // Function to handle status filter change
    const handleFilterChange = (event) => {
        setFilterStatus(event.target.value);
    };

    return (
        <div className='p-5'>
            <div className='border-b-2 pb-5 border-dashed'>
                <h1 className='flex text-xl font-bold text-blue-800 items-center gap-2'>
                    Manage your parcels -
                    <span className='bg-green-100 text-green-600 flex gap-2 items-center p-2 rounded-xl'>
                        <RiBox3Fill /> {parcelData.length}
                    </span>
                </h1>
                <div className="mt-4">
                    <label htmlFor="statusFilter" className="mr-2">Filter by Status:</label>
                    <select id="statusFilter" value={filterStatus} onChange={handleFilterChange} className="p-2 border rounded-md">
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="delivered">Delivered</option>
                        <option value="canceled">Canceled</option>
                    </select>
                </div>
            </div>
            <div className='mt-10 border-2 border-gray-100 shadow-md p-4'>
                <div className="overflow-x-auto">
                    <table className="table table-xs">
                        <thead>
                            <tr className='text-blue-900'>
                                <th>Number</th>
                                <th>Parcel Type</th>
                                <th>Requested Delivery Date</th>
                                <th>Approximate Delivery Date</th>
                                <th>Delivery Man Id</th>
                                <th>Booking Status</th>
                                <th>Update</th>
                                <th>Cancel</th>
                                <th>Review</th>
                                <th>Pay</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredParcelData.map((data, idx) => (
                                <tr className='border-b pt-5 border-gray-200 border-dashed' key={data._id}>
                                    <th>{idx + 1}</th>
                                    <td>{data.package_Type}</td>
                                    <td>{data.requested_Delivery_Date}</td>
                                    <td className='bg-green-100 max-w-[70px] text-center text-green-600 p-1 rounded-xl'>
                                        {data.approximate_Delivery_Date ? data.approximate_Delivery_Date : 'Not yet updated'}
                                    </td>
                                    <td className='bg-blue-100 max-w-[70px] text-center text-blue-600 p-1 rounded-xl'>
                                        {data.delivery_Man_Id ? data.delivery_Man_Id : 'Not yet assigned'}
                                    </td>
                                    <td className='font-bold text-orange-600 text-center'>{data.status ? data.status : 'pending'}</td>
                                    <td>
                                        {data.status === 'pending' ? (
                                            <Link to={`/dashboard/update/${data._id}`}>
                                                <button className='flex p-2 items-center gap-2 shadow-md rounded-xl text-white bg-blue-600'>
                                                    <GrUpdate /> Update
                                                </button>
                                            </Link>
                                        ) : (
                                            <button className='bg-gray-400 text-gray-500 p-2 rounded-xl' disabled>Update</button>
                                        )}
                                    </td>
                                    <td>
                                        {data.status === 'pending' ? (
                                            <button className='flex items-center p-2 gap-2 shadow-md rounded-xl text-white bg-red-600' onClick={() => handleCancel(data._id)}>
                                                <GiCancel /> Cancel
                                            </button>
                                        ) : (
                                            <button className='bg-gray-400 text-gray-500 p-2 rounded-xl' disabled>Cancel</button>
                                        )}
                                    </td>
                                    <td>
                                        {data.status === 'delivered' ? (
                                            <button className='flex items-center gap-2 p-2 shadow-md rounded-xl text-white bg-orange-600' onClick={() => handleReview(data._id)}>
                                                <MdOutlineReviews /> Review
                                            </button>
                                        ) : (
                                            <button className='bg-gray-400 text-gray-500 p-2 rounded-xl' disabled>Review</button>
                                        )}
                                    </td>
                                    <td>
                                        {data.status === 'delivered' ? <button className='flex items-center gap-2 p-2 shadow-md rounded-xl text-white bg-purple-900'>
                                            <RiSecurePaymentLine /> Pay
                                        </button> : <button className='bg-gray-400 text-gray-500 p-2 rounded-xl' disabled>Pay</button> }
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

export default MyParcels;
