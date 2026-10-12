import { Navigate, useLocation } from 'react-router-dom';
import store from './loginStore';
import { homePath } from '../components/dashboard/navigation';

const ProtectedRouter = ({ children, allowedRoles }) => {
    const location = useLocation();
    const { isLogin, loginUserData } = store(state => ({
        isLogin: state.isLogin,
        loginUserData: state.loginUserData
    }));

    // Check if we have required data
    if (!isLogin || !loginUserData?.role) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Check role permissions
    if (!allowedRoles.includes(loginUserData.role)) {
        return <Navigate to={homePath(loginUserData.role)} replace />;
    }

    return children;
};

export default ProtectedRouter;