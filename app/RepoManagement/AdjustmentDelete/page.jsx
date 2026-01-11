"use client"
import React from 'react'
import { useState } from 'react';
import Spinner from '@/app/Spinner/page';
import SUccessMessage from '@/app/Messages/SuccessMessage/page';
import ErrorMessage from '@/app/Messages/ErrorMessage/page';

export default function AdjustmentDelete() {
  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [adjustmentId, setAdjustmentId] = useState("");
  const [adjustmentDetails, setAdjustmentDetails] = useState([]);
  const [adjustmentDetailsComponent, setAdjustmentDetailsComponent] = useState(false);
  const [viewSinner, setViewSinner] = useState(false);
  const [deleteSinner, setDeleteSinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  //Define handleView function;
  const handleView = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setViewSinner(true);
    setAdjustmentDetailsComponent(false);
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/repo/get-adjustment-details?adjustmentId=${adjustmentId}`,
        {
          method: "GET",
          credentials: "include"
        }
      );
      if (request.status === 200) {
        const response = await request.json();
        setAdjustmentDetails(response.responseObject);
        setAdjustmentDetailsComponent(true);
      } else if (request.status === 409) {
        const response = await request.json();
        setErrorMessage(response.message);
      } else {
        const response = await request.json();
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.log(error)
      setErrorMessage(error + ":Un-expected error occurred. Please contact administrator!");
    } finally {
      setViewSinner(false);
    }
  }

  //Define handleDelete function;
  const handleDelete = async () => {
    setDeleteSinner(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/repo/delete-adjustment?adjustmentId=${adjustmentId}`,
        {
          method: "PUT",
          credentials: "include"
        }
      );
      if (request.status === 200) {
        const response = await request.json();
        setSuccessMessage(response.message);
      } else if (request.status == 409) {
        const response = await request.json();
        setErrorMessage(response.message);
      } else {
        const response = await request.json();
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage(error + ":Un-expected error occurred. Please contact administrator!");
    } finally {
      setDeleteSinner(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto animate-fadeIn">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-xl shadow-lg p-6 mb-0">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Adjustment Delete</h1>
              <p className="text-red-100 text-sm mt-1">View and delete adjustment records</p>
            </div>
          </div>
        </div>

        {/* Search Form Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <form onSubmit={(e) => handleView(e)}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Adjustment ID
                  <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    onChange={(e) => setAdjustmentId(e.target.value)}
                    type="text"
                    placeholder="Enter Adjustment ID (e.g., REPO-202601-001)"
                    required
                    className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                 hover:border-blue-400 hover:shadow-sm outline-none
                                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Enter adjustment ID to view details before deletion</p>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={viewSinner}
                  className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                             rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                             disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]">
                  {viewSinner ? (
                    <>
                      <Spinner size={20} />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                      <span>View Details</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Adjustment Details Card */}
        {adjustmentDetailsComponent && adjustmentDetails.length > 0 && (
          <div className="mt-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-t-xl p-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Adjustment Details</h2>
                    <p className="text-sm text-gray-600">Found {adjustmentDetails.length} record(s) for ID: {adjustmentId}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${adjustmentDetails[0]?.status?.toLowerCase() === 'active'
                    ? 'bg-green-100 text-green-800'
                    : adjustmentDetails[0]?.status?.toLowerCase() === 'deleted'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}>
                    {adjustmentDetails[0]?.status || 'Unknown Status'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Cross Adjustment ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Adjustment Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {adjustmentDetails.map((element) => (
                      <tr
                        key={element.adjustmentId}
                        className="hover:bg-gray-50 transition-all duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            </div>
                            <div className="text-sm font-medium text-gray-900">{element.adjustmentId}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{element.adjustmentDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${element.status?.toLowerCase() === 'active'
                            ? 'bg-green-100 text-green-800'
                            : element.status?.toLowerCase() === 'deleted'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {element.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            {element.status?.toLowerCase() === 'active' ? (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete adjustment ${element.adjustmentId}? This action cannot be undone.`)) {
                                    handleDelete();
                                  }
                                }}
                                disabled={deleteSinner}
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                                                                         rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                                                                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                                         disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                                {deleteSinner ? (
                                  <>
                                    <Spinner size={16} />
                                    <span>Deleting...</span>
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    <span>Delete</span>
                                  </>
                                )}
                              </button>
                            ) : (
                              <span className="text-sm text-gray-500 italic">Already deleted</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Warning Section */}
              {adjustmentDetails[0]?.status?.toLowerCase() === 'active' && (
                <div className="bg-red-50 border-t border-red-200 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Important Warning</h3>
                      <div className="mt-1 text-sm text-red-700">
                        <p>Deleting an adjustment is a permanent action that cannot be undone.</p>
                        <p className="mt-1">Please verify the adjustment ID and details before proceeding with deletion.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {adjustmentDetailsComponent && adjustmentDetails.length === 0 && (
          <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Adjustment Found</h3>
              <p className="text-gray-600 mb-4">
                No adjustment records found for the provided ID. Please verify the adjustment ID and try again.
              </p>
              <button
                onClick={() => setAdjustmentId("")}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* Messages Section */}
        <div className="mt-6 space-y-3">
          {errorMessage && (
            <div className="animate-slideDown">
              <ErrorMessage messageValue={errorMessage} />
            </div>
          )}
          {successMessage && (
            <div className="animate-slideDown">
              <SUccessMessage messageValue={successMessage} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}