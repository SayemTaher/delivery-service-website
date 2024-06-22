import React, { useContext, useState, useEffect } from 'react';
import useAxiosPublic from '../../AxiosPublic/useAxiosPublic';
import { useQuery } from '@tanstack/react-query';
import { RiBox3Fill } from 'react-icons/ri';
import { MdManageAccounts } from "react-icons/md";
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { TiTick } from "react-icons/ti";
import { TbTruckDelivery } from "react-icons/tb";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Helmet } from 'react-helmet-async';

const AllParcels = () => {
    const axiosPublic = useAxiosPublic();
    const [selectedParcel, setSelectedParcel] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [parcelData, setParcelData] = useState([]);

    const { data: deliVeryMan = [] } = useQuery({
        queryKey: ['deliveryMan'],
        queryFn: async () => {
            const res = await axiosPublic.get('/user/delivery');
            return res.data;
        }
    });

    const fetchParcels = async (url) => {
        try {
            const res = await axiosPublic.get(url);
            setParcelData(res.data);
        } catch (error) {
            console.error('Error fetching parcels:', error);
        }
    };

    useEffect(() => {
        fetchParcels('/allParcelData');
    }, []);

    const manageOrder = (parcel) => {
        setSelectedParcel(parcel);
        setErrorMessage(""); // Clear previous error message
        document.getElementById('manage_modal').showModal();
    };

    const onSubmit = async (data) => {
        const parcelBookingData = {
            delivery_Rider_Id: data.deliveryId,
            approximate_Delivery_Date: new Date(data.date), // Ensure this is a Date object
            status: 'On The Way'
        };

        if (selectedParcel.status === 'On The Way') {
            setErrorMessage("You have already assigned a rider for this order.");
            return;
        }

        try {
            const response = await axiosPublic.patch(`/allParcels/${selectedParcel._id}`, parcelBookingData);
            if (response.data.modifiedCount > 0) {
                setSuccessMessage(true);
                setErrorMessage("");
                Swal.fire({
                    title: "Success",
                    text: `You have assigned a Delivery Rider for the parcel, ${selectedParcel._id}`,
                    icon: "success"
                });
                reset();
                fetchParcels('/allParcelData');
            }
        } catch (error) {
            setErrorMessage("Failed to update your parcel. Please try again later.");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const handleDateChange = (e) => {
        setDateRange({
            ...dateRange,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = () => {
        if (dateRange.from && dateRange.to) {
            const url = `/allParcelData?from=${dateRange.from}&to=${dateRange.to}`;
            fetchParcels(url);
        } else {
            Swal.fire({
                title: "Error",
                text: "Please select both 'From' and 'To' dates.",
                icon: "error",
                showConfirmButton: true,
            });
        }
    };

    return (
        <div className='flex flex-col gap-5 p-5'>
            <Helmet><title>Fast Track | All Parcels</title></Helmet>
            <div className='border-b-2 border-dashed pb-5'>
                <h1 className='flex text-xl font-bold text-blue-800 items-center gap-2'>
                    Overview of all the parcels -
                    <span className='bg-blue-100 text-blue-600 flex gap-2 items-center p-2 rounded-xl'>
                        <RiBox3Fill /> {parcelData.length}
                    </span>
                </h1>
            </div>
            <div>
                <h1 className='bg-gray-100 font-bold text-center text-gray-500 p-2 rounded-md'> Search orders based on Date Range ( Choose minimum 2 dates )</h1>
            </div>
            <div className='flex gap-2 items-center mb-5'>
                <label className='font-bold'>From:</label>
                <input
                    type="date"
                    name="from"
                    value={dateRange.from}
                    onChange={handleDateChange}
                    className="block px-4 py-1 text-gray-700 bg-white border rounded-lg"
                />
                <label className='font-bold'>To:</label>
                <input
                    type="date"
                    name="to"
                    value={dateRange.to}
                    onChange={handleDateChange}
                    className="block px-4 py-1 text-gray-700 bg-white border rounded-lg"
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg"
                >
                    Search
                </button>
            </div>
            <div>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr className='text-lg text-blue-900'>
                                <th>Serial</th>
                                <th>Name</th>
                                <th>Phone Number</th>
                                <th>Booking Date</th>
                                <th>Requested Delivery Date</th>
                                <th>Price</th>
                                <th>Order status</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                parcelData.map((data, index) => (
                                    <tr key={data._id}>
                                        <th>{index + 1}</th>
                                        <td>{data.user_Name}</td>
                                        <td>{data.user_Phone_Number}</td>
                                        <td className='bg-green-100 rounded-full text-center font-bold text-green-600'>{formatDate(data.booking_Date)}</td>
                                        <td className='bg-blue-100 rounded-full text-center font-bold text-blue-600'>{formatDate(data.requested_Delivery_Date)}</td>
                                        <td className='font-bold text-orange-600'>$ {data.price}</td>
                                        <td className='bg-purple-100 p-1 rounded-full text-center font-bold text-purple-600'>{data.status}</td>
                                        <td className='cursor-pointer bg-blue-900 text-white text-center hover:scale-95 rounded-xl'>
                                            <button
                                                className='flex text-xl items-center gap-2'
                                                onClick={() => manageOrder(data)}
                                            >
                                                <MdManageAccounts /> Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <dialog id="manage_modal" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <h3 className="font-bold flex gap-2 items-center text-2xl"><TbTruckDelivery /> Assign Riders</h3>
                    {selectedParcel && (
                        <div className='mt-5'>
                            <p className='text-orange-500'><strong>Current Order ID - </strong> <span className='bg-green-100 p-1 rounded-xl text-green-500'>{selectedParcel._id}</span></p>
                            <form className='flex mt-5 border-2 border-dashed p-5 rounded-xl shadow-md flex-col gap-2' onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <label className="block font-bold text-sm text-gray-800">Approximate Delivery Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        {...register("date", { required: true })}
                                        placeholder="Enter approximate delivery date"
                                        className="block w-full px-4 py-1 mt-2 text-gray-700 bg-white border rounded-lg"
                                    />
                                    {errors.date && (
                                        <span className="text-red-500 mt-2">This field is required</span>
                                    )}
                                </div>
                                <div className="mt-2 mb-2">
                                    <label className='font-bold'>Select Delivery Man Id</label>
                                    <select className="select mt-2 select-bordered w-full max-w-full" {...register("deliveryId", { required: true })}>
                                        {
                                            deliVeryMan?.map(data => <option key={data._id} value={data._id}>{data._id}</option>)
                                        }
                                    </select>
                                    {errors.deliveryId && (
                                        <span className="text-red-500 mt-2">
                                            This field is required
                                        </span>
                                    )}
                                </div>
                                <div className="mt-6">
                                    <input
                                        type="submit"
                                        value="Assign a Rider"
                                        className="w-[200px] px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                                    />
                                </div>
                            </form>
                        </div>
                    )}
                    {successMessage && (
                        <span className='bg-green-200 mt-5 text-green-600 flex gap-2 items-center p-2 rounded-md'>
                            <TiTick /> Rider assigned successfully
                        </span>
                    )}
                    {errorMessage && (
                        <span className='bg-red-200 mt-5 text-red-600 flex gap-2 items-center p-2 rounded-md'>
                            {errorMessage}
                        </span>
                    )}
                    <div className="modal-action">
                        <button className="btn btn-error text-white" onClick={() => document.getElementById('manage_modal').close()}>Close</button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default AllParcels;
