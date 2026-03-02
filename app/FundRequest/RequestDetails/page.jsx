"use client";
import React from "react";
import { useState } from "react";
import Spinner from "@/app/Spinner/page";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";

export default function SearchRequest({ onCancel }) {
  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [requestType, setRequestType] = useState("");
  const [searchSpinner, setSearchSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [requestList, setRequestList] = useState([]);
  const [actualRequestDetailsWindow, setActualRequestDetailsWindow] =
    useState(false);
  const [forecastRequestDetailsWindow, setForecastRequestDetailsWindow] =
    useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  //Define handleSearch function;
  const handleSearch = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setActualRequestDetailsWindow(false);
    setForecastRequestDetailsWindow(false);
    setTotalAmount(0);

    if (!selectedDate || !requestType) {
      setErrorMessage("Please select both date and request type!");
      return;
    }

    try {
      setSearchSpinner(true);
      const request = await fetch(
        `${baseUrl}/api/v1/fund-request/get-fundRequest-details?requiredDate=${encodeURIComponent(
          selectedDate
        )}&requestType=${encodeURIComponent(requestType)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const response = await request.json();
      if (request.status === 200) {
        const requests = response.responseObject || [];
        setRequestList(requests);

        // Calculate total amount
        const total = requests.reduce((sum, item) => {
          return sum + (parseFloat(item.requestAmount) || 0);
        }, 0);
        setTotalAmount(total);

        if (requestType == 0) {
          setActualRequestDetailsWindow(true);
        } else {
          setForecastRequestDetailsWindow(true);
        }
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
      setSearchSpinner(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const clearSearch = () => {
    setSelectedDate(new Date().toLocaleDateString("en-CA"));
    setRequestType("");
    setErrorMessage("");
    setActualRequestDetailsWindow(false);
    setForecastRequestDetailsWindow(false);
    setRequestList([]);
    setTotalAmount(0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    if (!status) return null;

    const statusLower = status.toLowerCase();
    if (statusLower === 'approved') {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          {status}
        </span>
      );
    } else if (statusLower === 'active') {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          {status}
        </span>
      );
    } else if (statusLower === 'not-approved') {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          {status}
        </span>
      );
    } else if (statusLower === 'deleted') {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          {status}
        </span>
      );
    }
    return <span className="text-sm text-gray-600">{status}</span>;
  };

  const getRequestTypeLabel = (type) => {
    return type == 0 ? "Actual" : "Forecasted";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
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
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Search Fund Requests
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  Search and view fund request details by date and type
                </p>
              </div>
            </div>
            {onCancel && (
              <button
                onClick={handleCancel}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                <span>Close</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Form Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <form onSubmit={(e) => handleSearch(e)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Date Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-800">
                  Funds Required Date
                  <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="pl-10 w-full p-3.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                             hover:border-blue-400 hover:shadow-sm outline-none
                             dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Select the date to search for fund requests
                </p>
              </div>

              {/* Request Type Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-800">
                  Request Type
                  <span className="text-red-600 ml-1">*</span>
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  required
                  className="w-full p-3.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                           hover:border-blue-400 hover:shadow-sm outline-none
                           dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="">- Select Request Type -</option>
                  <option value="0">Actual Fund Request</option>
                  <option value="1">Forecasted Fund Request</option>
                </select>
                <p className="text-xs text-gray-500">
                  Select the type of fund requests to display
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>Select date and request type to search</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                             rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 
                             flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      ></path>
                    </svg>
                    <span>Clear</span>
                  </button>

                  <button
                    type="submit"
                    disabled={searchSpinner}
                    className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                             rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                             disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {searchSpinner ? (
                      <>
                        <Spinner size={20} />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          ></path>
                        </svg>
                        <span>Search Requests</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-6 animate-slideDown">
            <ErrorMessage messageValue={errorMessage} />
          </div>
        )}

        {/* Results Section */}
        {(actualRequestDetailsWindow || forecastRequestDetailsWindow) && (
          <div className="mt-8 animate-fadeIn">
            {/* Results Header */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-t-xl p-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${requestType == 0 ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                    <svg
                      className={`w-5 h-5 ${requestType == 0 ? 'text-green-600' : 'text-purple-600'
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {getRequestTypeLabel(requestType)} Fund Requests
                    </h2>
                    <p className="text-sm text-gray-600">
                      Date: {formatDate(selectedDate)} • Total Requests: {requestList.length} •
                      Total Amount: Rs. {formatCurrency(totalAmount)}
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span className="text-sm font-semibold text-blue-800">
                      Total: Rs. {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th scope="col" className="px-6 py-3 font-semibold">
                        Request ID
                      </th>
                      <th scope="col" className="px-6 py-3 font-semibold">
                        Account
                      </th>
                      <th scope="col" className="px-6 py-3 font-semibold">
                        Payment Type
                      </th>
                      <th scope="col" className="px-6 py-3 font-semibold text-right">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 font-semibold">
                        Request Date
                      </th>
                      <th scope="col" className="px-6 py-3 font-semibold">
                        Required Date
                      </th>
                      {requestType == 0 && (
                        <>
                          <th scope="col" className="px-6 py-3 font-semibold">
                            Approve Status
                          </th>
                          <th scope="col" className="px-6 py-3 font-semibold">
                            Approved By
                          </th>
                        </>
                      )}
                      <th scope="col" className="px-6 py-3 font-semibold">
                        Delete Status
                      </th>
                      <th scope="col" className="px-6 py-3 font-semibold">
                        Delete By
                      </th>
                      <th scope="col" className="px-6 py-3 font-semibold">
                        Requested By
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {requestList.length > 0 ? (
                      requestList.map((element) => (
                        <tr
                          key={element.requestId}
                          className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                              {element.requestId}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 font-medium">
                              {element.accountNumber}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">
                              {element.paymentType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-semibold text-gray-900">
                              Rs.{formatCurrency(element.requestAmount || 0)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {formatDate(element.requestDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {formatDate(element.requiredDate)}
                            </div>
                          </td>
                          {requestType == 0 && (
                            <>
                              <td className="px-6 py-4">
                                {getStatusBadge(element.approveStatus)}
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                  {element.approvedBy || "N/A"}
                                </div>
                              </td>
                            </>
                          )}
                          <td className="px-6 py-4">
                            {getStatusBadge(element.deleteStatus)}
                          </td>
                          <td className="px-6 py-4">
                            {element.deleted_by}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {element.requestedBy}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={requestType == 0 ? 9 : 7} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <svg
                              className="w-12 h-12 text-gray-400 mb-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              ></path>
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                              No Requests Found
                            </h3>
                            <p className="text-gray-500 max-w-md">
                              No fund requests found for the selected date and type.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              {requestList.length > 0 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-semibold">{requestList.length}</span> fund requests
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="ml-2 text-lg font-bold text-blue-700">
                          Rs.{formatCurrency(totalAmount)}
                        </span>
                      </div>
                      <button
                        onClick={clearSearch}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 
                                 rounded-lg transition-all duration-200 flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          ></path>
                        </svg>
                        <span>New Search</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Search Results Message */}
        {!actualRequestDetailsWindow && !forecastRequestDetailsWindow && selectedDate && requestType && !errorMessage && (
          <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Search Fund Requests
              </h3>
              <p className="text-gray-600 mb-4">
                Select a date and request type above to search for fund requests.
              </p>
              <p className="text-sm text-gray-500">
                Fund request details will appear here after a successful search.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}