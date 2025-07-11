import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { path } from '../ultils';
import Loading from './Loading';

export default function ProtectedRoute({ children, allowedRoles }) {
    const auth = useSelector(state => state.auth);
    const user = useSelector(state => state.user);
    
    if (auth.loading || user.loading) return <Loading></Loading>;

    if (!auth.isAuthenticated) {
        return <Navigate to={path.LOGIN} replace />;
    }

    // Check role from user.role (direct from userSlice) or from user.profile.role
    const userRole = user.role || user.profile?.role;
    
    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        return <Navigate to={path.UNAUTHORIZED} replace />;
    }

    return children;
}