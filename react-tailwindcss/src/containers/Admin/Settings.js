import React from 'react';
import { Settings as SettingsIcon, Globe, Shield, Bell, Database, Palette } from 'lucide-react';

export default function Settings() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <Globe className="h-6 w-6 text-blue-600 mr-3" />
                            <h3 className="text-lg font-medium text-gray-900">Cài đặt chung</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên trang web</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    defaultValue="E-commerce Platform"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                                <textarea
                                    rows="3"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    defaultValue="Nền tảng thương mại điện tử hàng đầu"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <Shield className="h-6 w-6 text-green-600 mr-3" />
                            <h3 className="text-lg font-medium text-gray-900">Bảo mật</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Xác thực 2 bước</span>
                                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                    <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out"></span>
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Đăng nhập an toàn</span>
                                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                    <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <Bell className="h-6 w-6 text-yellow-600 mr-3" />
                            <h3 className="text-lg font-medium text-gray-900">Thông báo</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Email thông báo</span>
                                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                    <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out"></span>
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Thông báo push</span>
                                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                    <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <Database className="h-6 w-6 text-purple-600 mr-3" />
                            <h3 className="text-lg font-medium text-gray-900">Dữ liệu</h3>
                        </div>
                        <div className="space-y-4">
                            <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <div className="text-sm font-medium text-gray-900">Sao lưu dữ liệu</div>
                                <div className="text-sm text-gray-500">Tạo bản sao lưu toàn bộ hệ thống</div>
                            </button>
                            <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <div className="text-sm font-medium text-gray-900">Khôi phục dữ liệu</div>
                                <div className="text-sm text-gray-500">Khôi phục từ bản sao lưu</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button className="px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Lưu thay đổi
                </button>
            </div>

            {/* Coming Soon Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center">
                    <SettingsIcon className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                        <h3 className="text-lg font-medium text-blue-900">Chức năng đang phát triển</h3>
                        <p className="text-blue-700 mt-1">
                            Các cài đặt chi tiết đang được phát triển và sẽ sớm được cập nhật.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
