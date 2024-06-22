import React from 'react';
import axios from 'axios';
const axiosPublic = axios.create({
    baseURL : "https://server-side-rose.vercel.app"
})
const useAxiosPublic = () => {
    return axiosPublic
  
};

export default useAxiosPublic;