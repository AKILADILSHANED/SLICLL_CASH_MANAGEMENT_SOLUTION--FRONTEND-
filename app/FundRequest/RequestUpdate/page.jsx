"use client"
import React, { useState } from "react";
import Spinner from "@/app/Spinner/page";
import SuccessMessage from "@/app/Messages/SuccessMessage/page";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";

export default function UpdateRequest({ onCancel }) {
  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [searchSpinner, setSearchSpinner] = useState(false);
  const [updateSpinner, setUpdateSpinner] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [requestDetails, setRequestDetails] = useState({});
  const [requestDetailsWindow, setRequestDetailsWindow] = useState(false);
  const [searchedRequestId, setSearchedRequestId] = useState("");
  const [searchedRequestType, setSearchedRequestType] = useState("");

  const [updatedAccountNumber, setUpdatedAccountNumber] = useState("");
  const [updatedPaymentType, setUpdatedPaymentType] = useState("");
  const [updatedAdjustmentType, setUpdatedAdjustmentType] = useState("");
  const [updatedAdjustmentAmount, setUpdatedAdjustmentAmount] = useState("");
  const [isModified, setIsModified] = useState(false);

  //Define handleSearch function;
  const handleSearch = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setRequestDetailsWindow(false);
    setRequestDetails({});
    setIsModified(false);

    if (!searchedRequestId.trim() || !searchedRequestType) {
      setErrorMessage("Please enter Request ID and select Request Type!");
      return;
    }

    try {
      setSearchSpinner(true);
      const request = await fetch(
        `${baseUrl}/api/v1/fund-request/fundRequest-update?requestId=${encodeURIComponent(
          searchedRequestId
        )}&requestType=${encodeURIComponent(searchedRequestType)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (request.ok) {
        const response = await request.json();
        if (response.success == false) {
          setErrorMessage(response.message);
        } else {
          const data = response.responseObject;
          setRequestDetails(data);
          setUpdatedAccountNumber(data.accountId || "");
          setUpdatedPaymentType(data.paymentId || "");
          setRequestDetailsWindow(true);
          setUpdatedAdjustmentType("");
          setUpdatedAdjustmentAmount("");
          setIsModified(false);
        }
      } else {
        setErrorMessage(
          "No response from server. Please contact administrator!"
        );
      }
    } catch (error) {
      setErrorMessage(
        "Unexpected error occurred. Please contact administrator!"
      );
    } finally {
      setSearchSpinner(false);
    }
  };

  // Check if form has been modified
  const checkForModifications = () => {
    if (!requestDetails) return false;

    const accountChanged = updatedAccountNumber !== requestDetails.accountId;
    const paymentChanged = updatedPaymentType !== requestDetails.paymentId;
    const hasAdjustment = updatedAdjustmentType && updatedAdjustmentAmount;

    return accountChanged || paymentChanged || hasAdjustment;
  };

  //define handleKeyDown function; This will be restricted typing minus values in the text box;
  const handleKeyDown = (e) => {
    if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
      e.preventDefault();
    }
  };

  //Define handleUpdate function;
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!checkForModifications()) {
      setErrorMessage("No changes detected. Please modify at least one field before updating.");
      return;
    }

    if (updatedAdjustmentType && !updatedAdjustmentAmount) {
      setErrorMessage("Please enter an adjustment amount when selecting adjustment type!");
      return;
    }

    setUpdateSpinner(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/fund-request/save-requestUpdate`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestId: requestDetails.requestId,
            accountId: updatedAccountNumber,
            requestAmount: requestDetails.requestAmount,
            paymentType: updatedPaymentType,
            adjustmentType: updatedAdjustmentType,
            adjustmentAmount: updatedAdjustmentAmount,
          }),
        }
      );
      if (request.ok) {
        const response = await request.json();
        if (response.success == false) {
          setErrorMessage(response.message);
        } else {
          setSuccessMessage(response.message);
          setUpdatedAdjustmentType("");
          setUpdatedAdjustmentAmount("");
          setIsModified(false);

          // Auto-hide success message after 5 seconds
          setTimeout(() => {
            setSuccessMessage("");
          }, 5000);
        }
      } else {
        setErrorMessage(
          "No response from server. Please contact administrator!"
        );
      }
    } catch (error) {
      setErrorMessage(
        "Unexpected error occurred. Please contact administrator!"
      );
    } finally {
      setUpdateSpinner(false);
    }
  };

  //Define number formating function. This function will formatted the number in comma separated;
  const formatAmount = (value) => {
    const number = parseFloat(value || 0);
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const clearSearch = () => {
    setSearchedRequestId("");
    setSearchedRequestType("");
    setRequestDetailsWindow(false);
    setErrorMessage("");
    setSuccessMessage("");
    setUpdatedAdjustmentType("");
    setUpdatedAdjustmentAmount("");
    setIsModified(false);
  };

  const resetForm = () => {
    if (requestDetails) {
      setUpdatedAccountNumber(requestDetails.accountId || "");
      setUpdatedPaymentType(requestDetails.paymentId || "");
      setUpdatedAdjustmentType("");
      setUpdatedAdjustmentAmount("");
      setIsModified(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getRequestTypeLabel = (type) => {
    return type == 0 ? "Actual" : "Forecasted";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto animate-fadeIn">
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
                  Update Fund Request
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  Search and update fund request details
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
          <form onSubmit={handleSearch} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Request ID Input */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-800">
                  Fund Request ID
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchedRequestId}
                    onChange={(e) => setSearchedRequestId(e.target.value)}
                    placeholder="Enter Fund Request ID"
                    required
                    className="pl-10 w-full p-3.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                             hover:border-blue-400 hover:shadow-sm outline-none
                             dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Enter the unique fund request ID to search
                </p>
              </div>

              {/* Request Type Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-800">
                  Request Type
                  <span className="text-red-600 ml-1">*</span>
                </label>
                <select
                  value={searchedRequestType}
                  onChange={(e) => setSearchedRequestType(e.target.value)}
                  required
                  className="w-full p-3.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                           hover:border-blue-400 hover:shadow-sm outline-none
                           dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="">- Select Request Type -</option>
                  <option value="0">Actual Fund Request</option>
                  <option value="1">Forecasted Fund Request</option>
                </select>
                <p className="text-xs text-gray-500">
                  Select the type of fund request
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-500"
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
                  <span>Enter Request ID and select type to search</span>
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      ></path>
                    </svg>
                    <span>Clear</span>
                  </button>

                  <button
                    type="submit"
                    disabled={searchSpinner}
                    className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                             rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                             disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {searchSpinner ? (
                      <>
                        <Spinner size={20} />
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
                        <span>Search Request</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Request Details Form */}
        {requestDetailsWindow && (
          <form onSubmit={handleUpdate}>
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Update Fund Request Details
                    </h2>
                    <p className="text-sm text-gray-600">
                      Request ID: {requestDetails.requestId} • Type: {getRequestTypeLabel(searchedRequestType)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Container */}
              <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg p-6 md:p-8">
                <div className="space-y-8">
                  {/* Basic Information Section */}
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Basic Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Fund Request ID
                        </label>
                        <div className="p-3.5 bg-gray-50 border border-gray-300 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">
                              {requestDetails.requestId || "N/A"}
                            </span>
                            <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              READ ONLY
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Account Number
                          <span className="text-red-600 ml-1">*</span>
                        </label>
                        <select
                          value={updatedAccountNumber}
                          onChange={(e) => {
                            setUpdatedAccountNumber(e.target.value);
                            setIsModified(true);
                          }}
                          required
                          className="w-full p-3.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                   hover:border-blue-400 hover:shadow-sm outline-none"
                        >
                          {requestDetails.accountList && requestDetails.accountList.map((element) => (
                            <option key={element.accountId} value={element.accountId}>
                              {element.accountNumber}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Amount Information */}
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Payment & Amount Details
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Payment Type
                          <span className="text-red-600 ml-1">*</span>
                        </label>
                        <select
                          value={updatedPaymentType}
                          onChange={(e) => {
                            setUpdatedPaymentType(e.target.value);
                            setIsModified(true);
                          }}
                          required
                          className="w-full p-3.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                   hover:border-blue-400 hover:shadow-sm outline-none"
                        >
                          {requestDetails.paymentList && requestDetails.paymentList.map((element) => (
                            <option key={element.paymentId} value={element.paymentId}>
                              {element.paymentType}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Request Amount
                        </label>
                        <div className="p-3.5 bg-gray-50 border border-gray-300 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900">
                              Rs.{formatAmount(requestDetails.requestAmount)}
                            </span>
                            <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                              Original
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dates & Outstanding Amount */}
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Dates & Financials
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Outstanding Amount
                        </label>
                        <div className="p-3.5 bg-gray-50 border border-gray-300 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900">
                              Rs.{formatAmount(requestDetails.outstandingAmount)}
                            </span>
                            <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-800 rounded-full">
                              Pending
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Request Date
                        </label>
                        <div className="p-3.5 bg-gray-50 border border-gray-300 rounded-lg">
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
                              {formatDate(requestDetails.requestDate)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Required Date
                        </label>
                        <div className="p-3.5 bg-gray-50 border border-gray-300 rounded-lg">
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
                              {formatDate(requestDetails.requiredDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Adjustment Section */}
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Amount Adjustment
                      </h3>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Adjustment Type
                          </label>
                          <select
                            value={updatedAdjustmentType}
                            onChange={(e) => {
                              setUpdatedAdjustmentType(e.target.value);
                              setIsModified(true);
                            }}
                            className="w-full p-3.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                     hover:border-blue-400 hover:shadow-sm outline-none"
                          >
                            <option value="">- Select Type -</option>
                            <option value="+">Add to Request</option>
                            <option value="-">Deduct from Request</option>
                          </select>
                          <p className="text-xs text-gray-500">
                            Optional: Adjust the request amount
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Adjustment Amount ($)
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500">Rs.</span>
                            </div>
                            <input
                              type="number"
                              value={updatedAdjustmentAmount}
                              onChange={(e) => {
                                setUpdatedAdjustmentAmount(e.target.value);
                                setIsModified(true);
                              }}
                              onKeyDown={handleKeyDown}
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              className="pl-8 w-full p-3.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                       hover:border-blue-400 hover:shadow-sm outline-none"
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            Enter amount for adjustment
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 text-transparent">
                            Update Action
                          </label>
                          <button
                            type="submit"
                            disabled={updateSpinner || !isModified}
                            className="w-full px-6 py-3.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 
                                     rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 
                                     focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                     active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                     disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            {updateSpinner ? (
                              <>
                                <Spinner size={20} />
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
                                <span>Update Request</span>
                              </>
                            )}
                          </button>
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
                              ? 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300'
                              : 'text-gray-400 bg-gray-50 cursor-not-allowed'
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
        {!requestDetailsWindow && searchedRequestId && !errorMessage && (
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
                Search for Fund Request
              </h3>
              <p className="text-gray-600 mb-4">
                Enter a Fund Request ID and select type above to search for details.
              </p>
              <p className="text-sm text-gray-500">
                Fund request details will appear here after a successful search.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}