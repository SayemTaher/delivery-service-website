import {
    createBrowserRouter,

} from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../LandingPage/Home";
import Error from "../Error/Error";
import Login from "../../Authentication/Login";
import Register from "../../Authentication/Register";
import DashboardRoute from "../Dashboard/DashboardRoute";
import Private from "./Private.jsx";
import AdminHome from "../Admin/AdminHome.jsx";
import AllDeliverMan from "../Admin/AllDeliverMan.jsx";
import AllParcels from "../Admin/AllParcels.jsx";
import AllUsers from "../Admin/AllUsers.jsx";
import Statistics from "../Admin/Statistics.jsx";
import MyDelivery from "../DeliveryDriver/MyDelivery.jsx";
import MyReviews from "../DeliveryDriver/MyReviews.jsx";

import BookParcels from "../User/BookParcels.jsx";
import MyParcels from "../User/MyParcels.jsx";
import MyProfile from "../User/MyProfile.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";
import General from "../Dashboard/General.jsx";
import UpdateParcel from "../User/UpdateParcel.jsx";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        errorElement: <Error></Error>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/login',
                element:<Login></Login>
            },{
                path:'/register',
                element:<Register></Register>
            },
            {
                path:'/dashboard',
                element:<DashboardRoute></DashboardRoute>
            }
        ]
    },
    {
        path: '/dashboard',
        element:<Private><Dashboard></Dashboard></Private>,
        errorElement:<Error></Error>,
        children:[
            {
                path:'/dashboard/adminHome',
                element: <AdminHome></AdminHome>

            },
            {
                path: '/dashboard/adminDeliveryMan',
                element: <AllDeliverMan></AllDeliverMan>
            },
            {
                path : '/dashboard/adminParcels',
                element: <AllParcels></AllParcels>

            },
            {
                path: '/dashboard/AdminAllUsers',
                element: <AllUsers></AllUsers>
            },
            {
                path : '/dashboard/statistics',
                element: <Statistics></Statistics>
            },
            //for delivery man 
            {
                path: '/dashboard/MyDelivery',
                element:<MyDelivery></MyDelivery>
            },
            {
                path:'/dashboard/MyReviews',
                element: <MyReviews></MyReviews>
            },
            // for users 
            
            {
                path:'/dashboard/BookParcels',
                element:<BookParcels></BookParcels>
            },
            {
                path:'/dashboard/MyParcels',
                element:<MyParcels></MyParcels>
            },
            {
                path:'/dashboard/MyProfile',
                element:<MyProfile></MyProfile>
            },
            {
                path:'/dashboard/update/:id',
                element: <UpdateParcel></UpdateParcel>,
                loader: ({params}) => fetch(`https://server-side-rose.vercel.app/parcelBookingData/${params.id}`)

            },
            //genral 
            {
                path:'/dashboard/general',
                element:<General></General>
            }
        ]
    }
]);