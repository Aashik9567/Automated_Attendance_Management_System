import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialLoginState = {
    _id: null,
    email: null,
    firstName: null,
    role: null,
    lastName: null,
};

const store = create(
        (set) => ({
            loginUserData: initialLoginState,
            isLogin: false,
            // Fixed to properly set login status and user data together
            setLoggedInUser: (data,token) => {
                set({ 
                    loginUserData: data,
                    isLogin: true ,
                    
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

export default store;