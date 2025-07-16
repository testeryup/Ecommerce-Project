import Layout from '../../../components/Layout';
import UserProfileComponent from '../../../components/user/UserProfile';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { updateUserProfile } from '../../../services/userService';
import { fetchUserProfile } from '../../../features/user/userSlice';
import Loading from '../../../components/Loading';
import { AlertCircle } from 'lucide-react';

export default function UserProfile() {
    const dispatch = useDispatch();
    const { profile, loading, error } = useSelector(state => state.user);
    const { isAuthenticated, token } = useSelector(state => state.auth);

    // Fetch profile when component mounts or when user becomes authenticated
    useEffect(() => {
        if (isAuthenticated && token && !profile) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, isAuthenticated, token, profile]);

    const handleUpdateProfile = async (data) => {
        try {
            await updateUserProfile(data);
            // Refresh profile data
            await dispatch(fetchUserProfile());
        } catch (error) {
            throw error;
        }
    };

    if (loading) return (
        <Layout>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <Loading />
            </div>
        </Layout>
    );
    
    if (error) return (
        <Layout>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 dark:text-red-400 text-lg">Error: {error}</p>
                </div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <UserProfileComponent 
                profile={profile}
                loading={loading}
                onUpdateProfile={handleUpdateProfile}
            />
        </Layout>
    );
}