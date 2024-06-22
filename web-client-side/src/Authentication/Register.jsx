import React, { useContext, useState } from "react";
import { Link, UNSAFE_FetchersContext, useLocation, useNavigate } from "react-router-dom";

import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { SlArrowLeftCircle } from "react-icons/sl";
import { Helmet } from "react-helmet-async";


import { AuthContext } from "../Components/Providers/AuthProvider";

import useAxiosPublic from "../AxiosPublic/useAxiosPublic";


const Register = () => {
    const axiosPublic = useAxiosPublic()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const { createUser, updateUserProfile, signInWithGoogle } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [showPassword, setShowPassword] = useState(false);
    const handleGoogleSignIn = () => {
        signInWithGoogle()
            .then((result) => {
                // console.log(result.user);
                const userInfo = {
                    name: result.user.displayName,
                    email: result.user.email,
                    
                    role:'user'

                };
                axiosPublic.post("/user", userInfo).then((res) => {
                    console.log(res.data);
                    toast.success("Signed in successfully");
                    navigate(from, { replace: true });
                });
            })
            .catch((error) => {
                console.log(error.message);
                toast.error(error.message);
            });
    };


    const onSubmit = (data) => {
        console.log(data)
        createUser(data.email, data.password)
            .then(result => {
                console.log(result.user)
                updateUserProfile(data.name, data.photo)
                const userInfo = {
                    name: data.name,
                    email: data.email,
                    role:data.role,
                    photoURL : data.photo

                }
                axiosPublic.post('/user', userInfo)
                    .then(res => {
                        if (res.data.insertedId) {
                            reset();
                            toast.success("User created successfully");
                            navigate("/");
                        }
                    })

            })
            .catch(error => {
                toast.error(error.message)
            })
    };

    return (
        <div
            data-aos="fade-up"
            className=" flex bg-bgPrimary flex-col pt-10 lg:pt-0 justify-center min-h-screen"
        >
            <Helmet>
                <title>Fast Track | User Register</title>
            </Helmet>
            <div className="flex justify-between ml-5 mr-5 gap-5 flex-col lg:flex-row">
                <div
                    data-aos="fade-up-left"
                    className=" hidden lg:flex mr-10 ml-10 lg:mr-0 rounded-md border-2 border-white  lg:ml-0 bg-[url('https://i.ibb.co/7YKzRf4/image-5.jpg')] h-[645px] bg-no-repeat bg-cover w-full"
                ></div>
                <div
                    data-aos="fade-up-right"
                    className="w-full max-w-sm p-6 m-auto mx-auto flex flex-col  bg-white rounded-lg shadow-md  border-2 border-gray-300"
                >
                    <div className="flex justify-center mx-auto">
                        <p className="text-2xl tracking-wide font-semibold">
                            Fast Track | Register
                        </p>
                    </div>

                    <form
                        className="mt-6 flex flex-col gap-5"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div>
                            <label className="block text-sm text-gray-800 ">
                                Enter Full Name
                            </label>
                            <input
                                type="text"
                                // onChange={(e) => setName(e.target.value)}
                                // value={name}
                                name="name"
                                {...register("name", { required: true })}
                                placeholder="Enter your full name"
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg  focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                            {errors.name && (
                                <span className="text-red-500 mt-2">
                                    This field is required
                                </span>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm text-gray-800 ">
                                Enter photoURL
                            </label>
                            <input
                                type="text"
                                // value={photoUrl}
                                // onChange={(e) => setPhotoUrl(e.target.value)}
                                name="photo"
                                {...register("photo", { required: true })}
                                placeholder="Enter your photoUrl"
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg  focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                            {errors.photo && (
                                <span className="text-red-500 mt-2">
                                    This field is required
                                </span>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm text-gray-800 ">
                                Email
                            </label>
                            <input
                                type="email"
                                // onChange={(e) => setEmail(e.target.value)}
                                // value={email}
                                {...register("email", { required: true })}
                                name="email"
                                required
                                placeholder="Enter your email"
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg  focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                            {errors.email && (
                                <span className="text-red-500 mt-2">
                                    This field is required
                                </span>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <div className="flex items-center ">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    //   value={password}
                                    //   onChange={(e) => setPassword(e.target.value)}
                                    name="password"
                                    {...register("password", {
                                        required: true,
                                        pattern: /^(?=.*[A-Z])(?=.*[a-z]).{6,}$/,
                                    })}
                                    placeholder="password"
                                    className="input input-bordered w-full"
                                />
                                {errors.password && (
                                    <span className="text-red-500 mt-2">
                                        This field is required
                                    </span>
                                )}
                                <span
                                    className="-ml-6"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <IoEyeOutline> </IoEyeOutline>
                                    ) : (
                                        <IoEyeOffOutline></IoEyeOffOutline>
                                    )}
                                </span>
                            </div>
                            <div className="mt-2 mb-2">
                                <label >Select Role</label>
                                <select className="select select-bordered w-full max-w-full" {...register("role", { required: true })}>
                                    <option value="user">User</option>
                                    <option value="delivery">DeliveryMan</option>

                                </select>
                                {errors.role && (
                                    <span className="text-red-500 mt-2">
                                        This field is required
                                    </span>
                                )}
                            </div>
                            {/* place checkbox here */}
                            <div className="flex gap-2 items-center mt-2 mb-2">
                                <input type="checkbox" className="checkbox" required />
                                <span>Accept terms & conditions</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <input
                                type="submit"
                                value="Sign Up"
                                className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                            ></input>
                        </div>
                    </form>
                    <div
                        className="flex items-center mt-6 -mx-2"
                    // onClick={handleGoogleLogin}
                    >
                        <button
                            type="button"
                            className="flex items-center justify-center w-full px-6 py-2 mx-2 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:bg-blue-400 focus:outline-none"
                        >
                            <svg className="w-4 h-4 mx-2 fill-current" viewBox="0 0 24 24">
                                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"></path>
                            </svg>

                            <span
                                className="hidden mx-2 sm:inline"
                                onClick={handleGoogleSignIn}
                            >
                                Sign in with Google
                            </span>
                        </button>
                    </div>

                    <div className="flex justify-center gap-2 items-center">
                        <p className="mt-8  text-xs font-light text-center text-gray-400">
                            Already have an account?
                            <span className="ml-2">
                                <Link
                                    to="/login"
                                    className="font-medium text-gray-700  hover:underline"
                                >
                                    Sign In
                                </Link>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-5 ">
                <Link to="/">
                    <button className="flex items-center gap-2">
                        <SlArrowLeftCircle className="text-3xl  rounded-full hover:scale-95 font-bold text-blue-600 "></SlArrowLeftCircle>{" "}
                        Back to Home
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Register;

