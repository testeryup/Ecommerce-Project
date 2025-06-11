import React from 'react';

const TailwindTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Tailwind CSS đã được cài đặt thành công! 🎉
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Card 1</h2>
            <p className="text-gray-600 mb-4">
              Đây là một card được tạo bằng Tailwind CSS với responsive design.
            </p>
            <button className="btn-primary w-full">
              Button Primary
            </button>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Card 2</h2>
            <p className="text-gray-600 mb-4">
              Tailwind CSS giúp bạn tạo giao diện đẹp một cách nhanh chóng.
            </p>
            <button className="btn-secondary w-full">
              Button Secondary
            </button>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Card 3</h2>
            <p className="text-gray-600 mb-4">
              Với utility classes, bạn có thể custom mọi thứ một cách dễ dàng.
            </p>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">
              Custom Button
            </button>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-4 bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Thiết lập hoàn tất!</h3>
              <p className="text-gray-600">Bây giờ bạn có thể sử dụng Tailwind CSS trong dự án</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailwindTest;
