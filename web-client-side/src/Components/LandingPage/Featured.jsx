import React from 'react';

const Featured = () => {
    return (
        <div className='flex flex-col gap-5 p-10 bg-gray-50 mt-10 mb-10 items-center justify-center flex-wrap'>
            <div className='mb-4 mt-4 border-b-2 pb-5'>
                <h1 className='text-4xl text-center font-bold text-blue-900'>Why customers chooses us ? </h1>
            </div>
            <div className='flex flex-col lg:flex-row gap-10 justify-center'>
            <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
                <div 
                    className="w-full h-64 bg-gray-300 bg-center bg-cover rounded-lg shadow-md" 
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1521903062400-b80f2cb8cb9d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80)' }}
                ></div>

                <div className="w-56 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64 dark:bg-gray-800">
                    <h3 className="py-2 font-bold tracking-wide text-center text-gray-800 uppercase dark:text-white">Nike Revolt</h3>

                    <div className="flex items-center justify-between px-3 py-2 bg-gray-200 dark:bg-gray-700">
                        <span className="font-bold text-gray-800 dark:text-gray-200">$129</span>
                        <button className="px-2 py-1 text-xs font-semibold text-white uppercase transition-colors duration-300 transform bg-gray-800 rounded hover:bg-gray-700 dark:hover:bg-gray-600 focus:bg-gray-700 dark:focus:bg-gray-600 focus:outline-none">Add to cart</button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
                <div 
                    className="w-full h-64 bg-gray-300 bg-center bg-cover rounded-lg shadow-md" 
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1521903062400-b80f2cb8cb9d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80)' }}
                ></div>

                <div className="w-56 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64 dark:bg-gray-800">
                    <h3 className="py-2 font-bold tracking-wide text-center text-gray-800 uppercase dark:text-white">Nike Revolt</h3>

                    <div className="flex items-center justify-between px-3 py-2 bg-gray-200 dark:bg-gray-700">
                        <span className="font-bold text-gray-800 dark:text-gray-200">$129</span>
                        <button className="px-2 py-1 text-xs font-semibold text-white uppercase transition-colors duration-300 transform bg-gray-800 rounded hover:bg-gray-700 dark:hover:bg-gray-600 focus:bg-gray-700 dark:focus:bg-gray-600 focus:outline-none">Add to cart</button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
                <div 
                    className="w-full h-64 bg-gray-300 bg-center bg-cover rounded-lg shadow-md" 
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1521903062400-b80f2cb8cb9d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80)' }}
                ></div>

                <div className="w-56 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64 dark:bg-gray-800">
                    <h3 className="py-2 font-bold tracking-wide text-center text-gray-800 uppercase dark:text-white">Nike Revolt</h3>

                    <div className="flex items-center justify-between px-3 py-2 bg-gray-200 dark:bg-gray-700">
                        <span className="font-bold text-gray-800 dark:text-gray-200">$129</span>
                        <button className="px-2 py-1 text-xs font-semibold text-white uppercase transition-colors duration-300 transform bg-gray-800 rounded hover:bg-gray-700 dark:hover:bg-gray-600 focus:bg-gray-700 dark:focus:bg-gray-600 focus:outline-none">Add to cart</button>
                    </div>
                </div>
            </div>
            </div>

        </div>
    );
};

export default Featured;
