import React, { useContext, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { AuthContext } from '../Providers/AuthProvider';
import useAxiosPublic from '../../AxiosPublic/useAxiosPublic';
import Swal from 'sweetalert2';
import { RiBox3Fill } from "react-icons/ri";

const BookParcels = () => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm();
    const [price, setPrice] = useState(0);

    const weight = useWatch({
        control,
        name: 'weight',
        defaultValue: 0,
    });

    useEffect(() => {
        const weightNum = parseFloat(weight);
        if (weightNum > 0) {
            setPrice(weightNum * 50);
        } else {
            setPrice(0);
        }
    }, [weight]);

    const onSubmit = async (data) => {
        data.price = price;
        const currentDate = new Date();
        const requestedDeliveryDate = new Date(data.date);

        const parcelBookingData = {
            user_Name: user?.displayName,
            user_Email: user?.email,
            user_Photo: user?.photoURL,
            user_Phone_Number: data.phone,
            requested_Delivery_Date: requestedDeliveryDate,
            price: data.price,
            receiver_Name: data.receiver,
            receivers_Phone: data.receiversPhone,
            package_Type: data.type,
            weight: data.weight,
            location_Latitude: data.latitude,
            location_Longitude: data.longitude,
            delivery_Address: data.address,
            status: 'pending',
            booking_Date: currentDate
        };

        try {
            const response = await axiosPublic.post('/parcelBookingData', parcelBookingData);
            if (response.data.insertedId) {
                Swal.fire({
                    title: "Success",
                    text: "Your parcel has been booked",
                    icon: "success"
                });
                reset();
            }
        } catch (error) {
            console.error("Error occurred while booking parcel:", error);
            Swal.fire({
                title: "Error",
                text: "Failed to book your parcel. Please try again later.",
                icon: "error"
            });
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl'>
                <h2 className="text-2xl font-bold mb-6 flex items-center text-blue-600 gap-2">
                    <RiBox3Fill /> Book a Parcel
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label className="block font-bold text-sm text-gray-800">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                readOnly
                                defaultValue={user?.displayName}
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-sm text-gray-800">Email</label>
                            <input
                                type="email"
                                name="email"
                                readOnly
                                defaultValue={user?.email}
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-sm text-gray-800">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                {...register("phone", { required: true })}
                                placeholder="Enter your phone number"
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                            {errors.phone && (
                                <span className="text-red-500 mt-2">This field is required</span>
                            )}
                        </div>
                        <div>
                            <label className="block font-bold text-sm text-gray-800">Parcel Type</label>
                            <input
                                type="text"
                                name="type"
                                {...register("type", { required: true })}
                                placeholder="Parcel type"
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                            {errors.type && (
                                <span className="text-red-500 mt-2">This field is required</span>
                            )}
                        </div>
                        <div>
                            <label className="block font-bold text-sm text-gray-800">Parcel Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                {...register("weight", {
                                    required: true,
                                    min: {
                                        value: 1,
                                        message: "Parcel weight must be greater than or equal to 1"
                                    }
                                })}
                                placeholder="Parcel weight (in KG)"
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                            {errors.weight && (
                                <span className="text-red-500 mt-2">This field is required</span>
                            )}
                        </div>
                        <div>
                            <label className="block font-bold text-sm text-gray-800">Receiver's Name</label>
                            <input
                                type="text"
                                name="receiver"
                                {...register("receiver", { required: true })}
                                placeholder="Enter receiver's name"
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                            {errors.receiver && (
                                <span className="text-red-500 mt-2">This field is required</span>
                            )}
                        </div>
                        <div>
                            <label className="block font-bold text-sm text-gray-800">Receiver's Phone Number</label>
                            <input
                                type="text"
                                name="receiversPhone"
                                {...register("receiversPhone", { required: true })}
                                placeholder="Enter receiver's phone number"
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                            {errors.receiversPhone && (
                                <span className="text-red-500 mt-2">This field is required</span>
                            )}
                        </div>
                        <div>
                            <label className="block font-bold text-sm text-gray-800">Parcel Delivery Address</label>
                            <input
                                type="text"
                                name="address"
                                {...register("address", { required: true })}
                                placeholder="Enter delivery address"
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                            {errors.address && (
                                <span className="text-red-500 mt-2">This field is required</span>
                            )}
                        </div>
                        <div>
                            <label className="block font-bold text-sm text-gray-800">Requested Delivery Date</label>
                            <input
                                type="date"
                                name="date"
                                {...register("date", { required: true })}
                                placeholder="Enter requested delivery date"
                                className="block w-full px-4 py-1 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                            {errors.date && (
                                <span className="text-red-500 mt-2">This field is required</span>
                            )}
                        </div>
                        <div>
                            <label className="block font-bold text-sm text-gray-800">Delivery Address Latitude</label>
                            <input
                                type="text"
                                name="latitude"
                                {...register("latitude", { required: true })}
                                placeholder="Enter delivery address latitude"
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                            {errors.latitude && (
                                <span className="text-red-500 mt-2">This field is required</span>
                            )}
                        </div>
                        <div>
                            <label className="block font-bold text-sm text-gray-800">Delivery Address Longitude</label>
                            <input
                                type="text"
                                name="longitude"
                                {...register("longitude", { required: true })}
                                placeholder="Enter delivery address longitude"
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                            {errors.longitude && (
                                <span className="text-red-500 mt-2">This field is required</span>
                            )}
                        </div>
                        <div>
                            <label className="block font-bold text-sm text-gray-800">Price (Auto-calculated)</label>
                            <input
                                type="text"
                                name="price"
                                readOnly
                                value={price}
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <input
                            type="submit"
                            value="Book your parcel"
                            className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookParcels;
