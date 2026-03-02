"use client";
import React, { useState } from "react";
import Spinner from "@/app/Spinner/page";
import SUccessMessage from "@/app/Messages/SuccessMessage/page";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";

export default function DeleteBalance({ onCancel }) {
  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables
  const [textBalanceId, setTextBalanceId] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSucceessMessage] = useState("");
  const [balanceData, setBalanceData] = useState({});
  const [balanceDisplayWindow, setBalanceDisplayWindow] = useState(false);
  const [deleteSpinner, setDeleteSpinner] = useState(false);
  const [showTransferIdsSpinner, setShowTransferIdsSpinner] = useState(false);
  const [transferDataTable, setTransferDataTable] = useState(false);
  const [transferIdList, setTransferIdList] = useState([]);

  //Define handleSearch function;
  const handleSearch = async () => {
    setErrorMessage("");
    setSucceessMessage("");
    setBalanceDisplayWindow(false);
    setTransferDataTable(false);
    if (textBalanceId == "") {
      setErrorMessage("Please provide a valid Balance ID!");
    } else {
      try {
        setSpinner(true);
        const request = await fetch(
          `${baseUrl}/api/v1/account-balance/balance-delete?balanceId=${encodeURIComponent(
            textBalanceId
          )}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const response = await request.json();
        if (request.status === 200) {
          setBalanceData(response.responseObject);
          setBalanceDisplayWindow(true);
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
        setSpinner(false);
      }
    }
  };

  //Define handle delete function;
  const handleDelete = async () => {
    setDeleteSpinner(true);
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/account-balance/save-balance-delete?balanceId=${encodeURIComponent(
          balanceData.balanceId
        )}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (request.status === 200) {
        const response = await request.json();
        setSucceessMessage(response.message);
        setBalanceDisplayWindow(false);

      } else if (request.status === 409) {
        const response = await request.json();
        setErrorMessage(response.message);

      } else if (request.status === 404) {
        const response = await request.json();
        setErrorMessage(response.message);
      }
      else if (request.status === 500) {
        const response = await request.json();
        setErrorMessage(response.message);
      } else {
        setErrorMessage(
          "No response from server. Please contact administrator!"
        );
      }
    } catch (error) {
      setErrorMessage(
        "Un-expected error occurred. Please contact administrator!"
      );
    } finally {
      setDeleteSpinner(false);
    }
  };

  //Define getRelatedTransfers function;
  const getRelatedTransfers = async () => {
    setTransferDataTable(false);
    setShowTransferIdsSpinner(true);
    setErrorMessage(false);
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/cross-adjustment/get-transferId-list?balanceId=${balanceData.balanceId}`,
        {
          method: "GET",
          credentials: "include"
        }
      );
      const response = await request.json();
      if (request.status === 200) {
        setTransferIdList(response.responseObject);
        setTransferDataTable(true);
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage(
        "No response from server. Please contact administrator!"
      );
    } finally {
      setShowTransferIdsSpinner(false);
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear search
  const clearSearch = () => {
    setTextBalanceId("");
    setBalanceDisplayWindow(false);
    setTransferDataTable(false);
    setErrorMessage("");
    setSucceessMessage("");
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "-";
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-xl shadow-lg p-6 mb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Delete Account Balance</h1>
                <p className="text-red-100 text-sm mt-1">Remove balance records from the system</p>
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

        {/* Search Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Search Balance Record</h2>
            <p className="text-sm text-gray-600">Enter Balance ID to search for deletion</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  value={textBalanceId}
                  onChange={(e) => setTextBalanceId(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter Balance ID (e.g., BAL-202601-0001)"
                  className="pl-10 w-full p-3.5 text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                           hover:border-blue-400 hover:shadow-sm outline-none
                           uppercase"
                />
                {textBalanceId && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
                    aria-label="Clear search">
                    <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">Enter the complete Balance ID to search</p>
            </div>

            <div className="flex items-center">
              <button
                onClick={handleSearch}
                disabled={spinner || !textBalanceId.trim()}
                className="px-8 py-3.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 
                         rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-3 focus:ring-blue-300 
                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                {spinner ? (
                  <>
                    <Spinner size={20} />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <span>Search Balance</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Balance Details Card */}
        {balanceDisplayWindow && (
          <div className="mt-8 animate-fadeIn">
            {/* Warning Header */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-t-2xl p-6">
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-800">Confirm Balance Deletion</h2>
                  <p className="text-red-700">
                    Warning: This action is irreversible. Please review all details carefully before proceeding.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Balance ID: <span className="font-semibold">{balanceData.balanceId}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Balance Details Container */}
            <div className="bg-white border-2 border-t-0 border-gray-200 rounded-b-2xl shadow-lg p-6">
              {/* Balance Summary */}
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Balance Summary</h3>
                    <p className="text-sm text-gray-600">
                      {balanceData.bank} • Account No: {balanceData.accountNumber}
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold border border-red-200">
                    {formatCurrency(balanceData.balanceAmount)}
                  </div>
                </div>
              </div>

              {/* Balance Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Account Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Balance ID</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">{balanceData.balanceId}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Bank Name</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">{balanceData.bank}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Account Number</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-mono">{balanceData.accountNumber}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Balance Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Balance Date</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">{formatDate(balanceData.balanceDate)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Balance Amount</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="text-xl font-semibold text-red-600 text-right">
                          {formatCurrency(balanceData.balanceAmount)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Box */}
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <div>
                    <h4 className="text-lg font-semibold text-red-800">Important Notice</h4>
                    <ul className="mt-2 text-red-700 space-y-2">
                      <li className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 mr-2"></span>
                        This action cannot be undone
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 mr-2"></span>
                        Balance record will be permanently deleted
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 mr-2"></span>
                        Check for related adjustments before proceeding
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={clearSearch}
                    className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 
                             rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 
                             transition-all duration-200 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    Search Another
                  </button>

                  <button
                    onClick={() => getRelatedTransfers()}
                    className="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 
                             rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-3 focus:ring-blue-300 
                             focus:outline-none transition-all duration-200 flex items-center justify-center gap-2">
                    {showTransferIdsSpinner ? (
                      <>
                        <Spinner size={20} />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        <span>Show Related Adjustments</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={() => onCancel()}
                    className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 
                             rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 
                             transition-all duration-200 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Cancel
                  </button>

                  <button
                    onClick={handleDelete}
                    disabled={deleteSpinner}
                    className="px-8 py-3 text-white bg-gradient-to-r from-red-600 to-red-700 
                             rounded-xl hover:from-red-700 hover:to-red-800 focus:ring-3 focus:ring-red-300 
                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                             disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                    {deleteSpinner ? (
                      <>
                        <Spinner size={20} />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        <span>Permanently Delete Balance</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Related Adjustments Table */}
            {transferDataTable && (
              <div className="mt-8 animate-fadeIn">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-t-2xl p-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-blue-800">Related Adjustments</h2>
                      <p className="text-blue-700">
                        {transferIdList.length} adjustment{transferIdList.length !== 1 ? 's' : ''} found related to this balance
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-t-0 border-gray-200 rounded-b-2xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                            <div className="flex items-center space-x-2">
                              <span>Adjustment ID</span>
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                              </svg>
                            </div>
                          </th>
                          <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                            Status
                          </th>
                          <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {transferIdList.map((transferId) => (
                          <tr key={transferId} className="hover:bg-blue-50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                <span className="font-medium text-gray-800">{transferId}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                                Related Adjustment
                              </span>
                            </td>
                            <td className="p-4">
                              <button className="px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {transferIdList.length === 0 && (
                      <div className="p-8 text-center">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 max-w-md mx-auto">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Related Adjustments</h3>
                          <p className="text-gray-600">
                            No adjustments found related to this balance record
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Messages */}
        {successMessage && (
          <div className="mt-6 animate-slideDown">
            <SUccessMessage messageValue={successMessage} />
          </div>
        )}

        {errorMessage && (
          <div className="mt-6 animate-slideDown">
            <ErrorMessage messageValue={errorMessage} />
          </div>
        )}
        {/* Initial State Message */}
        {!balanceDisplayWindow && !errorMessage && !successMessage && (
          <div className="mt-12 text-center animate-fadeIn">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 md:p-12 max-w-2xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Delete Account Balance</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Enter a Balance ID above to search for balance records and proceed with deletion. This is an irreversible action.
              </p>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Check for related adjustments before deleting balance records</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}