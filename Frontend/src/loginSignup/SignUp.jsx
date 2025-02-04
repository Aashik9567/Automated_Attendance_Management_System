import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { message } from 'antd';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaBook, FaArrowRight, FaGraduationCap, FaChalkboardTeacher, FaUserGraduate, FaKey } from 'react-icons/fa';

const schema=z.object({
  email: z.string().min(1, { message: "Email is required" }).email("please enter valid format of email"),
  password: z.string().min(1, { message: "Password is required" }),
  confirmPassword:z.string().min(1,{message:'confirm the password'}),
  role: z.string().min(1, {message: "role is required"}),
  fullName:z.string().min(1,{message:"full name is required"}),
  semester: z.preprocess(
    (value) => (typeof value === "string" ? parseInt(value, 10) : value),
    z.number()
      .min(1, { message: "Semester must be at least 1" })
      .max(8, { message: "Semester must not exceed 8" })
  )
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})
const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema)
  })
  const submitHandle = async (data) => {
    try {
      setLoading(true);

      // Make the API call
      const response = await axios.post("http://localhost:8080/api/v1/users/signup", {
        email: data.email,
        password: data.password,
        role: data.role,
        fullName: data.fullName,
        semester: data.semester
      });

      // Check if the response is valid
      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }

      // Navigate to login page on success
      navigate("/login");
      message.success(response.data.message || "Account created successfully!");
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        message.error(error.response.data.message || "Signup failed. Please try again.");
      } else if (error.request) {
        // The request was made but no response was received
        message.error("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        message.error("An unexpected error occurred. Please try again.");
      }
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };
  return (
<motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900"
      >      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-fixed"></div>
      
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          <div className="grid overflow-hidden text-transparent shadow-2xl bg-gradient-to-r from-purple-300 via-blue-200 to-indigo-100 rounded-3xl md:grid-cols-2">
            {/* Left Column - Form */}
            <div className="p-8 lg:p-12">
              <motion.div {...fadeInUp} className="mb-8">
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text">
                  Create Your Account
                </h1>
                <p className="mt-2 text-gray-600">Join our educational platform today</p>
              </motion.div>

              <form onSubmit={handleSubmit(submitHandle)} className="space-y-6">
                {/* Role Selection Cards */}
                <motion.div {...fadeInUp} className="grid grid-cols-2 gap-4 mb-6">
                  <div className="relative">
                    <input 
                      type="radio" 
                      {...register("role")} 
                      value="Teacher" 
                      id="teacher-role"
                      className="hidden peer" 
                    />
                    <label 
                      htmlFor="teacher-role"
                      className="flex flex-col items-center p-4 text-gray-600 transition-all bg-white border-2 border-gray-200 cursor-pointer rounded-xl hover:border-purple-400 peer-checked:border-purple-500 peer-checked:bg-purple-50"
                    >
                      <FaChalkboardTeacher className="w-8 h-8 mb-2 text-purple-500" />
                      <span className="font-medium">Teacher</span>
                    </label>
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="radio" 
                      {...register("role")} 
                      value="Student" 
                      id="student-role"
                      className="hidden peer" 
                    />
                    <label 
                      htmlFor="student-role"
                      className="flex flex-col items-center p-4 text-gray-600 transition-all bg-white border-2 border-gray-200 cursor-pointer rounded-xl hover:border-purple-400 peer-checked:border-purple-500 peer-checked:bg-purple-50"
                    >
                      <FaUserGraduate className="w-8 h-8 mb-2 text-purple-500" />
                      <span className="font-medium">Student</span>
                    </label>
                  </div>
                </motion.div>

                <motion.div {...fadeInUp} className="space-y-4">
                  {/* Full Name Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <FaUser className="text-purple-500" />
                    </div>
                    <input
                      {...register("fullName")}
                      type="text"
                      placeholder="Full Name"
                      className="w-full py-4 pl-12 pr-4 text-gray-700 transition-all border-2 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 bg-white/50"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <FaEnvelope className="text-purple-500" />
                    </div>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="Email Address"
                      className="w-full py-4 pl-12 pr-4 text-gray-700 transition-all border-2 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 bg-white/50"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Semester Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <FaBook className="text-purple-500" />
                    </div>
                    <input
                      {...register("semester")}
                      type="number"
                      placeholder="Semester (1-8)"
                      className="w-full py-4 pl-12 pr-4 text-gray-700 transition-all border-2 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 bg-white/50"
                    />
                    {errors.semester && (
                      <p className="mt-1 text-sm text-red-500">{errors.semester.message}</p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <FaKey className="text-purple-500" />
                    </div>
                    <input
                      {...register("password")}
                      type="password"
                      placeholder="Password"
                      className="w-full py-4 pl-12 pr-4 text-gray-700 transition-all border-2 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 bg-white/50"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <FaLock className="text-purple-500" />
                    </div>
                    <input
                      {...register("confirmPassword")}
                      type="password"
                      placeholder="Confirm Password"
                      className="w-full py-4 pl-12 pr-4 text-gray-700 transition-all border-2 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 bg-white/50"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </motion.div>

                {/* Sign Up Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/30"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                    <FaArrowRight className={`transition-transform ${loading ? 'translate-x-2' : ''}`} />
                  </span>
                </motion.button>

                {/* Login Link */}
                <p className="text-center text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="font-semibold text-purple-600 hover:text-purple-700"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            </div>

            {/* Right Column - Features */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600">
                <div className="absolute inset-0 bg-grid-white/[0.2] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
              </div>
              
              <div className="relative h-full p-12 text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col justify-center h-full"
                >
                  <h2 className="mb-8 text-4xl font-bold">Welcome to AttendEase</h2>
                  
                  <div className="space-y-6">
                    <div className="p-6 transition-all bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20">
                      <h3 className="flex items-center mb-4 text-xl font-semibold">
                        <FaGraduationCap className="mr-3" />
                        Smart Attendance
                      </h3>
                      <p className="text-white/80">
                        Automated attendance tracking system that saves time and improves accuracy
                      </p>
                    </div>

                    <div className="p-6 transition-all bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20">
                      <h3 className="flex items-center mb-4 text-xl font-semibold">
                        <FaChalkboardTeacher className="mr-3" />
                        Easy Management
                      </h3>
                      <p className="text-white/80">
                        Intuitive tools for teachers to manage classes and track student progress
                      </p>
                    </div>

                    <div className="p-6 transition-all bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20">
                      <h3 className="flex items-center mb-4 text-xl font-semibold">
                        <FaBook className="mr-3" />
                        Real-time Analytics
                      </h3>
                      <p className="text-white/80">
                        Get instant insights into attendance patterns and student engagement
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
    );
};

export default SignUp;