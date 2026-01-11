"use client"
import React, { useState } from 'react'
import Spinner from '@/app/Spinner/page'
import ErrorMessage from '@/app/Messages/ErrorMessage/page';

export default function DisplayTransfer() {

  //Define state variables;
  const [viewSpinner, setViewSpinner] = useState(false);
  const [transferDataTable, setTransferDataTable] = useState(false);
  const [transferData, setTransferData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [transferId, setTransferId] = useState("");

  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define viewTransferData function;
  const viewTransferData = async (e) => {
    e.preventDefault();
    try {
      setViewSpinner(true)
      setErrorMessage("");
      setTransferDataTable(false);
      setTransferData({});

      if (transferId.trim() === "") {
        setErrorMessage("Please provide a valid Transfer ID!");
        setViewSpinner(false);
        return;
      }

      const request = await fetch(
        `${baseUrl}/api/v1/transfers/display-transfer?transferId=${encodeURIComponent(transferId)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!request.ok) {
        const response = await request.json();
        setErrorMessage(response.message || "Failed to fetch transfer details");
      } else {
        const response = await request.json();
        setTransferDataTable(true);
        setTransferData(response.responseObject || {});
      }
    } catch (error) {
      setErrorMessage("Unexpected error occurred. Please contact administrator!");
    } finally {
      setViewSpinner(false)
    }
  }

  const clearSearch = () => {
    setTransferId("");
    setErrorMessage("");
    setTransferDataTable(false);
    setTransferData({});
  };

  const formatCurrency = (amount) => {
    const number = parseFloat(amount || 0);
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const getStatusBadge = (status) => {
    if (!status) return null;

    const statusLower = status.toLowerCase();
    if (statusLower.includes('approved') || statusLower === 'active' || statusLower === 'completed') {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          {status}
        </span>
      );
    } else if (statusLower.includes('pending') || statusLower === 'pending') {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          {status}
        </span>
      );
    } else if (statusLower.includes('rejected') || statusLower === 'failed') {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          {status}
        </span>
      );
    }
    return <span className="text-sm text-gray-600">{status}</span>;
  };

  const getCrossAdjustmentBadge = (adjustment) => {
    if (!adjustment) {
      return null;
    }else{
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
          {adjustment}
        </span>
      );
    }    
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      viewTransferData(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto animate-fadeIn">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Display Transfer Details
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  Search and view detailed transfer information
                </p>
              </div>
            </div>
            {transferDataTable && (
              <button
                onClick={clearSearch}
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
                <span>New Search</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Form Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <form onSubmit={viewTransferData} className="space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-800">
                Transfer ID
                <span className="text-red-600 ml-1">*</span>
              </label>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="relative flex-1">
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
                    onChange={(e) => setTransferId(e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress}
                    type="text"
                    value={transferId}
                    placeholder="Enter Transfer ID (e.g., TFR-202601-0013)"
                    required
                    className="pl-10 w-full p-3.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                 hover:border-blue-400 hover:shadow-sm outline-none uppercase
                                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                  {transferId && (
                    <button
                      type="button"
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

                <div className="flex items-center">
                  <button
                    type="submit"
                    disabled={viewSpinner}
                    className="px-8 py-3.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                                 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                                                 focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                 active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]"
                  >
                    {viewSpinner ? (
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
                        <span>Search Transfer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Enter the Transfer ID to search for detailed transfer information
              </p>
            </div>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-6 animate-slideDown">
              <ErrorMessage messageValue={errorMessage} />
            </div>
          )}
        </div>

        {/* Transfer Details Section */}
        {transferDataTable && Object.keys(transferData).length > 0 && (
          <div className="mt-8 animate-fadeIn">
            {/* Transfer Header */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-t-xl p-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Transfer Details
                    </h2>
                    <p className="text-sm text-gray-600">
                      Transfer ID: {transferData.transferId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-blue-600"
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
                      <span className="text-sm font-semibold text-blue-800">
                        Rs.{formatCurrency(transferData.transferAmount)}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(transferData.approveStatus)}
                </div>
              </div>
            </div>

            {/* Transfer Details Grid */}
            <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Transfer Information */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Transfer Information
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Transfer ID</span>
                        <span className="text-sm font-semibold text-blue-700">
                          {transferData.transferId || "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Transfer Amount</span>
                        <span className="text-sm font-semibold text-gray-900">
                          Rs.{formatCurrency(transferData.transferAmount)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Transfer Channel</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {transferData.channel || "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Cross Adjustment</span>
                        <div>
                          {getCrossAdjustmentBadge(transferData.crossAdjustment)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Account Information
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-100">
                        <div className="flex items-center mb-2">
                          <svg
                            className="w-4 h-4 text-blue-600 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            ></path>
                          </svg>
                          <span className="text-sm font-semibold text-blue-800">From Account</span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium">
                          {transferData.fromAccount || "N/A"}
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-white p-4 rounded-lg border border-green-100">
                        <div className="flex items-center mb-2">
                          <svg
                            className="w-4 h-4 text-green-600 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            ></path>
                          </svg>
                          <span className="text-sm font-semibold text-green-800">To Account</span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium">
                          {transferData.toAccount || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Repo Information */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Repo Information
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">From Repo</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {transferData.fromRepo || "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">To Repo</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {transferData.toRepo || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status & Initiation */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Status & Initiation
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Approve Status</span>
                        <div>
                          {getStatusBadge(transferData.approveStatus)}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Initiated By</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {transferData.initiatedBy || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-600 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Transfer Summary</p>
                      <p className="text-xs text-gray-600">
                        Transfer completed successfully from {transferData.fromAccount} to {transferData.toAccount}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearSearch}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 
                                                 rounded-lg transition-all duration-200 flex items-center gap-2"
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
                    <span>Search Another Transfer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {!transferDataTable && transferId && !errorMessage && (
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
                Search for Transfer Details
              </h3>
              <p className="text-gray-600 mb-4">
                Enter a Transfer ID above to search for transfer information.
              </p>
              <p className="text-sm text-gray-500">
                Transfer details will appear here after a successful search.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}