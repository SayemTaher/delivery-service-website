import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Featured = () => {
    const cards = [
        {
            image: 'https://i.ibb.co/dQmyzh5/maxim-zrr-UJf-Qb-Y2g-unsplash.jpg',
            title: 'Lightining Fast Delivery',
            info : 'Within 1 or 2 business days'
        },
        {
            image: 'https://i.ibb.co/r6n8znH/kira-auf-der-heide-IPx7-J1n-x-Uc-unsplash.jpg',
            title: 'Home collection',
            info: 'We directly collect the parcel from your home'
        },
        {
            image: 'https://i.ibb.co/QjHkwRz/bg-home.jpg',
            title: 'Deliver with care',
            info: 'Damage insurance'
        }
    ];

    return (
        <div data-aos="fade-up" className='flex flex-col gap-5 p-10 bg-gray-50 mt-10 mb-10 items-center justify-center flex-wrap'>
            <div className='mb-4 mt-4 border-b-2 pb-5'>
                <h1 className='text-4xl text-center font-bold text-blue-900'>Why customers choose us?</h1>
            </div>
            <div className='flex flex-col h-[500px] lg:flex-row gap-10 justify-center'>
                {cards.map((card, index) => (
                    <motion.div
                        key={index}
                        className="flex flex-col items-center text-center justify-center w-full max-w-sm mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                        <div
                            className="w-full h-64 bg-gray-300 bg-center bg-cover rounded-lg shadow-md"
                            style={{ backgroundImage: `url(${card.image})` }}
                        ></div>

                        <div className="w-56 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64 dark:bg-gray-800">
                            <h3 className="py-2 font-bold tracking-wide text-center text-gray-800 uppercase dark:text-white">{card.title}</h3>
                            <h2 className='text-xs text-gray-600 pb-2'>{card.info}</h2>

                            <div className="flex items-center justify-between px-3 py-2 bg-gray-200 dark:bg-gray-700">
                                <span className="font-bold text-gray-800 dark:text-gray-200">{card.price}</span>
                                <Link to='/login'><button className="px-2 py-1 text-xs font-semibold text-white  transition-colors duration-300 transform bg-gray-800 rounded hover:bg-gray-700 dark:hover:bg-gray-600 focus:bg-gray-700 dark:focus:bg-gray-600 focus:outline-none">Register Now</button></Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Featured;
