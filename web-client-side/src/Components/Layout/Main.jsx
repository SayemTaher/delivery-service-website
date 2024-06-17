import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../Navigation/NavBar';
import Footer from '../Navigation/Footer';

const Main = () => {
    return (
        <div>
            <NavBar></NavBar>
            <div className='flex flex-col container mx-auto'>
              <Outlet></Outlet>  
            </div>
            
            <Footer></Footer>
            
        </div>
    );
};

export default Main;