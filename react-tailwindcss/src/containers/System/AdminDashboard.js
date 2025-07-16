import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Loading from '../../components/Loading';

// Lazy load admin components
const Overview = React.lazy(() => import('../Admin/Overview'));
const Users = React.lazy(() => import('../Admin/Users'));
const Products = React.lazy(() => import('../Admin/Products'));
const Transactions = React.lazy(() => import('../Admin/Transactions'));
const Reports = React.lazy(() => import('../Admin/Reports'));
const Settings = React.lazy(() => import('../Admin/Settings'));

export default function AdminDashboard() {
    return (
        <AdminLayout>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/" element={<Overview />} />
                    <Route path="/dashboard" element={<Overview />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/orders" element={<Transactions />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </Suspense>
        </AdminLayout>
    );
}
