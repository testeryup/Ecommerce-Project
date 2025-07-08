export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                {/* Apple-style loading indicator */}
                <div className="relative">
                    <div className="w-16 h-16 mx-auto mb-8">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                    </div>
                    
                    {/* Logo */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-lg">O</span>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Đang tải...</h2>
                    <p className="text-gray-600 font-light">Vui lòng chờ trong giây lát</p>
                </div>
            </div>
        </div>
    )
}