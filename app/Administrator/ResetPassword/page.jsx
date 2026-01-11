"use client"
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Spinner from '@/app/Spinner/page';
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import SUccessMessage from '@/app/Messages/SuccessMessage/page';

export default function ResetPassword({ onCancel }) {

  const [userList, setUserList] = useState([]);
  const [resetSpinner, setResetSpinner] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersNeedingReset, setUsersNeedingReset] = useState(0);
  const [temporaryPassword, setTemporaryPassword] = useState("");

  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define getUser function;
  const getUser = async () => {
    setLoadingUsers(true);
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/user/userList-password-reset`,
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
          setUsersNeedingReset(response.responseObject.length);
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
    setTemporaryPassword("");
  };

  //Define resetPassword function;
  const resetPassword = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) {
      setErrorMessage("Please select a user to reset password");
      return;
    }

    // Get selected user details for confirmation
    const selectedUserDetails = userList.find(user => user.userId === selectedUser);
    const userName = selectedUserDetails ? `${selectedUserDetails.firstName} ${selectedUserDetails.lastName}` : "this user";
    
    if (!window.confirm(`Are you sure you want to reset the password for ${userName}?\n\n⚠️ This will generate a new temporary password and email it to the user. The user will need to change it on first login.`)) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setTemporaryPassword("");
    setResetSpinner(true);
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/password/reset-password?userId=${selectedUser}`,
        {
          method: "PUT",
          credentials: "include"
        }
      );
      if (request.ok) {
        const response = await request.json();
        setSuccessMessage(response.message);
        // Extract temporary password from response if available
        if (response.temporaryPassword) {
          setTemporaryPassword(response.temporaryPassword);
        }
        // Refresh user list after successful reset
        getUser();
        // Don't clear selected user - keep it for reference
      } else {
        const response = await request.json();
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage("Un-expected error occurred. Please contact administrator!");
    } finally {
      setResetSpinner(false);
    }
  }

  // Get selected user details
  const getSelectedUserDetails = () => {
    if (!selectedUser) return null;
    return userList.find(user => user.userId === selectedUser);
  };

  // Generate a temporary password display (for demonstration)
  const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto animate-fadeIn">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-t-xl shadow-lg p-6 mb-6">
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
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  ></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Reset User Password
                </h1>
                <p className="text-red-100 text-sm mt-1">
                  Generate new temporary passwords for users
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

        {/* Warning Banner */}
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
                Important: Password Reset Process
              </h4>
              <p className="text-sm text-red-700">
                Resetting a user's password will generate a new temporary password and email it to the user.
                The user will be forced to change this temporary password on their next login.
              </p>
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
              Select User to Reset Password
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Choose a user to generate a new temporary password
            </p>
            
            <form onSubmit={resetPassword}>
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
                          {element.epf} - {element.firstName} {element.lastName} ({element.email})
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
                    <p className="mt-1 text-xs text-green-600">All user passwords are up to date</p>
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
                              {getSelectedUserDetails().firstName} {getSelectedUserDetails().lastName}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">EPF:</span>
                            <span className="font-medium text-gray-800 ml-2">
                              {getSelectedUserDetails().epf}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium text-gray-800 ml-2">
                              {getSelectedUserDetails().email}
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
                                Ready for Reset
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Temporary Password Display */}
                {temporaryPassword && (
                  <div className="mt-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 animate-fadeIn">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <svg 
                          className="w-5 h-5 text-green-600" 
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
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-green-800 mb-2">
                          New Temporary Password Generated
                        </h4>
                        <div className="bg-white p-3 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-mono text-gray-800 bg-gray-100 px-3 py-2 rounded">
                                {temporaryPassword}
                              </p>
                              <p className="text-xs text-gray-600 mt-2">
                                This temporary password has been emailed to the user. 
                                They must change it on first login.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => navigator.clipboard.writeText(temporaryPassword)}
                              className="ml-2 px-3 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 
                                       rounded-lg transition-colors duration-200 flex items-center gap-1"
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
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                ></path>
                              </svg>
                              Copy
                            </button>
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
                    disabled={resetSpinner || loadingUsers || !selectedUser}
                    className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                             rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                             disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]"
                  >
                    {resetSpinner ? (
                      <>
                        <Spinner size={16} />
                        <span>Resetting...</span>
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
                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                          ></path>
                        </svg>
                        <span>Reset Password</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 
                             rounded-lg hover:from-gray-700 hover:to-gray-800 focus:ring-4 focus:ring-gray-300 
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
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Reset User Password
                </h3>
                <p className="text-gray-600 mb-4">
                  Select a user from the dropdown above to generate a new temporary password.
                </p>
                <p className="text-sm text-gray-500">
                  The new password will be emailed to the user and they will be required to change it on first login.
                </p>
              </div>
            </div>
          )}

          {/* Success Information */}
          {successMessage && !temporaryPassword && (
            <div className="mt-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 animate-slideDown">
              <div className="flex items-center">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-green-800 mb-1">
                    Password Successfully Reset
                  </h4>
                  <p className="text-sm text-green-700">
                    A new temporary password has been generated and emailed to the user.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}