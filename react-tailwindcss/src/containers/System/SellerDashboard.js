import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import SellerLayout from '../../components/seller/SellerLayout';
import Loading from '../../components/Loading';

// Lazy load seller components
const SellerMonitor = React.lazy(() => import('../Seller/SellerMonitor'));
const SellerProducts = React.lazy(() => import('../Seller/SellerProducts'));
const SellerOrders = React.lazy(() => import('../Seller/SellerOrders'));
const SellerMessage = React.lazy(() => import('../Seller/SellerMessage'));
const SellerCoupon = React.lazy(() => import('../Seller/SellerCoupon'));
const SellerPayment = React.lazy(() => import('../Seller/SellerPayment'));

export default function SellerDashboard() {
    return (
        <SellerLayout>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/" element={<SellerMonitor />} />
                    <Route path="/monitor" element={<SellerMonitor />} />
                    <Route path="/products" element={<SellerProducts />} />
                    <Route path="/orders" element={<SellerOrders />} />
                    <Route path="/messages" element={<SellerMessage />} />
                    <Route path="/coupons" element={<SellerCoupon />} />
                    <Route path="/payments" element={<SellerPayment />} />
                </Routes>
            </Suspense>
        </SellerLayout>
    );
}
