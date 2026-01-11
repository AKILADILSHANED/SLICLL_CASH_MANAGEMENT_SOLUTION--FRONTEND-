"use client";
import React, { useEffect, useState } from 'react';

export default function AccessDenied({ onBack, showBackButton = true }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Inline SVG icon for consistency
  const DeniedIcon = ({ className = "w-16 h-16" }) => (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path 
        fillRule="evenodd" 
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm3.707 10.293a1 1 0 0 0 0-1.414L13.414 10l2.293-2.293a1 1 0 1 0-1.414-1.414L12 8.586 9.707 6.293a1 1 0 0 0-1.414 1.414L10.586 10l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 11.414l2.293 2.293a1 1 0 0 0 1.414-1.414Z" 
        clipRule="evenodd" 
      />
    </svg>
  );

  const ShieldIcon = ({ className = "w-6 h-6" }) => (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path 
        fillRule="evenodd" 
        d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" 
        clipRule="evenodd" 
      />
    </svg>
  );

  const ContactIcon = ({ className = "w-6 h-6" }) => (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path 
        fillRule="evenodd" 
        d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97-1.94.284-3.916.455-5.922.505a.39.39 0 00-.266.112L8.78 21.53A.75.75 0 017.5 21v-3.955a48.842 48.842 0 01-2.652-.316c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" 
        clipRule="evenodd" 
      />
    </svg>
  );

  const handleBack = () => {
    if (onBack && typeof onBack === 'function') {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className={`w-full max-w-2xl ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 p-8 text-center relative overflow-hidden">
            {/* Pattern Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '30px'
              }} />
            </div>
            
            {/* Main Icon with Animation */}
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="relative">
                  {/* Outer ring pulse */}
                  <div className="absolute inset-0 animate-ping-slow bg-red-500 rounded-full opacity-20"></div>
                  {/* Middle ring */}
                  <div className="absolute inset-4 animate-pulse bg-red-400 rounded-full opacity-30"></div>
                  {/* Main icon container */}
                  <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-red-600 to-red-800 shadow-2xl ring-4 ring-red-200 dark:ring-red-900/50">
                    <DeniedIcon className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Access Denied
              </h1>
              <div className="w-32 h-1 bg-white/50 rounded-full mx-auto"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-10">
            {/* Main Message */}
            <div className="text-center mb-8">
              <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-6">
                You do not have permission to access this resource
              </p>
              
              {/* Separator */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                    Required Permissions
                  </span>
                </div>
              </div>
            </div>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Permission Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                      <ShieldIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Missing Permissions
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your account lacks the necessary authorization level to perform this action or view this content.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600">
                      <ContactIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Contact Administrator
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Please contact your system administrator to request access to this functionality.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-10 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Error Code: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">403 - Forbidden</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Logged at: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}

// Compact version for modal/popup use
export function AccessDeniedCompact({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <DeniedIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Access Restricted
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You don't have permission to perform this action.
          </p>
          
          
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}