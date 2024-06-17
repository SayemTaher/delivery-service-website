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
                element:<Private><DashboardRoute></DashboardRoute></Private>
            }
        ]
    },
]);