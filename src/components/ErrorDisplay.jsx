import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorDisplay = ({ 
  error, 
  onRetry, 
  title = 'Something went wrong', 
  className = '',
  showRetry = true 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      {error && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          {error}
        </p>
      )}
      
      {showRetry && onRetry && (
        <button 
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay; 