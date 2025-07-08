import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { 
  Settings, 
  Database, 
  Mail, 
  Shield,
  Palette,
  Globe,
  Server,
  Key,
  Bell,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Octopus Shop',
    siteDescription: 'Cửa hàng thương mại điện tử hiện đại',
    adminEmail: 'admin@octopus.com',
    currency: 'VND',
    timezone: 'Asia/Ho_Chi_Minh',
    language: 'vi',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: 'daily'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement settings save
    console.log('Saving settings:', settings);
  };

  const handleExport = () => {
    // TODO: Implement data export
    console.log('Exporting data...');
  };

  const handleImport = () => {
    // TODO: Implement data import
    console.log('Importing data...');
  };

  const handleBackupNow = () => {
    // TODO: Implement immediate backup
    console.log('Creating backup...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h2>
          <p className="text-muted-foreground">
            Quản lý cấu hình và thiết lập hệ thống
          </p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Lưu cài đặt
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Chung</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
          <TabsTrigger value="appearance">Giao diện</TabsTrigger>
          <TabsTrigger value="data">Dữ liệu</TabsTrigger>
          <TabsTrigger value="system">Hệ thống</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Thông tin chung
              </CardTitle>
              <CardDescription>
                Cấu hình thông tin cơ bản của website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tên website</label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange('siteName', e.target.value)}
                    placeholder="Nhập tên website"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email quản trị</label>
                  <Input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                    placeholder="Nhập email quản trị"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mô tả website</label>
                <Input
                  value={settings.siteDescription}
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  placeholder="Nhập mô tả website"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tiền tệ</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={settings.currency}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                  >
                    <option value="VND">VND</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Múi giờ</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  >
                    <option value="Asia/Ho_Chi_Minh">Hồ Chí Minh</option>
                    <option value="Asia/Bangkok">Bangkok</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ngôn ngữ</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Cài đặt thông báo
              </CardTitle>
              <CardDescription>
                Quản lý các loại thông báo từ hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Thông báo Email</h4>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo qua email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Thông báo SMS</h4>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo qua tin nhắn
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Thông báo Push</h4>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo trên trình duyệt
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Bảo mật hệ thống
              </CardTitle>
              <CardDescription>
                Cấu hình bảo mật và quyền truy cập
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Chế độ bảo trì</h4>
                    <p className="text-sm text-muted-foreground">
                      Tạm thời đóng website để bảo trì
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Đổi mật khẩu admin</label>
                  <div className="flex gap-2">
                    <Input type="password" placeholder="Mật khẩu hiện tại" />
                    <Input type="password" placeholder="Mật khẩu mới" />
                    <Button>
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Giao diện
              </CardTitle>
              <CardDescription>
                Tùy chỉnh giao diện và theme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Palette className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Tùy chỉnh giao diện</h3>
                <p className="text-muted-foreground mb-4">
                  Tính năng này đang được phát triển
                </p>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Quản lý dữ liệu
              </CardTitle>
              <CardDescription>
                Sao lưu, khôi phục và xuất nhập dữ liệu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Sao lưu tự động</h4>
                    <p className="text-sm text-muted-foreground">
                      Tự động sao lưu dữ liệu định kỳ
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoBackup}
                    onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Tần suất sao lưu</h4>
                    <p className="text-sm text-muted-foreground">
                      Chọn tần suất sao lưu tự động
                    </p>
                  </div>
                  <select 
                    className="p-2 border rounded-md"
                    value={settings.backupFrequency}
                    onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                  >
                    <option value="daily">Hàng ngày</option>
                    <option value="weekly">Hàng tuần</option>
                    <option value="monthly">Hàng tháng</option>
                  </select>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button onClick={handleBackupNow} variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Sao lưu ngay
                  </Button>
                  <Button onClick={handleExport} variant="outline" className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Xuất dữ liệu
                  </Button>
                  <Button onClick={handleImport} variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Nhập dữ liệu
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Thông tin hệ thống
              </CardTitle>
              <CardDescription>
                Thông tin về hiệu suất và tài nguyên hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phiên bản hệ thống</label>
                  <div className="p-2 bg-muted rounded-md">v1.0.0</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Thời gian hoạt động</label>
                  <div className="p-2 bg-muted rounded-md">24 giờ 30 phút</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sử dụng CPU</label>
                  <div className="p-2 bg-muted rounded-md">45%</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sử dụng RAM</label>
                  <div className="p-2 bg-muted rounded-md">2.1GB / 4GB</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dung lượng ổ cứng</label>
                  <div className="p-2 bg-muted rounded-md">45GB / 100GB</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kết nối database</label>
                  <div className="p-2 bg-muted rounded-md flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Hoạt động
                  </div>
                </div>
              </div>
              <Separator />
              <Button className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Khởi động lại hệ thống
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
