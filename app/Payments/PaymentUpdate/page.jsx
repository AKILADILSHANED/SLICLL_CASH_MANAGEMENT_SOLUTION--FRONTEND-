"use client"
import React, { useState, useEffect } from "react";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";
import Spinner from "@/app/Spinner/page";
import SuccessMessage from "@/app/Messages/SuccessMessage/page";

export default function UpdatePayment({ onCancel }) {
  //Define Base URL;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [textPaymentId, setTextPaymentId] = useState("");
  const [textPaymentType, setTextPaymentType] = useState("");
  const [spinnerSearch, setSpinnerSearch] = useState(false);
  const [spinnerUpdate, setSpinnerUpdate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [paymentDetailsWindow, setPaymentDetailsWindow] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [originalPaymentType, setOriginalPaymentType] = useState("");

  // Check if payment type has been modified
  useEffect(() => {
    if (paymentDetailsWindow && originalPaymentType) {
      setIsModified(textPaymentType !== originalPaymentType);
    }
  }, [textPaymentType, paymentDetailsWindow, originalPaymentType]);

  //Define handleSearchFunction;
  const handleSearch = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setPaymentDetailsWindow(false);
    setIsModified(false);
    if (textPaymentId == "") {
      setErrorMessage("Please provide a Payment ID!");
    } else {
      try {
        setSpinnerSearch(true);
        const request = await fetch(
          `${baseUrl}/api/v1/payment/payment-search-for-update?paymentId=${encodeURIComponent(
            textPaymentId
          )}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const response = await request.json();
        if (request.status === 200) {
          setPaymentData(response.responseObject);
          const paymentType = response.responseObject.paymentType || "";
          setTextPaymentType(paymentType);
          setOriginalPaymentType(paymentType);
          setPaymentDetailsWindow(true);
        } else {
          setErrorMessage(
            response.message
          );
        }
      } catch (error) {
        setErrorMessage(
          "Response not received from server. Please contact administrator!"
        );
      } finally {
        setSpinnerSearch(false);
      }
    }
  };

  //Define handleUpdate function;
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!isModified) {
      setErrorMessage("No changes detected. Please modify the payment type before updating.");
      return;
    }

    if (!textPaymentType.trim()) {
      setErrorMessage("Payment type cannot be empty!");
      return;
    }

    try {
      setSpinnerUpdate(true);
      setErrorMessage("");
      setSuccessMessage("");

      const request = await fetch(
        `${baseUrl}/api/v1/payment/payment-update?paymentType=${encodeURIComponent(
          textPaymentType
        )}&paymentId=${encodeURIComponent(paymentData.paymentId)}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      const response = await request.json();
      if (request.status === 200) {
        setSuccessMessage(response.message);
        setOriginalPaymentType(textPaymentType);
        setIsModified(false);

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage("Response not received from server. Please contact administrator!");
    } finally {
      setSpinnerUpdate(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setTextPaymentId("");
    setTextPaymentType("");
    setPaymentDetailsWindow(false);
    setErrorMessage("");
    setSuccessMessage("");
    setIsModified(false);
  };

  const resetForm = () => {
    if (originalPaymentType) {
      setTextPaymentType(originalPaymentType);
      setIsModified(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Update Payment
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  Search and update payment information
                </p>
              </div>
            </div>
            {onCancel && (
              <button
                onClick={() => onCancel()}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
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
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  onChange={(e) => setTextPaymentId(e.target.value.toUpperCase())}
                  value={textPaymentId}
                  onKeyPress={handleKeyPress}
                  type="text"
                  placeholder="Enter Payment ID (e.g., PAY-2026-001)"
                  required
                  className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                           hover:border-blue-400 hover:shadow-sm outline-none uppercase
                           dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                {textPaymentId && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label="Clear search"
                  >
                    <svg
                      className="w-4 h-4 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Enter the Payment ID to search for payment details
              </p>
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
                         disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]"
              >
                {spinnerSearch ? (
                  <>
                    <Spinner size={20}></Spinner>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Payment Update Form */}
        {paymentDetailsWindow && (
          <form onSubmit={(e) => handleUpdate(e)}>
            <div className="mt-8 animate-fadeIn">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-t-xl p-5">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Update Payment Details
                    </h2>
                    <p className="text-sm text-gray-600">
                      Payment ID: {paymentData.paymentId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Container */}
              <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg p-6 md:p-8">
                <div className="space-y-8">
                  {/* Payment Information Section */}
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Payment Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Payment ID
                        </label>
                        <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">
                              {paymentData.paymentId || "N/A"}
                            </span>
                            <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              READ ONLY
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Payment Type
                          <span className="text-red-600 ml-1">*</span>
                        </label>
                        <input
                          required
                          onChange={(e) => setTextPaymentType(e.target.value)}
                          value={textPaymentType}
                          type="text"
                          placeholder="Enter payment type"
                          className="w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                   hover:border-blue-400 hover:shadow-sm outline-none
                                   dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        />
                        {isModified && (
                          <div className="flex items-center text-blue-600 text-xs mt-1">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                            Modified from: {originalPaymentType}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Registration Details Section */}
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Registration Details
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Registered Date
                        </label>
                        <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 text-gray-500 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                            <span className="text-sm text-gray-900">
                              {formatDate(paymentData.registeredDate)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Registered By
                        </label>
                        <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 text-gray-500 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              ></path>
                            </svg>
                            <span className="text-sm text-gray-900">
                              {paymentData.registeredBy || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex items-center space-x-3">
                        {isModified && (
                          <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"
                              ></path>
                            </svg>
                            <span className="text-sm font-medium">
                              Unsaved Changes
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={resetForm}
                          disabled={!isModified}
                          className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${isModified
                            ? "text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300"
                            : "text-gray-400 bg-gray-50 cursor-not-allowed"
                            }`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            ></path>
                          </svg>
                          <span>Reset Changes</span>
                        </button>

                        <button
                          type="button"
                          onClick={clearSearch}
                          className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                                   rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 
                                   flex items-center justify-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            ></path>
                          </svg>
                          <span>Search Another</span>
                        </button>

                        <button
                          type="submit"
                          disabled={spinnerUpdate || !isModified}
                          className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 
                                   rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 
                                   focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                   active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                   disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {spinnerUpdate ? (
                            <>
                              <Spinner size={20}></Spinner>
                              <span>Updating...</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                ></path>
                              </svg>
                              <span>Update Payment</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Messages */}
        {successMessage && (
          <div className="mt-6 animate-slideDown">
            <SuccessMessage messageValue={successMessage} />
          </div>
        )}
        {errorMessage && (
          <div className="mt-6 animate-slideDown">
            <ErrorMessage messageValue={errorMessage} />
          </div>
        )}

        {/* No Results Message */}
        {!paymentDetailsWindow && textPaymentId && !errorMessage && (
          <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Search for Payment Details
              </h3>
              <p className="text-gray-600 mb-4">
                Enter a Payment ID above to search for payment information.
              </p>
              <p className="text-sm text-gray-500">
                Payment details will appear here after a successful search.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}