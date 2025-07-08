import { Link } from 'react-router-dom';

const CartPreview = ({ items = [] }) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-4">
                {items.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">Giỏ hàng trống</div>
                ) : (
                    <>
                        <div className="max-h-64 overflow-y-auto">
                            {items.map(item => (
                                <div key={item.skuId} className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                                        <div className="text-sm text-blue-600 font-medium">{item.price.toLocaleString()}đ</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                            <span className="text-gray-700 font-medium">Tổng cộng:</span>
                            <span className="text-lg font-bold text-blue-600">{total.toLocaleString()}đ</span>
                        </div>
                    </>
                )}
            </div>
            <Link to="/cart" className="block w-full bg-blue-600 text-white text-center py-3 rounded-b-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                Xem giỏ hàng
            </Link>
        </div>
    );
};

export default CartPreview;