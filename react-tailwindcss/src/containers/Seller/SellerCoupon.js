import React from 'react';
import { Gift, Plus, Percent } from 'lucide-react';

export default function SellerCoupon() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý khuyến mãi</h1>
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4 sm:mt-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo mã giảm giá
                </button>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6 text-center">
                <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Quản lý khuyến mãi</h3>
                <p className="text-gray-500">Tính năng tạo và quản lý mã giảm giá đang được phát triển...</p>
            </div>
        </div>
    );
}
