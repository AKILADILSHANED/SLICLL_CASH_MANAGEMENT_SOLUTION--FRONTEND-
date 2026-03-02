"use client";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";
import Spinner from "@/app/Spinner/page";
import React, { useState, useEffect } from "react";
import SUccessMessage from "@/app/Messages/SuccessMessage/page";

export default function EnterBalance() {
  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [displayTable, setDisplayTable] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [accountObject, setAccountObject] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [balances, setBalances] = useState({}); // Store balances for each account
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Filter accounts based on search term
  useEffect(() => {
    if (searchTerm && accountObject.length > 0) {
      const filtered = accountObject.filter(account =>
        account.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.bankBranch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Get unique suggestions for autocomplete
      const uniqueSuggestions = Array.from(
        new Set(filtered.map(account =>
          `${account.accountId} - ${account.bankName} (${account.accountNumber})`
        ))
      ).slice(0, 5);

      setSuggestions(uniqueSuggestions);
      setShowSuggestions(true);
      setFilteredAccounts(filtered);
    } else {
      setShowSuggestions(false);
      setFilteredAccounts(accountObject);
    }
  }, [searchTerm, accountObject]);

  const handleChange = (e, accountId) => {
    const value = e.target.value;

    // Allow: empty, numbers, negative numbers (minus only at start), and decimal numbers
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setBalances(prev => ({
        ...prev,
        [accountId]: value
      }));
    }
  };

  const handleKeyDown = (e) => {
    // Allow: Backspace, Delete, Tab, Escape, Enter
    if ([8, 9, 27, 13, 46].includes(e.keyCode) ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode)) ||
      // Allow: Home, End, Left, Right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }

    // Allow minus sign only at the beginning
    if ((e.key === '-' || e.keyCode === 189) && e.target.selectionStart === 0) {
      // Check if minus sign already exists
      if (!e.target.value.includes('-')) {
        return;
      }
    }

    // Allow decimal point (only one)
    if (e.key === '.' || e.keyCode === 190) {
      if (!e.target.value.includes('.')) {
        return;
      }
    }

    // Allow numbers (both main keyboard and numpad)
    if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
      return;
    }

    // Prevent any other key
    e.preventDefault();
  };

  //Define displayTable function;
  const handleDisplayAccount = async () => {
    try {
      setSpinner(true);
      setDisplayTable(false);
      setErrorMessage(false);
      setSuccessMessage(false);
      setSearchTerm("");

      const request = await fetch(
        `${baseUrl}/api/v1/account-balance/get-accounts`,
        {
          method: "GET",
          credentials: "include"
        }
      );
      const response = await request.json();
      if (request.status === 200) {
        setAccountObject(response.responseObject);
        setFilteredAccounts(response.responseObject);
        setDisplayTable(true);
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
  };

  //Define balance saving function;
  const handleSave = async (accountId) => {
    setErrorMessage(false);
    setSuccessMessage(false);

    let balanceAmount = balances[accountId];

    if (!balanceAmount || balanceAmount === '' || balanceAmount == 0) {
      setErrorMessage("Please provide Account Balance!");
      return;
    }
    balanceAmount = balanceAmount.replace(/,/g, '');
    try {
      setSpinner(true);
      const request = await fetch(
        `${baseUrl}/api/v1/account-balance/save-balance?accountId=${encodeURIComponent(
          accountId
        )}&balanceAmount=${encodeURIComponent(balanceAmount)}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const response = await request.json();
      if (request.status === 200) {
        setSuccessMessage(response.message);
        // Clear the balance for this account after successful save
        setBalances(prev => {
          const newBalances = { ...prev };
          delete newBalances[accountId];
          return newBalances;
        });
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
      // Refresh the account list
      await handleDisplayAccount();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    const parts = suggestion.split(' - ');
    if (parts[0]) {
      setSearchTerm(parts[0]); // Set to account ID
    }
    setShowSuggestions(false);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return "";
    const num = parseFloat(value);
    if (isNaN(num)) return value;

    // Handle negative numbers
    const isNegative = num < 0;
    const absNum = Math.abs(num);

    // Format with 2 decimal places and thousand separators
    return (isNegative ? "-" : "") +
      new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(absNum);
  };

  // Handle balance input blur - format the value
  const handleBalanceBlur = (e, accountId) => {
    const value = e.target.value;
    if (value && value !== '-') {
      const formatted = formatCurrency(value);
      setBalances(prev => ({
        ...prev,
        [accountId]: formatted
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl shadow-lg p-6 mb-0">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Enter Account Balances</h1>
              <p className="text-blue-100 text-sm mt-1">Update bank account balances</p>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Account List</h2>
              <p className="text-sm text-gray-600">Load and search bank accounts to update balances</p>
            </div>

            <button
              onClick={handleDisplayAccount}
              disabled={spinner}
              className="px-6 py-3.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 
                       rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-3 focus:ring-blue-300 
                       focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                       active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
              {spinner ? (
                <>
                  <Spinner size={20} />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                  </svg>
                  <span>Load All Accounts</span>
                </>
              )}
            </button>
          </div>

          {/* Search Box */}
          {displayTable && (
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by Account ID, Bank, Branch, or Account Number..."
                  className="pl-10 w-full p-3.5 text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                           hover:border-blue-400 hover:shadow-sm outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
                    aria-label="Clear search">
                    <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                )}

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="p-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="text-sm text-gray-800">{suggestion}</div>
                        <div className="text-xs text-gray-500 mt-1">Click to select</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Search accounts by Account ID, Bank Name, Branch, or Account Number
              </p>
            </div>
          )}
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="mt-6 animate-slideDown">
            <ErrorMessage messageValue={errorMessage} />
          </div>
        )}

        {successMessage && (
          <div className="mt-6 animate-slideDown">
            <SUccessMessage messageValue={successMessage} />
          </div>
        )}

        {/* Accounts Table */}
        {displayTable && (
          <div className="mt-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-t-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-blue-800">Update Account Balances</h2>
                    <p className="text-blue-700">
                      {filteredAccounts.length} account{filteredAccounts.length !== 1 ? 's' : ''} found
                      {searchTerm && ` matching "${searchTerm}"`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    {accountObject.length} Total Accounts
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-t-0 border-gray-200 rounded-b-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Account ID</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Bank</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Branch</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Account Number</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Balance Amount (Rs.)</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAccounts.map((element) => (
                      <tr
                        key={element.accountId}
                        className="hover:bg-blue-50 transition-colors group"
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-gray-900">{element.accountId}</span>
                            {balances[element.accountId] && (
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                                Unsaved
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-900">{element.bankName}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-900">{element.bankBranch}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-900 font-mono">{element.accountNumber}</div>
                        </td>
                        <td className="p-4">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-400">Rs.</span>
                            </div>
                            <input
                              type="text"
                              inputMode="decimal"
                              value={balances[element.accountId] || ''}
                              onChange={(e) => handleChange(e, element.accountId)}
                              onKeyDown={handleKeyDown}
                              onBlur={(e) => handleBalanceBlur(e, element.accountId)}
                              placeholder="0.00"
                              className="pl-8 w-full p-2 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-lg 
                                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                       hover:border-blue-400 outline-none font-mono"
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleSave(element.accountId)}
                            disabled={!balances[element.accountId] || balances[element.accountId] === '' || spinner}
                            className="px-4 py-2 text-white bg-gradient-to-r from-green-600 to-green-700 
                                     rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-300 
                                     focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                     active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                     disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Save
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredAccounts.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 max-w-md mx-auto">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">No Accounts Found</h3>
                      <p className="text-gray-600">
                        {searchTerm
                          ? `No accounts found matching "${searchTerm}"`
                          : "No accounts available to display"
                        }
                      </p>
                      {searchTerm && (
                        <button
                          onClick={clearSearch}
                          className="mt-4 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                          Clear Search
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Initial State Message */}
        {!displayTable && !errorMessage && !successMessage && (
          <div className="mt-12 text-center animate-fadeIn">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 md:p-12 max-w-2xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Enter Account Balances</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Click "Load All Accounts" to display the list of bank accounts and update their balances.
              </p>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>You can enter positive or negative balance amounts</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}