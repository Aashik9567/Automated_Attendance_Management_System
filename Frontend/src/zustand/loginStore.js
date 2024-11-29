import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialLoginState = {
    _id: null,
    email: null,
    firstName: null,
    role: null,
    lastName: null,
};
const Token={
    accessToken: null,
    refreshToken: null,
}
const store = create(
        (set) => ({
            loginUserData: initialLoginState,
            isLogin: false,
            tokens:Token,
            // Fixed to properly set login status and user data together
            setLoggedInUser: (data,token) => {
                set({ 
                    loginUserData: data,
                    isLogin: true ,
                    Token: token
                    
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