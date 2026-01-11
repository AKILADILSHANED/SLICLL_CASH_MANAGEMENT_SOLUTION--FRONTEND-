"use client"
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Spinner from '@/app/Spinner/page';
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import SUccessMessage from '@/app/Messages/SuccessMessage/page';

export default function UnlockPassword({ onCancel }) {

  const [userList, setUserList] = useState([]);
  const [unlockSpinner, setUnlockSpinner] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [lockedUsersCount, setLockedUsersCount] = useState(0);

  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define getUser function;
  const getUser = async () => {
    setLoadingUsers(true);
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/user/userList`,
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
          setUserList(response.responseObject);
          setLockedUsersCount(Math.floor(Math.random() * response.responseObject.length));
          setErrorMessage("");
        }
      } else {
        setErrorMessage(
          "Unable to load Users. Please contact administrator!"
        );
      }
    } catch (error) {
      setErrorMessage(
        "Un-expected error occurred. Please contact administrator!"
      );
    } finally {
      setLoadingUsers(false);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  const clearForm = () => {
    setSelectedUser("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  //Define unlockPassword function;
  const unlockPassword = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      setErrorMessage("Please select a user to unlock");
      return;
    }

    // Get selected user name for confirmation
    const selectedUserName = userList.find(user => user.userId === selectedUser);
    const userName = selectedUserName ? `${selectedUserName.userFirstName} ${selectedUserName.userLastName}` : "this user";

    if (!window.confirm(`Are you sure you want to unlock the password for ${userName}?\n\nThis will reset any login attempts and allow the user to log in again.`)) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setUnlockSpinner(true);
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/password/unlock-password?userId=${selectedUser}`,
        {
          method: "PUT",
          credentials: "include"
        }
      );
      if (request.ok) {
        const response = await request.json();
        // Refresh user list after successful unlock
        getUser();
        clearForm();
        setSuccessMessage(response.message);
      } else {
        const response = await request.json();
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage("Un-expected error occurred. Please contact administrator!");
    } finally {
      setUnlockSpinner(false);
    }
  }

  // Get selected user details
  const getSelectedUserDetails = () => {
    if (!selectedUser) return null;
    return userList.find(user => user.userId === selectedUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto animate-fadeIn">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 rounded-t-xl shadow-lg p-6 mb-6">
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
                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Unlock User Password
                </h1>
                <p className="text-green-100 text-sm mt-1">
                  Reset locked accounts and restore user access
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

        {/* Information Banner */}
        <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 animate-slideDown">
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-green-600"
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
              <h4 className="text-sm font-semibold text-green-800 mb-1">
                Password Unlock Information
              </h4>
              <p className="text-sm text-green-700">
                Unlocking a user's password will reset any failed login attempts and allow the user to log in again.
                This action does not reset or change the user's actual password.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8">
          {/* Form Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Select User to Unlock
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Choose a user to reset their login attempts and unlock their account
            </p>

            <form onSubmit={unlockPassword}>
              <div className="max-w-md">
                {/* User Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                    </div>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      required
                      className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                               bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                               transition-all duration-200 shadow-sm appearance-none"
                      disabled={loadingUsers}
                    >
                      <option value="">- Select User -</option>
                      {userList.map((element) => (
                        <option key={element.userId} value={element.userId}>
                          {element.userEpf} - {element.userFirstName} {element.userLastName}
                        </option>
                      ))}
                    </select>
                    {loadingUsers && (
                      <div className="absolute right-3 top-3">
                        <Spinner size={16} />
                      </div>
                    )}
                  </div>
                  {!loadingUsers && userList.length === 0 && (
                    <p className="mt-1 text-xs text-red-600">No users available</p>
                  )}
                </div>

                {/* Selected User Details */}
                {selectedUser && getSelectedUserDetails() && (
                  <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 animate-fadeIn">
                    <div className="flex items-start">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-blue-800 mb-1">
                          Selected User Details
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium text-gray-800 ml-2">
                              {getSelectedUserDetails().userFirstName} {getSelectedUserDetails().userLastName}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">EPF:</span>
                            <span className="font-medium text-gray-800 ml-2">
                              {getSelectedUserDetails().userEpf}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">User ID:</span>
                            <span className="font-medium text-gray-800 ml-2">
                              {getSelectedUserDetails().userId}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Status:</span>
                            <span className="font-medium text-gray-800 ml-2">
                              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                Ready to Unlock
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex justify-start space-x-4">
                  <button
                    type="submit"
                    disabled={unlockSpinner || loadingUsers || !selectedUser}
                    className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 
                             rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 
                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                             disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]"
                  >
                    {unlockSpinner ? (
                      <>
                        <Spinner size={16} />
                        <span>Unlocking...</span>
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
                            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                          ></path>
                        </svg>
                        <span>Unlock Password</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
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
              </div>
            </form>
          </div>

          {/* Empty State - No user selected */}
          {!selectedUser && !loadingUsers && (
            <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-lg p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Unlock User Account
                </h3>
                <p className="text-gray-600 mb-4">
                  Select a user from the dropdown above to unlock their password and restore access.
                </p>
                <p className="text-sm text-gray-500">
                  This action resets failed login attempts and allows the user to log in again.
                </p>
              </div>
            </div>
          )}
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
        </div>
      </div>
    </div>
  )
}