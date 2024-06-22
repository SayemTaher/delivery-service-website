import React from 'react';
import { motion } from 'framer-motion';

const Banner = () => {
    return (
        <div className="bg-[url('https://i.ibb.co/CKnzmBg/anirudh-w-Ke-Zstqx-KTQ-unsplash.jpg.ibb.co/r6n8znH/kira-auf-der-heide-IPx7-J1n-x-Uc-unsplash.jpg')] min-h-[800px] bg-cover bg-center h-96 flex gap-5 flex-col justify-center items-center text-blue-950">
            <div className='flex backdrop-blur-md p-10 rounded-xl shadow-md flex-col justify-center items-center'>
            <motion.h1
                className="text-2xl lg:text-6xl text-white font-bold mb-4"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                Welcome to Fast Track 
            </motion.h1>
            <motion.h2 className='text-lg mb-5 text-gray-50  '>
                We deliver your wishes with intense care
            </motion.h2>
            <motion.div
                className="relative w-full max-w-md"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                <input
                    type="text"
                    className="w-full border-2 shadow-md border-gray-300  p-4 text-black rounded-full"
                    placeholder="Search for parcels..."
                />
                <button className="absolute right-0 top-0 h-full px-4 bg-blue-900 text-white rounded-r-full">Search</button>
            </motion.div>
            </div>
        
        </div>
    );
};

export default Banner;
