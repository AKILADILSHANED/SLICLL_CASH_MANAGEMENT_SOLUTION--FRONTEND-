"use client";
import React, { useState } from "react";
import Spinner from "@/app/Spinner/page";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";
import SUccessMessage from "@/app/Messages/SuccessMessage/page";

export default function UpdateBalance({ onCancel }) {
  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define State variables;
  const [textBalanceId, setTextBalanceId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSucceessMessage] = useState("");
  const [balanceDisplayWindow, setBalanceDisplayWindow] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [balanceData, setBalanceData] = useState({});
  const [saveSpinner, setSaveSpinner] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);

  //Defined state to send updating details to backend;
  const [balanceId, setBalanceId] = useState("");
  const [balanceAmount, setBalanceAmount] = useState("");
  const [outstandingAmount, setOutstandingAmount] = useState("");
  const [actionState, setActionState] = useState("");
  const [adjustmentAmount, setAdjustmentAmount] = useState("");

  //Calculate new balance on the fly
  const calculateNewBalance = () => {
    if (!adjustmentAmount || !actionState || !balanceData.balanceAmount) return null;

    const currentBalance = parseFloat(balanceData.balanceAmount) || 0;
    const adjustment = parseFloat(adjustmentAmount) || 0;

    let newBalance = currentBalance;
    if (actionState === "+") {
      newBalance = currentBalance + adjustment;
    } else if (actionState === "-") {
      newBalance = currentBalance - adjustment;
    }

    return {
      currentBalance,
      adjustment,
      newBalance,
      changePercentage: ((newBalance - currentBalance) / currentBalance * 100).toFixed(2)
    };
  };

  //Define handleSearch function;
  const handleSearch = async () => {
    setErrorMessage("");
    setSucceessMessage("");
    setSpinner(true);
    setBalanceDisplayWindow(false);
    setCalculationResult(null);

    if (textBalanceId == "") {
      setErrorMessage("Please provide a Balance ID!");
      setSpinner(false);
    } else {
      try {
        const request = await fetch(
          `${baseUrl}/api/v1/account-balance/balance-update?balanceId=${encodeURIComponent(
            textBalanceId
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
            setBalanceData(response.responseObject);
            setBalanceId(response.responseObject.balanceId);
            setBalanceAmount(response.responseObject.balanceAmount);
            setOutstandingAmount(response.responseObject.outstandingBalance);
            setBalanceDisplayWindow(true);
            setActionState("");
            setAdjustmentAmount("");
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
        setSpinner(false);
      }
    }
  };

  //Define handleSave function;
  const handleSave = async () => {
    setErrorMessage("");
    setSucceessMessage("");

    if (!adjustmentAmount) {
      setErrorMessage("Please provide an Adjustment Amount!");
      return;
    } else if (actionState == "") {
      setErrorMessage("Please select an Adjustment Type!");
      return;
    }

    try {
      setSaveSpinner(true);
      const request = await fetch(
        `${baseUrl}/api/v1/account-balance/save-balance-update`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            balanceId: balanceId,
            balanceAmount: balanceAmount,
            outstandingBalance: outstandingAmount,
            action: actionState,
            adjustmentAmount: adjustmentAmount,
          }),
        }
      );
      if (request.ok) {
        const response = await request.json();
        if (response.success == false) {
          setErrorMessage(response.message);
        } else {

          setActionState("");
          setAdjustmentAmount("");
          setCalculationResult(null);
          // Refresh the balance data
          await handleSearch();
          setSucceessMessage(response.message);
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
      setSaveSpinner(false);
    }
  };

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
    setErrorMessage("");
    setSucceessMessage("");
    setCalculationResult(null);
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

  // Handle adjustment amount change with calculation
  const handleAdjustmentChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAdjustmentAmount(value);
      if (value && actionState) {
        setCalculationResult(calculateNewBalance());
      } else {
        setCalculationResult(null);
      }
    }
  };

  // Handle action state change with calculation
  const handleActionChange = (e) => {
    const value = e.target.value;
    setActionState(value);
    if (value && adjustmentAmount) {
      setCalculationResult(calculateNewBalance());
    } else {
      setCalculationResult(null);
    }
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Update Account Balance</h1>
                <p className="text-blue-100 text-sm mt-1">Adjust account balances with add or deduct operations</p>
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
            <p className="text-sm text-gray-600">Enter Balance ID to search for updating</p>
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

        {/* Balance Update Form */}
        {balanceDisplayWindow && (
          <div className="mt-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-t-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-blue-800">Update Balance</h2>
                    <p className="text-blue-700">Balance ID: <span className="font-semibold">{balanceData.balanceId}</span></p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">
                  Current: {formatCurrency(balanceData.balanceAmount)}
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-t-0 border-gray-200 rounded-b-2xl shadow-lg p-6 md:p-8">
              {/* Balance Summary */}
              <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Bank</div>
                    <div className="text-lg font-semibold text-gray-800">{balanceData.bank}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Account Number</div>
                    <div className="text-lg font-semibold text-gray-800 font-mono">{balanceData.accountNumber}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Balance Date</div>
                    <div className="text-lg font-semibold text-gray-800">{balanceData.balanceDate}</div>
                  </div>
                </div>
              </div>

              {/* Update Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Balance Display */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Current Balance
                    </label>
                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                      <div className="text-2xl font-bold text-blue-700 text-center">
                        {formatCurrency(balanceData.balanceAmount)}
                      </div>
                    </div>
                  </div>

                  {/* Adjustment Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Adjustment Type
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={actionState}
                        onChange={handleActionChange}
                        className="w-full p-3.5 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none appearance-none">
                        <option value="">- Select Adjustment Type -</option>
                        <option value="+">Add to Balance (+)</option>
                        <option value="-">Deduct from Balance (-)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Choose whether to add or deduct from the current balance
                    </p>
                  </div>
                </div>

                {/* Adjustment Amount */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Adjustment Amount
                    <span className="text-red-600 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">Rs.</span>
                    </div>
                    <input
                      type="text"
                      value={adjustmentAmount}
                      onChange={handleAdjustmentChange}
                      placeholder="Enter adjustment amount"
                      className="pl-10 w-full p-3.5 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                               hover:border-blue-400 hover:shadow-sm outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter the amount to adjust the balance
                  </p>
                </div>

                {/* Calculation Preview */}
                {calculationResult && (
                  <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Balance Update Preview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Current Balance</div>
                        <div className="text-lg font-semibold text-gray-800">{formatCurrency(calculationResult.currentBalance)}</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Adjustment</div>
                        <div className={`text-lg font-semibold ${actionState === '+' ? 'text-green-600' : 'text-red-600'}`}>
                          {actionState}{formatCurrency(calculationResult.adjustment)}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <div className="text-xs text-gray-500 mb-1">New Balance</div>
                        <div className="text-lg font-semibold text-green-700">{formatCurrency(calculationResult.newBalance)}</div>
                        <div className={`text-xs mt-1 ${calculationResult.newBalance > calculationResult.currentBalance ? 'text-green-600' : 'text-red-600'}`}>
                          {calculationResult.changePercentage}% change
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <button
                      onClick={clearSearch}
                      className="px-6 py-3.5 text-gray-700 bg-white border-2 border-gray-300 
                               rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 
                               transition-all duration-200 flex items-center justify-center gap-2 w-full md:w-auto">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                      Search Another
                    </button>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
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
                        onClick={handleSave}
                        disabled={saveSpinner || !adjustmentAmount || !actionState}
                        className="px-8 py-3.5 text-white bg-gradient-to-r from-green-600 to-green-700 
                                 rounded-xl hover:from-green-700 hover:to-green-800 focus:ring-3 focus:ring-green-300 
                                 focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                 active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                        {saveSpinner ? (
                          <>
                            <Spinner size={20} />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span>Update Balance</span>
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


        {/* Initial State Message */}
        {!balanceDisplayWindow && !errorMessage && !successMessage && (
          <div className="mt-12 text-center animate-fadeIn">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 md:p-12 max-w-2xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Update Account Balance</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Enter a Balance ID above to search for balance records and make adjustments. You can add to or deduct from the current balance amount.
              </p>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Search by Balance ID to adjust account balances</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}