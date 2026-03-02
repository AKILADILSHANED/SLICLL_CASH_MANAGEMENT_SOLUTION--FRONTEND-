"use client"
import React from 'react'
import Spinner from '@/app/Spinner/page'
import { useState, useEffect } from 'react';
import ErrorMessage from '@/app/Messages/ErrorMessage/page';

export default function DisplayAllTransfer() {

  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [viewSpinner, setViewSpinner] = useState(false);
  const [transferDataTable, setTransferDataTable] = useState(false);
  const [transferData, setTransferData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [transferDate, setTransferDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalTransfers, setTotalTransfers] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");

  // Set default date on component mount
  useEffect(() => {
    const today = new Date().toLocaleDateString('en-CA');
    setTransferDate(today);
  }, []);

  //Define viewTransferData function;
  const viewTransferData = async (e) => {
    e.preventDefault();
    try {
      setViewSpinner(true)
      setErrorMessage("");
      setTransferDataTable(false);
      setTotalAmount(0);
      setTotalTransfers(0);

      if (!transferDate) {
        setErrorMessage("Please select a transfer date!");
        setViewSpinner(false);
        return;
      }

      const request = await fetch(
        `${baseUrl}/api/v1/transfers/get-all-transfers?transferDate=${encodeURIComponent(transferDate)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const response = await request.json();
      if (request.status !== 200) {
        setErrorMessage(response.message || "Failed to fetch transfer data");
      } else {
        const transfers = response.responseObject || [];
        setTransferDataTable(true);
        setTransferData(transfers);

        // Calculate totals
        const total = transfers.reduce((sum, item) => {
          return sum + (parseFloat(item.transferAmount) || 0);
        }, 0);
        setTotalAmount(total);
        setTotalTransfers(transfers.length);
      }

    } catch (error) {
      setErrorMessage("Response not received from server. Please contact administrator!");
    } finally {
      setViewSpinner(false)
    }
  }

  const clearSearch = () => {
    setTransferDate(new Date().toLocaleDateString('en-CA'));
    setErrorMessage("");
    setTransferDataTable(false);
    setTransferData([]);
    setTotalAmount(0);
    setTotalTransfers(0);
    setFilterStatus("all");
  };

  const formatCurrency = (amount) => {
    const number = parseFloat(amount || 0);
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return null;

    const statusLower = status.toLowerCase();
    if (statusLower.includes('approved')) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Approved
        </span>
      );
    } else if (statusLower.includes('pending')) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          {status}
        </span>
      );
    }
    return <span className="text-sm text-gray-600">{status}</span>;
  };

  const getIsReversedBadge = (reversed) => {
    if (!reversed) return null;

    const reversedLower = reversed.toLowerCase();
    if (reversedLower == 'reversed') {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          {reversed}
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          {reversed}
        </span>
      );
    }

  };

  const filteredTransfers = transferData.filter(transfer => {
    if (filterStatus === "all") return true;
    if (filterStatus === "approved") return transfer.approveStatus?.toLowerCase().includes('approved');
    if (filterStatus === "pending") return transfer.approveStatus?.toLowerCase().includes('pending') ||
      transfer.checkedStatus?.toLowerCase().includes('pending');
    if (filterStatus === "reversed") return transfer.isReversed?.toLowerCase().includes('yes') ||
      transfer.isReversed?.toLowerCase().includes('reversed');
    return true;
  });

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      viewTransferData(e);
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  All Transfers
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  View all transfer records by date
                </p>
              </div>
            </div>
            {transferDataTable && (
              <button
                onClick={clearSearch}
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
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Form Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <form onSubmit={viewTransferData} className="space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-800">
                Transfer Date
                <span className="text-red-600 ml-1">*</span>
              </label>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
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
                    onChange={(e) => setTransferDate(e.target.value)}
                    onKeyPress={handleKeyPress}
                    type="date"
                    value={transferDate}
                    required
                    className="pl-10 w-full p-3.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                 hover:border-blue-400 hover:shadow-sm outline-none
                                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="flex items-center">
                  <button
                    type="submit"
                    disabled={viewSpinner}
                    className="px-8 py-3.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                                 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                                                 focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                 active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]"
                  >
                    {viewSpinner ? (
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
                        <span>Search Transfers</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Select a date to view all transfers initiated on that date
              </p>
            </div>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-6 animate-slideDown">
              <ErrorMessage messageValue={errorMessage} />
            </div>
          )}
        </div>

        {/* Results Section */}
        {transferDataTable && (
          <div className="mt-8 animate-fadeIn">
            {/* Results Header */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-t-xl p-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 text-blue-600"
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
                      Transfer Records
                    </h2>
                    <p className="text-sm text-gray-600">
                      Date: {formatDate(transferDate)} • Total Transfers: {totalTransfers} •
                      Total Amount: Rs.{formatCurrency(totalAmount)}
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
                      Total: Rs.{formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white border border-gray-200 p-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredTransfers.length}</span> of <span className="font-semibold">{totalTransfers}</span> transfers
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Filter by:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilterStatus("all")}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${filterStatus === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterStatus("approved")}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${filterStatus === "approved"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      Approved
                    </button>
                    <button
                      onClick={() => setFilterStatus("pending")}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${filterStatus === "pending"
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => setFilterStatus("reversed")}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${filterStatus === "reversed"
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      Reversed
                    </button>
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
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Transfer ID
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        From → To
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold text-right">
                        Amount
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Chanel
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        From Repo
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        To Repo
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Approve Status
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Initiated
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Checked
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Approved
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Reversed
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Reversed By
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Cross Adjustment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransfers.length > 0 ? (
                      filteredTransfers.map((element) => (
                        <tr
                          key={element.transferId}
                          className={`bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 ${element.isReversed?.toLowerCase().includes('yes') ||
                            element.isReversed?.toLowerCase().includes('reversed')
                            ? 'bg-red-50 hover:bg-red-100'
                            : ''
                            }`}
                        >
                          <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${element.isReversed?.toLowerCase().includes('yes') ||
                                element.isReversed?.toLowerCase().includes('reversed')
                                ? 'bg-red-600'
                                : element.approveStatus?.toLowerCase().includes('approved')
                                  ? 'bg-green-600'
                                  : 'bg-blue-600'
                                }`}></div>
                              {element.transferId}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">From:</span>
                              <span className="text-sm text-gray-900 font-medium">{element.fromAccount}</span>
                              <span className="text-xs text-gray-500 mt-1">To:</span>
                              <span className="text-sm text-gray-900 font-medium">{element.toAccount}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="text-sm font-semibold text-gray-900">
                              Rs.{formatCurrency(element.transferAmount)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-900">{element.channel}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-900">{element.fromRepo}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-900">{element.toRepo}</span>
                          </td>
                          <td className="px-4 py-4">
                            {getStatusBadge(element.approveStatus)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-xs text-gray-600">
                              {element.initiatedBy}<br />
                              <span className="text-gray-500">{formatDate(element.initiatedDate)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-xs text-gray-600">
                              {element.checkedBy || "N/A"}<br />
                              <span className="text-gray-500">{formatDate(element.checkedDate)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-xs text-gray-600">
                              {element.approvedBy || "N/A"}<br />
                              <span className="text-gray-500">{formatDate(element.approveDate)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {getIsReversedBadge(element.isReversed)}
                          </td>
                          <td className="px-4 py-4">
                            {element.reversedBy}
                          </td>
                          <td className="px-4 py-4">
                            {element.crossAdjustment}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="px-4 py-12 text-center">
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
                              No Transfers Found
                            </h3>
                            <p className="text-gray-500 max-w-md">
                              No transfers found for the selected date and filter criteria.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              {filteredTransfers.length > 0 && (
                <div className="bg-gray-50 px-4 py-4 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-semibold">{filteredTransfers.length}</span> transfers
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
        {!transferDataTable && transferDate && !errorMessage && (
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Search Transfer Records
              </h3>
              <p className="text-gray-600 mb-4">
                Select a date above to search for transfer records.
              </p>
              <p className="text-sm text-gray-500">
                Transfer records will appear here after a successful search.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}