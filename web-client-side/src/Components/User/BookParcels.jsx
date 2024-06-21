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
        // Calculate price based on weight: price is 50 per kg
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

        // Parse the requested delivery date to a Date object
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
                // reset();
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
        <div className='p-5 flex bg-gray-100 flex-col min-h-screen justify-center '>
            <div>
                <h2 className="text-2xl font-bold pb-5 flex items-center text-blue-600 gap-2">
                    <RiBox3Fill /> Book a Parcel
                </h2>
            </div>
            <div className='bg-white pb-5 pl-4 pr-4 '>
                <form
                    className="mt-6 flex border-2 pb-4 pt-2 border-dotted flex-col gap-5 items-center justify-center"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className='flex gap-5 items-center justify-center'>
                        <div className='flex gap-2 flex-col w-64'>
                            <div>
                                <label className="block font-bold text-sm text-gray-800">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    readOnly
                                    defaultValue={user?.displayName}
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-sm text-gray-800">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    readOnly
                                    defaultValue={user?.email}
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-sm text-gray-800">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    {...register("phone", { required: true })}
                                    placeholder="Enter your phone number"
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg"
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
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg"
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
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg"
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
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg"
                                />
                                {errors.receiver && (
                                    <span className="text-red-500 mt-2">This field is required</span>
                                )}
                            </div>
                        </div>
                        <div className='flex gap-2 flex-col w-64'>
                            <div>
                                <label className="block font-bold text-sm text-gray-800">Receiver's Phone Number</label>
                                <input
                                    type="text"
                                    name="receiversPhone"
                                    {...register("receiversPhone", { required: true })}
                                    placeholder="Enter receiver's phone number"
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg"
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
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg"
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
                                    className="block w-full px-4 py-1 mt-2 text-gray-700 bg-white border rounded-lg"
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
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg"
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
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg"
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
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <input
                            type="submit"
                            value="Book your parcel"
                            className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookParcels;
