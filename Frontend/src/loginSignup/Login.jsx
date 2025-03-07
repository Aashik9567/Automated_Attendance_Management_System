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
import { FaLock, FaEnvelope, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import { ReactTyped } from 'react-typed';
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
      const response = await axios.post(`${loginUserData.baseURL}/users/login`, {
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
    baseURL: loginUserData?.baseURL,
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
            `${loginUserData.baseURL}/users/refreshtoken`,
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
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900"
    >
      <div className="flex flex-col w-full mx-4 overflow-hidden bg-white/5 shadow-2xl backdrop-blur-xl max-w-6xl rounded-[40px] md:flex-row ring-1 ring-white/20">
        {/* Image Section */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative flex-col justify-center hidden p-8 md:w-1/2 md:flex bg-gradient-to-br from-purple-600/40 via-blue-600/40 to-indigo-600/40"
        >
          <div className="relative z-10 space-y-6">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl font-bold leading-tight text-transparent bg-gradient-to-r from-purple-300 via-blue-200 to-indigo-100 bg-clip-text"
            >
              <ReactTyped
                strings={["Secure Academic Access"]}
                typeSpeed={40}
                showCursor={false}
              />
              <br />
              <span className="text-2xl font-medium text-purple-200">
                AI-Powered Attendance System
              </span>
            </motion.h1>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative overflow-hidden rounded-3xl group"
            >
              <img
                src={loginImage}
                alt="Login Illustration"
                className="w-full max-w-md mx-auto transition-all duration-500 transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>

            <div className="grid grid-cols-3 gap-4 mt-8 text-center">
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-purple-400">99.6%</div>
                <div className="text-sm text-purple-200">Accuracy</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-blue-400">0.2s</div>
                <div className="text-sm text-blue-200">Recognition</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-indigo-400">256-bit</div>
                <div className="text-sm text-indigo-200">Encryption</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="p-8 md:w-1/2 md:p-12 lg:p-16 bg-gradient-to-br from-gray-800/60 to-purple-900/40 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center mb-8 space-x-4"
          >
            <img
              src={logo}
              alt="Logo"
              className="w-16 h-16 transition-all duration-500 rounded-xl hover:rotate-[8deg] hover:shadow-glow"
            />
            <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-300 via-blue-200 to-indigo-100 bg-clip-text">
              AttendEase
            </h2>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-3xl font-bold text-center text-purple-100"
          >
            <ReactTyped
              strings={["Faculty Portal Access"]}
              typeSpeed={40}
              showCursor={false}
            />
          </motion.h1>

          <form onSubmit={handleSubmit(submitHandle)} className="space-y-8">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <FaEnvelope className="text-purple-500" />
              </div>
              <input
                {...register("email")}
                type="email"
                placeholder="Academic Email"
                className="w-full py-4 pl-12 pr-4 text-gray-700 transition-all border-2 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 bg-white/50 placeholder:text-slate-600"
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <FaLock className="text-purple-500" />
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="Secure Password"
                className="w-full py-4 pl-12 pr-4 text-gray-700 transition-all border-2 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 bg-white/50 placeholder:text-slate-600"
              />
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoggingIn}
              className="w-full px-8 py-4 font-semibold text-white transition-all duration-300 shadow-xl bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-2xl hover:shadow-2xl hover:bg-gradient-to-r hover:from-purple-400 hover:via-blue-400 hover:to-indigo-400 group"
            >
              <span className="flex items-center justify-center tracking-wide">
                {isLoggingIn ? (
                  <span className="flex items-center gap-3">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="block w-5 h-5 border-2 border-white rounded-full border-t-transparent"
                    />
                    Authenticating...
                  </span>
                ) : (
                  <>
                    Continue Session
                    <FaArrowRight className="ml-3 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </motion.button>

            {/* Additional Links */}
            <div className="flex flex-col items-center space-y-4 text-center">
              <button
                onClick={() => navigate('/signup')}
                className="font-medium transition-colors text-purple-200/80 hover:text-purple-100 group"
              >
                New Faculty?
                <span className="ml-2 text-transparent bg-gradient-to-r from-purple-300 to-blue-200 bg-clip-text group-hover:from-purple-100 group-hover:to-blue-50">
                  Request Access
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
