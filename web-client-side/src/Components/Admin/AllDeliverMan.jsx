import React, { useEffect, useState } from 'react';
import useAxiosPublic from '../../AxiosPublic/useAxiosPublic';

const AllDeliverMan = () => {
    const axiosPublic = useAxiosPublic();
    const [deliveryMen, setDeliveryMen] = useState([]);
    const [deliveryMenStats, setDeliveryMenStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeliveryMen = async () => {
            try {
                const res = await axiosPublic.get('/user/delivery');
                setDeliveryMen(res.data);
            } catch (error) {
                console.error('Error fetching delivery men:', error);
            }
        };

        fetchDeliveryMen();
    }, [axiosPublic]);

    useEffect(() => {
        const fetchDeliveryMenStats = async () => {
            setLoading(true);
            try {
                const statsPromises = deliveryMen.map(async (deliveryMan) => {
                    const [parcelsRes, reviewsRes] = await Promise.all([
                        axiosPublic.get(`/parcels/delivered/${deliveryMan._id}`),
                        axiosPublic.get(`/reviews/${deliveryMan._id}`)
                    ]);

                    const parcels = parcelsRes.data;
                    const reviews = reviewsRes.data;

                    const numberOfParcelsDelivered = parcels.length;
                    const averageRating = reviews.length > 0
                        ? (reviews.reduce((acc, review) => acc + Number(review.rating), 0) / reviews.length).toFixed(2)
                        : 'Not yet available';

                    return {
                        ...deliveryMan,
                        parcel_Delivered: numberOfParcelsDelivered,
                        average_Rating: averageRating
                    };
                });

                const stats = await Promise.all(statsPromises);
                setDeliveryMenStats(stats);
            } catch (error) {
                console.error('Error fetching delivery men stats:', error);
            } finally {
                setLoading(false);
            }
        };

        if (deliveryMen.length > 0) {
            fetchDeliveryMenStats();
        }
    }, [axiosPublic, deliveryMen]);

    return (
        <div className='container mx-auto p-6 bg-gray-100 min-h-screen'>
            <div className='mb-6'>
                <h1 className='text-3xl font-bold text-purple-800'>
                    Available Delivery Riders <span className='text-xl bg-blue-100 text-blue-500 p-2 rounded-md'>{deliveryMen.length}</span>
                </h1>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-lg'>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="loader"></div> {/* Add your loader here */}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-200 text-gray-600">
                                <tr>
                                    <th className="py-2 px-4 text-left">Serial</th>
                                    <th className="py-2 px-4 text-left">Name</th>
                                    <th className="py-2 px-4 text-left">Email</th>
                                    <th className="py-2 px-4 text-center">Parcel Delivered</th>
                                    <th className="py-2 px-4 text-center">Average Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveryMenStats.map((data, idx) => (
                                    <tr key={data._id} className="border-b border-gray-200">
                                        <td className="py-2 px-4">{idx + 1}</td>
                                        <td className="py-2 px-4">{data.name}</td>
                                        <td className="py-2 px-4">{data.email}</td>
                                        <td className='py-2 px-4 text-center text-green-600 font-bold'>
                                            {data.parcel_Delivered ? data.parcel_Delivered : 'Not yet available'}
                                        </td>
                                        <td className='py-2 px-4 text-center text-blue-600 font-bold'>
                                            {data.average_Rating}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllDeliverMan;
