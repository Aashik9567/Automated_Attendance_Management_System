import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialLoginState = {
    id: null,
    email: null,
    password: null,
    name: 'a',
    role: null,
    avatar: null,
};

const store = create(
    persist(
        (set) => ({
            loginUserData: initialLoginState,
            isLogin: false,
            
            // Fixed to properly set login status and user data together
            setLoggedInUser: (data) => {
                set({ 
                    loginUserData: data,
                    isLogin: true  // This was set to false in your original code
                });
            },
            
            // Separate method if you only need to update login status
            setLoginStatus: (status) => {
                set({ isLogin: status });
            },
            
            // Properly reset everything on logout
            logoutUser: () => {
                set({ 
                    loginUserData: initialLoginState,
                    isLogin: false
                });
            }
        }),
        {
            name: 'auth-storage', // unique name for localStorage
            partialize: (state) => ({
                loginUserData: state.loginUserData,
                isLogin: state.isLogin
            }),
        }
    )
);

export default store;