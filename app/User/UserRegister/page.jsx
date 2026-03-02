"use client";
import React, { useState } from "react";
import SUccessMessage from "@/app/Messages/SuccessMessage/page";
import ErrorMessage from "@/app/Messages/ErrorMessage/page";
import Spinner from "@/app/Spinner/page";
import { useRouter } from "next/navigation";

export default function UserRegister({ onCancel }) {
  const router = useRouter();

  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define State Variables
  const [userStatus, setUserStatus] = useState("");
  const [userLevel, setUserLevel] = useState("");
  const [userPosition, setUserPosition] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [epf, setEpf] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [signatureImage, setSignatureImage] = useState(null);

  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [loader, setLoader] = useState(false);

  //Define functions
  const handleCancel = () => {
    onCancel();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage("Please select a valid image file");
        return;
      }

      // Validate file size (e.g., 2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("File size should be less than 2MB");
        return;
      }

      setSignatureImage(file);
      setErrorMessage("");
    }
  };

  const resetForm = () => {
    setUserStatus("");
    setUserLevel("");
    setUserPosition("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setEpf("");
    setDepartment("");
    setSection("");
    setSignatureImage(null);
    const fileInput = document.getElementById('signature-image');
    if (fileInput) fileInput.value = '';
  };

  //Define User Register function;
  const userRegister = async (e) => {
    setLoader(true);
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      //Create new form data object;
      const formDataObject = new FormData();
      formDataObject.append('userTitle', userStatus);
      formDataObject.append('userLevel', userLevel);
      formDataObject.append('userFirstName', firstName);
      formDataObject.append('userLastName', lastName);
      formDataObject.append('department', department);
      formDataObject.append('section', section);
      formDataObject.append('userPosition', userPosition);
      formDataObject.append('userEmail', email);
      formDataObject.append('userEpf', epf);
      formDataObject.append('userSignature', signatureImage);

      const request = await fetch(
        `${baseUrl}/api/v1/user/user-register`,
        {
          method: "POST",
          credentials: "include",
          body: formDataObject
        }
      );

      const response = await request.json();
      if (request.status === 200) {
        if (response.success == false) {
          setErrorMessage(response.message);
          setLoader(false);
        } else {
          setSuccessMessage(response.message);
          setLoader(false);
          // Reset form after successful registration
          resetForm();
        }
      } else if (request.status === 403) {
        setErrorMessage(response.message);
      } else if (request.status === 500) {
        setErrorMessage(response.message);
      }
      else {
        setErrorMessage(
          "Un-expected error occurred. Please contact administrator!"
        );
        setLoader(false);
      }
    } catch (error) {
      setErrorMessage(
        "No response received from server!"
      );
      setLoader(false);
    } finally {
      setLoader(false);
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">User Registration</h1>
                <p className="text-blue-100 text-sm mt-1">Register new users for the system</p>
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

        {/* Registration Form Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
          <form onSubmit={(e) => userRegister(e)} encType="multipart/form-data">
            <div className="space-y-8">
              {/* Personal Information Section */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                  <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* User Status */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      User Status
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="relative group">
                      <select
                        onChange={(e) => setUserStatus(e.target.value)}
                        value={userStatus}
                        required
                        className="w-full p-3 pl-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none appearance-none
                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                        <option value="" className="text-gray-400">- Select Status -</option>
                        <option value="Mr." className="py-2">Mr.</option>
                        <option value="Mrs." className="py-2">Mrs.</option>
                        <option value="Miss." className="py-2">Miss.</option>
                        <option value="Prof." className="py-2">Prof.</option>
                        <option value="Doc." className="py-2">Doc.</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <input
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                        placeholder="Enter First Name"
                        required
                        className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none
                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <input
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                        placeholder="Enter Last Name"
                        required
                        className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none
                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Employment Section */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                  <h2 className="text-lg font-semibold text-gray-800">Contact & Employment Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        placeholder="example@slicgeneral.com"
                        required
                        className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none
                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* EPF Number */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      EPF Number
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <input
                        onChange={(e) => setEpf(e.target.value)}
                        value={epf}
                        placeholder="Enter EPF Number"
                        required
                        className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none
                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Role & Department Section */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                  <h2 className="text-lg font-semibold text-gray-800">Role & Department</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* User Level */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      User Level
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="relative group">
                      <select
                        onChange={(e) => setUserLevel(e.target.value)}
                        value={userLevel}
                        required
                        className="w-full p-3 pl-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none appearance-none
                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                        <option value="" className="text-gray-400">- Select User Level -</option>
                        <option value="0" className="py-2">General User</option>
                        <option value="1" className="py-2">Administrator</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* User Position */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      User Position
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="relative group">
                      <select
                        onChange={(e) => setUserPosition(e.target.value)}
                        value={userPosition}
                        required
                        className="w-full p-3 pl-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none appearance-none
                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                        <option value="" className="text-gray-400">- Select User Position -</option>
                        <option value="Administrator" className="py-2">Administrator</option>
                        <option value="Finance Assistant" className="py-2">Finance Assistant</option>
                        <option value="Finance Executive" className="py-2">Finance Executive</option>
                        <option value="Insurance Assistant" className="py-2">Insurance Assistant</option>
                        <option value="Assistant Finance Manager" className="py-2">Assistant Finance Manager</option>
                        <option value="Finance Manager" className="py-2">Finance Manager</option>
                        <option value="Senior Finance Manager" className="py-2">Senior Finance Manager</option>
                        <option value="Assistant General Manager" className="py-2">Assistant General Manager</option>
                        <option value="Deputy General Manager" className="py-2">Deputy General Manager</option>
                        <option value="Chief Financial Officer" className="py-2">Chief Financial Officer</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Department */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Department
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="relative group">
                      <select
                        onChange={(e) => setDepartment(e.target.value)}
                        value={department}
                        required
                        className="w-full p-3 pl-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none appearance-none
                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                        <option value="" className="text-gray-400">- Select Department -</option>
                        <option value="Finance Department" className="py-2">Finance Department</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Section
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="relative group">
                      <select
                        onChange={(e) => setSection(e.target.value)}
                        value={section}
                        required
                        className="w-full p-3 pl-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none appearance-none
                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                        <option value="" className="text-gray-400">- Select Section -</option>
                        <option value="Investment" className="py-2">Investment</option>
                        <option value="Life Payment" className="py-2">Life Payment</option>
                        <option value="Salaries" className="py-2">Salaries</option>
                        <option value="Revenue" className="py-2">Revenue</option>
                        <option value="Tax" className="py-2">Tax</option>
                        <option value="Verification" className="py-2">Verification</option>
                        <option value="Miscellaneous Payments" className="py-2">Miscellaneous Payments</option>
                        <option value="Other" className="py-2">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Signature Image */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Signature Image
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <input
                        onChange={handleFileChange}
                        type="file"
                        id="signature-image"
                        accept="image/*"
                        className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                 hover:border-blue-400 hover:shadow-sm outline-none file:mr-4 file:py-2 file:px-4
                                 file:rounded-full file:border-0 file:text-sm file:font-semibold
                                 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    {signatureImage && (
                      <div className="flex items-center mt-2 text-sm text-green-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="truncate">{signatureImage.name}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Max file size: 2MB, Accepted formats: JPG, PNG, GIF</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => resetForm()}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                             rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 
                             transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg 
                             flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <span>Reset Form</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loader}
                    className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                             rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                             disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                    {loader ? (
                      <>
                        <Spinner size={20} />
                        <span>Registering User...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        <span>Register User</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Messages Section */}
        <div className="mt-6 space-y-3">
          {errorMessage && (
            <div className="animate-slideDown">
              <ErrorMessage messageValue={errorMessage} />
            </div>
          )}
          {successMessage && (
            <div className="animate-slideDown">
              <SUccessMessage messageValue={successMessage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}