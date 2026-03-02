"use client";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";
import Spinner from "@/app/Spinner/page";
import React, { useState } from "react";

export default function SearchAccount() {

  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [errorMessage, setErrorMessage] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [accountDetailsWindow, setAccountDetailsWindow] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [loader, setLoader] = useState(false);

  //Define handle search function;
  const handleSearch = async () => {
    setErrorMessage(false);
    setAccountDetailsWindow(false);
    setLoader(false);
    if (!accountId) {
      setErrorMessage("Please provide valid Account ID!");
    } else {
      try {
        setLoader(true);
        const request = await fetch(
          `${baseUrl}/api/v1/bank-account/account-search?accountId=${encodeURIComponent(
            accountId
          )}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const response = await request.json();
        if (request.status === 200) {
          setResponseData(response.responseObject);
          setAccountDetailsWindow(true);
        } else {
          setErrorMessage(
            response.message
          );
        }
      } catch (error) {
        setErrorMessage(
          "No respose received from server. Please contact administrator!"
        );
      } finally {
        setLoader(false);
      }
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
    setAccountId("");
    setAccountDetailsWindow(false);
    setErrorMessage(false);
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
    const accountType = type?.toLowerCase();
    let bgColor = 'bg-blue-100 text-blue-800 border-blue-200';
    let text = type || 'N/A';

    if (accountType?.includes('current')) {
      bgColor = 'bg-blue-100 text-blue-800 border-blue-200';
      text = 'Current Account';
    } else if (accountType?.includes('saving')) {
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
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl shadow-lg p-6 mb-0">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Search Bank Account</h1>
              <p className="text-blue-100 text-sm mt-1">Find account details using Account ID</p>
            </div>
          </div>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Search by Account ID</h2>
            <p className="text-sm text-gray-600">Enter the Account ID to search for bank account details</p>
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
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  type="text"
                  placeholder="Enter Account ID (e.g., ACC-001)"
                  className="pl-10 w-full p-3.5 text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                           hover:border-blue-400 hover:shadow-sm outline-none
                           uppercase"
                />
                {accountId && (
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
                disabled={loader || !accountId.trim()}
                className="px-8 py-3.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 
                         rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-3 focus:ring-blue-300 
                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]">
                {loader ? (
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

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-6 animate-slideDown">
            <ErrorMessage messageValue={errorMessage} />
          </div>
        )}

        {/* Account Details Card */}
        {accountDetailsWindow && (
          <div className="mt-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-t-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-blue-800">Account Details</h2>
                    <p className="text-blue-700">Account ID: <span className="font-semibold">{responseData.accountId}</span></p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getAccountTypeBadge(responseData.accountType)}
                  {getCurrencyBadge(responseData.currency)}
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-t-0 border-gray-200 rounded-b-2xl shadow-lg overflow-hidden">
              {/* Account Summary */}
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Bank Name</div>
                    <div className="text-lg font-semibold text-gray-800">{responseData.bank}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Account Number</div>
                    <div className="text-lg font-semibold text-gray-800">{responseData.accountNumber}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Bank Branch</div>
                    <div className="text-lg font-semibold text-gray-800">{responseData.bankBranch}</div>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Detailed Account Information
                  </h3>

                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Field</th>
                          <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Value</th>
                          <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-blue-50 transition-colors">
                          <td className="p-4 text-sm text-gray-600 font-medium">Account ID</td>
                          <td className="p-4 text-sm text-gray-900 font-semibold">{responseData.accountId}</td>
                          <td className="p-4 text-sm text-gray-500">Unique account identifier</td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                          <td className="p-4 text-sm text-gray-600 font-medium">Bank Name</td>
                          <td className="p-4 text-sm text-gray-900">{responseData.bank}</td>
                          <td className="p-4 text-sm text-gray-500">Financial institution</td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                          <td className="p-4 text-sm text-gray-600 font-medium">Bank Branch</td>
                          <td className="p-4 text-sm text-gray-900">{responseData.bankBranch}</td>
                          <td className="p-4 text-sm text-gray-500">Branch location</td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                          <td className="p-4 text-sm text-gray-600 font-medium">Account Number</td>
                          <td className="p-4 text-sm text-gray-900 font-mono">{responseData.accountNumber}</td>
                          <td className="p-4 text-sm text-gray-500">Bank account number</td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                          <td className="p-4 text-sm text-gray-600 font-medium">Account Type</td>
                          <td className="p-4">
                            {getAccountTypeBadge(responseData.accountType)}
                          </td>
                          <td className="p-4 text-sm text-gray-500">Type of bank account</td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                          <td className="p-4 text-sm text-gray-600 font-medium">Currency</td>
                          <td className="p-4">
                            {getCurrencyBadge(responseData.currency)}
                          </td>
                          <td className="p-4 text-sm text-gray-500">Account currency</td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                          <td className="p-4 text-sm text-gray-600 font-medium">GL Code</td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                              {responseData.glCode}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-500">General Ledger code</td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                          <td className="p-4 text-sm text-gray-600 font-medium">Registered Date</td>
                          <td className="p-4 text-sm text-gray-900">{formatDate(responseData.registeredDate)}</td>
                          <td className="p-4 text-sm text-gray-500">Account creation date</td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                          <td className="p-4 text-sm text-gray-600 font-medium">Registered By</td>
                          <td className="p-4 text-sm text-gray-900">{responseData.registeredBy}</td>
                          <td className="p-4 text-sm text-gray-500">User who created the account</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center">
                  <button
                    onClick={clearSearch}
                    className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 
                             rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 
                             transition-all duration-200 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    Search Another Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Initial State Message */}
        {!accountDetailsWindow && !errorMessage && (
          <div className="mt-12 text-center animate-fadeIn">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 md:p-12 max-w-2xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Search Bank Account Details</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Enter an Account ID in the search field above to view detailed bank account information including bank details, account type, currency, and registration information.
              </p>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Search by Account ID to retrieve complete account details</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}