"use client"
import React from 'react'
import { useState } from 'react';
import Spinner from '@/app/Spinner/page';
import ErrorMessage from '@/app/Messages/ErrorMessage/page';

export default function DisplayRepo() {
  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables
  const [textRepoId, setTextRepoId] = useState("");
  const [spinnerSearch, setSpinnerSearch] = useState(false);
  const [repoDataTable, setRepoDataTable] = useState(false);
  const [repoDetails, setRepoDetails] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");


  //Define getRepoDetails function;
  const getRepoDetails = async (e) => {
    e.preventDefault();
    setSpinnerSearch(true);
    setErrorMessage("");
    setRepoDataTable(false);
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/repo/display-repo?repoId=${textRepoId}`,
        {
          method: "GET",
          credentials: "include"
        }
      );
      if (request.status === 200) {
        const response = await request.json();
        setRepoDetails(response.responseObject);
        setRepoDataTable(true);
      } else if (request.status === 409) {
        const response = await request.json();
        setErrorMessage(response.message);
      } else if (request.status === 500) {
        const response = await request.json();
        setErrorMessage(response.message);
      } else {
        const response = await request.json();
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage("Un-expected error occurred. Please contact administrator!");
    } finally {
      setSpinnerSearch(false);
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case 'active':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            {status}
          </span>
        );
      case 'matured':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {status}
          </span>
        );
      case 'closed':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
      case 'yes':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Deleted
          </span>
        );
      case 'no':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Active
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            {status || 'N/A'}
          </span>
        );
    }
  };

  const getRepoTypeBadge = (type) => {
    switch (type) {
      case 'PAR':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {type}
          </span>
        );
      case 'NON-PAR':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
            {type}
          </span>
        );
      case 'TR':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            {type}
          </span>
        );
      case 'Excess':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
            {type}
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            {type || 'N/A'}
          </span>
        );
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
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Display REPO Details</h1>
                <p className="text-blue-100 text-sm mt-1">Search and view REPO investment information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Form Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <form onSubmit={(e) => getRepoDetails(e)}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by REPO ID
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
                <p className="text-xs text-gray-500 mt-2">Enter the exact REPO ID to retrieve details</p>
              </div>

              <div className="flex items-end">
                <button
                  type='submit'
                  disabled={spinnerSearch}
                  className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                           rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                           focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                           active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                           disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]">
                  {spinnerSearch ? (
                    <>
                      <Spinner size={20} />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                      <span>Search REPO</span>
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

        {/* Results Table */}
        {
          repoDataTable && repoDetails.length > 0 && (
            <div className="mt-8 animate-fadeIn">
              {/* Results Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-t-xl p-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">REPO Investment Details</h2>
                      <p className="text-sm text-gray-600">Found {repoDetails.length} REPO investment(s)</p>
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
                          REPO ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                          Account
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                          Opening Balance
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                          Closing Balance
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                          Maturity Value
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                          Interest Rate
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                          REPO Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                          Invest Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                          Maturity Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                          Created By
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                      {repoDetails.map((element) => (
                        <tr
                          key={element.repoId}
                          className="hover:bg-blue-50 transition-all duration-200 group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{element.repoId}</div>
                                <div className="text-xs text-gray-500">Created: {element.createdDate}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{element.accountNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              Rs.{formatCurrency(element.openingBalance)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              Rs.{formatCurrency(element.closingBalance)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-blue-700">
                              Rs.{formatCurrency(element.maturityValue)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm font-semibold text-gray-900">{element.interestRate}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getRepoTypeBadge(element.repoType)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(element.investmentStatus)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{element.investDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{element.maturityDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{element.createdBy}</div>
                            <div className="text-xs text-gray-500">{element.deleteStatus === 'Yes' ? `Deleted by: ${element.deleteUser}` : ''}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div>
                      Showing <span className="font-semibold">{repoDetails.length}</span> REPO investment(s)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        {/* No Results Message */}
        {
          repoDataTable && repoDetails.length === 0 && (
            <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No REPO Details Found</h3>
                <p className="text-gray-600 mb-4">
                  No REPO investment details found for the provided ID. Please verify the REPO ID and try again.
                </p>
                <button
                  onClick={() => setTextRepoId("")}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                  Clear Search
                </button>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}