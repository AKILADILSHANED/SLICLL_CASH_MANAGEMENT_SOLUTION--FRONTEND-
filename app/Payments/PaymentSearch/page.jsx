"use client"
import React, { useState } from "react";
import Spinner from "@/app/Spinner/page";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";

export default function PaymentSearch({ onCancel }) {

  //Define Base URL;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [textPaymentId, setTextPaymentId] = useState("");
  const [spinnerSearch, setSpinnerSearch] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [paymentDetailsWindow, setPaymentDetailsWindow] = useState(false);
  const [paymentData, setPaymentData] = useState({});

  //Define handleSearch function;
  const handleSearch = async () => {
    setErrorMessage("");
    setPaymentDetailsWindow(false);
    if(textPaymentId == ""){
        setErrorMessage("Please provide a Payment ID!");
    }else{
        try{
            setSpinnerSearch(true);
            const request = await fetch(
                `${baseUrl}/api/v1/payment/payment-search?paymentId=${encodeURIComponent(textPaymentId)}`,
                {
                    method:"GET",
                    credentials:"include"
                }
            );
            if(request.ok){
                const response = await request.json();
                if(response.success == false){
                    setErrorMessage(response.message);
                }else{
                    setPaymentData(response.responseObject);
                    setPaymentDetailsWindow(true);
                }
            }else{
                setErrorMessage("No response from server. Please contact administrator!");
            }
        }catch(error){
            setErrorMessage("Un-expected eror occurred. Please contact administrator!");
        }finally{
            setSpinnerSearch(false);
        }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setTextPaymentId("");
    setPaymentDetailsWindow(false);
    setErrorMessage("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto animate-fadeIn">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl shadow-lg p-6 mb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Payment Search</h1>
                <p className="text-blue-100 text-sm mt-1">Search and view payment information by Payment ID</p>
              </div>
            </div>
            {onCancel && (
              <button
                onClick={() => onCancel()}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span>Close</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Form Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment ID
                <span className="text-red-600 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  onChange={(e) => setTextPaymentId(e.target.value.toUpperCase())}
                  value={textPaymentId}
                  onKeyPress={handleKeyPress}
                  id="small"
                  type="text"
                  placeholder="Enter Payment ID (e.g., PAY-2026-001)"
                  required
                  className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                           hover:border-blue-400 hover:shadow-sm outline-none uppercase
                           dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {textPaymentId && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label="Clear search">
                    <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">Enter the Payment ID to search for payment details</p>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => handleSearch()}
                disabled={spinnerSearch || !textPaymentId.trim()}
                type="button"
                className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                         rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                         disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]">
                {spinnerSearch ? (
                  <>
                    <Spinner size={20} />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-6 animate-slideDown">
            <ErrorMessage messageValue={errorMessage} />
          </div>
        )}

        {/* Payment Details */}
        {paymentDetailsWindow ? (
          <div className="mt-8 animate-fadeIn">
            {/* Details Header */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-t-xl p-5">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Payment Details Found</h2>
                  <p className="text-sm text-gray-600">Payment ID: {paymentData.paymentId}</p>
                </div>
              </div>
            </div>

            {/* Details Container */}
            <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Information Card */}
                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Payment Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-blue-100">
                      <span className="text-sm font-medium text-gray-600">Payment ID</span>
                      <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                        {paymentData.paymentId || "N/A"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-3 border-b border-blue-100">
                      <span className="text-sm font-medium text-gray-600">Payment Type</span>
                      <span className="text-sm font-semibold text-gray-800">
                        {paymentData.paymentType || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Registration Information Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Registration Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-600">Registered Date</span>
                      <span className="text-sm font-semibold text-gray-800">
                        {formatDate(paymentData.registeredDate)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Registered By</span>
                      <span className="text-sm font-semibold text-gray-800">
                        {paymentData.registeredBy || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 mt-8 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Payment information retrieved successfully
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={clearSearch}
                      className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                               rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 
                               flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                      <span>Search Another</span>
                    </button>

                    <div
                      onClick={() => onCancel()}
                      className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                               rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                               focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                               active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2 
                               cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      <span>Close</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Empty State
          textPaymentId && !errorMessage && (
            <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Search for Payment Details</h3>
                <p className="text-gray-600 mb-4">
                  Enter a Payment ID above to search for payment information.
                </p>
                <p className="text-sm text-gray-500">
                  Payment details will appear here after a successful search.
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}