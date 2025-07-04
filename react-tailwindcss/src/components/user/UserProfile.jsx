import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { User, Mail, DollarSign, Shield, Calendar, Camera, Edit, Save, X } from 'lucide-react';
import { formatCurrency } from '../../ultils/currencyHelper';
import { toast } from 'react-hot-toast';

const UserProfileComponent = ({ profile, loading, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    address: profile?.address || ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await onUpdateProfile(formData);
      setIsEditing(false);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      address: profile?.address || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Thông tin cá nhân
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý thông tin tài khoản và cài đặt của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar & Basic Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <User className="h-16 w-16 text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors duration-200">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {profile?.firstName} {profile?.lastName}
                </h3>
                
                <Badge variant="secondary" className="mb-4">
                  {profile?.role || 'User'}
                </Badge>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Số dư tài khoản</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(profile?.balance || 0)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Thông tin chi tiết</CardTitle>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Lưu
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Tên</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Nhập tên của bạn"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                        {profile?.firstName || 'Chưa cập nhật'}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Họ</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Nhập họ của bạn"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                        {profile?.lastName || 'Chưa cập nhật'}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Nhập email của bạn"
                    />
                  ) : (
                    <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      {profile?.email || 'Chưa cập nhật'}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                      {profile?.phone || 'Chưa cập nhật'}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="address">Địa chỉ</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Nhập địa chỉ của bạn"
                    />
                  ) : (
                    <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                      {profile?.address || 'Chưa cập nhật'}
                    </div>
                  )}
                </div>

                {/* Read-only fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <Label>Tên đăng nhập</Label>
                    <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded border flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      {profile?.username || 'Chưa có'}
                    </div>
                  </div>

                  <div>
                    <Label>Vai trò</Label>
                    <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded border flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-gray-500" />
                      {profile?.role || 'User'}
                    </div>
                  </div>

                  <div>
                    <Label>Ngày tạo tài khoản</Label>
                    <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded border flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {profile?.createdAt ? formatDate(profile.createdAt) : 'Chưa có'}
                    </div>
                  </div>

                  <div>
                    <Label>Trạng thái</Label>
                    <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded border">
                      <Badge variant={profile?.status === 'active' ? 'default' : 'secondary'}>
                        {profile?.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileComponent;
