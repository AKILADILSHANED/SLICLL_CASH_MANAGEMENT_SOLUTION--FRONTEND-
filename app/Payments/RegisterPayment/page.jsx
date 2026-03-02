"use client"
import React, { useState } from "react";
import Spinner from "@/app/Spinner/page";
import SUccessMessage from "@/app/Messages/SuccessMessage/page";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";

export default function PaymentRegister({ onCancel }) {
  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [textPaymentType, setTextPaymentType] = useState("");
  const [spinnerSearch, setSpinnerSearch] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentData, setPaymentData] = useState({});
  const [paymentRegisterDataWindow, setPaymentRegisterDataWindow] =
    useState(false);
  const [suggestions, setSuggestions] = useState([
    "Cash Payment",
    "Cheque Payment",
    "Bank Transfer",
    "Credit Card",
    "Online Payment",
    "Mobile Payment",
    "Direct Debit",
    "Standing Order"
  ]);

  //Define handleRegister function;
  const handleRegister = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    setPaymentRegisterDataWindow(false);
    if (textPaymentType == "") {
      setErrorMessage("Please provide a Payment Type!");
    } else {
      try {
        setSpinnerSearch(true);
        const request = await fetch(
          `${baseUrl}/api/v1/payment/registerPayment?paymentType=${encodeURIComponent(
            textPaymentType
          )}`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        const response = await request.json();
        if (request.status === 200) {
          setPaymentData(response.responseObject);
          setPaymentRegisterDataWindow(true);
          setSuccessMessage(response.message);
          // Add the new payment type to suggestions if not already there
          if (!suggestions.includes(textPaymentType)) {
            setSuggestions(prev => [textPaymentType, ...prev.slice(0, 7)]);
          }
        } else {
          setErrorMessage(
            response.message
          );
        }
      } catch (error) {
        setErrorMessage(
          "No response from server. Please contact administrator!"
        );
      } finally {
        setSpinnerSearch(false);
        setTextPaymentType("");
      }
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRegister();
    }
  };

  // Clear form
  const clearForm = () => {
    setTextPaymentType("");
    setPaymentRegisterDataWindow(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  // Format date
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

  // Get payment type badge
  const getPaymentTypeBadge = (type) => {
    const paymentType = type?.toLowerCase();

    const badgeConfigs = {
      'cash': { bg: 'bg-green-100 text-green-800 border-green-200', icon: '💵' },
      'cheque': { bg: 'bg-blue-100 text-blue-800 border-blue-200', icon: '📄' },
      'bank': { bg: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: '🏦' },
      'credit': { bg: 'bg-purple-100 text-purple-800 border-purple-200', icon: '💳' },
      'online': { bg: 'bg-teal-100 text-teal-800 border-teal-200', icon: '🌐' },
      'mobile': { bg: 'bg-cyan-100 text-cyan-800 border-cyan-200', icon: '📱' },
      'direct': { bg: 'bg-orange-100 text-orange-800 border-orange-200', icon: '🔄' },
      'standing': { bg: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '📅' }
    };

    const matchedConfig = Object.entries(badgeConfigs).find(([key]) =>
      paymentType?.includes(key)
    );

    const config = matchedConfig ? matchedConfig[1] : {
      bg: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: '💰'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${config.bg}`}>
        <span>{config.icon}</span>
        <span>{type}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl shadow-lg p-6 mb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Register Payment Type</h1>
                <p className="text-blue-100 text-sm mt-1">Add new payment methods to the system</p>
              </div>
            </div>
            <button
              onClick={() => onCancel()}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Payment Type Registration</h2>
            <p className="text-sm text-gray-600">Enter payment type details to register a new payment method</p>
          </div>

          <div className="space-y-6">
            {/* Payment Type Input */}
            <div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type
                    <span className="text-red-600 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <input
                      value={textPaymentType}
                      onChange={(e) => setTextPaymentType(e.target.value)}
                      onKeyPress={handleKeyPress}
                      type="text"
                      placeholder="Enter payment type"
                      className="pl-10 w-full p-3.5 text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                               hover:border-blue-400 hover:shadow-sm outline-none"
                    />
                    {textPaymentType && (
                      <button
                        type="button"
                        onClick={() => setTextPaymentType("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
                        aria-label="Clear input">
                        <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter the payment method name. Examples: Motor, Non-Motor, Staff, Commissions etc.
                  </p>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleRegister}
                    disabled={spinnerSearch || !textPaymentType.trim()}
                    className="px-8 py-3.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 
                             rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-3 focus:ring-blue-300 
                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                             disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]">
                    {spinnerSearch ? (
                      <>
                        <Spinner size={20} />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>Register Payment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Suggestions Display (Non-interactive) */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Common payment type examples:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((type) => (
                    <div
                      key={type}
                      className="px-3 py-1.5 text-sm text-gray-600 bg-gray-50 
                               rounded-lg border border-gray-200 cursor-default"
                    >
                      {type}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  These are examples only. You can type any payment type name in the field above.
                </p>
              </div>
            </div>

            {/* Messages */}
            {successMessage && (
              <div className="animate-slideDown">
                <SUccessMessage messageValue={successMessage} />
              </div>
            )}

            {errorMessage && (
              <div className="animate-slideDown">
                <ErrorMessage messageValue={errorMessage} />
              </div>
            )}
          </div>
        </div>

        {/* Registration Success Details */}
        {paymentRegisterDataWindow && (
          <div className="mt-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-t-2xl p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-green-800">Payment Type Registered Successfully</h2>
                  <p className="text-green-700">Payment type has been added to the system</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-t-0 border-gray-200 rounded-b-2xl shadow-lg p-6 md:p-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Registration Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Payment ID</div>
                    <div className="text-lg font-semibold text-gray-900">{paymentData.paymentId}</div>
                    <div className="text-xs text-gray-500 mt-1">Unique payment identifier</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Payment Type</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {getPaymentTypeBadge(paymentData.paymentType)}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Registered Date</div>
                    <div className="text-sm font-medium text-gray-900">{formatDate(paymentData.registeredDate)}</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Registered By</div>
                    <div className="text-sm font-medium text-gray-900">{paymentData.registeredBy || "System"}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <button
                    onClick={clearForm}
                    className="px-6 py-3.5 text-gray-700 bg-white border-2 border-gray-300 
                             rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 
                             transition-all duration-200 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Register Another</span>
                  </button>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => onCancel()}
                      className="px-6 py-3.5 text-gray-700 bg-white border-2 border-gray-300 
                               rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 
                               transition-all duration-200 flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      <span>Close</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}