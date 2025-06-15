import React from 'react';

const ScanQRPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Sorriso Beach Bar</h1>
        <p className="text-gray-600 mb-6">
          Please scan the QR code on your umbrella to start ordering. The QR code should be located on your umbrella's table.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-500">
            If you can't find the QR code, please ask a staff member for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScanQRPage; 