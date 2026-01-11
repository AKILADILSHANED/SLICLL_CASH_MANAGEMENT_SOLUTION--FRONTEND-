"use client"
import ErrorMessage from '@/app/Messages/ErrorMessage/page'
import SuccessMessage from '@/app/Messages/SuccessMessage/page'
import React, { useState } from 'react'
import Spinner from '@/app/Spinner/page';

export default function NewTransfers({ manualTransfer }) {

  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define states;
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [transferSpinner, setTransferSpinner] = useState(false);
  const [isInitiating, setIsInitiating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  //Define handleInitiateTransfers function;
  const handleInitiateTransfers = async () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    setSuccessMessage("");
    setErrorMessage("");
    setTransferSpinner(true);
    setIsInitiating(true);
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/transfers/initiate-transfers`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!request.ok) {
        const response = await request.json();
        setErrorMessage(response.message || "Failed to initiate transfers");
      } else {
        const response = await request.json();
        setSuccessMessage(response.message);
        setShowConfirmation(false);

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      }
    } catch (error) {
      setErrorMessage("Unexpected error occurred. Please contact administrator!");
    } finally {
      setTransferSpinner(false);
      setIsInitiating(false);
    }
  }

  const cancelInitiation = () => {
    setShowConfirmation(false);
    setErrorMessage("");
  };

  const resetMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto animate-fadeIn">
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
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  ></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Initiate Fund Transfers
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  Start the fund transfer process for approved requests
                </p>
              </div>
            </div>
            {(successMessage || errorMessage) && (
              <button
                onClick={resetMessages}
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

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          {!showConfirmation ? (
            /* Information and Requirements Section */
            <div className="space-y-8">
              {/* Information Card */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start">
                  <div className="bg-blue-200 p-3 rounded-lg mr-4">
                    <svg
                      className="w-6 h-6 text-blue-700"
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
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">
                      Important Pre-Transfer Checklist
                    </h3>
                    <p className="text-blue-700 mb-4">
                      Before initiating transfers, please ensure all requirements are met to ensure successful fund transfers.
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-white p-1 rounded-full mr-3 mt-0.5">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-1">Fund Request Approval</h4>
                          <p className="text-sm text-gray-600">
                            Only properly approved Fund Requests will result in funds being transferred.
                            Funds will not be transferred for pending or unapproved requests.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-white p-1 rounded-full mr-3 mt-0.5">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-1">Account Balance Accuracy</h4>
                          <p className="text-sm text-gray-600">
                            Ensure that account balances are correctly entered for all relevant bank accounts.
                            Incorrect balances will lead to inaccurate transfers and potential errors.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-white p-1 rounded-full mr-3 mt-0.5">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-1">Repo Management</h4>
                          <p className="text-sm text-gray-600">
                            All Repo details for the current date must be inserted using the "Repo Management" option
                            before proceeding with fund transfers.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-white p-1 rounded-full mr-3 mt-0.5">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-1">System Readiness</h4>
                          <p className="text-sm text-gray-600">
                            Ensure the system is ready and no other users are performing critical operations
                            during the transfer initiation process.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-full mb-4">
                      <svg
                        className="w-8 h-8 text-green-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Ready to Initiate Transfers?
                    </h3>
                    <p className="text-gray-600 max-w-lg mx-auto">
                      Once initiated, the system will process all approved fund requests and
                      generate transfer instructions based on current account balances and repo details.
                    </p>
                  </div>

                  <div className='flex flex-row gap-3 items-center justify-center'>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button
                        onClick={handleInitiateTransfers}
                        className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-400 to-green-700 
                                                     rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 
                                                     focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                     active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          ></path>
                        </svg>
                        <span>Initiate Transfers</span>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button
                        onClick={() => manualTransfer()}
                        className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-slate-400 to-slate-700 
                                                     rounded-lg hover:from-slate-500 hover:to-slate-800 focus:ring-4 focus:ring-green-300 
                                                     focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                     active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          ></path>
                        </svg>
                        <span>Manual Transfers</span>
                      </button>
                    </div>

                  </div>


                  <p className="text-sm text-gray-500 mt-4">
                    Note: This process may take several minutes depending on the number of requests.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Confirmation Section */
            <div className="text-center py-8">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <svg
                      className="w-8 h-8 text-yellow-600"
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
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Confirm Transfer Initiation
                </h3>
                <p className="text-gray-600 mb-4 max-w-lg mx-auto">
                  Are you sure you want to initiate fund transfers? This action will:
                </p>

                <div className="bg-white rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <div className="space-y-3 text-left">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-red-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        ></path>
                      </svg>
                      <span className="text-sm text-gray-700">Process all approved fund requests</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-red-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        ></path>
                      </svg>
                      <span className="text-sm text-gray-700">Generate transfer instructions</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-red-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        ></path>
                      </svg>
                      <span className="text-sm text-gray-700">Update system records automatically</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-red-600 font-medium mb-6">
                  This action cannot be undone once initiated.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={cancelInitiation}
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
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                    <span>Cancel</span>
                  </button>

                  <button
                    onClick={handleInitiateTransfers}
                    disabled={isInitiating}
                    className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                                                 rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                                                 focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                 active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isInitiating ? (
                      <>
                        <Spinner size={20} />
                        <span>Initiating Transfers...</span>
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
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          ></path>
                        </svg>
                        <span>Confirm & Initiate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {errorMessage && !showConfirmation && (
            <div className="mt-6 animate-slideDown">
              <ErrorMessage messageValue={errorMessage} />
            </div>
          )}
          {successMessage && !showConfirmation && (
            <div className="mt-6 animate-slideDown">
              <SuccessMessage messageValue={successMessage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}