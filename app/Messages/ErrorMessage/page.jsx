"use client";
import React, { useState, useEffect } from "react";

// Inline SVG icons to avoid dependencies
const ErrorIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const CloseIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function ErrorMessage({ messageValue, autoClose = 5000, onClose }) {
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
      <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      
      {/* Main Alert Card */}
      <div 
        className="relative flex items-center justify-between p-4 mb-4 rounded-xl shadow-lg border border-red-200 bg-gradient-to-r from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800 dark:border-red-900/30 backdrop-blur-sm"
        role="alert"
        aria-live="assertive"
      >
        {/* Left Content */}
        <div className="flex items-start space-x-3">
          {/* Icon Container */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-md ring-2 ring-red-200 dark:ring-red-900/50">
              <ErrorIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          
          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-1">
              <h3 className="text-sm font-semibold text-red-900 dark:text-red-200">
                Error
              </h3>
              {autoClose > 0 && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-200 dark:bg-red-900/50 text-red-700 dark:text-red-300">
                  Auto-closes in {Math.ceil(autoClose / 1000)}s
                </span>
              )}
            </div>
            <p className="text-sm text-red-800 dark:text-red-300">
              {messageValue}
            </p>
            
            {/* Progress Bar for Auto-close */}
            {autoClose > 0 && (
              <div className="mt-2 w-full bg-red-200 dark:bg-red-900/30 rounded-full h-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: isClosing ? '0%' : '100%' }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="flex-shrink-0 ml-4 -mr-2 flex items-center justify-center w-8 h-8 rounded-full text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-label="Close error message"
        >
          <CloseIcon />
        </button>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-red-500 to-red-400 rounded-t-xl"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-20"></div>
      </div>

      <style jsx>{`
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
        
        .animate-slideInRight {
          animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        
        .animate-fadeOut {
          animation: fadeOut 0.3s ease-out forwards;
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}

// Compact version for smaller screens or less prominent errors
export function ErrorMessageCompact({ messageValue, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="animate-slideInRight">
      <div className="inline-flex items-center px-4 py-2 rounded-lg bg-red-50 dark:bg-gray-800 border border-red-200 dark:border-red-900 shadow-sm">
        <ErrorIcon className="w-4 h-4 text-red-600 dark:text-red-400 mr-2" />
        <span className="text-sm text-red-700 dark:text-red-300">{messageValue}</span>
        <button
          onClick={handleClose}
          className="ml-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          aria-label="Close"
        >
          <CloseIcon className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}