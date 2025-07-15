import React from 'react';
import { FileText, TrendingUp, DollarSign, Users } from 'lucide-react';

export default function Reports() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Báo cáo</h1>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <TrendingUp className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-5">
                                <h3 className="text-lg font-medium text-gray-900">Báo cáo doanh thu</h3>
                                <p className="text-sm text-gray-500">Tổng quan về doanh thu theo thời gian</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Users className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-5">
                                <h3 className="text-lg font-medium text-gray-900">Báo cáo người dùng</h3>
                                <p className="text-sm text-gray-500">Thống kê về người dùng và hoạt động</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <DollarSign className="h-8 w-8 text-yellow-600" />
                            </div>
                            <div className="ml-5">
                                <h3 className="text-lg font-medium text-gray-900">Báo cáo giao dịch</h3>
                                <p className="text-sm text-gray-500">Chi tiết về các giao dịch</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FileText className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-5">
                                <h3 className="text-lg font-medium text-gray-900">Báo cáo sản phẩm</h3>
                                <p className="text-sm text-gray-500">Thống kê về sản phẩm bán chạy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coming Soon Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center">
                    <FileText className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                        <h3 className="text-lg font-medium text-blue-900">Chức năng đang phát triển</h3>
                        <p className="text-blue-700 mt-1">
                            Các báo cáo chi tiết đang được phát triển và sẽ sớm được cập nhật.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
