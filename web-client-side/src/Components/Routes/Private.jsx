
import { Navigate, useLocation } from 'react-router-dom';

import { useContext } from 'react';
import { AuthContext } from '../Providers/AuthProvider';
 
 
const Private = ({ children }) => {
    const { user, loading } = useContext(AuthContext)
    const location = useLocation()
   
    if (loading) {
        return (
              <div className="flex flex-col gap-4 w-52">
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
        )
        
    }
    if (user) {
        return children
    }
 
    return (
       <Navigate state={{from:location}} to='/login' replace></Navigate>
    );
};
 
export default Private;