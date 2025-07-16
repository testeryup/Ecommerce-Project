import { useState } from 'react';

export default function SubscriptionInfo({ sku, product }) {
    const [selectedDuration, setSelectedDuration] = useState(sku?.subscriptionInfo?.duration || 30);

    if (!sku?.subscriptionInfo) {
        return null;
    }

    const { subscriptionInfo } = sku;

    const formatDuration = (days) => {
        if (days < 30) {
            return `${days} ngày`;
        } else if (days < 365) {
            const months = Math.floor(days / 30);
            return `${months} tháng`;
        } else {
            const years = Math.floor(days / 365);
            return `${years} năm`;
        }
    };

    const getDurationOptions = () => {
        const options = [
            { days: 30, label: '1 tháng', discount: 0 },
            { days: 90, label: '3 tháng', discount: 5 },
            { days: 180, label: '6 tháng', discount: 10 },
            { days: 365, label: '1 năm', discount: 15 }
        ];

        return options.filter(option => option.days <= (subscriptionInfo.maxDuration || 365));
    };

    const calculatePrice = (baseDays, targetDays) => {
        const basePrice = sku.price;
        const ratio = targetDays / baseDays;
        return Math.round(basePrice * ratio);
    };

    const calculateDiscountedPrice = (basePrice, discount) => {
        return Math.round(basePrice * (1 - discount / 100));
    };

    return (
        <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📅 Thông tin Subscription
            </h3>

            <div className="space-y-4">
                {/* Duration Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn thời hạn subscription
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {getDurationOptions().map((option) => {
                            const basePrice = calculatePrice(subscriptionInfo.duration, option.days);
                            const finalPrice = calculateDiscountedPrice(basePrice, option.discount);
                            const isSelected = selectedDuration === option.days;

                            return (
                                <div
                                    key={option.days}
                                    onClick={() => setSelectedDuration(option.days)}
                                    className={`relative border rounded-lg p-3 cursor-pointer transition-all ${
                                        isSelected 
                                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-medium text-gray-900">{option.label}</div>
                                            <div className="text-sm text-gray-500">{option.days} ngày</div>
                                        </div>
                                        <div className="text-right">
                                            {option.discount > 0 && (
                                                <div className="text-xs line-through text-gray-400">
                                                    {basePrice.toLocaleString('vi-VN')}đ
                                                </div>
                                            )}
                                            <div className="font-semibold text-gray-900">
                                                {finalPrice.toLocaleString('vi-VN')}đ
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {option.discount > 0 && (
                                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                            -{option.discount}%
                                        </div>
                                    )}
                                    
                                    {isSelected && (
                                        <div className="absolute -top-2 -left-2 bg-blue-500 text-white rounded-full p-1">
                                            <span className="material-symbols-outlined text-sm">check</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Subscription Features */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">✨ Tính năng Subscription</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                            <span className="material-symbols-outlined text-green-500 mr-2 text-base">check_circle</span>
                            Tài khoản riêng biệt chỉ dành cho bạn
                        </li>
                        <li className="flex items-center">
                            <span className="material-symbols-outlined text-green-500 mr-2 text-base">check_circle</span>
                            Tự động reset password khi hết hạn
                        </li>
                        {subscriptionInfo.autoRenewable && (
                            <li className="flex items-center">
                                <span className="material-symbols-outlined text-green-500 mr-2 text-base">check_circle</span>
                                Có thể gia hạn dễ dàng
                            </li>
                        )}
                        <li className="flex items-center">
                            <span className="material-symbols-outlined text-green-500 mr-2 text-base">check_circle</span>
                            Hỗ trợ 24/7 trong thời gian sử dụng
                        </li>
                    </ul>
                </div>

                {/* Current Selection Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="font-medium text-blue-900">
                                Gói đã chọn: {formatDuration(selectedDuration)}
                            </div>
                            <div className="text-sm text-blue-700">
                                Bạn sẽ nhận được tài khoản sử dụng trong {selectedDuration} ngày
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-blue-900">
                                {(() => {
                                    const option = getDurationOptions().find(opt => opt.days === selectedDuration);
                                    const basePrice = calculatePrice(subscriptionInfo.duration, selectedDuration);
                                    const finalPrice = calculateDiscountedPrice(basePrice, option?.discount || 0);
                                    return finalPrice.toLocaleString('vi-VN');
                                })()}đ
                            </div>
                            {(() => {
                                const option = getDurationOptions().find(opt => opt.days === selectedDuration);
                                return option?.discount > 0 && (
                                    <div className="text-xs text-green-600">
                                        Tiết kiệm {option.discount}%
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {/* Usage Guidelines */}
                <div className="text-xs text-gray-500 space-y-1">
                    <p>⚠️ <strong>Lưu ý quan trọng:</strong></p>
                    <ul className="ml-4 space-y-1">
                        <li>• Mỗi tài khoản chỉ sử dụng cho 1 người duy nhất</li>
                        <li>• Thay đổi mật khẩu ngay sau khi nhận để bảo mật</li>
                        <li>• Không chia sẻ thông tin tài khoản với người khác</li>
                        <li>• Liên hệ hỗ trợ nếu gặp vấn đề với tài khoản</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
