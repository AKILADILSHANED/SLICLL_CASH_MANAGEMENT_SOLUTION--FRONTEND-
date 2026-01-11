"use client";
import React from "react";
import { useState } from "react";
import Spinner from "@/app/Spinner/page";
import SUccessMessage from "@/app/Messages/SuccessMessage/page";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";

export default function RemoveChannel({ onCancel }) {
  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [channelId, setChannelId] = useState("");
  const [searchSpinner, setSearchSpinner] = useState(false);
  const [deleteSpinner, setDeleteSpinner] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [channelData, setChannelData] = useState({});
  const [channelDataWindow, setChannelDataWindow] = useState(false);

  //Define handleSearch function;
  const handleSearch = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setChannelDataWindow(false);
    setSearchSpinner(true);
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/channel/search-removeChannel?channelId=${channelId}`,
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
          setChannelData(response.responseObject);
          setChannelDataWindow(true);
        }
      } else {
        setErrorMessage(
          "No response from server. Please contact administrator!"
        );
      }
    } catch (error) {
      setErrorMessage(
        "Un-expected error occurred. Please contact administrator!"
      );
    } finally {
      setSearchSpinner(false);
    }
  };

  //Define handleRemove function;
  const handleRemove = async () => {
    if (!window.confirm("Are you sure you want to delete this channel? This action cannot be undone.")) {
      return;
    }
    
    setDeleteSpinner(true);
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/channel/remove-channel?channelId=${channelData.channelId}`,
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
            setSuccessMessage(response.message);
            setChannelDataWindow(false);
            setChannelId("");
        }
      } else {
        setErrorMessage("No response from server. Please contact administrator!");
      }
    } catch (error) {
        setErrorMessage("Un-expected error occurred. Please contact administrator!");
    }finally{
        setDeleteSpinner(false);
    }
  };

  const clearForm = () => {
    setChannelId("");
    setChannelDataWindow(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto animate-fadeIn">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-t-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Remove Transfer Channel
                </h1>
                <p className="text-red-100 text-sm mt-1">
                  Search and remove transfer channels from the system
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
              Clear
            </button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          {/* Search Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Search Channel
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Enter the Channel ID to search for deletion
            </p>
            
            <form onSubmit={handleSearch}>
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel ID
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
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                    </div>
                    <input
                      id="channelId"
                      onChange={(e) => {
                        setChannelId(e.target.value.toUpperCase());
                      }}
                      value={channelId}
                      placeholder="Enter Channel ID (e.g., CH001, CH002)"
                      required
                      className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                               bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 
                               transition-all duration-200 shadow-sm uppercase"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={searchSpinner}
                    className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                             rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                             disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[120px]"
                  >
                    {searchSpinner ? (
                      <>
                        <Spinner size={16} />
                        <span>Searching...</span>
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
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          ></path>
                        </svg>
                        <span>Search</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 
                             rounded-lg hover:from-gray-700 hover:to-gray-800 focus:ring-4 focus:ring-gray-300 
                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                             min-w-[120px]"
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
              </div>
            </form>
          </div>

          {/* Warning Banner */}
          {channelDataWindow && (
            <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4 animate-slideDown">
              <div className="flex items-start">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <svg 
                    className="w-6 h-6 text-red-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-red-800 mb-1">
                    Warning: Channel Deletion
                  </h4>
                  <p className="text-sm text-red-700">
                    You are about to delete a channel. This action will mark the channel as deleted in the system.
                    Please verify the details below before proceeding.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Channel Details Table */}
          {channelDataWindow && (
            <div className="animate-fadeIn">
              <div className="mb-4">
                <h3 className="text-md font-semibold text-gray-800">
                  Channel Found
                </h3>
                <p className="text-sm text-gray-600">
                  Review the channel details before deletion
                </p>
              </div>
              
              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
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
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {channelData.channelType}
                        </h4>
                        <p className="text-sm text-gray-600">
                          ID: {channelData.channelId}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Created on {new Date(channelData.createdDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">Channel ID</p>
                      <p className="text-sm font-semibold text-gray-800">{channelData.channelId}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">Channel Type</p>
                      <p className="text-sm font-semibold text-gray-800">{channelData.channelType}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">Short Key</p>
                      <p className="text-sm font-semibold text-gray-800">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                          {channelData.shortKey}
                        </span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">Priority Level</p>
                      <div className="flex items-center">
                        <div className={`h-2 w-12 rounded-full mr-2 ${
                          channelData.priorityLevel >= 8 ? 'bg-red-500' :
                          channelData.priorityLevel >= 5 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}></div>
                        <span className="text-sm font-semibold text-gray-800">
                          {channelData.priorityLevel}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">Created Date</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(channelData.createdDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">Created By</p>
                      <p className="text-sm font-semibold text-gray-800">{channelData.definedBy}</p>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-end">
                      <button 
                        onClick={handleRemove}
                        disabled={deleteSpinner}
                        className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                                 rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                                 focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                 active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]"
                      >
                        {deleteSpinner ? (
                          <>
                            <Spinner size={16} />
                            <span>Deleting...</span>
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              ></path>
                            </svg>
                            <span>Delete Channel</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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

          {/* Empty State - No search performed */}
          {!channelDataWindow && !channelId && !errorMessage && (
            <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-lg p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-r from-red-100 to-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg 
                    className="w-8 h-8 text-red-600" 
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
                  Search Channel for Deletion
                </h3>
                <p className="text-gray-600 mb-4">
                  Enter a Channel ID above to search and remove a transfer channel.
                </p>
                <p className="text-sm text-gray-500">
                  Deleting a channel will mark it as inactive in the system.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}