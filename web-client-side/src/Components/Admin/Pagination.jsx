import React from 'react';
import { BsArrowLeftCircle } from "react-icons/bs";
import { BsArrowRightCircle } from "react-icons/bs";
const Pagination = ({ usersPerPage, totalUsers, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className='flex fixed bottom-56'>
            <ul className='pagination flex items-center gap-4'>
                {currentPage > 1 && (
                    <li className='page-item'>
                        <button onClick={() => paginate(currentPage - 1)} className='text-2xl page-link'>
                           <BsArrowLeftCircle></BsArrowLeftCircle>
                        </button>
                    </li>
                )}
                {pageNumbers.map(number => (
                    <li key={number} className='page-item '>
                        <button
                            onClick={() => paginate(number)}
                            className={`page-link ${currentPage === number ? 'bg-blue-500 btn text-white' : 'bg-gray-200 btn text-black'}`}
                        >
                            {number}
                        </button>
                    </li>
                ))}
                {currentPage < pageNumbers.length && (
                    <li className='page-item'>
                        <button onClick={() => paginate(currentPage + 1)} className='text-2xl page-link'>
                            <BsArrowRightCircle></BsArrowRightCircle>
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Pagination;
