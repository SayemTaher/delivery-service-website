import React from 'react';
import useAxiosPublic from '../../AxiosPublic/useAxiosPublic';
import { useQueries, useQuery } from '@tanstack/react-query';

const AllDeliverMan = () => {

    const axiosPublic = useAxiosPublic()
    const {data : deliveryMan =[]} = useQuery({
        queryKey : ['deliveryMan'],
        queryFn: async () => {
            const res =await axiosPublic.get('/user/delivery')
            return res.data
        }
    })
    return (
        <div className='flex flex-col gap-5 m-10'>
            <div className='border-b-2 border-dashed pb-5'>
            <h1 className='text-purple-800 text-2xl font-bold'>Available Delivery Riders <sup className='bg-blue-100 text-blue-500 p-2 rounded-md'> {deliveryMan?.length}</sup></h1>
            </div>
            <div>
            <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr className='font-bold text-lg text-blue-800'>
        <th>Serial</th>
        <th>Name</th>
        <th>Email</th>
        <th>Parcel Delivered</th>
        <th>Average Rating</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      {
        deliveryMan?.map((data,idx) => <tr key={data._id}>
            <th>{idx + 1 }</th>
            <td>{data.name}</td>
            <td>{data.email}</td>
            <td className='bg-green-100 p-1 rounded-lg text-green-600 font-bold text-center '>{data.parcel_Delivered ? data.parcel_Delivered : 'Not yet available'}</td>
            <td className='bg-blue-100 p-1 rounded-lg text-blue-600 font-bold text-center '>{data.average_Rating ? data.average_Rating : 'Not yet available'}</td>
          </tr>)
      }
 
    </tbody>
  </table>
</div>

            </div>
            
        </div>
    );
};

export default AllDeliverMan;