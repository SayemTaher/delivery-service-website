import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../AxiosPublic/useAxiosPublic";
import ReactApexChart from 'react-apexcharts';
import { ImStatsBars } from "react-icons/im";
import { Helmet } from 'react-helmet-async';

const AdminHome = () => {
    const axiosPublic = useAxiosPublic();

    const { data: bookingDates = [] } = useQuery({
        queryKey: ['bookingDates'],
        queryFn: async () => {
            const res = await axiosPublic.get('/allParcels');
            return res.data.map(data => data.booking_Date);
        }
    });

    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                type: 'bar',
                height: 200
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: []
            }
        }
    });

    useEffect(() => {
        if (bookingDates.length > 0) {
            const dateCounts = bookingDates.reduce((acc, date) => {
                const formattedDate = new Date(date).toISOString().split('T')[0];
                acc[formattedDate] = (acc[formattedDate] || 0) + 1;
                return acc;
            }, {});

            const categories = Object.keys(dateCounts);
            const seriesData = Object.values(dateCounts);

            setChartData({
                series: [{
                    name: 'Bookings',
                    data: seriesData
                }],
                options: {
                    ...chartData.options,
                    xaxis: {
                        categories: categories
                    }
                }
            });
        }
    }, [bookingDates]);

    return (
        <div className='flex flex-col m-10'>
            <Helmet><title>Fast Track | Admin Home</title></Helmet>
            <div className='border-b-2 border-dashed pb-5'>
                <h1 className='text-3xl font-bold pb-5 flex items-center gap-2 text-blue-950 border-b-2 '><span className='text-purple-600'><ImStatsBars></ImStatsBars></span> Statistics </h1>
            <h2 className='bg-blue-100 text-blue-700 mt-5 font-semibold p-2'>The below bar chart shows an  overview of Bookings by Date</h2>
            </div>
            <div id="chart" className='mt-5 bg-gray-50 p-5 shadow-md'>
                <ReactApexChart 
                    options={chartData.options} 
                    series={chartData.series} 
                    type="bar" 
                    height={200} 
                />
            </div>
        </div>
    );
};

export default AdminHome;
