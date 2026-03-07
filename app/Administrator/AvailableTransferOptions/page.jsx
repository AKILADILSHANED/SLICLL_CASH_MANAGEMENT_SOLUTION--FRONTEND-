"use client";
import React, { useEffect, useState } from 'react'
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import Spinner from '@/app/Spinner/page';

export default function AvailableTransferOptions() {
    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables
    const [transferOptions, setTransferOptions] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    //Define handleFetchOptions function
    const handleFetchOptions = async () => {
        setLoading(true);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/transferOption/displayAvailableOptions`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            const response = await request.json();
            if (request.status === 200) {
                setTransferOptions(response.responseObject);
                setErrorMessage("");
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage("Response not received from server. Please contact the administrator!");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleFetchOptions();
    }, []);

    // Filter options based on search and status
    const filteredOptions = transferOptions.filter(option => {
        const matchesSearch = searchTerm === "" ||
            option.optionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            option.fromAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
            option.toAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
            option.transferChannel.toLowerCase().includes(searchTerm.toLowerCase()) ||
            option.definedBy.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "active" && option.isActive === "YES" && option.isDeleted === "NO") ||
            (statusFilter === "inactive" && option.isActive === "NO") ||
            (statusFilter === "deleted" && option.isDeleted === "YES");

        return matchesSearch && matchesStatus;
    });

    // Calculate statistics
    const activeOptions = transferOptions.filter(option => option.isActive === "YES" && option.isDeleted === "NO").length;
    const deletedOptions = transferOptions.filter(option => option.isDeleted === "YES").length;
    const inactiveOptions = transferOptions.filter(option => option.isActive === "NO" && option.isDeleted === "NO").length;

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
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Transfer Option Details
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    View all transfer options and their current status
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleFetchOptions}
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


                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-6 animate-slideDown">
                        <ErrorMessage messageValue={errorMessage} />
                    </div>
                )}

                {/* Main Content Card */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* Table Header with Filters */}
                    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    All Transfer Options
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Showing {filteredOptions.length} of {transferOptions.length} options
                                </p>
                            </div>
                            <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
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
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search options..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg 
                                                 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                                 transition-all duration-200 shadow-sm w-full md:w-64"
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg 
                                             bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                             transition-all duration-200 shadow-sm"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active Only</option>
                                    <option value="inactive">Inactive Only</option>
                                    <option value="deleted">Deleted Only</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="py-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600">Loading transfer options...</p>
                        </div>
                    ) : filteredOptions.length > 0 ? (
                        /* Options Table */
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Option Details
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Active Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Delete Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Accounts
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Channel & Author
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredOptions.map((element, index) => (
                                        <tr
                                            key={element.optionId}
                                            className="hover:bg-gray-50 transition-colors duration-150"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        ID: {element.optionId}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Defined: {new Date(element.definedDate).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {element.isActive}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {element.isDeleted}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-2">
                                                    <div className="flex items-center">
                                                        <div className="bg-blue-100 p-1.5 rounded-md mr-2">
                                                            <svg
                                                                className="w-3 h-3 text-blue-600"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                                                ></path>
                                                            </svg>
                                                        </div>
                                                        <div className="text-sm text-gray-900">
                                                            {element.fromAccount}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="bg-green-100 p-1.5 rounded-md mr-2">
                                                            <svg
                                                                className="w-3 h-3 text-green-600"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                                                                ></path>
                                                            </svg>
                                                        </div>
                                                        <div className="text-sm text-gray-900">
                                                            {element.toAccount}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-2">
                                                    <div className="flex items-center">
                                                        <div className="bg-purple-100 p-1.5 rounded-md mr-2">
                                                            <svg
                                                                className="w-3 h-3 text-purple-600"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                                                ></path>
                                                            </svg>
                                                        </div>
                                                        <div className="text-sm text-gray-900">
                                                            {element.transferChannel}
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Defined by: {element.definedBy}
                                                    </div>
                                                </div>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {searchTerm || statusFilter !== "all" ? "No Matching Options" : "No Transfer Options"}
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                {searchTerm || statusFilter !== "all"
                                    ? "No transfer options match your search criteria. Try changing your filters."
                                    : "No transfer options have been created yet. Create new options to get started."}
                            </p>
                            {(searchTerm || statusFilter !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStatusFilter("all");
                                    }}
                                    className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 
                                             hover:bg-blue-100 rounded-lg transition-colors duration-200"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* Table Footer */}
                    {filteredOptions.length > 0 && (
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
    )
}