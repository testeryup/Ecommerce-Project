import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X, Camera, Wallet, Star, DollarSign, Settings } from 'lucide-react';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/Breadcrumb';
import { updateUserProfile } from '../../features/user/userSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    }
  }, [profile]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      // Error handling
    }
  };

  const handleCancel = () => {
    setFormData({
      username: profile?.username || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
    });
    setIsEditing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getAvatarGradient = (username) => {
    const gradients = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-green-400 to-green-600',
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600',
      'from-red-400 to-red-600',
      'from-yellow-400 to-yellow-600',
      'from-teal-400 to-teal-600',
    ];
    
    if (!username) return gradients[0];
    
    const hash = username.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return gradients[Math.abs(hash) % gradients.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header với Breadcrumb */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink to="/">Trang chủ</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Hồ sơ người dùng</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{profile?.username}</p>
                <p className="text-xs text-gray-500">{profile?.email}</p>
              </div>
              <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarGradient(profile?.username)} rounded-full flex items-center justify-center`}>
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Số dư tài khoản</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(profile?.balance || 0)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-green-900">24</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Star className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">Vai trò</p>
                <p className="text-lg font-bold text-purple-900">
                  {profile?.role === 'seller' ? 'Người bán' : profile?.role === 'admin' ? 'Quản trị' : 'Khách hàng'}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">Thành viên từ</p>
                <p className="text-lg font-bold text-orange-900">
                  {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className={`w-24 h-24 bg-gradient-to-br ${getAvatarGradient(profile?.username)} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white hover:bg-gray-50 border-2 border-gray-100 text-gray-600 p-2 rounded-full shadow-md transition-all">
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {profile?.username || 'Người dùng'}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{profile?.email}</p>
                
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                  profile?.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                  profile?.role === 'seller' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  <Shield className="h-3 w-3" />
                  {profile?.role === 'seller' ? 'Người bán' : profile?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
                <div className="space-y-3">
                  <Link to="/orders" className="w-full flex items-center gap-3 px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors text-sm font-medium">
                    <Star className="h-4 w-4" />
                    Đơn hàng của tôi
                  </Link>
                  <Link to="/topup" className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors text-sm font-medium">
                    <DollarSign className="h-4 w-4" />
                    Nạp tiền
                  </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors text-sm font-medium">
                    <Settings className="h-4 w-4" />
                    Cài đặt
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Thông tin chi tiết</h2>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)} 
                      className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors text-sm font-medium"
                    >
                      <Edit className="h-4 w-4" />
                      Chỉnh sửa
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button 
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm font-medium"
                      >
                        <Save className="h-4 w-4" />
                        Lưu
                      </button>
                      <button 
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm font-medium"
                      >
                        <X className="h-4 w-4" />
                        Hủy
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-600" />
                    Thông tin cá nhân
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Tên người dùng</Label>
                      {isEditing ? (
                        <Input
                          value={formData.username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          placeholder="Nhập tên người dùng"
                          className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          disabled
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                          {profile?.username || 'Chưa cập nhật'}
                        </div>
                      )}
                      {isEditing && (
                        <p className="text-xs text-gray-500">Tên người dùng không thể thay đổi</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Email</Label>
                      <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-700 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        {profile?.email || 'Chưa cập nhật'}
                      </div>
                      <p className="text-xs text-gray-500">Email không thể thay đổi</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-gray-600" />
                    Thông tin liên hệ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Số điện thoại</Label>
                      {isEditing ? (
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Nhập số điện thoại"
                          className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          {profile?.phone || 'Chưa cập nhật'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Địa chỉ</Label>
                      {isEditing ? (
                        <Input
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Nhập địa chỉ của bạn"
                          className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          {profile?.address || 'Chưa cập nhật'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gray-600" />
                    Thông tin tài khoản
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Ngày tạo tài khoản</Label>
                      <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {profile?.createdAt ? formatDate(profile.createdAt) : 'Chưa có'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Vai trò</Label>
                      <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-700 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-500" />
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          profile?.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          profile?.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {profile?.role === 'admin' ? 'Quản trị viên' :
                           profile?.role === 'seller' ? 'Người bán' : 'Khách hàng'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Trạng thái tài khoản</Label>
                      <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-700">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          profile?.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : profile?.status === 'suspended'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {profile?.status === 'active' ? 'Hoạt động' : 
                           profile?.status === 'suspended' ? 'Đã khóa' : 'Không xác định'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Số dư tài khoản</Label>
                      <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-green-600" />
                          <span className="text-lg font-bold text-green-700">
                            {formatCurrency(profile?.balance || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
