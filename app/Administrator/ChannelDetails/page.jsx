"use client";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";
import React, { useState } from "react";
import { useEffect } from "react";

export default function ChannelDetails() {
  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [errorMessage, setErrorMessage] = useState("");
  const [channelData, setChannelData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //Define getChannelDetails function;
  const getChannelDetails = async () => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/channel/get-channelDetails`,
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getChannelDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto animate-fadeIn">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-red-700 rounded-t-xl shadow-lg p-6 mb-6">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Transfer Channel Details
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  View all registered transfer channels and their properties
                </p>
              </div>
            </div>
            <button
              onClick={getChannelDetails}
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              Refresh Data
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Channels</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{channelData.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Channels</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {channelData.filter(item => item.deletedStatus === "Active").length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Deleted Channels</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {channelData.filter(item => item.deletedStatus === "Deleted").length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Priority Levels</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {[...new Set(channelData.map(item => item.priorityLevel))].length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 animate-slideDown">
            <ErrorMessage messageValue={errorMessage} />
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Channel List
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  All registered transfer channels with their details
                </p>
              </div>
              <div className="flex items-center space-x-2 mt-2 md:mt-0">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{channelData.length}</span> channels
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading channel data...</p>
            </div>
          ) : (
            /* Table Container */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-red-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                        </svg>
                        Channel ID
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Channel Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Short Key
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Delete Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Delete By
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Created By
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {channelData.map((element, index) => (
                    <tr 
                      key={element.channelId}
                      className="hover:bg-gray-50 transition-colors duration-150"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold text-sm">
                              {element.channelId.toString().charAt(0)}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {element.channelId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{element.channelType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {element.shortKey}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-2 w-16 rounded-full mr-2 ${
                            element.priorityLevel >= 8 ? 'bg-red-500' :
                            element.priorityLevel >= 5 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}></div>
                          <span className={`text-sm font-semibold ${
                            element.priorityLevel >= 8 ? 'text-red-600' :
                            element.priorityLevel >= 5 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {element.priorityLevel}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(element.createdDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          element.deletedStatus === "YES" 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {element.deletedStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {element.deleteBy || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {element.definedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Empty State */}
              {channelData.length === 0 && !isLoading && (
                <div className="py-12 text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Channels Found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    No transfer channels have been registered yet. Add new channels to get started.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Table Footer */}
          {channelData.length > 0 && (
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Last updated: {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}