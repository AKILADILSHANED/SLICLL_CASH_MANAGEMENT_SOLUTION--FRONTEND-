"use client"
import React, { useState } from 'react'
import Spinner from '@/app/Spinner/page';
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import { useEffect } from 'react';
import SUccessMessage from '@/app/Messages/SuccessMessage/page';

export default function GrantAuthority({ onCancel }) {
    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables;
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedModule, setSelectedModule] = useState("");
    const [searchSpinner, setSearchSpinner] = useState(false);
    const [revokeSpinner, setRevokeSpinner] = useState(false);
    const [userList, setUserList] = useState([]);
    const [moduleList, setModuleList] = useState([]);
    const [errorMessage, setErrorMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [availableFunctionList, setAvailableFunctionList] = useState([]);
    const [functionTable, setFunctionTable] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingModules, setLoadingModules] = useState(true);
    const [revokingId, setRevokingId] = useState(null);

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


    //Define getModules function;
    const getModules = async () => {
        setLoadingModules(true);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/module/getModuleList`,
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
                    setModuleList(response.responseObject);
                }
            } else {
                setErrorMessage(
                    "Unable to load Modules. Please contact administrator!"
                );
            }
        } catch (error) {
            setErrorMessage(
                "Un-expected error occurred. Please contact administrator!"
            );
        } finally {
            setLoadingModules(false);
        }
    };
    useEffect(() => {
        getModules();
    }, []);

    const clearForm = () => {
        setSelectedUser("");
        setSelectedModule("");
        setFunctionTable(false);
        setErrorMessage(false);
        setSuccessMessage(false);
        setAvailableFunctionList([]);
        setRevokingId(null);
    };

    //Define getAllSubFunctions function;
    const getAllSubFunctions = async (e) => {
        e.preventDefault();
        try {
            setSearchSpinner(true);
            setErrorMessage(false);
            setSuccessMessage(false);
            setFunctionTable(false);
            setRevokingId(null);
            const request = await fetch(
                `${baseUrl}/api/v1/module/getFunctionsForRevoke?userId=${selectedUser}&moduleId=${selectedModule}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (!request.ok) {
                const response = await request.json();
                setErrorMessage(response.message);
            } else {
                const response = await request.json();
                setAvailableFunctionList(response.responseObject)
                setFunctionTable(true);
            }
        } catch (Error) {
            setErrorMessage("Un-expected error occurred. Please contact administrator!");
        } finally {
            setSearchSpinner(false);
        }
    }

    //Define functionRevoking function;
    const functionRevoking = async (userId, functionId, functionName, userName) => {
        if (!window.confirm(`Are you sure you want to revoke the function "${functionName}" from ${userName}?\n\nThis will immediately remove the user's access to this functionality.`)) {
            return;
        }

        try {
            setRevokingId(functionId);
            setRevokeSpinner(true);
            setErrorMessage(false);
            setSuccessMessage(false);
            const request = await fetch(
                `${baseUrl}/api/v1/userFunction/revokeFunction`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: userId,
                        functionId: functionId,
                    }),
                },
            );
            if (!request.ok) {
                const response = await request.json();
                setErrorMessage(response.message);
                setFunctionTable(false);
            } else {
                const response = await request.json();
                setSuccessMessage(response.message);
                // Remove the revoked function from the list
                setAvailableFunctionList(prev => prev.filter(func => func.functionId !== functionId));
                if (availableFunctionList.length === 1) {
                    setFunctionTable(false);
                }
            }
        } catch (Error) {
            setErrorMessage("Un-expected error occurred. Please contact administrator!");
        } finally {
            setRevokeSpinner(false);
            setRevokingId(null);
        }
    }

    // Get selected user name
    const getSelectedUserName = () => {
        if (!selectedUser) return "";
        const user = userList.find(u => u.userId === selectedUser);
        return user ? `${user.userFirstName} ${user.userLastName}` : "";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto animate-fadeIn">
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
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Revoke Authority from Users
                                </h1>
                                <p className="text-red-100 text-sm mt-1">
                                    Remove system access permissions from users
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
                            Clear Form
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
                                Important: Revocation Process
                            </h4>
                            <p className="text-sm text-red-700">
                                Revoking authority will immediately remove the user's access to the selected functions.
                                This action may affect the user's ability to perform their duties. Please verify before proceeding.
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
                            Select User and Module
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Choose a user and module to view currently granted functions for revocation
                        </p>
                        
                        <form onSubmit={getAllSubFunctions}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                                {/* Module Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Module
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
                                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <select
                                            value={selectedModule}
                                            onChange={(e) => setSelectedModule(e.target.value)}
                                            required
                                            className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                                                     bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                                     transition-all duration-200 shadow-sm appearance-none"
                                            disabled={loadingModules}
                                        >
                                            <option value="">- Select Module -</option>
                                            {moduleList.map((element) => (
                                                <option key={element.moduleId} value={element.moduleId}>
                                                    {element.moduleId} - {element.moduleName}
                                                </option>
                                            ))}
                                        </select>
                                        {loadingModules && (
                                            <div className="absolute right-3 top-3">
                                                <Spinner size={16} />
                                            </div>
                                        )}
                                    </div>
                                    {!loadingModules && moduleList.length === 0 && (
                                        <p className="mt-1 text-xs text-red-600">No modules available</p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex justify-center space-x-4">
                                <button
                                    type="submit"
                                    disabled={searchSpinner || loadingUsers || loadingModules || !selectedUser || !selectedModule}
                                    className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                             rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                             disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]"
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
                                            <span>Search Functions</span>
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
                        </form>
                    </div>

                    {/* Functions Table */}
                    {functionTable && availableFunctionList.length > 0 && (
                        <div className="animate-fadeIn">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Currently Granted Functions
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Select functions to revoke from {getSelectedUserName()}
                                    </p>
                                </div>
                                <div className="text-sm text-gray-600 mt-2 md:mt-0">
                                    <span className="font-semibold">{availableFunctionList.length}</span> active functions
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-lg border border-red-200 shadow-sm">
                                <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200">
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
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            ></path>
                                        </svg>
                                        <h4 className="font-semibold text-red-800">
                                            Functions Currently Granted to {getSelectedUserName()}
                                        </h4>
                                    </div>
                                </div>
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-gray-50 to-red-50 border-b border-gray-200">
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Function Details
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Module
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Function Name
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {availableFunctionList.map((element, index) => (
                                                <tr 
                                                    key={element.functionId}
                                                    className="hover:bg-gray-50 transition-colors duration-150"
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                ID: {element.functionId}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                Currently active
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                                                <svg 
                                                                    className="w-4 h-4 text-purple-600" 
                                                                    fill="none" 
                                                                    stroke="currentColor" 
                                                                    viewBox="0 0 24 24" 
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path 
                                                                        strokeLinecap="round" 
                                                                        strokeLinejoin="round" 
                                                                        strokeWidth="2" 
                                                                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                                                    ></path>
                                                                </svg>
                                                            </div>
                                                            <span className="text-sm text-gray-900">
                                                                {element.moduleName}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 font-medium">
                                                            {element.functionName}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            Granted
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => functionRevoking(selectedUser, element.functionId, element.functionName, getSelectedUserName())}
                                                            disabled={revokeSpinner && revokingId === element.functionId}
                                                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                                                                     rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                                                                     focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                                     active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                                     disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[120px]"
                                                        >
                                                            {revokeSpinner && revokingId === element.functionId ? (
                                                                <>
                                                                    <Spinner size={16} />
                                                                    <span>Revoking...</span>
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
                                                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                                        ></path>
                                                                    </svg>
                                                                    <span>Revoke Access</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Empty State - No functions found */}
                    {functionTable && availableFunctionList.length === 0 && (
                        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl shadow-lg p-8 text-center animate-fadeIn">
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
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    No Granted Functions
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    The selected user has no granted functions for the chosen module.
                                </p>
                                <p className="text-sm text-gray-500">
                                    All functions have been revoked or were never granted for this module.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Empty State - No search performed */}
                    {!functionTable && (
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
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Revoke User Authority
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Select a user and module above to view currently granted functions for revocation.
                                </p>
                                <p className="text-sm text-gray-500">
                                    Revoking authority removes users' access to specific system functions within selected modules.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}