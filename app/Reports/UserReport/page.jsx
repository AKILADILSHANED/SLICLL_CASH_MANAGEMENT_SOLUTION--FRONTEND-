"use client"
import React, { useState } from 'react'
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import { useEffect } from 'react';
import Spinner from '@/app/Spinner/page';

export default function UserReport() {

    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables;
    const [userReport, setUserReport] = useState(false);
    const [userDetails, setUserDetails] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loadingMessage, setloadingMessage] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    //Define getUserData function;
    const getUserData = async () => {
        setUserReport(false);
        setErrorMessage("");
        setloadingMessage(true);
        try {
            const request = await fetch(`${baseUrl}/api/v1/reports/get-user-report`, {
                method: "GET",
                credentials: "include",
            });
            const response = await request.json();
            if (request.status === 200) {
                const users = response.responseObject || [];
                setUserDetails(users);
                setFilteredUsers(users);
                setUserReport(true);
                setTotalUsers(users.length);
                
                // Calculate active users
                const active = users.filter(user => 
                    user.status && user.status.toLowerCase() === 'active'
                ).length;
                setActiveUsers(active);
            } else if (request.status === 409) {
                setErrorMessage(response.message);
            } else {
                setErrorMessage(response.message || "Failed to load user report");
            }
        } catch (error) {
            setErrorMessage("Unexpected error occurred. Please contact administrator!");
        } finally {
            setloadingMessage(false);
        }
    }
    useEffect(() => {
        getUserData();
    }, []);

    // Filter users based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredUsers(userDetails);
            return;
        }
        
        const filtered = userDetails.filter(user => 
            user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.epf?.toString().includes(searchTerm)
        );
        setFilteredUsers(filtered);
    }, [searchTerm, userDetails]);

    const refreshData = () => {
        getUserData();
        setErrorMessage("");
        setSearchTerm("");
    };

    const getStatusBadge = (status) => {
        const statusLower = status?.toLowerCase();
        if (statusLower === 'active') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                    {status}
                </span>
            );
        } else if (statusLower === 'inactive') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                    {status}
                </span>
            );
        } else if (statusLower === 'pending') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                    {status}
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto animate-fadeIn">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-red-700 rounded-t-xl shadow-lg p-6 mb-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
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
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 5.197v-1a6 6 0 00-4.5-5.803"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    User Management Report
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    Overview of all system users and their details
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={refreshData}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
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
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Stats Summary Card */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-800 mb-1">Total Users</p>
                                    <p className="text-3xl font-bold text-blue-900">{totalUsers}</p>
                                </div>
                                <div className="bg-blue-200 p-3 rounded-full">
                                    <svg 
                                        className="w-6 h-6 text-blue-700" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth="2" 
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 5.197v-1a6 6 0 00-4.5-5.803"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-800 mb-1">Active Users</p>
                                    <p className="text-3xl font-bold text-green-900">{activeUsers}</p>
                                </div>
                                <div className="bg-green-200 p-3 rounded-full">
                                    <svg 
                                        className="w-6 h-6 text-green-700" 
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
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-800 mb-1">Inactive Users</p>
                                    <p className="text-3xl font-bold text-red-900">{totalUsers - activeUsers}</p>
                                </div>
                                <div className="bg-red-200 p-3 rounded-full">
                                    <svg 
                                        className="w-6 h-6 text-red-700" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth="2" 
                                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                User Directory
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Search and filter through all registered users in the system
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-semibold">{filteredUsers.length}</span> of <span className="font-semibold">{totalUsers}</span> users
                            </div>
                        </div>
                    </div>

                    <div className="relative mb-6">
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
                            type="text"
                            placeholder="Search users by name, email, department, or EPF..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                                     bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                     transition-all duration-200 shadow-sm"
                        />
                    </div>

                    {/* Information Banner */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 mb-6">
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
                                    User Report Information
                                </h4>
                                <p className="text-sm text-blue-700">
                                    This report displays all registered users in the system. Use the search bar above to filter users by any field.
                                </p>
                            </div>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="mb-6">
                            <ErrorMessage messageValue={errorMessage} />
                        </div>
                    )}

                    {loadingMessage ? (
                        /* Loading State */
                        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                                <Spinner size={40} />
                                <p className="mt-4 text-gray-600">Generating user report...</p>
                            </div>
                        </div>
                    ) : userReport && filteredUsers.length > 0 ? (
                        /* Users Table */
                        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                User ID
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Department
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Position
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                EPF
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Email
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Registered By
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((element) => (
                                            <tr
                                                key={element.userId}
                                                className="bg-white border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                                                        {element.userId}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {element.firstName} {element.lastName}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {element.section}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-900">
                                                        {element.department}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-900">
                                                        {element.position}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-900 font-medium">
                                                        {element.epf}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-900">
                                                        {element.email}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(element.status)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-900">
                                                        {element.registeredBy}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footer */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-gray-600">
                                        Displaying <span className="font-semibold">{filteredUsers.length}</span> user{filteredUsers.length !== 1 ? 's' : ''}
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold">Active:</span> {activeUsers}
                                            <span className="mx-2">•</span>
                                            <span className="font-semibold">Inactive:</span> {totalUsers - activeUsers}
                                        </div>
                                        <button
                                            onClick={refreshData}
                                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 
                                                     rounded-lg transition-all duration-200 flex items-center gap-2"
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
                                            <span>Refresh Data</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : userReport && filteredUsers.length === 0 ? (
                        /* No Results State */
                        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="bg-gray-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <svg 
                                        className="w-8 h-8 text-gray-400" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth="2" 
                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    No Users Found
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {searchTerm ? 'No users match your search criteria.' : 'No users found in the system.'}
                                </p>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 
                                                 rounded-lg transition-all duration-200"
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}