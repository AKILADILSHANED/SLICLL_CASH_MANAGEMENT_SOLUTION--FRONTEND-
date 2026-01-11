"use client";
import React, { useState, useEffect } from "react";

// Inline SVG icons to avoid dependencies
const SuccessIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const CloseIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function SuccessMessage({ messageValue, autoClose = 5000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  // Auto-close functionality
  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [autoClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`relative animate-slideInRight ${isClosing ? 'animate-fadeOut' : ''}`}>
      {/* Background Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
      
      {/* Main Alert Card */}
      <div 
        className="relative flex items-center justify-between p-5 mb-4 rounded-xl shadow-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 dark:border-green-900/30 backdrop-blur-sm"
        role="alert"
        aria-live="polite"
      >
        {/* Left Content */}
        <div className="flex items-start space-x-4">
          {/* Icon Container with Animation */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 animate-ping-slow bg-green-400 rounded-full opacity-30"></div>
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg ring-2 ring-green-200 dark:ring-green-900/50">
                <SuccessIcon className="w-6 h-6 text-white animate-scaleIn" />
              </div>
            </div>
          </div>
          
          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-bold text-green-900 dark:text-green-200">
                Success!
              </h3>
              {autoClose > 0 && (
                <span className="ml-3 text-xs px-2.5 py-1 rounded-full bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-300 font-medium">
                  Auto-closes in {Math.ceil(autoClose / 1000)}s
                </span>
              )}
            </div>
            <p className="text-green-800 dark:text-green-300">
              {messageValue}
            </p>
            
            {/* Progress Bar for Auto-close */}
            {autoClose > 0 && (
              <div className="mt-3 w-full bg-green-200 dark:bg-green-900/30 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: isClosing ? '0%' : '100%' }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 ml-4">
          {/* Optional Action Button (e.g., "View Details") */}
          {messageValue.includes("registered") && (
            <button
              type="button"
              onClick={() => {
                // Handle action - could navigate to user list
                console.log("View user details");
              }}
              className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900 rounded-lg transition-all duration-200 active:scale-95"
            >
              View Details
            </button>
          )}
          
          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full text-green-600 hover:bg-green-200 dark:text-green-400 dark:hover:bg-green-900/50 hover:text-green-800 dark:hover:text-green-300 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Close success message"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 rounded-t-xl"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-40"></div>
        
        {/* Checkmark Background Pattern */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 w-20 h-20 opacity-5">
          <SuccessIcon className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

// Compact version for smaller notifications
export function SuccessMessageCompact({ messageValue, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="animate-slideInRight">
      <div className="inline-flex items-center px-4 py-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 border border-green-200 dark:border-green-900 shadow-lg">
        <div className="relative">
          <div className="absolute inset-0 animate-ping-slow bg-green-400 rounded-full opacity-30"></div>
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mr-3">
            <SuccessIcon className="w-4 h-4 text-white" />
          </div>
        </div>
        <span className="text-sm font-medium text-green-800 dark:text-green-300">{messageValue}</span>
        <button
          onClick={handleClose}
          className="ml-4 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
          aria-label="Close"
        >
          <CloseIcon className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// Add custom animations to global CSS
const styles = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
  
  @keyframes scaleIn {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }
  
  @keyframes ping-slow {
    75%, 100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
  
  .animate-slideInRight {
    animation: slideInRight 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  }
  
  .animate-fadeOut {
    animation: fadeOut 0.3s ease-out forwards;
  }
  
  .animate-scaleIn {
    animation: scaleIn 0.3s ease-out forwards;
  }
  
  .animate-ping-slow {
    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}