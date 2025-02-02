import React, { useState, useEffect } from 'react';
import loginImage from '../assets/login.png';
import logo from '../assets/Logo.svg';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import axios from 'axios';
import { message } from 'antd';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from 'framer-motion';
import {  FaLock, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import store from '../zustand/loginStore';

const schema = z.object({
  email: z.string()
    .min(1, { message: "Email is required" })
    .email("Please enter valid email format"),
  password: z.string()
    .min(3, { message: "Password must be at least 3 characters" })
});
const Login = () => {
    const { setLoggedInUser, isLogin, loginUserData } = store(state => ({
        setLoggedInUser: state.setLoggedInUser,
        isLogin: state.isLogin,
        loginUserData: state.loginUserData
    }));
    
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema)
    })
    useEffect(() => {
        if (isLogin && loginUserData?.role) {
            const dashboardPath = loginUserData.role === "Teacher" 
                ? "/teacherdashboard" 
                : "/studentdashboard";
            navigate(dashboardPath, { replace: true });
        }
    }, [isLogin, loginUserData.role, navigate]);

    const submitHandle = async (formData) => {
        try {
            setIsLoggingIn(true);
            const response = await axios.post('http://localhost:8080/api/v1/users/login', {
                email: formData.email,
                password: formData.password,
            });

            const userData = response.data.data.loginUser;
            const accessToken = response.data.data.accessToken;
            const refreshToken = response.data.data.refreshToken;

            if (!userData?.role) {
                throw new Error("Invalid user data received");
            }

            // Store tokens in localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            // Update Zustand store
            setLoggedInUser(userData, accessToken, refreshToken);
            
            message.success(response.data?.message);

        } catch (error) {
            console.error(error);
            message.error(error.response?.data?.message || "Login failed.");
        } finally {
            setIsLoggingIn(false);
        }
    };


    // Create a custom axios instance with interceptors
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080/api/v1',
        withCredentials: true
    });

    // Add a request interceptor to include the access token
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Add a response interceptor for token refresh
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // Check if the error is due to token expiration and not already retried
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    // Call the backend refresh token endpoint
                    const response = await axios.post(
                        'http://localhost:8080/api/v1/users/refreshtoken',
                        { refreshToken: localStorage.getItem('refreshToken') },
                        { withCredentials: true }
                    );

                    const { accessToken, refreshToken } = response.data.data;

                    // Update stored tokens
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);

                    // Update authorization header for the original request
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // Logout user if refresh fails
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );


    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50"
      >
        <div className="flex flex-col w-full mx-4 overflow-hidden bg-white/80 shadow-2xl backdrop-blur-xl max-w-6xl rounded-[40px] md:flex-row ring-1 ring-white/20">
          {/* Image Section */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative flex-col justify-center hidden p-8 md:w-1/2 md:flex bg-gradient-to-br from-purple-600/90 via-blue-600/90 to-indigo-600/90"
          >
            <div className="relative z-10 space-y-6 text-white">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-5xl font-bold leading-tight"
              >
                Welcome Back!<br />
                <span className="text-3xl font-medium">Continue Your Journey</span>
              </motion.h1>
              <motion.img 
                src={loginImage} 
                alt="Login Illustration"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-md mx-auto mt-8 transform hover:scale-[1.02] transition-all duration-300"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>
  
          {/* Form Section */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="p-8 md:w-1/2 md:p-12 lg:p-16 bg-white/70 backdrop-blur-lg"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center mb-8"
            >
              <img 
                src={logo} 
                alt="Logo" 
                className="w-20 h-20 mr-3 rounded-xl shadow-xl transform hover:rotate-[-4deg] transition-transform"
              />
              <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text">
                AttendEase
              </h2>
            </motion.div>
  
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 text-3xl font-bold text-center text-gray-800"
            >
              Welcome Back! 👋
            </motion.h1>
  
            <form onSubmit={handleSubmit(submitHandle)} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
              >
                <FaEnvelope className="absolute text-gray-500 transition-colors transform -translate-y-1/2 left-4 top-1/2 group-focus-within:text-purple-600" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="Enter your email"
                  className="w-full py-4 pl-12 pr-6 transition-all duration-300 border-2 border-gray-200/80 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200/30 placeholder-gray-400/80 hover:border-gray-300 bg-white/50"
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="mt-2 text-sm text-red-500"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
  
              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative group"
              >
                <FaLock className="absolute text-gray-500 transition-colors transform -translate-y-1/2 left-4 top-1/2 group-focus-within:text-purple-600" />
                <input
                  type="password"
                  {...register('password')}
                  placeholder="Enter your password"
                  className="w-full py-4 pl-12 pr-6 transition-all duration-300 border-2 border-gray-200/80 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200/30 placeholder-gray-400/80 hover:border-gray-300 bg-white/50"
                />
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="mt-2 text-sm text-red-500"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
  
              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoggingIn}
                className="w-full px-8 py-4 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl hover:shadow-xl hover:bg-gradient-to-r hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 group"
              >
                <span className="flex items-center justify-center">
                  {isLoggingIn ? 'Logging in...' : 'Continue'}
                  <FaArrowRight className="ml-3 transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>
  
              {/* Divider */}
              <div className="relative flex items-center py-6">
                <div className="flex-grow border-t border-gray-300/50"></div>
                <span className="flex-shrink mx-4 text-gray-500/80">or</span>
                <div className="flex-grow border-t border-gray-300/50"></div>
              </div>
  
              {/* Additional Links */}
              <div className="flex flex-col space-y-4 text-center">
                <button
                  onClick={() => navigate('/signup')}
                  className="font-medium transition-colors text-gray-600/90 hover:text-purple-600"
                >
                  Create new account
                </button>
                <button className="text-sm transition-colors text-gray-500/80 hover:text-purple-600">
                  Forgot password?
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    );
  };
  
  export default Login;
