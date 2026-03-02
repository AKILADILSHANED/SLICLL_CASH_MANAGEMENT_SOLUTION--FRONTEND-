"use client";
import React, { useState } from "react";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";
import Spinner from "@/app/Spinner/page";
import SuccessMessage from "@/app/Messages/SuccessMessage/page";

export default function DeletePayment({ onCancel }) {
  //Define Base URL;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [textPaymentId, setTextPaymentId] = useState("");
  const [textPaymentType, setTextPaymentType] = useState("");
  const [spinnerSearch, setSpinnerSearch] = useState(false);
  const [spinnerDelete, setSpinnerDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [paymentDetailsWindow, setPaymentDetailsWindow] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  //Define handleSearchFunction;
  const handleSearch = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setPaymentDetailsWindow(false);
    setConfirmDelete(false);
    if (textPaymentId == "") {
      setErrorMessage("Please provide a Payment ID!");
    } else {
      try {
        setSpinnerSearch(true);
        const request = await fetch(
          `${baseUrl}/api/v1/payment/payment-search-for-delete?paymentId=${encodeURIComponent(
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
          setTextPaymentType(response.responseObject.paymentType);
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

  //Define handleDelete function;
  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      setSpinnerDelete(true);
      const request = await fetch(
        `${baseUrl}/api/v1/payment/payment-delete?paymentId=${encodeURIComponent(
          paymentData.paymentId
        )}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      const response = await request.json();
      if (request.status === 200) {
        setSuccessMessage(response.message);
        setPaymentDetailsWindow(false);
        setTextPaymentId("");

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      } else {
        setErrorMessage(
          response.message
        );
        setConfirmDelete(false);
      }
    } catch (error) {
      setErrorMessage(
        "Response not received from server. Please contact administrator!"
      );
      setConfirmDelete(false);
    } finally {
      setSpinnerDelete(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setTextPaymentId("");
    setPaymentDetailsWindow(false);
    setErrorMessage("");
    setSuccessMessage("");
    setConfirmDelete(false);
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto animate-fadeIn">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-xl shadow-lg p-6 mb-0">
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Delete Payment
                </h1>
                <p className="text-red-100 text-sm mt-1">
                  Search and delete payment records
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
                  placeholder="Enter Payment ID to delete (e.g., PAY-2026-001)"
                  required
                  className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200
                           hover:border-red-400 hover:shadow-sm outline-none uppercase
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
                Enter the Payment ID to search for deletion
              </p>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => handleSearch()}
                disabled={spinnerSearch || !textPaymentId.trim()}
                type="button"
                className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                         rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
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

        {/* Payment Details & Delete Confirmation */}
        {paymentDetailsWindow && (
          <div className="mt-8 animate-fadeIn">
            {/* Warning Header */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-t-xl p-5">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-red-600"
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
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-red-800">
                    {confirmDelete ? "⚠️ Confirm Deletion" : "Review Payment Details"}
                  </h2>
                  <p className="text-red-600 text-sm mt-1">
                    Payment ID: {paymentData.paymentId}
                  </p>
                </div>
              </div>
            </div>

            {/* Details Container */}
            <div className="bg-white border border-red-200 rounded-b-xl shadow-lg p-6 md:p-8">
              {!confirmDelete ? (
                <>
                  {/* Payment Information */}
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center mb-6">
                        <div className="w-1 h-6 bg-red-600 rounded-full mr-3"></div>
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
                              <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-800 rounded-full">
                                FOR DELETION
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Payment Type
                          </label>
                          <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                            <span className="text-sm text-gray-900">
                              {textPaymentType || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Registration Details */}
                    <div>
                      <div className="flex items-center mb-6">
                        <div className="w-1 h-6 bg-red-600 rounded-full mr-3"></div>
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
                                xmlns="http://www.w3.org/2000/svg"
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

                    {/* Warning Box */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <svg
                          className="w-5 h-5 text-red-600 mt-0.5 mr-3"
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
                        <div>
                          <h4 className="text-sm font-semibold text-red-800">
                            Important Notice
                          </h4>
                          <p className="text-sm text-red-600 mt-1">
                            Once deleted, this payment record cannot be recovered.
                            Please ensure you have selected the correct payment record before proceeding.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-8 border-t border-gray-200">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg
                            className="w-4 h-4 mr-2 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                          Review details carefully before deletion
                        </div>

                        <div className="flex flex-wrap gap-3">
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
                            onClick={() => handleDelete()}
                            type="button"
                            className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                                     rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                                     focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                     active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              ></path>
                            </svg>
                            <span>Delete Payment</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>

              ) : (
                /* Confirmation Dialog */
                <div className="text-center py-8">
                  <div className="bg-red-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-red-600"
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
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Confirm Deletion
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Are you sure you want to delete the payment record{" "}
                    <span className="font-semibold text-red-600">
                      {paymentData.paymentId}
                    </span>
                    ? This action cannot be undone.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      type="button"
                      onClick={cancelDelete}
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
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                      <span>Cancel</span>
                    </button>

                    <button
                      onClick={() => handleDelete()}
                      disabled={spinnerDelete}
                      className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                               rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                               focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                               active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                               disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {spinnerDelete ? (
                        <>
                          <Spinner size={20}></Spinner>
                          <span>Deleting...</span>
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                          <span>Yes, Delete Payment</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
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
              <div className="bg-red-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
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
                Enter a Payment ID above to search for payment deletion.
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