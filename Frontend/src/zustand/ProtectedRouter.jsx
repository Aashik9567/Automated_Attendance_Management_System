import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import store from './loginStore.js';

const ProtectedRouter = ({ children }) => {
    const location = useLocation();
    const { isLogin, loginUserData } = store(state => ({
        isLogin: state.isLogin,
        loginUserData: state.loginUserData
    }));

    // Debug logging (you can remove this later)
    useEffect(() => {
        console.log('Auth State:', { isLogin, loginUserData });
        console.log('Current Path:', location.pathname);
    }, [isLogin, loginUserData, location]);

    if (!isLogin) {
        // Save the attempted URL to redirect back after login
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default ProtectedRouter;