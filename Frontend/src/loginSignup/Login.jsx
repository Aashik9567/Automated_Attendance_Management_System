import React, { useEffect } from 'react';
import login from '../assets/login.png'
import { Link } from 'react-router-dom';
import logo from '../assets/Logo.png'
import ImageDisplayer from './ImageDisplayer';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import axios from 'axios';
import { message } from 'antd';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import store from '../zustand/loginStore'
const schema = z.object({
    email: z.string()
        .min(1, { message: "Email is required" })
        .email("Please enter valid email format"),
    password: z.string()
        .min(3, { message: "Password must be at least 3 characters" })
})
const Login = () => {
    const {setLoginStatus,setLoggedInUser}=store(state=>state)
    
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema)
    })

    const  submitHandle = async (formData) => {
        try{
            const response = await axios.post('http://localhost:8080/api/v1/users/login', {
                email: formData.email,
                password: formData.password
            });
            setLoginStatus(true);
            const userData=response.data.data.loginUser;
            const accessToken= response.data.data.accessToken
            const refreshToken=response.data.data.refreshToken
        
            setLoggedInUser(userData);
            message.success(response.data?.message);
            localStorage.setItem('accessToken',accessToken);
            localStorage.setItem('refreshToken',refreshToken);
            if(userData.role==="Teacher"){
                navigate("/teacherdashboard");
            }else{
                navigate("/studentdashboard");
            }

        }
        catch(error){
            console.log(error)
            message.error(error.response.data.message);
        }
        finally{
            // setLoading(false)
        }
    }
    return (
        <div className="flex flex-col-reverse md:flex-row ">
            {/* Image Part */}
            <ImageDisplayer login={login} />
            {/* Login Part */}
            <div className="flex flex-col justify-center h-screen px-6 py-8 md:w-1/2 bg-gradient-to-b from-purple-400 to-indigo-400">
                <div className="mb-4 text-center md:mb-8">
                    <img className="w-[90px] h-[70px] inline-block mr-2" src={logo} alt="logo" />
                    <span className="text-2xl font-semibold">AAMS</span>
                </div>
                <div className="w-full mx-auto rounded-lg shadow sm:max-w-md xl:p-0">
                    <div className="p-6 md:space-y-4 sm:p-8">
                        <h1 className="mb-6 text-xl font-bold text-center md:text-2xl">
                            Sign in to your account
                        </h1>
                        <form onSubmit={handleSubmit(submitHandle)} className="space-y-2 md:space-y-4">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium">Your email</label>
                                <input type="email" {...register('email',)} id="email" className="block w-full p-2 border border-blue-500 rounded-lg focus:ring-primary-600 focus:border-primary-600" placeholder="name@acem.edu.np" />
                                {errors.email && (<p className="text-red-400">{errors.email.message}</p>)}
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                                <input type="password" {...register('password',)} id="password" placeholder="Enter password" className="block w-full p-2 border border-blue-500 rounded-lg focus:ring-primary-600 focus:border-primary-600" />
                                {errors.password && <p className='text-red-400'>{errors.password.message}</p>}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <input id="remember" type="checkbox" className="w-4 h-4 border border-blue-500 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600" />
                                    <label htmlFor="remember" className="ml-2 text-sm">Remember me</label>
                                </div>
                                <Link to="#" className="text-sm font-medium text-blue-500 hover:underline">Forgot password?</Link>
                            </div>
                            <button type="submit" className="w-full bg-cyan-300 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4">Login</button>
                            <p className="mt-4 text-sm font-light text-center">
                                Don’t have an account yet?<button onClick={() => navigate('/signup')} type="button" className="px-5 py-2 mx-3 mb-2 text-sm font-medium text-center text-white rounded-lg shadow-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 me-2">Signup</button>
                            </p>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
