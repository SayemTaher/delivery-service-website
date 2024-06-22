import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Providers/AuthProvider';
import useAxiosPublic from '../../AxiosPublic/useAxiosPublic';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';

const MyReviews = () => {
    const { user, loading } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const [reviews, setReviews] = useState([]);

    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosPublic.get('/user');
            return res.data;
        }
    });

    useEffect(() => {
        const fetchReviews = async () => {
            if (!usersLoading && users.length > 0) {
                const loggedInUser = users.find(u => u.email === user.email);
                if (loggedInUser) {
                    try {
                        const res = await axiosPublic.get(`/reviews/${loggedInUser._id}`);
                        setReviews(res.data);
                    } catch (error) {
                        console.error('Error fetching reviews:', error);
                    }
                }
            }
        };

        fetchReviews();
    }, [user, users, usersLoading, axiosPublic]);

    if (usersLoading || loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='p-5'>
            <div className='border-b-2 border-dashed pb-5'>
            <Helmet><title>Fast Track | My Reviews</title></Helmet>
                <h1 className='text-2xl font-bold text-blue-800'>
                    My Reviews <sup className='bg-purple-100 p-2 text-purple-600 rounded-full'>{reviews?.length}</sup>
                </h1>
            </div>
            <div className='bg-gray-50 p-5 mt-5 shadow-md rounded-lg'>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white p-5 rounded-lg shadow-lg">
                            <div className="flex items-center mb-4">
                                
                                <img src={review.user_Image} alt={review.userName} className="w-12 h-12 rounded-full mr-4 object-cover" />
                                <div>
                                    <h3 className="text-lg font-bold">{review.user_Name}</h3>
                                    <p className="text-sm text-gray-500">{new Date(review.review_Date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="flex items-center mb-4">
                                <span className="text-blue-500 font-bold"> Average Rating -</span>
                                <span className="ml-2 text-lg font-bold"><span className='text-purple-700'>{review.rating}</span> out of 5</span>
                            </div>
                            <p className=" flex text-orange-600 text-xl font-bold flex-col "> Feedback  <span className='text-gray-600 text-sm font-normal'>{review.feedback}</span></p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyReviews;
