import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Providers/AuthProvider';
import useAxiosPublic from '../../AxiosPublic/useAxiosPublic';
import Swal from 'sweetalert2';
import { RiBox3Fill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { GrUpdate } from "react-icons/gr";
import { GiCancel } from "react-icons/gi";
import { MdOutlineReviews } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

const MyParcels = () => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const [parcelData, setParcelData] = useState([]);
    const [filterStatus, setFilterStatus] = useState(""); // State to hold filter status
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [selectedParcel, setSelectedParcel] = useState(null);

    const { data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosPublic.get('/user')
            return res.data
        }
    });

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

    const handleReviewRider = (parcel) => {
        setSelectedParcel(parcel);
        document.getElementById('review_modal').showModal();
    };

    const onSubmitReview = async (data) => {
        const reviewData = {
            user_Name: user.displayName,
            user_Image: user.photoURL,
            rating: data.rating,
            feedback: data.feedback,
            delivery_Rider_Id: selectedParcel.delivery_Rider_Id,
            review_Date: new Date(),
        };

        try {
            const response = await axiosPublic.post('/reviews', reviewData);
            if (response.data.insertedId) {
                Swal.fire('Success', 'Your review has been submitted', 'success');
                reset();
                document.getElementById('review_modal').close();
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            Swal.fire('Error', 'Failed to submit your review. Please try again later.', 'error');
        }
    };

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
                    setParcelData(parcelData.map(item => item._id === id ? { ...item, status: 'canceled' } : item));
                    Swal.fire('Canceled!', 'You canceled the order!', 'success');
                } catch (error) {
                    console.error('Error canceling the order:', error);
                    Swal.fire('Error!', 'There was an error canceling the order.', 'error');
                }
            }
        });
    };

    const filteredParcelData = parcelData.filter(data => {
        if (filterStatus === "") {
            return true; // Return true for all items if no filter is applied
        } else {
            return data.status === filterStatus;
        }
    });

    const handleFilterChange = (event) => {
        setFilterStatus(event.target.value);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'canceled':
                return 'text-red-600';
            case 'delivered':
                return 'text-green-600';
            case 'on the way':
                return 'text-blue-600';
            case 'pending':
                return 'text-purple-600';
            default:
                return '';
        }
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
                                    <td>{formatDate(data.requested_Delivery_Date)}</td>
                                    <td className='bg-green-100 max-w-[70px] text-center text-green-600 p-1 rounded-xl'>
                                        {data.approximate_Delivery_Date ? formatDate(data.approximate_Delivery_Date) : 'Not yet updated'}
                                    </td>
                                    <td className='bg-blue-100 max-w-[30px] overflow-hidden text-center text-blue-600 p-1 rounded-xl'>
                                        {data.delivery_Rider_Id ? data.delivery_Rider_Id : 'Not yet assigned'}
                                    </td>
                                    <td className={`font-bold text-center ${getStatusClass(data.status)}`}>
                                        {data.status ? data.status : 'pending'}
                                    </td>
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
                                            <button className='flex hover:scale-95 items-center gap-2 p-2 shadow-md rounded-xl text-white bg-orange-600' onClick={() => handleReviewRider(data)}>
                                                <MdOutlineReviews /> Review
                                            </button>
                                        ) : (
                                            <button className='bg-gray-400 text-gray-500 p-2 rounded-xl' disabled>Review</button>
                                        )}
                                    </td>
                                    <td>
                                        {data.status === 'delivered' ? (
                                            <button className='flex items-center gap-2 p-2 shadow-md rounded-xl text-white bg-purple-900'>
                                                <RiSecurePaymentLine /> Pay
                                            </button>
                                        ) : (
                                            <button className='bg-gray-400 text-gray-500 p-2 rounded-xl' disabled>Pay</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Review Modal */}
            <dialog id="review_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Leave a Review</h3>
                    <form onSubmit={handleSubmit(onSubmitReview)} className="flex flex-col gap-4">
                        <div>
                            <label className="block font-bold text-sm text-gray-800">User’s Name</label>
                            <input
                                type="text"
                                name="userName"
                                defaultValue={user.displayName}
                                readOnly
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-sm text-gray-800">User’s Image</label>
                            <input
                                type="text"
                                name="userImage"
                                defaultValue={user.photoURL}
                                readOnly
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-sm text-gray-800">Rating</label>
                            <input
                                type="number"
                                name="rating"
                                {...register("rating", { required: true, min: 1, max: 5 })}
                                placeholder="Rate out of 5"
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg"
                            />
                            {errors.rating && (
                                <span className="text-red-500 mt-2">Please provide a rating between 1 and 5.</span>
                            )}
                        </div>
                        <div>
                            <label className="block font-bold text-sm text-gray-800">Feedback</label>
                            <textarea
                                name="feedback"
                                {...register("feedback", { required: true })}
                                placeholder="Provide your feedback"
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg"
                            />
                            {errors.feedback && (
                                <span className="text-red-500 mt-2">Please provide your feedback.</span>
                            )}
                        </div>
                        <div>
                            <label className="block font-bold text-sm text-gray-800">Delivery Men’s Id</label>
                            <input
                                type="text"
                                name="deliveryRiderId"
                                defaultValue={selectedParcel?.delivery_Rider_Id}
                                readOnly
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg"
                            />
                        </div>
                        <div className="modal-action">
                            <button type="submit" className="btn btn-primary">Submit</button>
                            <button type="button" className="btn" onClick={() => document.getElementById('review_modal').close()}>Close</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default MyParcels;
