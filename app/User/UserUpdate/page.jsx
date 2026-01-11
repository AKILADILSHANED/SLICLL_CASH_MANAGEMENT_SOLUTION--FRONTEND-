"use client";
import React, { useState, useEffect } from "react";
import Spinner from "@/app/Spinner/page";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";
import SuccessMessage from "@/app/Messages/SuccessMessage/page";
import { useRouter } from "next/navigation";

export default function UpdateUser({ onCancel }) {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // State variables
  const [userId, setUserId] = useState("");
  const [errorMessageStatus, setErrorMessageStatus] = useState(false);
  const [successMessageStatus, setSuccessMessageStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [userDetailsWindow, setUserDetailsWindow] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isModified, setIsModified] = useState(false);

  // User details states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [epf, setEpf] = useState("");
  const [email, setEmail] = useState("");
  const [userLevel, setUserLevel] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [userPosition, setUserPosition] = useState("");
  const [signatureImage, setSignatureImage] = useState(null);
  const [originalData, setOriginalData] = useState({});

  // Track form modifications
  useEffect(() => {
    if (userDetailsWindow) {
      const currentData = { firstName, lastName, epf, email, userPosition };
      const hasChanges = Object.keys(currentData).some(
        key => currentData[key] !== originalData[key]
      ) || signatureImage !== null;
      setIsModified(hasChanges);
    }
  }, [firstName, lastName, epf, email, userPosition, signatureImage, userDetailsWindow]);

  const handleCancel = () => {
    onCancel();
  };

  // Handle search function
  const handleSearch = async () => {
    if (!userId.trim()) {
      setErrorMessageStatus(true);
      setMessage("Please provide a valid User ID!");
      setUserDetailsWindow(false);
      return;
    }

    setLoader(true);
    setErrorMessageStatus(false);
    setSuccessMessageStatus(false);

    try {
      const request = await fetch(
        `${baseUrl}/api/v1/user/user-search?userId=${encodeURIComponent(userId)}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (request.ok) {
        const response = await request.json();
        if (response.success === true) {
          // Set response values
          const userData = response.responseObject;
          setFirstName(userData.userFirstName);
          setLastName(userData.userLastName);
          setEpf(userData.userEpf);
          setEmail(userData.userEmail);
          setActiveStatus(userData.userActiveStatus);
          setUserLevel(userData.userLevel);
          setCreatedDate(userData.userCreatedDate);
          setCreatedBy(userData.userCreateBy);
          setUserPosition(userData.userPosition || "");

          // Store original data for change detection
          setOriginalData({
            firstName: userData.userFirstName,
            lastName: userData.userLastName,
            epf: userData.userEpf,
            email: userData.userEmail,
            userPosition: userData.userPosition || ""
          });

          setUserDetailsWindow(true);
          setImagePreview(null);
          setSignatureImage(null);
          setIsModified(false);
        } else {
          setErrorMessageStatus(true);
          setMessage(response.message);
          setUserDetailsWindow(false);
        }
      } else {
        if (request.status === 403) {
          router.push("/AccessDenied");
        } else {
          setErrorMessageStatus(true);
          setMessage("Server error. Please try again or contact administrator.");
          setUserDetailsWindow(false);
        }
      }
    } catch (error) {
      setErrorMessageStatus(true);
      setMessage("Network error. Please check your connection and try again.");
      setUserDetailsWindow(false);
    } finally {
      setLoader(false);
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage("Please select a valid image file (JPEG, PNG, etc.)");
        return;
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("File size should be less than 2MB");
        return;
      }

      setSignatureImage(file);
      setErrorMessage("");

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle user update
  const handleUserUpdate = async () => {
    if (!isModified) {
      setErrorMessageStatus(true);
      setMessage("No changes detected. Please modify at least one field before updating.");
      return;
    }

    setUpdateLoader(true);
    setErrorMessageStatus(false);
    setSuccessMessageStatus(false);

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("userFirstName", firstName);
      formData.append("userLastName", lastName);
      formData.append("userEpf", epf);
      formData.append("userEmail", email);
      formData.append("userPosition", userPosition);

      if (signatureImage !== null) {
        formData.append("userSignature", signatureImage);
      }

      const request = await fetch(
        `${baseUrl}/api/v1/user/user-update`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      if (request.ok) {
        const response = await request.json();
        if (response.success === true) {
          setSuccessMessageStatus(true);
          setMessage(response.message);
          // Update original data after successful update
          setOriginalData({ firstName, lastName, epf, email, userPosition });
          setIsModified(false);

          // Auto-hide success message after 5 seconds
          setTimeout(() => {
            setSuccessMessageStatus(false);
          }, 5000);
        } else {
          setErrorMessageStatus(true);
          setMessage(response.message);
        }
      } else {
        setErrorMessageStatus(true);
        setMessage("Unable to update user at this moment. Please contact administrator.");
      }
    } catch (error) {
      setErrorMessageStatus(true);
      setMessage("Network error. Please check your connection and try again.");
    } finally {
      setUpdateLoader(false);
      setSignatureImage(null);
      setImagePreview(null);
      // Clear file input
      const fileInput = document.getElementById('signature-image');
      if (fileInput) fileInput.value = '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setUserId("");
    setUserDetailsWindow(false);
    setErrorMessageStatus(false);
    setSuccessMessageStatus(false);
    setImagePreview(null);
    setSignatureImage(null);
    setIsModified(false);
  };

  const resetForm = () => {
    if (originalData) {
      setFirstName(originalData.firstName || "");
      setLastName(originalData.lastName || "");
      setEpf(originalData.epf || "");
      setEmail(originalData.email || "");
      setUserPosition(originalData.userPosition || "");
      setSignatureImage(null);
      setImagePreview(null);
      setErrorMessage("");
      setIsModified(false);

      // Clear file input
      const fileInput = document.getElementById('signature-image');
      if (fileInput) fileInput.value = '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getUserLevelText = (level) => {
    return level === "1" ? "Administrator" : level === "0" ? "General User" : level || "N/A";
  };

  const getUserLevelBadge = (level) => {
    const isAdmin = level === "1" || level?.toLowerCase() === "administrator";
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isAdmin
          ? 'bg-red-100 text-red-800'
          : 'bg-green-100 text-green-800'
        }`}>
        {getUserLevelText(level)}
      </span>
    );
  };

  const getUserStatusBadge = (status) => {
    const isActive = status?.toString().toLowerCase() === "active" || status === "1";
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
        }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto animate-fadeIn">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl shadow-lg p-6 mb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Update User</h1>
                <p className="text-blue-100 text-sm mt-1">Search and update user information</p>
              </div>
            </div>
            {onCancel && (
              <button
                onClick={() => handleCancel()}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span>Close</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Form Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search User by ID
                <span className="text-red-600 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  type="text"
                  placeholder="Enter User ID (e.g., USR-01)"
                  className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                           hover:border-blue-400 hover:shadow-sm outline-none
                           dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                {userId && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label="Clear search">
                    <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">Enter User ID to search for user details</p>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loader || !userId.trim()}
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

        {/* User Update Form */}
        {userDetailsWindow && (
          <div className="mt-8 animate-fadeIn">
            {/* Summary Header */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-t-xl p-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Update User Details</h2>
                    <p className="text-sm text-gray-600">User ID: {userId} • {firstName} {lastName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Status:</span>
                    {getUserStatusBadge(activeStatus)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Level:</span>
                    {getUserLevelBadge(userLevel)}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Container */}
            <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg p-6 md:p-8">
              <div className="space-y-8">
                {/* Personal Information Section */}
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        First Name
                        <span className="text-red-600 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none
                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Last Name
                        <span className="text-red-600 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none
                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        EPF Number
                        <span className="text-red-600 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={epf}
                        onChange={(e) => setEpf(e.target.value)}
                        className="w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none
                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Email Address
                        <span className="text-red-600 ml-1">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none
                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Work Information Section */}
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Work Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        User Position
                        <span className="text-red-600 ml-1">*</span>
                      </label>
                      <select
                        value={userPosition}
                        onChange={(e) => setUserPosition(e.target.value)}
                        className="w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none"
                      >
                        <option value="">- Select Position -</option>
                        <option value="Finance Assistant">Finance Assistant</option>
                        <option value="Finance Executive">Finance Executive</option>
                        <option value="Insurance Assistant">Insurance Assistant</option>
                        <option value="Assistant Finance Manager">Assistant Finance Manager</option>
                        <option value="Finance Manager">Finance Manager</option>
                        <option value="Senior Finance Manager">Senior Finance Manager</option>
                        <option value="Assistant General Manager">Assistant General Manager</option>
                        <option value="Deputy General Manager">Deputy General Manager</option>
                        <option value="Chief Financial Officer">Chief Financial Officer</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        User Level
                      </label>
                      <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{getUserLevelText(userLevel)}</span>
                          {getUserLevelBadge(userLevel)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signature Update Section */}
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Signature Update</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Signature Image (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id="signature-image"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                   hover:border-blue-400 hover:shadow-sm outline-none file:mr-4 file:py-2 file:px-4
                                   file:rounded-full file:border-0 file:text-sm file:font-semibold
                                   file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Max file size: 2MB • Supported: JPG, PNG, GIF</p>
                      {errorMessage && (
                        <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
                      )}
                    </div>

                    {imagePreview && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Preview
                        </label>
                        <div className="h-32 bg-gray-50 border border-gray-300 rounded-lg p-4 flex items-center justify-center">
                          <img
                            src={imagePreview}
                            alt="Signature preview"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <p className="text-xs text-green-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          New signature image selected
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Information Section */}
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Account Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Account Status</div>
                      <div className="flex items-center">
                        {getUserStatusBadge(activeStatus)}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Created Date</div>
                      <div className="text-sm font-medium text-gray-900">{formatDate(createdDate)}</div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Created By</div>
                      <div className="text-sm font-medium text-gray-900">{createdBy || "System"}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-8 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center space-x-3">
                      {isModified && (
                        <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                          </svg>
                          <span className="text-sm font-medium">Unsaved Changes</span>
                        </div>
                      )}
                    </div>
                    {/* Error Message */}
                    {errorMessageStatus && (
                      <div className="mt-6 animate-slideDown">
                        <ErrorMessage messageValue={message} />
                      </div>
                    )}

                    {/* Success Message */}
                    {successMessageStatus && (
                      <div className="mt-6 animate-slideDown">
                        <SuccessMessage messageValue={message} />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={resetForm}
                        disabled={!isModified}
                        className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${isModified
                            ? 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300'
                            : 'text-gray-400 bg-gray-50 cursor-not-allowed'
                          }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        <span>Reset Changes</span>
                      </button>

                      <button
                        type="button"
                        onClick={clearSearch}
                        className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                                 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 
                                 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <span>Search Another</span>
                      </button>

                      <button
                        onClick={handleUserUpdate}
                        disabled={updateLoader || !isModified}
                        className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 
                                 rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 
                                 focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                 active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                        {updateLoader ? (
                          <>
                            <Spinner size={20} />
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span>Update User</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {!userDetailsWindow && userId && !errorMessageStatus && (
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