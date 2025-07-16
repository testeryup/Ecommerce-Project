import React from 'react';
import { MessageSquare, Users, Send } from 'lucide-react';

export default function SellerMessage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Tin nhắn khách hàng</h1>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6 text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chức năng tin nhắn</h3>
                <p className="text-gray-500">Tính năng chat với khách hàng đang được phát triển...</p>
            </div>
        </div>
    );
}
