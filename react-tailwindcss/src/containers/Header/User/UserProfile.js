import Header from '../../../components/Header';
import { useSelector } from 'react-redux';
import Loading from '../../../components/Loading';
import { formatCurrency } from '../../../ultils';
import { User, Mail, DollarSign, Shield, Calendar, Camera, AlertCircle } from 'lucide-react';

export default function UserProfile() {
    const { profile, loading, error } = useSelector(state => state.user);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    if (loading) return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <Loading />
            </div>
        </>
    );
    
    if (error) return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 dark:text-red-400 text-lg">Error: {error}</p>
                </div>
            </div>
        </>
    );

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                            <h1 className="text-2xl font-bold text-white">Thông tin tài khoản</h1>
                        </div>
                        
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Avatar Section */}
                                <div className="lg:col-span-1">
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 text-center">
                                        <div className="relative inline-block mb-6">
                                            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                                                <User className="h-16 w-16 text-white" />
                                            </div>
                                            <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors duration-200">
                                                <Camera className="h-4 w-4" />
                                            </button>
                                        </div>
                                        
                                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition-colors duration-200 font-medium flex items-center justify-center space-x-2">
                                            <Camera className="h-4 w-4" />
                                            <span>Đổi ảnh đại diện</span>
                                        </button>
                                        
                                        <div className="mt-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                profile?.status?.toLowerCase() === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {profile?.status || 'Chưa xác định'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Profile Details */}
                                <div className="lg:col-span-2">
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                            <div className="flex items-center mb-3">
                                                <User className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    Tên người dùng
                                                </label>
                                            </div>
                                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {profile?.username || 'Chưa cập nhật'}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                            <div className="flex items-center mb-3">
                                                <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    Email
                                                </label>
                                            </div>
                                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {profile?.email || 'Chưa cập nhật'}
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border border-green-200 dark:border-gray-600">
                                            <div className="flex items-center mb-3">
                                                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                                                <label className="text-sm font-medium text-green-600 dark:text-green-400">
                                                    Số dư tài khoản
                                                </label>
                                            </div>
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {profile?.balance >= 0 ? formatCurrency(profile.balance) : 0}₫
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                            <div className="flex items-center mb-3">
                                                <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    Vai trò
                                                </label>
                                            </div>
                                            <div className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                                {profile?.role || 'Chưa cập nhật'}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                            <div className="flex items-center mb-3">
                                                <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    Ngày tham gia
                                                </label>
                                            </div>
                                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {profile?.createdAt ? formatDate(profile.createdAt) : 'Chưa cập nhật'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}