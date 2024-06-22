import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardRoute from './DashboardRoute';

const Dashboard = () => {
    
    return (
        <div className='flex  '>
            
            <div>
              <DashboardRoute></DashboardRoute>  
            </div>
            <div className='flex-1 '>
               <Outlet ></Outlet> 
            </div>
            
            
        </div>
    );
};

export default Dashboard;