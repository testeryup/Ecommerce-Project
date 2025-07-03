import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboardNew';
import UsersManagement from './UsersManagement';
import ProductsManagement from './ProductsManagement';
import TransactionsManagement from './TransactionsManagement';
import OrdersManagement from './OrdersManagement';
import AdminSettings from './AdminSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Settings, BarChart3, ShoppingCart } from 'lucide-react';

// Placeholder components for remaining routes
const ReportsManagement = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Báo cáo thống kê</h1>
      <p className="text-muted-foreground">
        Xem báo cáo chi tiết về hoạt động của hệ thống
      </p>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Báo cáo</CardTitle>
        <CardDescription>
          Tính năng này đang được phát triển
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Báo cáo chi tiết sẽ có sẵn sớm</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const SettingsManagement = () => <AdminSettings />;

const AdminApp = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/products" element={<ProductsManagement />} />
        <Route path="/orders" element={<OrdersManagement />} />
        <Route path="/transactions" element={<TransactionsManagement />} />
        <Route path="/reports" element={<ReportsManagement />} />
        <Route path="/settings" element={<SettingsManagement />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp;
