"use client"
import React from 'react'
import Spinner from '@/app/Spinner/page';
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import { useState } from 'react';

export default function RepoAdjustments({ onCancel }) {

  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables
  const [textRepoId, setTextRepoId] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [adjustmentData, setAdjustmentData] = useState([]);
  const [adjustmentDataTable, setAdjustmentDataTable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //Define getAdjustmentsData function;
  const getAdjustmentsData = async (e) => {
    e.preventDefault();
    setSpinner(true);
    setErrorMessage("");
    setAdjustmentDataTable(false);
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/repo/get-adjustments?repoId=${encodeURIComponent(textRepoId)}`,
        {
          method: "GET",
          credentials: "include"
        }
      );
      if (request.ok) {
        const response = await request.json();
        setAdjustmentData(response.responseObject);
        setAdjustmentDataTable(true);
      } else {
        const response = await request.json();
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage("Un-expected error occurred. Please contact administrator!");
    } finally {
      setSpinner(false);
    }
  }

  const formatCurrency = (value) => {
    const absValue = Math.abs(value || 0);
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(absValue);

    return value < 0 ? `(${formatted})` : formatted;
  };

  const getAdjustmentType = (amount) => {
    if (amount > 0) return 'positive';
    if (amount < 0) return 'negative';
    return 'neutral';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto animate-fadeIn">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl shadow-lg p-6 mb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Display REPO Adjustments</h1>
                <p className="text-blue-100 text-sm mt-1">View adjustment history for REPO accounts</p>
              </div>
            </div>
            {onCancel && (
              <button
                onClick={() => onCancel()}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span>Close</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Form Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <form onSubmit={(e) => getAdjustmentsData(e)}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search REPO Adjustments
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    onChange={(e) => setTextRepoId(e.target.value)}
                    value={textRepoId.toUpperCase()}
                    required
                    placeholder="Enter REPO ID (e.g., REPO-202601-001)"
                    className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                 hover:border-blue-400 hover:shadow-sm outline-none
                                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Enter REPO ID to view all adjustment transactions</p>
              </div>

              <div className="flex items-end">
                <button
                  type='submit'
                  disabled={spinner}
                  className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                             rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                             disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]">
                  {spinner ? (
                    <>
                      <Spinner size={20} />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                      <span>Search Adjustments</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Message */}
        <div className="mt-6">
          {errorMessage && (
            <div className="animate-slideDown">
              <ErrorMessage messageValue={errorMessage} />
            </div>
          )}
        </div>

        {/* Adjustments Table */}
        {adjustmentDataTable && adjustmentData.length > 0 && (
          <div className="mt-8 animate-fadeIn">
            {/* Summary Header */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-t-xl p-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      REPO Adjustments for {adjustmentData[0]?.repoId}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Bank Account: {adjustmentData[0]?.bankAccount}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="text-gray-600">Total Adjustments:</span>
                    <span className="font-semibold text-gray-800 ml-2">{adjustmentData.length}</span>
                  </div>

                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Adjustment ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Cross Adjustment
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Remark
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Adjustment Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Opening Balance Row */}
                    <tr className="bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                          <span className="text-sm text-gray-600">Opening Balance</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">—</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Initial REPO balance</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                        Rs.{formatCurrency(adjustmentData[0]?.openingBalance)}
                      </td>
                    </tr>

                    {/* Adjustment Rows */}
                    {adjustmentData.map((element) => (
                      <tr
                        key={element.adjustmentId}
                        className="hover:bg-gray-50 transition-all duration-150 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center mr-3 ${getAdjustmentType(element.adjustmentAmount) === 'positive'
                                ? 'bg-green-100'
                                : getAdjustmentType(element.adjustmentAmount) === 'negative'
                                  ? 'bg-red-100'
                                  : 'bg-gray-100'
                              }`}>
                              <svg className={`h-4 w-4 ${getAdjustmentType(element.adjustmentAmount) === 'positive'
                                  ? 'text-green-600'
                                  : getAdjustmentType(element.adjustmentAmount) === 'negative'
                                    ? 'text-red-600'
                                    : 'text-gray-600'
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                {getAdjustmentType(element.adjustmentAmount) === 'positive' ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                ) : getAdjustmentType(element.adjustmentAmount) === 'negative' ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                )}
                              </svg>
                            </div>
                            <div className="text-sm font-medium text-gray-900">{element.adjustmentId}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {element.crossAdjustment || '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                          <div className="line-clamp-2">{element.remark}</div>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${getAdjustmentType(element.adjustmentAmount) === 'positive'
                            ? 'text-green-700'
                            : getAdjustmentType(element.adjustmentAmount) === 'negative'
                              ? 'text-red-700'
                              : 'text-gray-700'
                          }`}>
                          <div className="flex items-center justify-end space-x-2">
                            {getAdjustmentType(element.adjustmentAmount) === 'positive' ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                              </svg>
                            ) : getAdjustmentType(element.adjustmentAmount) === 'negative' ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                              </svg>
                            ) : null}
                            <span>Rs.{formatCurrency(element.adjustmentAmount)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Closing Balance Row */}
                    <tr className="bg-gradient-to-r from-purple-50 to-purple-100 border-t-2 border-purple-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">Closing Balance</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">—</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Final balance after all adjustments</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-800 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>Rs.{formatCurrency(adjustmentData[0]?.closingBalance)}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                  <div>
                    Showing <span className="font-semibold">{adjustmentData.length}</span> adjustment(s) for REPO ID: <span className="font-semibold text-blue-600">{adjustmentData[0]?.repoId}</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 md:mt-0">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="text-xs">Credit Adjustment</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <span className="text-xs">Debit Adjustment</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                      <span className="text-xs">Closing Balance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {adjustmentDataTable && adjustmentData.length === 0 && (
          <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Adjustments Found</h3>
              <p className="text-gray-600 mb-4">
                No adjustment records found for the provided REPO ID. Please verify the ID and try again.
              </p>
              <button
                onClick={() => setTextRepoId("")}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                Clear Search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}