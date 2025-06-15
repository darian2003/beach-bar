import React from 'react';
import { Link } from 'react-router-dom';

const InvalidTokenPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid QR Code</h1>
        <p className="text-gray-600 mb-6">
          The QR code you scanned is not valid. Please make sure you're scanning the correct QR code from your umbrella.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
};

export default InvalidTokenPage; 