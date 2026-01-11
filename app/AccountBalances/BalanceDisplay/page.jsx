"use client";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";
import Spinner from "@/app/Spinner/page";
import React, { useState } from "react";

export default function DisplayBalance() {
  //Define states;
  const [spinner, setSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [accountBalanceTable, setAccountBalanceTable] = useState(false);
  const [balancesObject, setBalancesObject] = useState([]);
  const [summaryStats, setSummaryStats] = useState(null);

  //Base URL;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Calculate summary statistics
  const calculateSummaryStats = (balances) => {
    const activeBalances = balances.filter(b => b.deleteStatus !== "Deleted");
    const deletedBalances = balances.filter(b => b.deleteStatus === "Deleted");

    const totalActiveBalance = activeBalances.reduce((sum, b) => sum + (parseFloat(b.balanceAmount) || 0), 0);
    const totalDeletedBalance = deletedBalances.reduce((sum, b) => sum + (parseFloat(b.balanceAmount) || 0), 0);
    const averageBalance = activeBalances.length > 0 ? totalActiveBalance / activeBalances.length : 0;

    // Find highest and lowest balances
    const sortedBalances = [...activeBalances].sort((a, b) =>
      (parseFloat(b.balanceAmount) || 0) - (parseFloat(a.balanceAmount) || 0)
    );

    return {
      totalActiveBalance,
      totalDeletedBalance,
      averageBalance,
      totalAccounts: balances.length,
      activeAccounts: activeBalances.length,
      deletedAccounts: deletedBalances.length,
      highestBalance: sortedBalances[0],
      lowestBalance: sortedBalances[sortedBalances.length - 1]
    };
  };

  //Define getBalance function;
  const getBalances = async () => {
    setErrorMessage("");
    setAccountBalanceTable(false);
    setSummaryStats(null);

    if (!selectedDate) {
      setErrorMessage("Please select a date first!");
      return;
    }

    try {
      setSpinner(true);
      const request = await fetch(
        `${baseUrl}/api/v1/account-balance/get-balances?balanceDate=${encodeURIComponent(
          selectedDate
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
          const balances = response.responseObject || [];
          setBalancesObject(balances);
          setSummaryStats(calculateSummaryStats(balances));
          setAccountBalanceTable(true);
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
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getBalances();
    }
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
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

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl shadow-lg p-6 mb-0">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Display Account Balances</h1>
              <p className="text-blue-100 text-sm mt-1">View account balances for a specific date</p>
            </div>
          </div>
        </div>

        {/* Date Selection Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Select Date</h2>
            <p className="text-sm text-gray-600">Choose a date to view account balances</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  onKeyPress={handleKeyPress}
                  max={getTodayDate()}
                  className="pl-10 w-full p-3.5 text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                           hover:border-blue-400 hover:shadow-sm outline-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Select a date to view balances (dates cannot be in the future)
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedDate(getTodayDate())}
                className="px-4 py-3.5 text-gray-700 bg-white border-2 border-gray-300 
                         rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 
                         transition-all duration-200 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>Today</span>
              </button>

              <button
                onClick={getBalances}
                disabled={spinner || !selectedDate}
                className="px-8 py-3.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <span>View Balances</span>
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

        {/* Summary Statistics */}
        {summaryStats && (
          <div className="mt-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-blue-800">Balance Summary</h2>
                  <p className="text-blue-700">For {formatDisplayDate(selectedDate)}</p>
                </div>
                <div className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">
                  {summaryStats.totalAccounts} Total Accounts
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Total Active Balance</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(summaryStats.totalActiveBalance)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {summaryStats.activeAccounts} active accounts
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Average Balance</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(summaryStats.averageBalance)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Per active account
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Deleted Accounts</div>
                  <div className="text-2xl font-bold text-red-600">
                    {summaryStats.deletedAccounts}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatCurrency(summaryStats.totalDeletedBalance)} total
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Balance Range</div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Highest:</span>
                      <span className="text-sm font-semibold text-green-600">
                        {summaryStats.highestBalance ? formatCurrency(summaryStats.highestBalance.balanceAmount) : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Lowest:</span>
                      <span className="text-sm font-semibold text-red-600">
                        {summaryStats.lowestBalance ? formatCurrency(summaryStats.lowestBalance.balanceAmount) : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Balances Table */}
        {accountBalanceTable && (
          <div className="mt-8 animate-fadeIn">
            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Account Balances</h2>
                    <p className="text-gray-600 text-sm">
                      Showing {balancesObject.length} account balance{balancesObject.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-600">Active</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-600">Deleted</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Balance ID</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Bank</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Account Number</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Balance Date</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Balance Amount (Rs.)</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Status</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Entered By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {balancesObject.map((element) => {
                      const isDeleted = element.deleteStatus === "Deleted";
                      const balanceAmount = parseFloat(element.balanceAmount) || 0;

                      return (
                        <tr
                          key={element.balanceId}
                          className={`transition-colors ${isDeleted ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-blue-50'}`}
                        >
                          <td className={`p-4 ${isDeleted ? 'border-red-100' : ''}`}>
                            <div className={`text-sm font-medium ${isDeleted ? 'text-red-800' : 'text-gray-900'}`}>
                              {element.balanceId}
                            </div>
                          </td>
                          <td className={`p-4 ${isDeleted ? 'border-red-100' : ''}`}>
                            <div className={`text-sm ${isDeleted ? 'text-red-800' : 'text-gray-900'}`}>
                              {element.bank}
                            </div>
                          </td>
                          <td className={`p-4 ${isDeleted ? 'border-red-100' : ''}`}>
                            <div className={`text-sm font-mono ${isDeleted ? 'text-red-800' : 'text-gray-900'}`}>
                              {element.accountNumber}
                            </div>
                          </td>
                          <td className={`p-4 ${isDeleted ? 'border-red-100' : ''}`}>
                            <div className={`text-sm ${isDeleted ? 'text-red-800' : 'text-gray-900'}`}>
                              {formatDisplayDate(element.balanceDate)}
                            </div>
                          </td>
                          <td className={`p-4 ${isDeleted ? 'border-red-100' : ''}`}>
                            <div className={`text-right ${balanceAmount >= 0 ? 'text-green-600' : 'text-red-600'} text-sm font-semibold`}>
                              {formatCurrency(balanceAmount)}
                            </div>
                          </td>
                          <td className={`p-4 ${isDeleted ? 'border-red-100' : ''}`}>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isDeleted
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : 'bg-green-100 text-green-800 border border-green-200'
                              }`}>
                              {isDeleted ? 'Deleted' : 'Active'}
                            </span>
                          </td>
                          <td className={`p-4 ${isDeleted ? 'border-red-100' : ''}`}>
                            <div className={`text-sm ${isDeleted ? 'text-red-800' : 'text-gray-900'}`}>
                              {element.enteredBy || '-'}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {balancesObject.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 max-w-md mx-auto">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">No Balances Found</h3>
                      <p className="text-gray-600">
                        No account balances were found for {formatDisplayDate(selectedDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Export Options */}
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Data as of {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      Export CSV
                    </button>
                    <button className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                      </svg>
                      Print Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Initial State Message */}
        {!accountBalanceTable && !errorMessage && (
          <div className="mt-12 text-center animate-fadeIn">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 md:p-12 max-w-2xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">View Account Balances</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Select a date above to view account balances. You'll see a summary of all balances along with detailed information for each account.
              </p>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Choose a date to view detailed balance information</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}