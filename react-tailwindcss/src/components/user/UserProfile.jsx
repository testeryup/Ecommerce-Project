import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X, Camera, Wallet, ShoppingBag, DollarSign, Settings, Clock, Package } from 'lucide-react';
import { Label } from '../ui/label';
import Breadcrumb from '../ui/Breadcrumb';
import { formatCurrency } from '../../ultils/currencyHelper';
import { toast } from 'react-hot-toast';
import userService from '../../services/userService';
import { fetchUserProfile } from '../../features/user/userSlice';

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
      await userService.updateUserProfile(formData);
      setIsEditing(false);
      toast.success('Cập nhật thông tin thành công!');
      dispatch(fetchUserProfile());
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin');
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumb />
          <div className="mt-12 text-center">
            <h1 className="text-4xl md:text-5xl font-medium text-gray-900 mb-6 tracking-tight leading-tight">
              Hồ sơ
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cá nhân
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Quản lý thông tin tài khoản và trải nghiệm mua sắm cá nhân hoá của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Hero Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-10 mb-12 text-center hover:shadow-lg transition-all duration-300">
          <div className="relative inline-block mb-6">
            <div className={`w-32 h-32 bg-gradient-to-br ${getAvatarGradient(profile?.username)} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
              <User className="h-16 w-16 text-white" />
            </div>
            <button className="absolute bottom-0 right-0 bg-white hover:bg-gray-50 border-2 border-gray-100 text-gray-600 p-3 rounded-full shadow-md transition-all hover:scale-105">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          
          <h2 className="text-3xl font-medium text-gray-900 mb-2">
            {profile?.username || 'Người dùng'}
          </h2>
          <p className="text-lg text-gray-600 mb-5">{profile?.email}</p>
          
          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-base font-medium ${
            profile?.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
            profile?.role === 'seller' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
            'bg-gray-50 text-gray-700 border border-gray-200'
          }`}>
            <Shield className="h-4 w-4" />
            {profile?.role === 'seller' ? 'Người bán' : profile?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center hover:shadow-lg transition-all duration-300 group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-5 group-hover:bg-blue-100 transition-colors">
              <Wallet className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-3xl font-light text-blue-600 mb-2 tabular-nums">
              {formatCurrency(profile?.balance || 0)}
            </div>
            <div className="text-gray-600 text-base">Số dư tài khoản</div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center hover:shadow-lg transition-all duration-300 group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-5 group-hover:bg-emerald-100 transition-colors">
              <ShoppingBag className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="text-3xl font-light text-emerald-600 mb-2 tabular-nums">24</div>
            <div className="text-gray-600 text-base">Tổng đơn hàng</div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center hover:shadow-lg transition-all duration-300 group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-50 rounded-full mb-5 group-hover:bg-purple-100 transition-colors">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-lg font-light text-purple-600 mb-2">
              {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}
            </div>
            <div className="text-gray-600 text-base">Ngày tham gia</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link to="/orders" className="group bg-black hover:bg-gray-800 text-white p-8 rounded-3xl transition-all duration-300 text-center">
            <ShoppingBag className="h-8 w-8 mx-auto mb-5 group-hover:scale-105 transition-transform" />
            <div className="text-lg font-medium mb-2">Đơn hàng của tôi</div>
            <div className="text-gray-300 text-sm">Xem lịch sử mua hàng</div>
          </Link>

          <Link to="/topup" className="group bg-blue-600 hover:bg-blue-700 text-white p-8 rounded-3xl transition-all duration-300 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-5 group-hover:scale-105 transition-transform" />
            <div className="text-lg font-medium mb-2">Nạp tiền</div>
            <div className="text-blue-100 text-sm">Thêm số dư vào tài khoản</div>
          </Link>

          <button className="group bg-gray-50 hover:bg-gray-100 text-gray-700 p-8 rounded-3xl transition-all duration-300 text-center border border-gray-200">
            <Settings className="h-8 w-8 mx-auto mb-5 group-hover:scale-105 transition-transform" />
            <div className="text-lg font-medium mb-2">Cài đặt</div>
            <div className="text-gray-500 text-sm">Tùy chỉnh tài khoản</div>
          </button>
        </div>

        {/* Information Form */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="px-10 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-medium text-gray-900">Thông tin chi tiết</h3>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 text-base"
                >
                  <Edit className="h-4 w-4" />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-3">
                  <button 
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 text-base"
                  >
                    <Save className="h-4 w-4" />
                    Lưu
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 text-base"
                  >
                    <X className="h-4 w-4" />
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-10 space-y-12">
            {/* Personal Information */}
            <div>
              <h4 className="text-xl font-medium text-gray-900 mb-6 flex items-center gap-2">
                <User className="h-5 w-5 text-gray-600" />
                Thông tin cá nhân
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700">Tên người dùng</Label>
                  {isEditing ? (
                    <input
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Nhập tên người dùng"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors bg-gray-50 text-base"
                      disabled
                    />
                  ) : (
                    <div className="px-5 py-4 bg-gray-50 rounded-2xl text-gray-900 border border-gray-200 text-base">
                      {profile?.username || 'Chưa cập nhật'}
                    </div>
                  )}
                  {isEditing && (
                    <p className="text-sm text-gray-500">Tên người dùng không thể thay đổi</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700">Email</Label>
                  <div className="px-5 py-4 bg-gray-50 rounded-2xl text-gray-700 flex items-center gap-3 border border-gray-200 text-base">
                    <Mail className="h-4 w-4 text-gray-500" />
                    {profile?.email || 'Chưa cập nhật'}
                  </div>
                  <p className="text-sm text-gray-500">Email không thể thay đổi</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-xl font-medium text-gray-900 mb-6 flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-600" />
                Thông tin liên hệ
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700">Số điện thoại</Label>
                  {isEditing ? (
                    <input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-base"
                    />
                  ) : (
                    <div className="px-5 py-4 bg-gray-50 rounded-2xl text-gray-900 flex items-center gap-3 border border-gray-200 text-base">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {profile?.phone || 'Chưa cập nhật'}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700">Địa chỉ</Label>
                  {isEditing ? (
                    <input
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Nhập địa chỉ của bạn"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-base"
                    />
                  ) : (
                    <div className="px-5 py-4 bg-gray-50 rounded-2xl text-gray-900 flex items-center gap-3 border border-gray-200 text-base">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {profile?.address || 'Chưa cập nhật'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="pt-10 border-t border-gray-100">
              <h4 className="text-xl font-medium text-gray-900 mb-6 flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                Thông tin tài khoản
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700">Vai trò</Label>
                  <div className="px-5 py-4 bg-gray-50 rounded-2xl text-gray-700 flex items-center gap-3 border border-gray-200 text-base">
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

                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700">Trạng thái tài khoản</Label>
                  <div className="px-5 py-4 bg-gray-50 rounded-2xl text-gray-700 border border-gray-200 text-base">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
