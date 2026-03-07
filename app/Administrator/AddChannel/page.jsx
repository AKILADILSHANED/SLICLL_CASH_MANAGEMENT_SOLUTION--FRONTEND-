"use client"
import ErrorMessage from "@/app/Messages/ErrorMessage/page";
import SUccessMessage from "@/app/Messages/SuccessMessage/page";
import Spinner from "@/app/Spinner/page";
import React, { useState } from "react";

export default function AddChannel({ onCancel }) {
  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [saveSpinner, setSaveSpinner] = useState(false);

  const [channelType, setChannelType] = useState("");
  const [shortKey, setShortKey] = useState("");
  const [priorityLevel, setPriorityLevel] = useState("");

  //Define handleSave function;
  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    try {
      setSaveSpinner(true);
      const request = await fetch(`${baseUrl}/api/v1/channel/add-channel`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelType: channelType,
          shortKey: shortKey,
          priorityLevel: priorityLevel,
        }),
      });
      const response = await request.json();
      if (request.status === 200) {
        setSuccessMessage(response.message);
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      } else {
        setErrorMessage(
          response.message
        );
      }
    } catch (error) {
      setErrorMessage(
        "No response from server. Please contact administrator!"
      );
    } finally {
      setSaveSpinner(false);
    }
  };

  const clearForm = () => {
    setChannelType("");
    setShortKey("");
    setPriorityLevel("");
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto animate-fadeIn">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-red-700 rounded-t-xl shadow-lg p-6 mb-0">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Add New Transfer Channel
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  Register new transfer channels with priority levels
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Channel Information
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Enter channel details to register a new transfer method
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={clearForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 
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
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                Clear Form
              </button>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Channel Type Input */}
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
                  <input
                    id="channelType"
                    value={channelType}
                    onChange={(e) => setChannelType(e.target.value)}
                    placeholder="Enter Channel Type (e.g., IBT, CEFT, RTGS, CHEQUE)"
                    required
                    className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                             bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             transition-all duration-200 shadow-sm"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  The name of the transfer channel
                </p>
              </div>

              {/* Short Key Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Key
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
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    id="shortKey"
                    value={shortKey}
                    onChange={(e) => setShortKey(e.target.value)}
                    placeholder="Enter Short Key (e.g., BFT, CHQ, RTGSFT)"
                    required
                    className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                             bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             transition-all duration-200 shadow-sm"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Abbreviation used for system reference
                </p>
              </div>

              {/* Priority Level Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
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
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    id="priorityLevel"
                    type="number"
                    min="1"
                    max="10"
                    value={priorityLevel}
                    onChange={(e) => setPriorityLevel(e.target.value)}
                    placeholder="Enter Priority Level (1-10)"
                    required
                    className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                             bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             transition-all duration-200 shadow-sm"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Higher number indicates higher priority (1-10)
                </p>
              </div>

              {/* Information Banner */}
              <div className="lg:col-span-2 bg-gradient-to-r from-blue-50 to-red-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
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
                  <div>
                    <h4 className="text-sm font-semibold text-blue-800 mb-1">
                      Channel Registration Information
                    </h4>
                    <p className="text-sm text-blue-700">
                      Transfer channels define how funds are transferred between accounts.
                      Priority level determines the order in which channels are presented to users.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
              <button
                type="submit"
                disabled={saveSpinner}
                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                         rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                         disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]"
              >
                {saveSpinner ? (
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
                    <span>Save Channel</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                         rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                         min-w-[140px]"
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
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mt-6 animate-slideDown">
            <SUccessMessage messageValue={successMessage} />
          </div>
        )}
        {errorMessage && (
          <div className="mt-6 animate-slideDown">
            <ErrorMessage messageValue={errorMessage} />
          </div>
        )}

        {/* Empty State - Form not filled */}
        {!channelType && !shortKey && !priorityLevel && (
          <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-r from-blue-100 to-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Add New Transfer Channel
              </h3>
              <p className="text-gray-600 mb-4">
                Fill in the form above to register a new transfer channel.
              </p>
              <p className="text-sm text-gray-500">
                All fields are required to successfully add a new channel.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}