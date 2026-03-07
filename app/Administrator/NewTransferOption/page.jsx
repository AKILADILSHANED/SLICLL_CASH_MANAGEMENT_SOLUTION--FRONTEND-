"use client";
import React, { useState } from "react";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";
import SUccessMessage from "@/app/Messages/SuccessMessage/page";
import { useEffect } from "react";
import Spinner from "@/app/Spinner/page";

export default function NewTransferOption() {
  //Define State Variables;
  const [fromAccountId, setFromAccountId] = useState("");
  const [channelId, setChannelId] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [fromAccountList, setFromAccountList] = useState([]);
  const [channelList, setChannelList] = useState([]);
  const [viewSpinner, setViewSpinner] = useState(false);
  const [optionSaveSpinner, setOptionSaveSpinner] = useState(false);
  const [optionDetailsTable, setOptionDetailsTable] = useState(false);
  const [optionList, setOptionList] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingChannels, setLoadingChannels] = useState(true);

  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define getBankAccount function;
  const getBankAccount = async () => {
    setLoadingAccounts(true);
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
        setFromAccountList(response.responseObject);
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
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    getBankAccount();
  }, []);

  //Define getChannells function;
  const getChannells = async () => {
    setLoadingChannels(true);
    try {
      const request = await fetch(`${baseUrl}/api/v1/channel/define-options`, {
        method: "GET",
        credentials: "include",
      });
      const response = await request.json();
      if (request.status === 200) {
        setChannelList(response.responseObject);
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
      setLoadingChannels(false);
    }
  };
  useEffect(() => {
    getChannells();
  }, []);

  //Define displayOptionDetails function;
  const displayOptionDetails = async (e) => {
    e.preventDefault();
    setErrorMessage(false);
    setSuccessMessage(false);
    setOptionDetailsTable(false);
    setViewSpinner(true);
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/transferOption/display-options?accountId=${fromAccountId}&channelId=${channelId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const response = await request.json();
      if (request.status === 200) {
        setOptionList(response.responseObject);
        setOptionDetailsTable(true);
        setSelectedRow([]);
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
      setViewSpinner(false);
    }
  };

  //Define handleCheckBox function;
  const handleCheckBox = (
    e,
    existingRowKey,
    fromAccountId,
    toAccountId,
    channelId
  ) => {
    setSelectedRow((prevSelected) => {
      if (!prevSelected.some((item) => item.key == existingRowKey)) {
        return [
          ...prevSelected,
          {
            key: existingRowKey,
            fromAccountId: fromAccountId,
            toAccountId: toAccountId,
            channelId: channelId,
          },
        ];
      } else {
        return prevSelected.filter((item) => item.key !== existingRowKey);
      }
    });
  };

  //Define handleSavingOption function;
  const handleSavingOption = async () => {
    setOptionSaveSpinner(true);
    setErrorMessage(false);
    setSuccessMessage(false);
    if (selectedRow.length == 0) {
      setErrorMessage("Please select at least one option to save!");
      setOptionSaveSpinner(false);
    } else {
      try {
        const savingOptions = selectedRow.map(element => (
          {
            fromAccountId: element.fromAccountId,
            toAccountId: element.toAccountId,
            channelId: element.channelId
          }
        ));
        const request = await fetch(
          `${baseUrl}/api/v1/transferOption/save-transferOptions`,
          {
            method: "POST",
            credentials: "include",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(savingOptions)
          }
        );
        const response = await request.json();
        if (request.status === 200) {
          setSuccessMessage(response.message);
          setOptionDetailsTable(false);
          setFromAccountId("");
          setChannelId("");
          setSelectedRow([]);
        } else {
          setErrorMessage(response.message);
        }
      } catch (error) {
        setErrorMessage("Response not received from server. Please contact administrator!");
      } finally {
        setOptionSaveSpinner(false);
      }
    }
  };

  const clearForm = () => {
    setFromAccountId("");
    setChannelId("");
    setOptionDetailsTable(false);
    setSelectedRow([]);
    setErrorMessage(false);
    setSuccessMessage(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto animate-fadeIn">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-t-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-white/20 p-3 rounded-xl">
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
                  Set New Transfer Option
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  Define transfer options between accounts and channels
                </p>
              </div>
            </div>
            <button
              onClick={clearForm}
              className="px-4 py-2 text-sm font-medium text-white bg-white/20 hover:bg-white/30 
                       rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
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
              Clear Form
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Accounts</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{fromAccountList.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Channels</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{channelList.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Options Found</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {optionDetailsTable ? optionList.length : '0'}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Selected</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{selectedRow.length}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
            </div>
          </div>
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

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8">
          {/* Form Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Select Transfer Parameters
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Choose source account and channel to view available transfer options
            </p>

            <form onSubmit={displayOptionDetails}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* From Account Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Account Number
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
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        ></path>
                      </svg>
                    </div>
                    <select
                      value={fromAccountId}
                      onChange={(e) => setFromAccountId(e.target.value)}
                      required
                      className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                               bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                               transition-all duration-200 shadow-sm appearance-none"
                      disabled={loadingAccounts}
                    >
                      <option value="">- Select Account Number -</option>
                      {fromAccountList.map((element) => (
                        <option key={element.accountId} value={element.accountId}>
                          {element.accountNumber}
                        </option>
                      ))}
                    </select>
                    {loadingAccounts && (
                      <div className="absolute right-3 top-3">
                        <Spinner size={16} />
                      </div>
                    )}
                  </div>
                  {!loadingAccounts && fromAccountList.length === 0 && (
                    <p className="mt-1 text-xs text-red-600">No accounts available</p>
                  )}
                </div>

                {/* Channel Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel Type
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
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        ></path>
                      </svg>
                    </div>
                    <select
                      value={channelId}
                      onChange={(e) => setChannelId(e.target.value)}
                      required
                      className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                               bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                               transition-all duration-200 shadow-sm appearance-none"
                      disabled={loadingChannels}
                    >
                      <option value="">- Select Channel Type -</option>
                      {channelList.map((element) => (
                        <option key={element.channelId} value={element.channelId}>
                          {element.channelType} ({element.shortKey})
                        </option>
                      ))}
                    </select>
                    {loadingChannels && (
                      <div className="absolute right-3 top-3">
                        <Spinner size={16} />
                      </div>
                    )}
                  </div>
                  {!loadingChannels && channelList.length === 0 && (
                    <p className="mt-1 text-xs text-red-600">No channels available</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={viewSpinner || loadingAccounts || loadingChannels}
                  className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                           rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                           focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                           active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                           disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]"
                >
                  {viewSpinner ? (
                    <>
                      <Spinner size={16} />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        ></path>
                      </svg>
                      <span>View Options</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Options Table */}
          {optionDetailsTable && (
            <div className="animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Available Transfer Options
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Select options to enable transfers between accounts
                  </p>
                </div>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">{selectedRow.length}</span> of{" "}
                    <span className="font-semibold">{optionList.length}</span> selected
                  </div>
                  <button
                    onClick={handleSavingOption}
                    disabled={optionSaveSpinner || selectedRow.length === 0}
                    className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 
                             rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 
                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {optionSaveSpinner ? (
                      <>
                        <Spinner size={16} />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
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
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        <span>Save {selectedRow.length} Options</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-12">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  const allRows = optionList.map(element => ({
                                    key: element.fromAccountId + "-" + element.toAccountId,
                                    fromAccountId: element.fromAccountId,
                                    toAccountId: element.toAccountId,
                                    channelId: element.channelId
                                  }));
                                  setSelectedRow(allRows);
                                } else {
                                  setSelectedRow([]);
                                }
                              }}
                              checked={selectedRow.length === optionList.length && optionList.length > 0}
                            />
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          From Account
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          To Account
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Channel
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {optionList.map((element, index) => {
                        const isSelected = selectedRow.some(
                          item => item.key === element.fromAccountId + "-" + element.toAccountId
                        );
                        return (
                          <tr
                            key={element.fromAccountId + "-" + element.toAccountId}
                            className={`transition-colors duration-150 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                onChange={(e) =>
                                  handleCheckBox(
                                    e,
                                    element.fromAccountId + "-" + element.toAccountId,
                                    element.fromAccountId,
                                    element.toAccountId,
                                    element.channelId
                                  )
                                }
                                checked={isSelected}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {element.fromAccountNumber}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {element.fromAccountId}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {element.toAccountNumber}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {element.toAccountId}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
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
                                      d="M13 10V3L4 14h7v7l9-11h-7z"
                                    ></path>
                                  </svg>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {element.channelType}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    ID: {element.channelId}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${isSelected
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                                }`}>
                                {isSelected ? 'Selected' : 'Available'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Empty State for Table */}
                {optionList.length === 0 && (
                  <div className="py-12 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Options Found</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      No transfer options available for the selected account and channel combination.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty State - No selection made */}
          {!optionDetailsTable && (
            <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-lg p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
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
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Set Transfer Options
                </h3>
                <p className="text-gray-600 mb-4">
                  Select a source account and channel above to view available transfer options.
                </p>
                <p className="text-sm text-gray-500">
                  Transfer options define which accounts can send funds to other accounts through specific channels.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}