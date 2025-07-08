export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="text-center p-8">
                {/* Logo container */}
                <div className="relative mb-8 flex items-center justify-center">
                    {/* Animated rings */}
                    <div className="absolute w-24 h-24 border-2 border-gray-200 rounded-full animate-ping"></div>
                    <div className="absolute w-20 h-20 border-2 border-gray-300 rounded-full animate-pulse"></div>
                    
                    {/* Main logo */}
                    <div className="relative w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-2xl">🐙</span>
                    </div>
                </div>
                
                {/* Brand name */}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Octopus Store
                </h2>
                
                {/* Loading text with dots */}
                <div className="flex items-center justify-center space-x-1 mb-6">
                    <span className="text-gray-600">Đang tải</span>
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                </div>
                
                {/* Simple progress bar */}
                <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-gray-900 rounded-full w-1/3 animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}