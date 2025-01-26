import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialLoginState = {
    _id: null,
    email: null,
    fullName: null,
    role: null,
    semester: null,
    avatar: null,
};

const useLoginStore = create(
    persist(
        (set) => ({
            loginUserData: initialLoginState,
            isLogin: false,
            accessToken: null,
            refreshToken: null,

            // Sets user data and tokens on login
            setLoggedInUser: (data, accessToken, refreshToken) => {
                set({ 
                    loginUserData: data,
                    isLogin: true,
                    accessToken,
                    refreshToken
                });
            },

            // Updates access token if it is refreshed
            updateAccessToken: (newAccessToken) => {
                set({ accessToken: newAccessToken });
            },

            // Logs out the user and clears all stored data
            logoutUser: () => {
                set({ 
                    loginUserData: initialLoginState,
                    isLogin: false,
                    accessToken: null,
                    refreshToken: null
                });
            },
        }),
        {
            name: 'auth-storage', // unique name for localStorage
            partialize: (state) => ({
                loginUserData: state.loginUserData,
                isLogin: state.isLogin,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken
            }),
        }
    )
);
export default useLoginStore;