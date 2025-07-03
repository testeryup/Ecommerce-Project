import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
      
      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Seller info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        {/* Title */}
        <div className="space-y-2">
          <div className="w-full h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-3/4 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        {/* Price */}
        <div className="flex items-center space-x-2">
          <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        {/* Stock */}
        <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        
        {/* Button */}
        <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>
    </div>
  );
};

const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(count)].map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
