import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CountUp from 'react-countup';
import useAxiosPublic from '../../AxiosPublic/useAxiosPublic';
import { BsBoxSeamFill } from "react-icons/bs";
import { GrUnorderedList } from "react-icons/gr";
import { FaUsers } from "react-icons/fa";

const Statistics = () => {
    const [parcelData, setParcelData] = useState([]);
    const [userData, setUserData] = useState([]);
    const axiosPublic = useAxiosPublic()

    useEffect(() => {
        const fetchData = async () => {
            const usersResponse = await axiosPublic.get('/user');
            setUserData(usersResponse.data);

            const parcelsResponse = await axiosPublic.get('/allBookedParcel');
            setParcelData(parcelsResponse.data);
        };
        fetchData();
    }, []);

    const totalNumberofParcelBooked = parcelData.length;
    const totalNumberofParcelDelivered = parcelData.filter(parcel => parcel.status === 'delivered').length;
    const totalNumberOfUsers = userData.length;

    return (
        <div className='flex text-center flex-col gap-5 p-10 bg-gray-50 mt-10 mb-10 items-center justify-center flex-wrap'>
            <div className='mb-4 mt-4 border-b-2 pb-5'>
                <h1 className='lg:text-3xl text-2xl text-center font-bold text-blue-900'>Our Application Usage Statistics</h1>
            </div>
            <div className='flex flex-col lg:flex-row gap-10 justify-center'>
                <div className="flex flex-col gap-2 items-center justify-between w-full max-w-sm mx-auto bg-white p-5 rounded-lg shadow-md">
                    <BsBoxSeamFill className='text-6xl text-blue-500'></BsBoxSeamFill>
                    <h3 className="text-xxl font-bold text-gray-800">Total Parcels Booked</h3>
                    <CountUp end={totalNumberofParcelBooked} duration={2.5} className="text-4xl font-bold text-blue-900" />
                </div>
                <div className="flex flex-col gap-2 items-center justify-between w-full max-w-sm mx-auto bg-white p-5 rounded-lg shadow-md">
                    <GrUnorderedList className='text-6xl text-purple-500'></GrUnorderedList>
                    <h3 className="text-xxl font-bold text-gray-800">Total Parcels Delivered</h3>
                    <CountUp end={totalNumberofParcelDelivered} duration={2.5} className="text-4xl font-bold text-blue-900" />
                </div>
                <div className="flex flex-col gap-2 items-center justify-between w-full max-w-sm mx-auto bg-white p-5 rounded-lg shadow-md">
                    <FaUsers className='text-6xl text-green-500'></FaUsers>
                    <h3 className="text-xxl font-bold text-gray-800">Total Users</h3>
                    <CountUp end={totalNumberOfUsers} duration={2.5} className="text-4xl font-bold text-blue-900" />
                </div>
            </div>
        </div>
    );
};

export default Statistics;
