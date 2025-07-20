import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X, Wallet, ShoppingBag, DollarSign, Settings, Camera, Home } from 'lucide-react';
import Button from '../ui/Button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { formatCurrency } from '../../ultils/currencyHelper';
import { toast } from 'react-hot-toast';
import userService from '../../services/userService';
import { fetchUserProfile } from '../../features/user/userSlice';
import Breadcrumb from '../ui/Breadcrumb';

const UserProfile = ({ profile: profileProp, loading: loadingProp, onUpdateProfile }) => {
  const dispatch = useDispatch();
  const { profile: reduxProfile, loading: reduxLoading } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  
  // Use props if provided, otherwise fall back to Redux state
  const profile = profileProp || reduxProfile;
  const loading = loadingProp || reduxLoading;
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
      if (onUpdateProfile) {
        await onUpdateProfile(formData);
      } else {
        await userService.updateUserProfile(formData);
        dispatch(fetchUserProfile());
      }
      setIsEditing(false);
      toast.success('Cập nhật thông tin thành công!');
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Hồ sơ cá nhân
              </h1>
              <p className="text-gray-600 text-lg">
                Quản lý thông tin và cài đặt tài khoản của bạn
              </p>
            </div>
          </div>
        </div>
        {/* Profile Overview Card */}
        <Card className="p-8 mb-8">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <div className={`w-20 h-20 bg-gradient-to-br ${getAvatarGradient(profile?.username)} rounded-full flex items-center justify-center shadow-lg`}>
                <User className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {profile?.username || 'Người dùng'}
                  </h2>
                  <p className="text-gray-600 mb-3">{profile?.email}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Tham gia: {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      profile?.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      profile?.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {profile?.role === 'seller' ? 'Người bán' : profile?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                    </div>
                  </div>
                </div>
                
                {!isEditing ? (
                  <Button 
                    onClick={() => setIsEditing(true)} 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSave}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Lưu
                    </Button>
                    <Button 
                      onClick={handleCancel}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Hủy
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {formatCurrency(profile?.balance || 0)}
            </div>
            <div className="text-gray-600 text-sm">Số dư tài khoản</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
            {/* <div className="text-2xl font-bold text-green-600 mb-1">24</div> */}
            <div className="text-gray-600 text-sm">Tổng đơn hàng</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-purple-600 mb-1">
              {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}
            </div>
            <div className="text-gray-600 text-sm">Ngày tham gia</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/orders" className="group">
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:border-gray-300">
              <ShoppingBag className="h-8 w-8 mx-auto mb-4 text-gray-600 group-hover:text-black transition-colors" />
              <div className="text-lg font-semibold text-gray-900 mb-2">Đơn hàng của tôi</div>
              <div className="text-gray-500 text-sm">Xem lịch sử mua hàng</div>
            </Card>
          </Link>

          <Link to="/topup" className="group">
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:border-gray-300">
              <DollarSign className="h-8 w-8 mx-auto mb-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
              <div className="text-lg font-semibold text-gray-900 mb-2">Nạp tiền</div>
              <div className="text-gray-500 text-sm">Thêm số dư vào tài khoản</div>
            </Card>
          </Link>

          <button className="group">
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:border-gray-300">
              <Settings className="h-8 w-8 mx-auto mb-4 text-gray-600 group-hover:text-gray-900 transition-colors" />
              <div className="text-lg font-semibold text-gray-900 mb-2">Cài đặt</div>
              <div className="text-gray-500 text-sm">Tùy chỉnh tài khoản</div>
            </Card>
          </button>
        </div>

        {/* Information Form */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900">Thông tin chi tiết</h3>
          </div>

          <div className="p-6 space-y-8">
            {/* Personal Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-gray-600" />
                Thông tin cá nhân
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Tên người dùng</Label>
                  {isEditing ? (
                    <div>
                      <input
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        placeholder="Nhập tên người dùng"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors bg-gray-100"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Tên người dùng không thể thay đổi</p>
                    </div>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-900 border border-gray-200">
                      {profile?.username || 'Chưa cập nhật'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-700 flex items-center gap-2 border border-gray-200">
                    <Mail className="h-4 w-4 text-gray-500" />
                    {profile?.email || 'Chưa cập nhật'}
                  </div>
                  <p className="text-xs text-gray-500">Email không thể thay đổi</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-600" />
                Thông tin liên hệ
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Số điện thoại</Label>
                  {isEditing ? (
                    <input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-900 flex items-center gap-2 border border-gray-200">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {profile?.phone || 'Chưa cập nhật'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Địa chỉ</Label>
                  {isEditing ? (
                    <input
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Nhập địa chỉ của bạn"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-900 flex items-center gap-2 border border-gray-200">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {profile?.address || 'Chưa cập nhật'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                Thông tin tài khoản
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Vai trò</Label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-700 flex items-center gap-2 border border-gray-200">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-700 border border-gray-200">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
