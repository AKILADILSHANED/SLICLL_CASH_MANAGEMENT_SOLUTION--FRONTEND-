"use client";
import React from "react";
import { useState } from "react";
import Spinner from "@/app/Spinner/page";
import SUccessMessage from "@/app/Messages/SuccessMessage/page";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";

export default function DeleteAccount({ onCancel }) {

  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [textAccountID, setTextAccountID] = useState("");
  const [accountDetailsWindow, setAccountDetailsWindow] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [spinnerSearch, setSpinnerSearch] = useState(false);
  const [spinnerDelete, setSpinnerDelete] = useState(false);
  const [accountData, setAccountData] = useState({});

  //Define search function;
  const handleSearch = async () => {
    setSpinnerSearch(true);
    setAccountDetailsWindow(false);
    setSuccessMessage("");
    setErrorMessage("");
    if (textAccountID == "") {
      setErrorMessage("Please provide valid Account ID!");
      setSpinnerSearch(false);
    } else {
      try {
        const request = await fetch(
          `${baseUrl}/api/v1/bank-account/account-searchForUpdate?accountId=${encodeURIComponent(
            textAccountID
          )}`,
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
            setAccountData(response.responseObject);
            setAccountDetailsWindow(true);
          }
        } else {
          setErrorMessage(
            "No response from server. Please contact administrator!"
          );
        }
      } catch (error) {
        setErrorMessage(
          "Un-expected error occurred while fetching account data. Please contact administrator!"
        );
      } finally {
        setSpinnerSearch(false);
      }
    }
  };

  //Define Delete function;
  const handleDeleteAccount = async () => {
    setSpinnerDelete(false);
    setSuccessMessage(false);
    setErrorMessage(false);
    try {
      setSpinnerDelete(true);
      const request = await fetch(
        `${baseUrl}/api/v1/bank-account/account-delete?accountId=${encodeURIComponent(accountData.accountId)}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      if (request.ok) {
        const response = await request.json();
        if (response.success == false) {
          setErrorMessage(response.message);
        } else {
          setSuccessMessage(response.message);
        }
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
      setSpinnerDelete(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear search function
  const clearSearch = () => {
    setTextAccountID("");
    setAccountDetailsWindow(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  // Format date function
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

  // Get account type badge
  const getAccountTypeBadge = (type) => {
    const accountType = type?.toString();
    let bgColor = 'bg-blue-100 text-blue-800 border-blue-200';
    let text = 'N/A';

    if (accountType === '1') {
      bgColor = 'bg-blue-100 text-blue-800 border-blue-200';
      text = 'Current Account';
    } else if (accountType === '2') {
      bgColor = 'bg-green-100 text-green-800 border-green-200';
      text = 'Saving Account';
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${bgColor}`}>
        {text}
      </span>
    );
  };

  // Get currency badge
  const getCurrencyBadge = (currency) => {
    const currencyCode = currency?.toUpperCase();
    const currencies = {
      'LKR': '🇱🇰 LKR',
      'USD': '🇺🇸 USD',
      'EUR': '🇪🇺 EUR',
      'GBP': '🇬🇧 GBP',
      'AUD': '🇦🇺 AUD',
      'SGD': '🇸🇬 SGD'
    };

    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold border border-gray-200">
        {currencies[currencyCode] || currency || 'N/A'}
      </span>
    );
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
                <h1 className="text-2xl font-bold text-white">Delete Bank Account</h1>
                <p className="text-red-100 text-sm mt-1">Permanently remove bank accounts from the system</p>
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
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Search Account</h2>
            <p className="text-sm text-gray-600">Enter Account ID to search for deletion</p>
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
                  value={textAccountID}
                  onChange={(e) => setTextAccountID(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  type="text"
                  placeholder="Enter Account ID (e.g., ACC-001)"
                  className="pl-10 w-full p-3.5 text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                           hover:border-blue-400 hover:shadow-sm outline-none
                           uppercase"
                />
                {textAccountID && (
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
              <p className="text-xs text-gray-500 mt-2">Enter the complete Account ID to search</p>
            </div>

            <div className="flex items-center">
              <button
                onClick={handleSearch}
                disabled={spinnerSearch || !textAccountID.trim()}
                className="px-8 py-3.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 
                         rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-3 focus:ring-blue-300 
                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]">
                {spinnerSearch ? (
                  <>
                    <Spinner size={20} />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <span>Search Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Account Delete Form */}
        {accountDetailsWindow && (
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
                  <h2 className="text-xl font-bold text-red-800">Confirm Account Deletion</h2>
                  <p className="text-red-700">
                    Warning: This action is irreversible. Please review all details carefully before proceeding.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Account ID: <span className="font-semibold">{accountData.accountId}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Account Details Container */}
            <div className="bg-white border-2 border-t-0 border-gray-200 rounded-b-2xl shadow-lg p-6 md:p-8">
              {/* Account Summary */}
              <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Account Summary</h3>
                    <p className="text-sm text-gray-600">
                      {accountData.bankName} • Account No: {accountData.accountNumber}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Account Type</div>
                      {getAccountTypeBadge(accountData.accountType)}
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Currency</div>
                      {getCurrencyBadge(accountData.currency)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bank Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Bank Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Bank Name</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">{accountData.bank}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Bank Branch</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">{accountData.bankBranch}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Account Number</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-mono">{accountData.accountNumber}</div>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Account Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Account ID</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">{accountData.accountId}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Account Type</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900">{getAccountTypeBadge(accountData.accountType)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">GL Code</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">{accountData.glCode}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Metadata */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Registered Date</div>
                    <div className="text-sm font-medium text-gray-900">{formatDate(accountData.registeredDate)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Registered By</div>
                    <div className="text-sm font-medium text-gray-900">{accountData.registeredBy || "System"}</div>
                  </div>
                </div>
              </div>

              {/* Warning Box */}
              <div className="mt-8 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <div>
                    <h4 className="text-lg font-semibold text-red-800">Final Warning</h4>
                    <ul className="mt-2 text-red-700 space-y-2">
                      <li className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 mr-2"></span>
                        This action cannot be undone
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 mr-2"></span>
                        All account data will be permanently deleted
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 mr-2"></span>
                        Account will be removed from all system records
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 
                           rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 
                           transition-all duration-200 flex items-center justify-center gap-2 w-full md:w-auto">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  Search Another Account
                </button>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={() => onCancel()}
                    className="px-6 py-3.5 text-gray-700 bg-white border-2 border-gray-300 
                             rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 
                             transition-all duration-200 flex items-center justify-center gap-2 flex-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Cancel
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    disabled={spinnerDelete}
                    className="px-8 py-3.5 text-white bg-gradient-to-r from-red-600 to-red-700 
                             rounded-xl hover:from-red-700 hover:to-red-800 focus:ring-3 focus:ring-red-300 
                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                             disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex-1">
                    {spinnerDelete ? (
                      <>
                        <Spinner size={20} />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        <span>Permanently Delete Account</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Initial State Message */}
        {!accountDetailsWindow && !errorMessage && !successMessage && (
          <div className="mt-12 text-center animate-fadeIn">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 md:p-12 max-w-2xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Search Account for Deletion</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Enter an Account ID in the search field above to view account details and proceed with deletion. This action requires careful review before proceeding.
              </p>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>This is an irreversible action - please verify details carefully</span>
              </div>
            </div>
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
      </div>
    </div>
  );
}