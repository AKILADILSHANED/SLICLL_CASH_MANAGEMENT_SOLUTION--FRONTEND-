"use client"
import React, { useState } from "react";
import Spinner from "@/app/Spinner/page";
import { useEffect } from "react";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";
import SuccessMessage from "@/app/Messages/SuccessMessage/page";

export default function ReverseApprove({ onCancel }) {
  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [approveSpinner, setApproveSpinner] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [requestDetails, setRequestDetails] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [totalApproved, setTotalApproved] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  //Handle function to load existing available fund request data, when loading this component.
  const loadRequestData = async () => {
    setErrorMessage("");
    setRequestDetails([]);
    setTotalApproved(0);
    setTotalAmount(0);
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/fund-request/getRequestDetails-reverse`,
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
          const requests = response.responseObject || [];
          setRequestDetails(requests);
          setTotalApproved(requests.length);

          // Calculate total amount
          const total = requests.reduce((sum, item) => {
            return sum + (parseFloat(item.requestAmount) || 0);
          }, 0);
          setTotalAmount(total);
        }
      } else {
        setErrorMessage(
          "No response from server. Please contact administrator!"
        );
      }
    } catch (error) {
      setErrorMessage(
        "Unexpected error occurred. Please contact administrator!"
      );
    }
  };

  useEffect(() => {
    loadRequestData();
  }, []);

  //Define handleApprove function;
  const handleReverse = async (requestId) => {
    setApproveSpinner(requestId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const request = await fetch(
        `${baseUrl}/api/v1/fund-request/reverse-approval?requestId=${encodeURIComponent(
          requestId
        )}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      if (request.ok) {
        const response = await request.json();
        if (response.success == false) {
          setErrorMessage(response.message);
        } else {
          await loadRequestData();
          setSuccessMessage(response.message);

          // Auto-hide success message after 5 seconds
          setTimeout(() => {
            setSuccessMessage("");
          }, 5000);
        }
      } else {
        setErrorMessage(
          "Unexpected error occurred. Please contact administrator!"
        );
      }
    } catch (error) {
      setErrorMessage(
        "Unexpected error occurred. Please contact administrator!"
      );
    } finally {
      setApproveSpinner(null);
    }
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
      });
    } catch {
      return dateString;
    }
  };

  const refreshData = () => {
    loadRequestData();
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto animate-fadeIn">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-t-xl shadow-lg p-6 mb-0">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Reverse Approvals
                </h1>
                <p className="text-orange-100 text-sm mt-1">
                  Review and reverse approved fund requests
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={refreshData}
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
                <span>Refresh</span>
              </button>
              {onCancel && (
                <button
                  onClick={() => onCancel()}
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
        </div>

        {/* Stats Summary Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-800 mb-1">Approved Requests</p>
                  <p className="text-3xl font-bold text-orange-900">{totalApproved}</p>
                </div>
                <div className="bg-orange-200 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-orange-700"
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
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-red-900">Rs.{formatCurrency(totalAmount)}</p>
                </div>
                <div className="bg-red-200 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-red-700"
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
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800 mb-1">Reversal Actions</p>
                  <p className="text-3xl font-bold text-yellow-900">{totalApproved}</p>
                </div>
                <div className="bg-yellow-200 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-yellow-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mt-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-red-800 mb-1">
                Important Notice
              </h4>
              <p className="text-sm text-red-600">
                Reversing an approval will change the request status back to pending.
                This action should only be performed if there are errors in the original approval.
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mt-6 animate-slideDown">
            <SuccessMessage messageValue={successMessage} />
          </div>
        )}
        {errorMessage && (
          <div className="mt-6 animate-slideDown">
            <ErrorMessage messageValue={errorMessage} />
          </div>
        )}

        {/* Requests Table */}
        <div className="mt-8 animate-fadeIn">
          {requestDetails.length > 0 ? (
            <>
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50 to-orange-50 border border-gray-200 rounded-t-xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <svg
                        className="w-5 h-5 text-orange-600"
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
                        Approved Fund Requests
                      </h2>
                      <p className="text-sm text-gray-600">
                        {totalApproved} approved requests available for reversal
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Total Value:</span> Rs.{formatCurrency(totalAmount)}
                  </div>
                </div>
              </div>

              {/* Table Container */}
              <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th scope="col" className="px-6 py-3 font-semibold">
                          Request ID
                        </th>
                        <th scope="col" className="px-6 py-3 font-semibold">
                          Bank Account
                        </th>
                        <th scope="col" className="px-6 py-3 font-semibold">
                          Payment Type
                        </th>
                        <th scope="col" className="px-6 py-3 font-semibold">
                          Requested By
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
                        <th scope="col" className="px-6 py-3 font-semibold text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {requestDetails.map((element) => (
                        <tr
                          key={element.requestId}
                          className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
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
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {element.requestBy}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-semibold text-gray-900">
                              Rs.{formatCurrency(element.requestAmount)}
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
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <button
                                type="button"
                                onClick={() => handleReverse(element.requestId)}
                                disabled={approveSpinner === element.requestId}
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                                         rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                         disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[110px]"
                              >
                                {approveSpinner === element.requestId ? (
                                  <>
                                    <Spinner size={16} />
                                    <span>Reversing...</span>
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
                                        d="M15 19l-7-7 7-7"
                                      ></path>
                                    </svg>
                                    <span>Reverse</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-semibold">{totalApproved}</span> approved requests
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Total Approved Amount:</span>
                        <span className="ml-2 text-lg font-bold text-red-700">
                          Rs.{formatCurrency(totalAmount)}
                        </span>
                      </div>
                      <button
                        onClick={refreshData}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                                 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 
                                 flex items-center gap-2"
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
                        <span>Refresh Data</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-green-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No Approved Requests
                </h3>
                <p className="text-gray-600 mb-4">
                  There are no approved requests available for reversal.
                </p>
                <p className="text-sm text-gray-500">
                  Approved requests will appear here when available.
                </p>
                <button
                  onClick={refreshData}
                  className="mt-4 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 
                           rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
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
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}