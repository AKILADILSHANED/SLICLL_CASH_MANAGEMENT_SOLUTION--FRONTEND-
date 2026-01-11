"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";
import SUccessMessage from "@/app/Messages/SuccessMessage/page";
import Spinner from "@/app/Spinner/page";

export default function PriorityLevel({ onCancel }) {
  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define State variables;
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [channelData, setChannelData] = useState([]);
  const [channelDetailsWindow, setChannelDetailsWindow] = useState(false);
  const [newLevel, setNewLevel] = useState("");
  const [newChannelId, setNewChannelId] = useState("");
  const [modalError, setModalError] = useState("");
  const [modal, setModal] = useState(false);
  const [saveSpinner, setSaveSpinner] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadChannelData = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setChannelDetailsWindow(false);
    setLoading(true);
    try {
      const request = await fetch(`${baseUrl}/api/v1/channel/priority-levels`, {
        method: "GET",
        credentials: "include",
      });
      if (request.ok) {
        const response = await request.json();
        if (response.success == false) {
          setErrorMessage(response.message);
        } else {
          setChannelData(response.responseObject);
          setChannelDetailsWindow(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChannelData();
  }, []);

  //Define modal close function;
  const modalClose = () => {
    setModal(false);
    setNewLevel("");
    setModalError("");
  };

  //Define changeLevel function;
  const changeLevel = async (channelId, newLevel) => {
    if (newLevel === "" || newLevel < 1 || newLevel > 10) {
      setModalError("Please provide a valid level between 1 and 10!");
      return;
    }

    try {
      setSaveSpinner(true);
      const request = await fetch(
        `${baseUrl}/api/v1/channel/level-update?channelId=${channelId}&newLevel=${newLevel}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      if (request.ok) {
        const response = await request.json();
        if (response.success == false) {
          setModalError(response.message);
        } else {
          setModal(false);
          setSuccessMessage(response.message);
          loadChannelData();
        }
      } else {
        setModalError(
          "No response from server. Please contact administrator!"
        );
      }
    } catch (error) {
      setModalError(
        "Un-expected error occurred. Please contact administrator!"
      );
    } finally {
      setSaveSpinner(false);
    }
  };

  //Define handleClickChannelId function;
  const handleClickChannelId = (channel) => {
    setNewChannelId(channel.channelId);
    setModal(true);
    setErrorMessage("");
    setSuccessMessage("");
    setModalError("");
    setNewLevel(channel.priorityLevel);
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
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  ></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Set-up Priority Levels
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  Manage and update priority levels for transfer channels
                </p>
              </div>
            </div>
            <button
              onClick={loadChannelData}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                <p className="text-sm font-medium text-gray-600">Priority Range</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {channelData.length > 0 
                    ? `${Math.min(...channelData.map(item => item.priorityLevel))} - ${Math.max(...channelData.map(item => item.priorityLevel))}`
                    : '0-0'}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
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
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Priority Level Management
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Click on any Channel ID to update its priority level
                </p>
              </div>
              <div className="flex items-center space-x-2 mt-2 md:mt-0">
                <div className="text-sm text-gray-600">
                  Priority scale: <span className="font-semibold">1 (Lowest) - 10 (Highest)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading priority levels...</p>
            </div>
          ) : channelDetailsWindow && channelData.length > 0 ? (
            /* Channels Table */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Channel ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Channel Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Short Key
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Priority Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
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
                        <button
                          onClick={() => handleClickChannelId(element)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-2 group"
                        >
                          <div className="bg-blue-100 group-hover:bg-blue-200 p-2 rounded-lg transition-colors">
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              ></path>
                            </svg>
                          </div>
                          {element.channelId}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{element.channelType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {element.shortKey}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                element.priorityLevel >= 8 ? 'bg-red-500' :
                                element.priorityLevel >= 5 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${(element.priorityLevel / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-semibold ${
                            element.priorityLevel >= 8 ? 'text-red-600' :
                            element.priorityLevel >= 5 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {element.priorityLevel}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          element.deletedStatus === "YES" 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {element.deletedStatus === "YES" ? "Deleted" : "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty State */
            <div className="py-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Channels Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                There are no transfer channels available to manage priority levels.
              </p>
            </div>
          )}
        </div>

        {/* Update Priority Modal */}
        {modal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg 
                        className="w-5 h-5 text-white" 
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
                    <h3 className="text-xl font-bold text-white">
                      Update Priority Level
                    </h3>
                  </div>
                  <button
                    onClick={modalClose}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <svg 
                      className="w-6 h-6" 
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
                  </button>
                </div>
                <p className="text-blue-100 text-sm mt-2">
                  Channel ID: <span className="font-semibold">{newChannelId}</span>
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
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
                        Important Information
                      </h4>
                      <p className="text-sm text-blue-700">
                        Changing priority levels will affect transfer processing order across the system.
                        This change takes effect immediately after saving.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Priority Level
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
                        type="number"
                        min="1"
                        max="10"
                        onChange={(e) => setNewLevel(e.target.value)}
                        value={newLevel}
                        className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                                 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                 transition-all duration-200 shadow-sm"
                        placeholder="Enter level (1-10)"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Enter a value between 1 (lowest) and 10 (highest)
                    </p>
                  </div>

                  {modalError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-slideDown">
                      <div className="flex items-center">
                        <svg 
                          className="w-5 h-5 text-red-600 mr-3" 
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
                        <span className="text-sm text-red-700">{modalError}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end space-x-3">
                <button
                  onClick={modalClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 
                           border border-gray-300 rounded-lg transition-all duration-200 
                           focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => changeLevel(newChannelId, newLevel)}
                  disabled={saveSpinner}
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                           rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                           focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                           active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                           disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[100px]"
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
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}