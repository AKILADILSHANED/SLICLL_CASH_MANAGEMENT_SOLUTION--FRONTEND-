"use client"
import SUccessMessage from "@/app/Messages/SuccessMessage/page";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";
import Spinner from "@/app/Spinner/page";
import React, { useState } from "react";
import { useEffect } from "react";

export default function RegisterAccount({ onCancel }) {

  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [spinner, setSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  //Define state variables to store user input data;
  const [textBank, setTextBank] = useState("");
  const [bankList, setBankList] = useState([]);
  const [textBranch, setTextBranch] = useState("");
  const [textAccountType, setAccountType] = useState("");
  const [textCurrency, setCurrency] = useState("");
  const [textGlCode, setGlCode] = useState("");
  const [textAccountNumber, setAccountNumber] = useState("");

  //define getBankList function;
  const getBankList = async () => {
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/bank/bank-list`,
        {
          method: "GET",
          credentials: "include"
        }
      );
      if (request.ok) {
        const response = await request.json();
        if (response.success == false) {
          setErrorMessage(response.message);
        } else {
          setBankList(response.responseObject);
        }
      } else {
        setErrorMessage("Unable to fetch Bank List. Please contact administrator!");
      }
    } catch (error) {
      setErrorMessage("Un-expected error occurred. Please contact administrator!");
    }
  }

  useEffect(() => {
    getBankList();
  }, []);

  //Define handle register function;
  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setSpinner(true);

    if (!textBank) {
      setErrorMessage("Please select the bank from drop down!");
      setSpinner(false);
    } else if (!textAccountType) {
      setErrorMessage("Please select the account type from drop down!");
      setSpinner(false);
    } else if (!textCurrency) {
      setErrorMessage("Please select currency from drop down!");
      setSpinner(false);
    } else {
      try {
        const request = await fetch(
          `${baseUrl}/api/v1/bank-account/account-register`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bank: textBank,
              bankBranch: textBranch,
              accountType: textAccountType,
              currency: textCurrency,
              glCode: textGlCode,
              accountNumber: textAccountNumber,
            }),
          }
        );
        if (request.ok) {
          const response = await request.json();
          if (response.success == false) {
            setErrorMessage(response.message);
            setSpinner(false);
          } else {
            setSuccessMessage(response.message);
            setSpinner(false);
          }
        } else {
          setErrorMessage(
            "No response received from server. Please contact administrator!"
          );
          setSpinner(false);
        }
      } catch (error) {
        setErrorMessage(
          error + " Un-expected error occurred. Please contact administrator!"
        );
        setSpinner(false);
      }
    }
  };

  // Clear form function
  const clearForm = () => {
    setTextBank("");
    setTextBranch("");
    setAccountType("");
    setCurrency("");
    setGlCode("");
    setAccountNumber("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl shadow-lg p-6 mb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Register Bank Account</h1>
                <p className="text-blue-100 text-sm mt-1">Add new bank accounts to the system</p>
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

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <form onSubmit={handleRegister}>
            {/* Form Header */}
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                <h2 className="text-lg font-semibold text-gray-800">Bank Account Details</h2>
              </div>
              <p className="text-sm text-gray-600 ml-4">Fill in all required fields to register a new bank account</p>
            </div>

            {/* Form Fields Grid */}
            <div className="space-y-8">
              {/* Row 1: Bank Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Bank Name
                  <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                  </div>
                  <select
                    onChange={(e) => setTextBank(e.target.value)}
                    value={textBank}
                    className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                             hover:border-blue-400 hover:shadow-sm outline-none appearance-none
                             dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                    <option value="">- Select Bank -</option>
                    {bankList.map(element => (
                      <option key={element.bankName} value={element.bankId}>{element.bankName}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Select the bank from the dropdown list</p>
              </div>

              {/* Row 2: Branch and Account Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Bank Branch
                    <span className="text-red-600 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                    </div>
                    <input
                      onChange={(e) => setTextBranch(e.target.value)}
                      placeholder="Enter Bank Branch"
                      required
                      value={textBranch}
                      className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                               hover:border-blue-400 hover:shadow-sm outline-none
                               dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Account Type
                    <span className="text-red-600 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                    </div>
                    <select
                      onChange={(e) => setAccountType(e.target.value)}
                      value={textAccountType}
                      className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                               hover:border-blue-400 hover:shadow-sm outline-none appearance-none">
                      <option value="">- Select Account Type -</option>
                      <option value="1">Current Account</option>
                      <option value="2">Saving Account</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Currency and GL Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Currency
                    <span className="text-red-600 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <select
                      onChange={(e) => setCurrency(e.target.value)}
                      value={textCurrency}
                      className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                               hover:border-blue-400 hover:shadow-sm outline-none appearance-none">
                      <option value="">- Select Currency -</option>
                      <option value="LKR">LKR (Sri Lankan Rupee)</option>
                      <option value="AUD">AUD (Australian Dollar)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="GBP">GBP (British Pound)</option>
                      <option value="SGD">SGD (Singapore Dollar)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    GL Code
                    <span className="text-red-600 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <input
                      onChange={(e) => setGlCode(e.target.value)}
                      placeholder="Enter GL Code"
                      required
                      value={textGlCode}
                      className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                               hover:border-blue-400 hover:shadow-sm outline-none
                               dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Account Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Account Number
                  <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                    </svg>
                  </div>
                  <input
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter Account Number"
                    required
                    value={textAccountNumber}
                    className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                             hover:border-blue-400 hover:shadow-sm outline-none
                             dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <p className="text-xs text-gray-500">Enter the complete bank account number</p>
              </div>

              {/* Messages */}
              {successMessage && (
                <div className="mb-6 animate-slideDown">
                  <SUccessMessage messageValue={successMessage} />
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 animate-slideDown">
                  <ErrorMessage messageValue={errorMessage} />
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button
                    type="button"
                    onClick={clearForm}
                    className="px-6 py-3.5 text-gray-700 bg-white border-2 border-gray-300 
                             rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 
                             transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Clear Form
                  </button>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => onCancel()}
                      type="button"
                      className="px-6 py-3.5 text-gray-700 bg-white border-2 border-gray-300 
                               rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 
                               transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={spinner}
                      className="px-8 py-3.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 
                               rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-3 focus:ring-blue-300 
                               focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                               active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                               disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto">
                      {spinner ? (
                        <>
                          <Spinner size={20} />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>Register Account</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Information Card */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Important Information</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-2"></span>
                  Fields marked with <span className="text-red-600">*</span> are required
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-2"></span>
                  Ensure all information is accurate before submission
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-2"></span>
                  Account will be available for transactions immediately after registration
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}