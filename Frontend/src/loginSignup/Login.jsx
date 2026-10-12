import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import axios from 'axios';
import { message } from 'antd';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthField, AuthLayout, AuthLink, SubmitButton } from './AuthLayout';
import store from '../zustand/loginStore';
import { homePath } from '../components/dashboard/navigation';
import { API_BASE_URL } from "../config/env";

const schema = z.object({
  email: z.string()
    .min(1, { message: "Email is required" })
    .email("Enter a valid email address"),
  password: z.string()
    .min(1, { message: "Password is required" })
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
      navigate(homePath(loginUserData.role), { replace: true });
    }
  }, [isLogin, loginUserData.role, navigate]);

  const submitHandle = async (formData) => {
    try {
      setIsLoggingIn(true);
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
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

  return (
    <AuthLayout
      title="Sign in to AttendEase"
      subtitle="Teachers and students use the same sign-in."
      footer={<>Don&apos;t have an account? <AuthLink to="/signup">Create one</AuthLink></>}
    >
      <form onSubmit={handleSubmit(submitHandle)} noValidate className="space-y-5">
        <AuthField id="email" label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <AuthField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="pt-1">
          <SubmitButton loading={isLoggingIn} loadingText="Signing in…">
            Sign in
          </SubmitButton>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
