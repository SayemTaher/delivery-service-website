import React, { useContext, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import useAxiosPublic from '../../AxiosPublic/useAxiosPublic';
import { useForm, useWatch } from 'react-hook-form';
import { AuthContext } from '../Providers/AuthProvider';
import Swal from 'sweetalert2';
import { RiBox3Fill } from 'react-icons/ri';
import { Helmet } from 'react-helmet-async';

const UpdateParcel = () => {
    const data = useLoaderData()
    const { user } = useContext(AuthContext)
    const axiosPublic = useAxiosPublic()
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm();
    const [price, setPrice] = useState(0);

    const weight = useWatch({
        control,
        name: 'weight',
        defaultValue: data.weight,
    });

    useEffect(() => {
        const weightNum = parseFloat(weight);
        if (weightNum > 0) {
            setPrice(weightNum * 50);
        } else {
            setPrice(0);
        }
    }, [weight]);

    const { _id,
        user_Phone_Number,
        requested_Delivery_Date,
        receiver_Name,
        receivers_Phone,
        delivery_Address,
        package_Type,
        location_Latitude,
        location_Longitude,
    } = data

    const onSubmit = async (formData) => {
        formData.price = price;
        
        const parcelBookingData = {
            user_Name: user?.displayName,
            user_Email: user?.email,
            user_Photo: user?.photoURL,
            user_Phone_Number: formData.phone,
            requested_Delivery_Date: new Date(formData.date),
            price: formData.price,
            receiver_Name: formData.receiver,
            receivers_Phone: formData.receiversPhone,
            package_Type: formData.type,
            location_Latitude: formData.latitude,
            location_Longitude: formData.longitude,
            delivery_Address: formData.address,
            weight: formData.weight,
            status: 'pending'
        }
    
        try {
            const response = await axiosPublic.patch(`/parcelBookingData/${_id}`, parcelBookingData);
            if (response.data.modifiedCount > 0) {
                Swal.fire({
                    title: "Success",
                    text: "Your parcel has been updated",
                    icon: "success"
                });
                reset();
            }
        } catch (error) {
            console.error("Error occurred while updating parcel:", error);
            Swal.fire({
                title: "Error",
                text: "Failed to update your parcel. Please try again later.",
                icon: "error"
            });
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <Helmet><title>Fast Track | Update parcel </title></Helmet>
            <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl'>
                <h2 className="text-2xl font-bold mb-6 flex items-center text-blue-600 gap-2">
                    <RiBox3Fill /> Update Parcel
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
                                defaultValue={user_Phone_Number}
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
                                defaultValue={package_Type}
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
                                defaultValue={data.weight}
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
                                defaultValue={receiver_Name}
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
                                defaultValue={receivers_Phone}
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
                                defaultValue={delivery_Address}
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
                                defaultValue={new Date(requested_Delivery_Date).toISOString().split('T')[0]}
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
                                defaultValue={location_Latitude}
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
                                defaultValue={location_Longitude}
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
                            value="Update your parcel"
                            className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateParcel;
