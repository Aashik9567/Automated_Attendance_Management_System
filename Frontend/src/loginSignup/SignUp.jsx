import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { message } from 'antd';
import { AuthField, AuthLayout, AuthLink, SubmitButton } from './AuthLayout';
import { API_BASE_URL } from "../config/env";

const schema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email("Enter a valid email address"),
  password: z.string().min(8, { message: "Use at least 8 characters" }),
  confirmPassword: z.string().min(1, { message: 'Confirm your password' }),
  fullName: z.string().min(1, { message: "Full name is required" }),
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
  const navigate = useNavigate();
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
      const response = await axios.post(`${API_BASE_URL}/users/signup`, {
        email: data.email,
        password: data.password,
        role: "Student",
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

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Student accounts. Teachers get theirs from the admin."
      footer={<>Already have an account? <AuthLink to="/login">Sign in</AuthLink></>}
    >
      <form onSubmit={handleSubmit(submitHandle)} noValidate className="space-y-5">
        <AuthField id="fullName" label="Full name" autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
        <AuthField id="email" label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <AuthField
          id="semester"
          label="Semester"
          type="number"
          inputMode="numeric"
          min={1}
          max={8}
          placeholder="1–8"
          error={errors.semester?.message}
          {...register("semester")}
        />
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-3">
          <AuthField
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <AuthField
            id="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>
        <div className="pt-1">
          <SubmitButton loading={loading} loadingText="Creating account…">
            Create account
          </SubmitButton>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
