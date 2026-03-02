"use client";
import React from "react";
import Spinner from "@/app/Spinner/page";
import { useState } from "react";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";
import SUccessMessage from "@/app/Messages/SuccessMessage/page";
import Router, { useRouter } from "next/navigation";

export default function UserDelete({ onCancel }) {
  const router = useRouter();

  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [userId, setUserId] = useState("");
  const [errorMessageStatus, setErrorMessageStatus] = useState(false);
  const [successMessageStatus, setSuccessMessageStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [userDetailsWindow, setUserDetailsWindow] = useState(false);

  //Defined states for Updating text fields.
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [epf, setEpf] = useState("");
  const [email, setEmail] = useState("");
  const [userLevel, setUserLevel] = useState("");
  const [userPosition, setUserPosition] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  const handleCancel = () => {
    onCancel();
  };

  //Define search function.
  const handleSearch = async () => {
    setLoader(true);
    setErrorMessageStatus(false);
    setSuccessMessageStatus(false);
    setMessage(false);

    if (userId == "") {
      setErrorMessageStatus(true);
      setMessage("Please provide a valid User ID!");
      setUserDetailsWindow(false);
      setLoader(false);
    } else {
      try {
        const request = await fetch(
          `${baseUrl}/api/v1/user/user-search-for-delete?userId=${encodeURIComponent(
            userId
          )}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        const response = await request.json();
        if (request.status === 200) {
          //Setting response values to text field states.
          setFirstName(response.responseObject.userFirstName);
          setLastName(response.responseObject.userLastName);
          setEpf(response.responseObject.userEpf);
          setEmail(response.responseObject.userEmail);
          setActiveStatus(response.responseObject.userActiveStatus);
          setUserLevel(response.responseObject.userLevel);
          setUserPosition(response.responseObject.userPosition);
          setCreatedDate(response.responseObject.userCreatedDate);
          setCreatedBy(response.responseObject.userCreateBy);
          setUserDetailsWindow(true);
        } else {
          setErrorMessageStatus(true);
          setMessage(response.message);
          setUserDetailsWindow(false);
        }
      } catch (error) {
        setErrorMessageStatus(true);
        setMessage("Response not received from server!");
        setUserDetailsWindow(false);
      } finally {
        setLoader(false);
      }
    }
  };

  //Define Delete function;
  const handleUserDelete = async () => {
    setErrorMessageStatus(false);
    setMessage(false);
    setSuccessMessageStatus(false);
    try {
      setDeleteLoader(true);
      const request = await fetch(
        `${baseUrl}/api/v1/user/user-delete?userId=${encodeURIComponent(
          userId
        )}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      const response = await request.json();
      if (request.status === 200) {
        setSuccessMessageStatus(true);
        setMessage(response.message);
      } else {
        setErrorMessageStatus(true);
        setMessage(response.message);
      }
    } catch (error) {
      setErrorMessageStatus(true);
      setMessage("Response not received from server!");
    } finally {
      setDeleteLoader(false);
    }
  };

  // Handle Enter key press for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear search function
  const clearSearch = () => {
    setUserId("");
    setUserDetailsWindow(false);
    setErrorMessageStatus(false);
    setSuccessMessageStatus(false);
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const isActive = status?.toString().toLowerCase() === "active" || status === "1";
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isActive
        ? 'bg-green-100 text-green-800 border border-green-200'
        : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  // Get user level badge
  const getUserLevelBadge = (level) => {
    const isAdmin = level === "1" || level?.toLowerCase() === "administrator";
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isAdmin
        ? 'bg-red-100 text-red-800 border border-red-200'
        : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
        {isAdmin ? 'Administrator' : 'General User'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-xl shadow-lg overflow-hidden mb-0">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Delete User Account</h1>
                  <p className="text-red-100 text-sm mt-1">Permanently remove user accounts from the system</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8 -mt-2 relative z-10 transition-all duration-300 hover:shadow-xl">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Search User
            </h2>
            <p className="text-sm text-gray-600">Enter the User ID to search for deletion</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  type="text"
                  required
                  placeholder="Enter User ID (e.g., USR-01)"
                  className="pl-12 w-full p-3.5 text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                           hover:border-blue-400 hover:shadow-sm outline-none"
                />
                {userId && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform"
                    aria-label="Clear search">
                    <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSearch}
                disabled={loader || !userId.trim()}
                className="px-6 py-3.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 
                         rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-3 focus:ring-blue-300 
                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]">
                {loader ? (
                  <>
                    <Spinner size={20} />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <span>Search User</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleCancel()}
                className="px-4 py-3.5 text-gray-600 bg-white border-2 border-gray-300 
                         rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 
                         transition-all duration-200 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>

        {/* User Details Card */}
        {userDetailsWindow && (
          <div className="mt-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-t-2xl p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-red-600 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-800">Confirm User Deletion</h2>
                  <p className="text-red-700">Review all details before permanently deleting this account</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-t-0 border-gray-200 rounded-b-2xl shadow-lg p-6 md:p-8">
              {/* User Summary */}
              <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{firstName} {lastName}</h3>
                    <p className="text-sm text-gray-600">User ID: <span className="font-medium">{userId}</span> • Email: <span className="font-medium">{email}</span></p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Account Status</div>
                      {getStatusBadge(activeStatus)}
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">User Level</div>
                      {getUserLevelBadge(userLevel)}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">{firstName}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">{lastName}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">EPF Number</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">{epf}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">{email}</div>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Account Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">User Level</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900">{getUserLevelBadge(userLevel)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">User Position</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">{userPosition}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Account Created</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="text-gray-900 mb-1">{formatDate(createdDate)}</div>
                        <div className="text-sm text-gray-500">By: {createdBy || "System"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Box */}
              <div className="mt-8 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <div>
                    <h4 className="text-lg font-semibold text-red-800">Important Notice</h4>
                    <ul className="mt-2 text-red-700 space-y-2">
                      <li className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 mr-2"></span>
                        This action cannot be undone
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 mr-2"></span>
                        All user data will be permanently deleted
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 mr-2"></span>
                        The user will immediately lose system access
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 
                           rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 
                           transition-all duration-200 flex items-center justify-center gap-2 w-full md:w-auto">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  Search Another User
                </button>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handleCancel()}
                    type="button"
                    className="px-8 py-3.5 text-gray-700 bg-white border-2 border-gray-300 
                             rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 
                             transition-all duration-200 flex items-center justify-center gap-2 flex-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Cancel
                  </button>

                  <button
                    onClick={() => handleUserDelete()}
                    type="submit"
                    disabled={deleteLoader}
                    className="px-8 py-3.5 text-white bg-gradient-to-r from-red-600 to-red-700 
                             rounded-xl hover:from-red-700 hover:to-red-800 focus:ring-3 focus:ring-red-300 
                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                             disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex-1">
                    {deleteLoader ? (
                      <>
                        <Spinner size={20} />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        <span>Permanently Delete User</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Messages */}
        {errorMessageStatus && (
          <div className="mt-6 animate-slideDown">
            <ErrorMessage messageValue={message} />
          </div>
        )}

        {successMessageStatus && (
          <div className="mt-6 animate-slideDown">
            <SUccessMessage messageValue={message} />
          </div>
        )}
        {/* Initial State Message */}
        {!userDetailsWindow && !errorMessageStatus && !successMessageStatus && (
          <div className="mt-12 text-center animate-fadeIn">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 md:p-12 max-w-2xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Search for a User to Delete</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Enter a User ID in the search field above to view user details and proceed with deletion.
              </p>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>This action requires careful review before proceeding</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}