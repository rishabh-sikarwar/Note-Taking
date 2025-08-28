import React from 'react';

const TestTailwind: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tailwind CSS Test</h1>
        <p className="text-gray-600 mb-6">
          If you can see this styled card with gradients, shadows, and proper spacing, 
          then Tailwind CSS is working correctly!
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-red-500 text-white p-4 rounded text-center">Red</div>
          <div className="bg-green-500 text-white p-4 rounded text-center">Green</div>
          <div className="bg-yellow-500 text-white p-4 rounded text-center">Yellow</div>
          <div className="bg-blue-500 text-white p-4 rounded text-center">Blue</div>
        </div>
        <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300">
          Tailwind is Working! 🎉
        </button>
      </div>
    </div>
  );
};

export default TestTailwind;
