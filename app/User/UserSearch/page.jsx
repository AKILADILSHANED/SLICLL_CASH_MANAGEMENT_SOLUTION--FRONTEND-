"use client"
import React, { useState } from "react";
import Spinner from "@/app/Spinner/page";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";
import { useRouter } from "next/navigation";

export default function SearchUser({ onCancel }) {

  const router = useRouter();

  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const [userId, setUserId] = useState("");
  const [messageStatus, setMessageStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    userFirstName: "",
    userLastName: "",
    userEpf: "",
    userEmail: "",
    userActiveStatus: "",
    userLevel: "",
    userCreatedDate: "",
    userCreateBy: "",
    userPosition: "",
  });
  const [userDetailsWindow, setUserDetailsWindow] = useState(false);

  //Define search function.
  const handleCancel = () => {
    onCancel();
  };

  const handleSearch = async () => {
    setLoader(true);
    setMessageStatus(false);
    setUserDetailsWindow(false);
    if (userId == "") {
      setMessageStatus(true);
      setMessage("Please provide a valid User ID!");
      setUserDetailsWindow(false);
      setLoader(false);
    } else {
      setMessageStatus(false);
      try {
        const request = await fetch(
          `${baseUrl}/api/v1/user/user-search?userId=${encodeURIComponent(
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
          setCurrentUser(response.responseObject);
          setUserDetailsWindow(true);
        } else {
          setMessageStatus(true);
          setMessage(response.message);
        }
      } catch (error) {
        setMessageStatus(true);
        setMessage("Response not received from server!");
      } finally {
        setLoader(false);
      }
    }
  };

  const getUserLevelBadge = (level) => {
    if (level === "Administrator" || level === "1") {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          Administrator
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          General User
        </span>
      );
    }
  };

  const getStatusBadge = (status) => {
    if (status?.toLowerCase() === "active" || status === "1") {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Active
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          Inactive
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto animate-fadeIn">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl shadow-lg p-6 mb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Search User Details</h1>
                <p className="text-blue-100 text-sm mt-1">Find and view user information by User ID</p>
              </div>
            </div>
            <button
              onClick={() => handleCancel()}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Search Form Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by User ID
                <span className="text-red-600 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  onChange={(e) => setUserId(e.target.value)}
                  type="text"
                  required
                  placeholder="Enter User ID (e.g., USR-01)"
                  className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                           hover:border-blue-400 hover:shadow-sm outline-none
                           dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Enter the exact User ID to retrieve user details</p>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loader}
                className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                         rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                         disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]">
                {loader ? (
                  <>
                    <Spinner size={20} />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <span>Search User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {messageStatus && (
          <div className="mt-6 animate-slideDown">
            <ErrorMessage messageValue={message} />
          </div>
        )}

        {/* User Details Card */}
        {userDetailsWindow && (
          <div className="mt-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-t-xl p-5">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">User Details</h2>
                  <p className="text-sm text-gray-600">Information for User ID: {userId}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Profile Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {currentUser.userFirstName} {currentUser.userLastName}
                      </h3>
                      <div className="flex items-center space-x-3 mt-2">
                        {getUserLevelBadge(currentUser.userLevel)}
                        {getStatusBadge(currentUser.userActiveStatus)}
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                          <span>{currentUser.userEmail}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>EPF: {currentUser.userEpf}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Position & Creation Info Card */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">User Position</div>
                      <div className="text-sm font-medium text-gray-800">{currentUser.userPosition}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Created On</div>
                        <div className="text-sm font-medium text-gray-800">{currentUser.userCreatedDate}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Created By</div>
                        <div className="text-sm font-medium text-gray-800">{currentUser.userCreateBy}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Information Grid */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">First Name</div>
                  <div className="text-sm font-semibold text-gray-900">{currentUser.userFirstName}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Last Name</div>
                  <div className="text-sm font-semibold text-gray-900">{currentUser.userLastName}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Email Address</div>
                  <div className="text-sm font-semibold text-gray-900">{currentUser.userEmail}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">EPF Number</div>
                  <div className="text-sm font-semibold text-gray-900">{currentUser.userEpf}</div>
                </div>
              </div>

              {/* Status Information Grid */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-2">Account Status</div>
                  <div className="flex items-center">
                    {getStatusBadge(currentUser.userActiveStatus)}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-2">Access Level</div>
                  <div className="flex items-center">
                    {getUserLevelBadge(currentUser.userLevel)}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-2">Registration Date</div>
                  <div className="text-sm font-semibold text-gray-900">{currentUser.userCreatedDate}</div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    onClick={() => handleCancel()}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                             rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 
                             flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>Close Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {!userDetailsWindow && userId && !messageStatus && (
          <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Search for User Details</h3>
              <p className="text-gray-600 mb-4">
                Enter a User ID above to search for user information.
              </p>
              <p className="text-sm text-gray-500">
                User information will appear here after a successful search.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}