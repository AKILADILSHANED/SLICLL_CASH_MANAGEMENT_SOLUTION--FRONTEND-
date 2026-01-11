"use client";
import React from "react";
import { useState, useEffect } from "react";
import Spinner from "@/app/Spinner/page";
import SuccessMessage from "@/app/Messages/SuccessMessage/page";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";

export default function NewRequest({ onCancel }) {
  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [loadAccounts, setLoadAccounts] = useState("Load Accounts");
  const [accountLoadingSpinner, setAccountLoadingSpinner] = useState(false);
  const [requestSaveSpinner, setRequestSaveSpinner] = useState(false);
  const [loadPayments, setLoadPayments] = useState("Load Payments");
  const [paymentLoadingSpinner, setPaymentLoadingSpinner] = useState(false);
  const [accountList, setAccountList] = useState([]);
  const [paymentList, setPaymentList] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [prediction, setPrediction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [bankAccount, setBankAccount] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [requestAmount, setRequestAmount] = useState("");
  const [requestType, setRequestType] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('en-CA')
  );

  // Load accounts and payments on component mount
  useEffect(() => {
    loadBankAccounts();
    loadPaymentList();
  }, []);

  //Define loadBankAccounts function;
  const loadBankAccounts = async () => {
    try {
      setAccountLoadingSpinner(true);
      const request = await fetch(
        `${baseUrl}/api/v1/bank-account/getBankAccounts`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (request.ok) {
        const response = await request.json();
        if (response.success == false) {
          setLoadAccounts(response.success);
        } else {
          setAccountList(response.responseObject);
          setLoadAccounts("");
        }
      } else {
        setLoadAccounts("No response from server!");
      }
    } catch (error) {
      setLoadAccounts("Unexpected error occurred!");
    } finally {
      setAccountLoadingSpinner(false);
    }
  };

  //Define loadPayments function;
  const loadPaymentList = async () => {
    try {
      setPaymentLoadingSpinner(true);
      const request = await fetch(`${baseUrl}/api/v1/payment/getPaymentList`, {
        method: "GET",
        credentials: "include",
      });
      if (request.ok) {
        const response = await request.json();
        if (response.success == false) {
          setLoadPayments(response.success);
        } else {
          setPaymentList(response.responseObject);
          setLoadPayments("");
        }
      } else {
        setLoadPayments("No response from server!");
      }
    } catch (error) {
      setLoadPayments("Unexpected error occurred!");
    } finally {
      setPaymentLoadingSpinner(false);
    }
  };

  //Define handleSubmit function;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Validation
    if (!bankAccount || !paymentType || !requestAmount || !requestType || !selectedDate) {
      setErrorMessage("Please fill in all required fields!");
      return;
    }

    setRequestSaveSpinner(true);
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/fund-request/new-request`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountId: bankAccount,
            paymentId: paymentType,
            requestAmount: requestAmount,
            requestType: requestType,
            requiredDate: selectedDate,
          }),
        }
      );
      if (request.ok) {
        const response = await request.json();
        if (response.success == false) {
          setErrorMessage(response.message);
        } else {
          setSuccessMessage(response.message);
          // Reset form after successful submission
          setTimeout(() => {
            setBankAccount("");
            setPaymentType("");
            setRequestAmount("");
            setRequestType("");
            setSelectedDate(new Date().toLocaleDateString('en-CA'));
          }, 2000);
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
    } finally {
      setRequestSaveSpinner(false);
    }
  };

  //define handleKeyDown function; This will be restricted typing minus values in the text box;
  const handleKeyDown = (e) => {
    if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
      e.preventDefault();
    }
  }

  //Define base url;
  const baseUrlforPrediction = process.env.NEXT_PUBLIC_API_BASE_URL_CLAIM_PREDICTION;

  //Define handlePrediction function;
  const handlePrediction = async () => {
    setIsLoading(true);
    setError('');
    setErrorMessage('');

    try {
      // The URL of Python Flask backend API
      const response = await fetch(`${baseUrlforPrediction}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: selectedDate }),
      });

      if (!response.ok) {
        // Handle HTTP errors like 400 or 500
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const result = await response.json();
      setRequestAmount(result.predicted_cost);
      setSuccessMessage(`Predicted amount loaded: $${result.predicted_cost}`);

      // Auto-hide success message
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

    } catch (err) {
      setErrorMessage(`Prediction failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto animate-fadeIn">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  New Fund Request
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  Submit a new fund request for processing
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

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
            {/* Bank Account & Payment Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bank Account */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-800">
                    Bank Account
                    <span className="text-red-600 ml-1">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={loadBankAccounts}
                    disabled={accountLoadingSpinner}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-all duration-200 
                             flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {accountLoadingSpinner ? (
                      <>
                        <Spinner size={16} />
                        <span>Loading...</span>
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
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          ></path>
                        </svg>
                        <span>Reload Accounts</span>
                      </>
                    )}
                  </button>
                </div>
                <select
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  required
                  className="w-full p-3.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                           hover:border-blue-400 hover:shadow-sm outline-none
                           dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="">
                    - Select Bank Account -
                  </option>
                  {accountList.map((element) => (
                    <option key={element.accountId} value={element.accountId}>
                      {element.accountNumber}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">
                  Select the bank account for fund disbursement
                </p>
              </div>

              {/* Payment Type */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-800">
                    Payment Type
                    <span className="text-red-600 ml-1">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={loadPaymentList}
                    disabled={paymentLoadingSpinner}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-all duration-200 
                             flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {paymentLoadingSpinner ? (
                      <>
                        <Spinner size={16} />
                        <span>Loading...</span>
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
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          ></path>
                        </svg>
                        <span>Reload Payments</span>
                      </>
                    )}
                  </button>
                </div>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  required
                  className="w-full p-3.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                           hover:border-blue-400 hover:shadow-sm outline-none
                           dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="">
                    - Select Payment Type -
                  </option>
                  {paymentList.map((element) => (
                    <option key={element.paymentId} value={element.paymentId}>
                      {element.paymentType}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">
                  Select the type of payment for this request
                </p>
              </div>
            </div>

            {/* Request Amount & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Request Amount */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-800">
                    Request Amount (Rs.)
                    <span className="text-red-600 ml-1">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handlePrediction}
                    disabled={isLoading || !selectedDate}
                    className="text-sm font-medium text-green-600 hover:text-green-800 transition-all duration-200 
                             flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Spinner size={16} />
                        <span>Predicting...</span>
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
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          ></path>
                        </svg>
                        <span>Predict Amount</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500"></span>
                  </div>
                  <input
                    type="number"
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                    className="pl-8 w-full p-3.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                             hover:border-blue-400 hover:shadow-sm outline-none
                             dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Enter the amount requested in USD
                </p>
              </div>

              {/* Request Type */}
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
                  Select the type of fund request
                </p>
              </div>
            </div>

            {/* Required Date */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-800">
                Fund Required Date
                <span className="text-red-600 ml-1">*</span>
              </label>
              <div className="relative max-w-xs">
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
                  min={new Date().toLocaleDateString('en-CA')}
                  className="pl-10 w-full p-3.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                           hover:border-blue-400 hover:shadow-sm outline-none
                           dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              <p className="text-xs text-gray-500">
                Select the date when funds are required
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500">
                  <div className="flex items-center">
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
                    <span>All fields marked with * are required</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
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
                    type="submit"
                    disabled={requestSaveSpinner}
                    className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                             rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                             disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {requestSaveSpinner ? (
                      <>
                        <Spinner size={20} />
                        <span>Submitting...</span>
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
                            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                          ></path>
                        </svg>
                        <span>Submit Request</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
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
      </div>
    </div>
  );
}