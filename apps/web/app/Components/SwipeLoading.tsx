import React from 'react';

const SwipeLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-zinc-900">
      <div className="relative w-[50vh] h-[80vh] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900 animate-pulse">
        {/* Card skeleton */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
        
        {/* Loading animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Card content skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/60 rounded-b-2xl">
          <div className="h-8 w-3/4 bg-gray-700 rounded-lg mb-2 animate-pulse"></div>
          <div className="h-4 w-1/4 bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
          <div className="h-4 w-full bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-serif text-pink-400 mb-2">Finding Your Perfect Match</h2>
        <p className="text-gray-400">Please wait while we prepare your potential matches...</p>
      </div>
    </div>
  );
};

export default SwipeLoading; 