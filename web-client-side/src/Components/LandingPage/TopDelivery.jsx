import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAxiosPublic from '../../AxiosPublic/useAxiosPublic';
import { IoStarSharp } from "react-icons/io5";
import { BsBoxSeamFill } from "react-icons/bs";

const TopDelivery = () => {
    const [parcelData, setParcelData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [reviewData, setReviewData] = useState([]);
    const axiosPublic = useAxiosPublic();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await axiosPublic.get('/user');
                console.log('User Data:', usersResponse.data);
                setUserData(usersResponse.data);

                const parcelsResponse = await axiosPublic.get('/allBookedParcel');
                console.log('Parcel Data:', parcelsResponse.data);
                setParcelData(parcelsResponse.data);

                const reviewsResponse = await axiosPublic.get('/reviews');
                console.log('Review Data:', reviewsResponse.data);
                setReviewData(reviewsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [axiosPublic]);

    // Calculate top 3 delivery men
    const deliveryMen = userData.filter(user => user.role === 'delivery').map(deliveryMan => {
        const parcelsDelivered = parcelData.filter(parcel => parcel.delivery_Rider_Id === deliveryMan._id && parcel.status === 'delivered').length;
        const ratings = reviewData.filter(review => review.delivery_Rider_Id === deliveryMan._id).map(review => parseInt(review.rating));
        const averageRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

        return {
            ...deliveryMan,
            parcelsDelivered,
            averageRating
        };
    });

    const topDeliveryMen = deliveryMen.sort((a, b) => {
        if (b.parcelsDelivered !== a.parcelsDelivered) {
            return b.parcelsDelivered - a.parcelsDelivered;
        }
        return b.averageRating - a.averageRating;
    }).slice(0, 3);

    console.log('Top Delivery Men:', topDeliveryMen);

    return (
        <div data-aos="fade-up" className='flex flex-col gap-5 p-10 bg-gray-50 mt-10 mb-10 items-center justify-center flex-wrap'>
            <div className='mt-10'>
                <h2 className='text-3xl text-center border-b-2 pb-5 font-bold text-blue-900 mb-5'>Top Delivery Men</h2>
                <div data-aos="fade-left" className='flex flex-col items-center lg:flex-row gap-10 justify-center'>
                    {topDeliveryMen.map((deliveryMan, index) => (
                        <div key={index} className="flex flex-col h-[300px] text-center gap-2 items-center justify-between w-full max-w-sm mx-auto bg-white p-5 rounded-lg shadow-md">
                            <img src={deliveryMan.photoURL} alt={deliveryMan.name} className="w-24 h-24 rounded-full mb-4" />
                           <div className='flex flex-col items-center justify-between gap-2'>
                           <h3 className="text-2xl font-bold text-gray-800">{deliveryMan.name}</h3>
                            <p className="text-gray-600 flex gap-2 items-center">Delivered -<BsBoxSeamFill className='text-2xl text-orange-500'> </BsBoxSeamFill> {deliveryMan.parcelsDelivered}</p>
                            <p className="text-gray-600 flex gap-2 items-center">Average Rating -<IoStarSharp className='text-2xl text-green-500'> </IoStarSharp>  {deliveryMan.averageRating.toFixed(1)}</p>
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopDelivery;
