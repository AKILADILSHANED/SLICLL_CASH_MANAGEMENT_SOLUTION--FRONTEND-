"use client"
import React, { useEffect } from 'react'
import Spinner from '@/app/Spinner/page';
import { useState } from 'react';
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import SUccessMessage from '@/app/Messages/SuccessMessage/page';

export default function CreateNewRepo({ onCancel }) {

  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [saveSpinner, setSaveSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [bankAccountList, setBankAccountList] = useState([]);
  const [accountNumber, setAccountNumber] = useState("");
  const [repoType, setRepoType] = useState("");
  const [repoValue, setRepoValue] = useState("");
  const [eligibility, setEligibility] = useState("0");

  //Define getBankAccount function;
  const getBankAccount = async () => {
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/bank-account/getBankAccounts`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const response = await request.json();
      if (request.status === 200) {
        setBankAccountList(response.responseObject);       
      } else {
        setErrorMessage(
          response.message
        );
      }
    } catch (error) {
      setErrorMessage(
        "Response not received from server. Please contact administrator!"
      );
    }
  };

  useEffect(() => {
    getBankAccount();
  }, []);

  //define handleKeyDown function; This will be restricted typing minus values in the text box;
  const handleKeyDown = (e) => {
    if (e.key === "-") {
      e.preventDefault();
    } else {
      //No code block to be run;
    }
  }

  //Define handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaveSpinner(true);
      setErrorMessage(false);
      setSuccessMessage(false);

      const request = await fetch(
        `${baseUrl}/api/v1/repo/create-new-repo`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(
            {
              accountID: accountNumber,
              repoType: repoType,
              repoValue: repoValue,
              eligibility: eligibility
            }
          )
        }
      );
      const response = await request.json();
      if (request.status !== 200) {        
        setErrorMessage(response.message);
      } else {
        setSuccessMessage(response.message);
      }
    } catch (error) {
      setErrorMessage("Response not received from server. Please contact administrator!");
    } finally {
      setSaveSpinner(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto animate-fadeIn">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl shadow-lg p-6 mb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Create New REPO Investment</h1>
                <p className="text-blue-100 text-sm mt-1">Set up a new repo investment account</p>
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

        {/* Form Card */}
        <div className="bg-white rounded-b-xl shadow-xl border border-gray-200 p-6 md:p-8">
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="space-y-8">
              {/* Account Information Section */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                  <h2 className="text-lg font-semibold text-gray-800">Account Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bank Account Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Account Number
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="relative group">
                      <select
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                        className="w-full p-3 pl-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                         hover:border-blue-400 hover:shadow-sm outline-none appearance-none
                                                         dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                        <option value="" className="text-gray-400">- Select Account Number -</option>
                        {
                          bankAccountList.map((element) => (
                            <option
                              key={element.accountId}
                              value={element.accountId}
                              className="py-2">
                              {element.accountNumber}
                            </option>
                          ))
                        }
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Repo Type Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Repo Type
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="relative group">
                      <select
                        onChange={(e) => setRepoType(e.target.value)}
                        required
                        className="w-full p-3 pl-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                         hover:border-blue-400 hover:shadow-sm outline-none appearance-none
                                                         dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                        <option value="" className="text-gray-400">- Select Repo Type -</option>
                        <option value={1} className="py-2">PAR</option>
                        <option value={2} className="py-2">NON-PAR</option>
                        <option value={3} className="py-2">TR</option>
                        <option value={4} className="py-2">Excess</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Value Information Section */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                  <h2 className="text-lg font-semibold text-gray-800">Investment Values</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Repo Value Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Repo Value
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">Rs.</span>
                      </div>
                      <input
                        type="number"
                        onChange={(e) => setRepoValue(e.target.value)}
                        value={repoValue}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter Repo Value"
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-10 p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                         hover:border-blue-400 hover:shadow-sm outline-none
                                                         dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Enter the repo investment amount</p>
                  </div>

                  {/* Investment Value Field (Auto-calculated) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Investment Value (Auto-calculated)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">Rs.</span>
                      </div>
                      <input
                        value={repoValue}
                        disabled
                        type="number"
                        className="w-full pl-10 p-3 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg 
                                                         cursor-not-allowed opacity-70
                                                         dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Mirrors the repo value for reference</p>
                  </div>
                </div>
              </div>

              {/* Eligibility Section */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                  <h2 className="text-lg font-semibold text-gray-800">Transfer Eligibility</h2>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 transition-all duration-300 hover:shadow-sm">
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    Please confirm whether this REPO is eligible to initiate fund transfers for other bank accounts
                    when existing funds are insufficient for daily payments.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="radio"
                          onChange={(e) => setEligibility(e.target.value)}
                          name="transferEligibility"
                          value={1}
                          checked={eligibility === "1"}
                          required
                          className="sr-only peer"
                          id="eligible"
                        />
                        <label
                          htmlFor="eligible"
                          className="flex items-center p-4 cursor-pointer bg-white border-2 border-gray-200 rounded-lg 
                                                             hover:border-blue-400 transition-all duration-200
                                                             peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:shadow-sm">
                          <div className="w-5 h-5 border-2 border-blue-500 rounded-full mr-3 flex items-center justify-center 
                                                                 peer-checked:bg-blue-500 transition-all duration-200">
                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Eligible</span>
                            <p className="text-xs text-gray-500 mt-1">Can be used for fund transfers</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="radio"
                          onChange={(e) => setEligibility(e.target.value)}
                          name="transferEligibility"
                          value={0}
                          required
                          checked={eligibility === "0"}
                          className="sr-only peer"
                          id="notEligible"
                        />
                        <label
                          htmlFor="notEligible"
                          className="flex items-center p-4 cursor-pointer bg-white border-2 border-gray-200 rounded-lg 
                                                             hover:border-red-400 transition-all duration-200
                                                             peer-checked:border-red-500 peer-checked:bg-red-50 peer-checked:shadow-sm">
                          <div className="w-5 h-5 border-2 border-red-500 rounded-full mr-3 flex items-center justify-center 
                                                                 peer-checked:bg-red-500 transition-all duration-200">
                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Not Eligible</span>
                            <p className="text-xs text-gray-500 mt-1">Cannot be used for transfers</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => onCancel()}
                    className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                                                 rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                                                 focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                 active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>Cancel</span>
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                                 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                                                 focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                 active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={saveSpinner}>
                    {saveSpinner ? (
                      <>
                        <Spinner size={20} />
                        <span>Creating REPO...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                        </svg>
                        <span>Create REPO Investment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}