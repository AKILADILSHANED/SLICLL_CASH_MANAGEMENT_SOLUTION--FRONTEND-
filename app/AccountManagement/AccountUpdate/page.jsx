"use client";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";
import SUccessMessage from "@/app/Messages/SuccessMessage/page";
import React, { useState } from "react";
import Spinner from "@/app/Spinner/page";
import { useEffect } from "react";

export default function UpdateAccount({ onCancel }) {

  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [textAccountID, setTextAccountID] = useState("");
  const [accountDetailsWindow, setAccountDetailsWindow] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [spinnerSearch, setSpinnerSearch] = useState(false);
  const [spinnerUpdate, setSpinnerUpdate] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [originalData, setOriginalData] = useState({});
  const [isModified, setIsModified] = useState(false);

  //Define states to holds values of account details;
  const [accountId, setAccountId] = useState("");
  const [bankId, setBankId] = useState("");
  const [bank, setBank] = useState("");
  const [branch, setBranch] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("");
  const [currency, setCurrency] = useState("");
  const [glCode, setGlCode] = useState("");
  const [registerDate, setRegisterDate] = useState("");
  const [registerBy, setRegisterBy] = useState("");

  // Track form modifications
  useEffect(() => {
    if (accountDetailsWindow) {
      const currentData = { bankId, branch, accountNumber, accountType, currency, glCode };
      const hasChanges = Object.keys(currentData).some(
        key => currentData[key] !== originalData[key]
      );
      setIsModified(hasChanges);
    }
  }, [bankId, branch, accountNumber, accountType, currency, glCode, accountDetailsWindow]);

  //Define search function;
  const handleSearch = async () => {
    setSpinnerSearch(true);
    setAccountDetailsWindow(false);
    setSuccessMessage("");
    setErrorMessage("");
    setIsModified(false);

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
            //Set values for each state;
            const data = response.responseObject;
            setAccountId(data.accountId);
            setBankId(data.bankId);
            setBank(data.bank);
            setBranch(data.bankBranch);
            setAccountType(data.accountType);
            setCurrency(data.currency);
            setGlCode(data.glCode);
            setAccountNumber(data.accountNumber);
            setRegisterDate(data.registeredDate);
            setRegisterBy(data.registeredBy);

            // Store original data for change detection
            setOriginalData({
              bank: data.bankId,
              branch: data.bankBranch,
              accountNumber: data.accountNumber,
              accountType: data.accountType,
              currency: data.currency,
              glCode: data.glCode
            });

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

  //define getBankList function;
  const getBankList = async () => {
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/bank/bank-list`,
        {
          method: "GET",
          credentials: "include"
        }
      );
      if (request.ok) {
        const response = await request.json();
        if (response.success == false) {
          setErrorMessage(response.message);
        } else {
          setBankList(response.responseObject);
        }
      } else {
        setErrorMessage("Unable to fetch Bank List. Please contact administrator!");
      }
    } catch (error) {
      setErrorMessage("Un-expected error occurred. Please contact administrator!");
    }
  }

  useEffect(() => {
    getBankList();
  }, []);

  //Define Update function;
  const handleUpdateAccount = async () => {
    if (!isModified) {
      setErrorMessage("No changes detected. Please modify at least one field before updating.");
      return;
    }

    setSuccessMessage("");
    setErrorMessage("");
    try {
      setSpinnerUpdate(true);
      const request = await fetch(
        `${baseUrl}/api/v1/bank-account/account-update`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accountId: accountId,
            bank: bankId,
            bankBranch: branch,
            accountType: accountType,
            currency: currency,
            glCode: glCode,
            accountNumber: accountNumber,
          }),
        }
      );
      if (request.ok) {
        const response = await request.json();
        if (response.success == false) {
          setErrorMessage(response.message);
        } else {
          setSuccessMessage(response.message);
          // Update original data after successful update
          setOriginalData({ bank, branch, accountNumber, accountType, currency, glCode });
          setIsModified(false);
        }
      } else {
        setErrorMessage(
          "No response from server. Please contact administrator!"
        );
      }
    } catch (error) {
      setErrorMessage(
        "Un-expected error occurred while updating account data. Please contact administrator!"
      );
    } finally {
      setSpinnerUpdate(false);
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
    setIsModified(false);
  };

  // Reset form to original values
  const resetForm = () => {
    if (originalData) {
      setBankId(originalData.bankId || "");
      setBranch(originalData.branch || "");
      setAccountNumber(originalData.accountNumber || "");
      setAccountType(originalData.accountType || "");
      setCurrency(originalData.currency || "");
      setGlCode(originalData.glCode || "");
      setIsModified(false);
    }
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

  // Get account type text
  const getAccountTypeText = (type) => {
    return type === "1" ? "Current Account" : type === "2" ? "Saving Account" : type || "N/A";
  };

  // Get currency badge
  const getCurrencyBadge = (currency) => {
    const currencyCode = currency?.toUpperCase();
    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold border border-gray-200">
        {currencyCode || 'N/A'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl shadow-lg p-6 mb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Update Bank Account</h1>
                <p className="text-blue-100 text-sm mt-1">Search and update bank account information</p>
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
            <p className="text-sm text-gray-600">Enter Account ID to search for updating</p>
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

        {/* Account Update Form */}
        {accountDetailsWindow && (
          <div className="mt-8 animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-t-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-blue-800">Update Account Details</h2>
                    <p className="text-blue-700">Account ID: <span className="font-semibold">{accountId}</span></p>
                  </div>
                </div>
                {isModified && (
                  <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <span className="text-sm font-medium">Unsaved Changes</span>
                  </div>
                )}
              </div>
            </div>

            {/* Form Container */}
            <div className="bg-white border-2 border-t-0 border-gray-200 rounded-b-2xl shadow-lg p-6 md:p-8">
              <div className="space-y-8">
                {/* Account Information Section */}
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Account Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Account ID
                      </label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                        {accountId}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Bank Name
                        <span className="text-red-600 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={bankId}
                          onChange={(e) => setBankId(e.target.value)}
                          className="w-full p-3 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                   hover:border-blue-400 hover:shadow-sm outline-none appearance-none">
                          {bankList.map(element => (
                            <option key={element.bankId} value={element.bankId}>{element.bankName}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Bank Branch
                        <span className="text-red-600 ml-1">*</span>
                      </label>
                      <input
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        type="text"
                        placeholder="Enter bank branch"
                        className="w-full p-3 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Account Number
                        <span className="text-red-600 ml-1">*</span>
                      </label>
                      <input
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        type="text"
                        placeholder="Enter account number"
                        className="w-full p-3 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Details Section */}
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Account Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Account Type
                        <span className="text-red-600 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={accountType}
                          onChange={(e) => setAccountType(e.target.value)}
                          className="w-full p-3 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                   hover:border-blue-400 hover:shadow-sm outline-none appearance-none">
                          <option value="1">Current Account</option>
                          <option value="2">Saving Account</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Currency
                        <span className="text-red-600 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full p-3 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                   hover:border-blue-400 hover:shadow-sm outline-none appearance-none">
                          <option value="LKR">LKR (Sri Lankan Rupee)</option>
                          <option value="AUD">AUD (Australian Dollar)</option>
                          <option value="USD">USD (US Dollar)</option>
                          <option value="EUR">EUR (Euro)</option>
                          <option value="GBP">GBP (British Pound)</option>
                          <option value="SGD">SGD (Singapore Dollar)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        GL Code
                        <span className="text-red-600 ml-1">*</span>
                      </label>
                      <input
                        value={glCode}
                        onChange={(e) => setGlCode(e.target.value)}
                        type="text"
                        placeholder="Enter GL code"
                        className="w-full p-3 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Account Type Display
                      </label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{getAccountTypeText(accountType)}</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {accountType === "1" ? "Current" : "Saving"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Metadata Section */}
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Account Metadata</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Registered Date</div>
                      <div className="text-sm font-medium text-gray-900">{formatDate(registerDate)}</div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Registered By</div>
                      <div className="text-sm font-medium text-gray-900">{registerBy || "System"}</div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Currency</div>
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        {getCurrencyBadge(currency)}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Status</div>
                      <div className="flex items-center">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 
                                 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 
                                 transition-all duration-200 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        Search Another
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={resetForm}
                        disabled={!isModified}
                        className={`px-6 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${isModified
                          ? 'text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                          : 'text-gray-400 bg-gray-50 border-2 border-gray-200 cursor-not-allowed'
                          }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Reset Changes
                      </button>

                      <button
                        onClick={() => onCancel()}
                        type="button"
                        className="px-6 py-3.5 text-gray-700 bg-white border-2 border-gray-300 
                                 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 
                                 transition-all duration-200 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Cancel
                      </button>

                      <button
                        onClick={handleUpdateAccount}
                        disabled={spinnerUpdate || !isModified}
                        className="px-8 py-3.5 text-white bg-gradient-to-r from-green-600 to-green-700 
                                 rounded-xl hover:from-green-700 hover:to-green-800 focus:ring-3 focus:ring-green-300 
                                 focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                 active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                        {spinnerUpdate ? (
                          <>
                            <Spinner size={20} />
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span>Update Account</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
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

        {/* Initial State Message */}
        {!accountDetailsWindow && !errorMessage && !successMessage && (
          <div className="mt-12 text-center animate-fadeIn">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 md:p-12 max-w-2xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Search Account to Update</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Enter an Account ID in the search field above to view and update bank account information including bank details, account type, currency, and GL code.
              </p>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Search by Account ID to modify account details</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}