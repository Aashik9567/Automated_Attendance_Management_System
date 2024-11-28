import React,{useState} from 'react'
import login from '../assets/login.png'
import ImageDisplayer from './ImageDisplayer'
import {useNavigate} from 'react-router-dom'
import { z } from "zod"
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import axios from 'axios'
import { toast } from 'react-toastify'
const schema=z.object({
  email: z.string().min(1, { message: "Email is required" }).email("please enter valid format of email"),
  password: z.string().min(1, { message: "Password is required" }),
  confirmPassword:z.string().min(1,{message:'confirm the password'}),
  role: z.string().min(1, {message: "role is required"}),
  firstName:z.string().min(1,{message:"first name is required"}),
  lastName:z.string().min(1,{message:"last name is required "})
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})
const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const nav=useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema)
  })
  const submitHandle=async (data)=>{
    console.log(data);  
    try {
      setLoading(true);
      console.log(data)
      const response = await axios.post("http://localhost:8080/api/v1/users/signup", {
        email: data.email,
        password: data.password,
        role: data.role,
        firstName:data.firstName,
        lastName:data.lastName
      });
      console.log(response.data)
      nav("/login");
      toast.success(response?.data.message);
    } catch (error) {
        toast.error(error.response.data.message);
  }
  finally{
    setLoading(false)
  }
  }

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row ">
        {/* Image Part */}
        <ImageDisplayer login={login} />
        {/* signup part */}
        <div className="flex flex-col justify-center h-screen px-6 py-8 md:w-1/2 bg-gradient-to-b from-purple-400 to-indigo-400">
          <div className="w-full mx-auto rounded-lg shadow sm:max-w-md xl:p-0">
            <div className="p-6 md:space-y-4 sm:p-8">
              <h1 className="mb-4 text-xl font-bold text-center md:text-2xl">
                Sign Up
              </h1>
              <div className='mb-5 text-sm font-light'>Enter details to create your account</div>
              <form onSubmit={handleSubmit(submitHandle)} className="space-y-4 md:space-y-4" action="#">
                <select id="role" className="block w-full p-2 text-sm border rounded-lg bg-gray-50 border-blur-e00" {...register("role")}>
                       <option value="Teacher" >Teacher</option>
                       <option value="Student">Student</option>
                </select>
                 {errors.role && (<p className="text-red-400">{errors.role.message}</p>)}
                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="relative z-0 w-full mb-5 group">
                    <input type="text" {...register("firstName")} id="firstName" className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "/>
                    <label htmlFor="firstName" className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">first name</label>
                    {errors.firstName && (<p className="text-red-400">{errors.firstName.message}</p>)}
                  </div>
                  <div className="relative z-0 w-full mb-5 group">
                    <input type="text" {...register("lastName")} id="lastName" className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "/>
                    <label htmlFor="lastName" className="peer-focus:font-medium absolute text-sm  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">last name</label>
                    {errors.lastName && (<p className="text-red-400">{errors.lastName.message}</p>)}
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium">Your email</label>
                  <input type="email" {...register("email")} id="email" className="block w-full p-2 border border-blue-500 rounded-lg focus:ring-primary-600 focus:border-primary-600" placeholder="name@acem.edu.np"/>
                  {errors.email && (<p className="text-red-400">{errors.email.message}</p>)}
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                  <input type="password" {...register("password")} id="password" placeholder="Enter password" className="block w-full p-2 border border-blue-500 rounded-lg focus:ring-primary-600 focus:border-primary-600" />
                  {errors.password && <p className='text-red-400'>{errors.password.message}</p>}
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium">Confirm Password</label>
                  <input type="confirm-password" {...register("confirmPassword")} id="confirm-password" placeholder="Confirm password" className="block w-full p-2 border border-blue-500 rounded-lg focus:ring-primary-600 focus:border-primary-600"/>
                  {errors.confirmPassword && <p className='text-red-400'>{errors.confirmPassword.message}</p>}
                </div>
                <button type="submit" disabled={loading} className="w-full bg-cyan-300 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4">{loading ? "Loading...." : "Create an account"}</button>
                <p className="text-sm font-light ">
                  Already have an account? <button onClick={()=> nav("/login")} type="button" className="px-4 py-2 mx-3 mb-2 text-sm font-medium text-center text-white rounded-lg shadow-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 shadow-teal-500/50 dark:shadow-teal-800/80 me-2">Login here</button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default SignUp
