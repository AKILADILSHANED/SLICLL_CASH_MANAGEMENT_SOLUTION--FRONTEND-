"use client"
import React, { useState } from 'react'
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import { useEffect } from 'react';
import Spinner from '@/app/Spinner/page';

export default function AccountsReport() {

    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables;
    const [accountReport, setAccountReport] = useState(false);
    const [accountDetails, setAccountDetails] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loadingMessage, setloadingMessage] = useState(false);
    const [totalAccounts, setTotalAccounts] = useState(0);
    const [activeAccounts, setActiveAccounts] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [selectedBank, setSelectedBank] = useState("all");
    const [selectedCurrency, setSelectedCurrency] = useState("all");

    //Define getAccountData function;
    const getAccountData = async () => {
        setAccountReport(false);
        setErrorMessage("");
        setloadingMessage(true);
        try {
            const request = await fetch(`${baseUrl}/api/v1/reports/get-account-report`, {
                method: "GET",
                credentials: "include",
            });
            const response = await request.json();
            if (request.status === 200) {
                const accounts = response.responseObject || [];
                setAccountDetails(accounts);
                setFilteredAccounts(accounts);
                setAccountReport(true);
                setTotalAccounts(accounts.length);

                // Calculate active accounts
                const active = accounts.filter(account =>
                    account.status && account.status.toLowerCase() === 'active'
                ).length;
                setActiveAccounts(active);
            } else if (request.status === 409) {
                setErrorMessage(response.message);
            } else {
                setErrorMessage(response.message || "Failed to load account report");
            }
        } catch (error) {
            setErrorMessage("Unexpected error occurred. Please contact administrator!");
        } finally {
            setloadingMessage(false);
        }
    }
    useEffect(() => {
        getAccountData();
    }, []);

    // Get unique banks and currencies for filters
    const banks = [...new Set(accountDetails.map(account => account.bankName).filter(Boolean))];
    const currencies = [...new Set(accountDetails.map(account => account.currency).filter(Boolean))];

    // Filter accounts based on search term and filters
    useEffect(() => {
        let filtered = accountDetails;

        if (searchTerm.trim()) {
            filtered = filtered.filter(account =>
                account.bankName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                account.bankBranch?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                account.bankAccount?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                account.glCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                account.accountType?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedBank !== "all") {
            filtered = filtered.filter(account => account.bankName === selectedBank);
        }

        if (selectedCurrency !== "all") {
            filtered = filtered.filter(account => account.currency === selectedCurrency);
        }

        setFilteredAccounts(filtered);
    }, [searchTerm, selectedBank, selectedCurrency, accountDetails]);

    const refreshData = () => {
        getAccountData();
        setErrorMessage("");
        setSearchTerm("");
        setSelectedBank("all");
        setSelectedCurrency("all");
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
        } else if (statusLower === 'deleted') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                    {status}
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                {status}
            </span>
        );
    };

    const getAccountTypeBadge = (type) => {
        const typeLower = type?.toLowerCase();
        if (typeLower === 'savings') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    {type}
                </span>
            );
        } else if (typeLower === 'current') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                    {type}
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                {type}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto animate-fadeIn">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-green-700 rounded-t-xl shadow-lg p-6 mb-0">
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
                                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Bank Accounts Report
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    Overview of all registered bank accounts and their details
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
                                    <p className="text-sm font-medium text-blue-800 mb-1">Total Accounts</p>
                                    <p className="text-3xl font-bold text-blue-900">{totalAccounts}</p>
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
                                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-800 mb-1">Active Accounts</p>
                                    <p className="text-3xl font-bold text-green-900">{activeAccounts}</p>
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

                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-800 mb-1">Unique Banks</p>
                                    <p className="text-3xl font-bold text-purple-900">{banks.length}</p>
                                </div>
                                <div className="bg-purple-200 p-3 rounded-full">
                                    <svg
                                        className="w-6 h-6 text-purple-700"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
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
                                Bank Accounts Directory
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Search and filter through all registered bank accounts
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-semibold">{filteredAccounts.length}</span> of <span className="font-semibold">{totalAccounts}</span> accounts
                            </div>
                        </div>
                    </div>

                    {/* Filters Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org2000/svg"
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
                                    placeholder="Search accounts by bank, branch, account number, or GL code..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                                             bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                             transition-all duration-200 shadow-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Filter by Bank
                            </label>
                            <select
                                value={selectedBank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                                className="block w-full py-3 px-3 text-sm border border-gray-300 rounded-lg 
                                         bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                         transition-all duration-200 shadow-sm"
                            >
                                <option value="all">All Banks</option>
                                {banks.map((bank, index) => (
                                    <option key={index} value={bank}>{bank}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Filter by Currency
                            </label>
                            <select
                                value={selectedCurrency}
                                onChange={(e) => setSelectedCurrency(e.target.value)}
                                className="block w-full py-3 px-3 text-sm border border-gray-300 rounded-lg 
                                         bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                         transition-all duration-200 shadow-sm"
                            >
                                <option value="all">All Currencies</option>
                                {currencies.map((currency, index) => (
                                    <option key={index} value={currency}>{currency}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Information Banner */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-100 border border-blue-200 rounded-lg p-4 mb-6">
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
                                    Bank Accounts Information
                                </h4>
                                <p className="text-sm text-blue-700">
                                    This report displays all registered bank accounts in the system. Use the filters above to narrow down your search.
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
                                <p className="mt-4 text-gray-600">Generating accounts report...</p>
                            </div>
                        </div>
                    ) : accountReport && filteredAccounts.length > 0 ? (
                        /* Accounts Table */
                        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Account Details
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Bank & Branch
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Financial Details
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Registration Info
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAccounts.map((element) => (
                                            <tr
                                                key={element.accountId}
                                                className="bg-white border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150"
                                            >
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900 mb-1">
                                                            Account #{element.bankAccount}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            ID: {element.accountId}
                                                        </div>
                                                        <div className="mt-2">
                                                            {getAccountTypeBadge(element.accountType)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {element.bankName}
                                                        </div>
                                                        <div className="text-sm text-gray-600 mt-1">
                                                            {element.bankBranch}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-2">
                                                        <div>
                                                            <div className="text-xs text-gray-500">Currency</div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {element.currency}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">GL Code</div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {element.glCode}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-3">
                                                        {getStatusBadge(element.status)}
                                                        {element.deletedBy && (
                                                            <div className="text-xs text-red-600">
                                                                Deleted by: {element.deletedBy}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-2">
                                                        <div>
                                                            <div className="text-xs text-gray-500">Registered Date</div>
                                                            <div className="text-sm text-gray-900">
                                                                {formatDate(element.registeredDate)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Registered By</div>
                                                            <div className="text-sm text-gray-900">
                                                                {element.registeredBy}
                                                            </div>
                                                        </div>
                                                    </div>
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
                                        Displaying <span className="font-semibold">{filteredAccounts.length}</span> account{filteredAccounts.length !== 1 ? 's' : ''}
                                        {selectedBank !== "all" && ` in ${selectedBank}`}
                                        {selectedCurrency !== "all" && ` (${selectedCurrency})`}
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold">Active:</span> {activeAccounts}
                                            <span className="mx-2">•</span>
                                            <span className="font-semibold">Inactive:</span> {totalAccounts - activeAccounts}
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
                    ) : accountReport && filteredAccounts.length === 0 ? (
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
                                    No Accounts Found
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {searchTerm || selectedBank !== "all" || selectedCurrency !== "all"
                                        ? 'No accounts match your search criteria.'
                                        : 'No accounts found in the system.'}
                                </p>
                                {(searchTerm || selectedBank !== "all" || selectedCurrency !== "all") && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedBank("all");
                                            setSelectedCurrency("all");
                                        }}
                                        className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 
                                                 rounded-lg transition-all duration-200"
                                    >
                                        Clear All Filters
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