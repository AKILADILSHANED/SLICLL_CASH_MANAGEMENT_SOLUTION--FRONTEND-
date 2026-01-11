"use client"
import React, { useState } from "react";
import Spinner from "@/app/Spinner/page";
import SuccessMessage from "@/app/Messages/SuccessMessage/page";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";

export default function DeleteRequest({ onCancel }) {
  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [searchSpinner, setSearchSpinner] = useState(false);
  const [searchedRequestId, setSearchedRequestId] = useState("");
  const [searchedRequestType, setSearchedRequestType] = useState("");
  const [updateSpinner, setUpdateSpinner] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fundRequestData, setFundRequestData] = useState({});
  const [requestDetailsWindow, setRequestDetailsWindow] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  //Define handleSearch function;
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchSpinner(true);
    setSuccessMessage("");
    setErrorMessage("");
    setRequestDetailsWindow(false);
    setConfirmDelete(false);

    if (!searchedRequestId.trim() || !searchedRequestType) {
      setErrorMessage("Please enter Request ID and select Request Type!");
      setSearchSpinner(false);
      return;
    }

    try {
      const request = await fetch(
        `${baseUrl}/api/v1/fund-request/delete-request?requestId=${encodeURIComponent(
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
          setRequestDetailsWindow(true);
          setFundRequestData(response.responseObject);
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

  //Define handleDelete function;
  const handleDelete = async (e) => {
    e.preventDefault();

    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setUpdateSpinner(true);
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/fund-request/save-requestDelete?requestId=${encodeURIComponent(fundRequestData.requestId)}&requestType=${encodeURIComponent(fundRequestData.requestType)}`,
        {
          method: "PUT",
          credentials: "include"
        }
      );
      if (request.ok) {
        const response = await request.json();
        if (response.success == false) {
          setErrorMessage(response.message);
          setConfirmDelete(false);
        } else {
          setSuccessMessage(response.message);
          setRequestDetailsWindow(false);
          setSearchedRequestId("");
          setSearchedRequestType("");
          setConfirmDelete(false);

          // Auto-hide success message after 5 seconds
          setTimeout(() => {
            setSuccessMessage("");
          }, 5000);
        }
      } else {
        setErrorMessage("No response from server. Please contact administrator!");
        setConfirmDelete(false);
      }
    } catch (error) {
      setErrorMessage(
        "Unexpected error occurred. Please contact administrator!"
      );
      setConfirmDelete(false);
    } finally {
      setUpdateSpinner(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const clearSearch = () => {
    setSearchedRequestId("");
    setSearchedRequestType("");
    setRequestDetailsWindow(false);
    setErrorMessage("");
    setSuccessMessage("");
    setConfirmDelete(false);
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  const formatCurrency = (amount) => {
    const number = parseFloat(amount || 0);
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto animate-fadeIn">
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
                  Delete Fund Request
                </h1>
                <p className="text-red-100 text-sm mt-1">
                  Search and delete fund request records
                </p>
              </div>
            </div>
            {onCancel && (
              <button
                onClick={handleCancel}
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
                    placeholder="Enter Fund Request ID to delete"
                    required
                    className="pl-10 w-full p-3.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200
                             hover:border-red-400 hover:shadow-sm outline-none
                             dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Enter the unique fund request ID to search for deletion
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
                           focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200
                           hover:border-red-400 hover:shadow-sm outline-none
                           dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="">- Select Request Type -</option>
                  <option value="0">Actual Fund Request</option>
                  <option value="1">Forecasted Fund Request</option>
                </select>
                <p className="text-xs text-gray-500">
                  Select the type of fund request to delete
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200">
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
                    className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                             rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
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

        {/* Request Details Section */}
        {requestDetailsWindow && (
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
                    {confirmDelete ? "⚠️ Confirm Deletion" : "Review Request Details"}
                  </h2>
                  <p className="text-red-600 text-sm mt-1">
                    Request ID: {fundRequestData.requestId} • Type: {getRequestTypeLabel(fundRequestData.requestType)}
                  </p>
                </div>
              </div>
            </div>

            {!confirmDelete ? (
              /* Request Details Table */
              <div className="bg-white border border-red-200 rounded-b-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th scope="col" className="px-6 py-3 font-semibold">
                          Request ID
                        </th>
                        <th scope="col" className="px-6 py-3 font-semibold">
                          Account
                        </th>
                        <th scope="col" className="px-6 py-3 font-semibold">
                          Payment Type
                        </th>
                        <th scope="col" className="px-6 py-3 font-semibold text-right">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 font-semibold">
                          Request Date
                        </th>
                        <th scope="col" className="px-6 py-3 font-semibold">
                          Required Date
                        </th>
                        <th scope="col" className="px-6 py-3 font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                            {fundRequestData.requestId}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium">
                            {fundRequestData.accountNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">
                            {fundRequestData.paymentType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            Rs.{formatCurrency(fundRequestData.requestAmount)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {formatDate(fundRequestData.requestDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {formatDate(fundRequestData.requiredDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <form onSubmit={handleDelete}>
                            <button
                              type="submit"
                              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
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
                              <span>Delete Request</span>
                            </button>
                          </form>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Warning Box */}
                <div className="bg-red-50 border-t border-red-200 p-6">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
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
                      <h4 className="text-sm font-semibold text-red-800 mb-1">
                        Important Notice
                      </h4>
                      <p className="text-sm text-red-600">
                        This action will permanently delete the fund request record.
                        Deleted requests cannot be recovered. Please ensure you have selected
                        the correct request before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Confirmation Dialog */
              <div className="bg-white border border-red-200 rounded-b-xl shadow-lg p-8">
                <div className="text-center">
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
                    Are you sure you want to permanently delete the fund request{" "}
                    <span className="font-semibold text-red-600">
                      {fundRequestData.requestId}
                    </span>
                    ? This action cannot be undone.
                  </p>

                  {/* Request Details Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-gray-600">Account:</div>
                      <div className="font-medium text-gray-900">{fundRequestData.accountNumber}</div>

                      <div className="text-gray-600">Payment Type:</div>
                      <div className="font-medium text-gray-900">{fundRequestData.paymentType}</div>

                      <div className="text-gray-600">Amount:</div>
                      <div className="font-medium text-gray-900">Rs.{formatCurrency(fundRequestData.requestAmount)}</div>

                      <div className="text-gray-600">Required Date:</div>
                      <div className="font-medium text-gray-900">{formatDate(fundRequestData.requiredDate)}</div>
                    </div>
                  </div>

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
                      onClick={handleDelete}
                      disabled={updateSpinner}
                      className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                               rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                               focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                               active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                               disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {updateSpinner ? (
                        <>
                          <Spinner size={20} />
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
                          <span>Yes, Delete Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
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
        {!requestDetailsWindow && searchedRequestId && !errorMessage && (
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
                Search for Fund Request
              </h3>
              <p className="text-gray-600 mb-4">
                Enter a Fund Request ID and select type above to search for deletion.
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