"use client"
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import Spinner from '@/app/Spinner/page';

/**
 * @typedef {Object} RepoInvestment
 * @property {string|number} repoId - The unique identifier for the repo investment
 * @property {string} accountNumber - The bank account number associated with the repo
 * @property {string} repoType - The type of repo investment (Par, Non-Par, TR, Excess, etc.)
 * @property {string|number} investmentValue - The monetary value of the investment
 * @property {string} repoDate - The date of the repo investment
 * @property {string} [additionalDetails] - Any additional details about the repo (optional)
 */

export default function RepoLetterPrint() {
    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    /**
     * @typedef {Object} StateVariables
     * @property {RepoInvestment[]} repoList - Array of all repo investments
     * @property {string} errorMessage - Error message to display
     * @property {boolean} loadingStatus - Loading state indicator
     * @property {number} totalRepos - Total number of repos
     * @property {number} totalInvestment - Total investment value sum
     * @property {string} searchTerm - Search term for filtering
     * @property {RepoInvestment[]} filteredRepos - Filtered array of repos based on search
     * @property {string} selectedDate - Selected date in YYYY-MM-DD format
     * @property {string} displayDate - Formatted date for display
     */

    //Define state variables
    /** @type {[RepoInvestment[], React.Dispatch<React.SetStateAction<RepoInvestment[]>>]} */
    const [repoList, setRepoList] = useState([]);
    
    /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
    const [errorMessage, setErrorMessage] = useState("");
    
    /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
    const [loadingStatus, setLoadingStatus] = useState(false);
    
    /** @type {[number, React.Dispatch<React.SetStateAction<number>>]} */
    const [totalRepos, setTotalRepos] = useState(0);
    
    /** @type {[number, React.Dispatch<React.SetStateAction<number>>]} */
    const [totalInvestment, setTotalInvestment] = useState(0);
    
    /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
    const [searchTerm, setSearchTerm] = useState("");
    
    /** @type {[RepoInvestment[], React.Dispatch<React.SetStateAction<RepoInvestment[]>>]} */
    const [filteredRepos, setFilteredRepos] = useState([]);
    
    // New state variables for date selection
    /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
    const [selectedDate, setSelectedDate] = useState(() => {
        // Initialize with today's date in YYYY-MM-DD format
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    
    /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
    const [displayDate, setDisplayDate] = useState("");

    /**
     * Fetches repo details from the server based on selected date
     * @param {string} date - The date to fetch repos for (YYYY-MM-DD format)
     * @returns {Promise<void>}
     */
    const showRepoDetails = async (date = selectedDate) => {
        setLoadingStatus(true);
        setErrorMessage("");
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/repo/display-repo-details-for-print?repoDate=${date}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            /** @type {{responseObject?: RepoInvestment[], message?: string}} */
            const response = await request.json();
            
            if (request.status === 200) {
                /** @type {RepoInvestment[]} */
                const repos = response.responseObject || [];
                setRepoList(repos);
                setFilteredRepos(repos);
                setTotalRepos(repos.length);
                
                // Calculate total investment
                const total = repos.reduce((sum, repo) => {
                    return sum + (parseFloat(String(repo.investmentValue)) || 0);
                }, 0);
                setTotalInvestment(total);
                
                // Format display date
                const formattedDate = new Date(date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
                setDisplayDate(formattedDate);
            } else {
                setErrorMessage(response.message || "An error occurred");
            }
        } catch (error) {
            setErrorMessage("Response not received from server. Please contact administrator!");
        } finally {
            setLoadingStatus(false);
        }
    }

    // Load initial data with today's date
    useEffect(() => {
        showRepoDetails(selectedDate);
    }, []);

    /**
     * Handles date form submission
     * @param {React.FormEvent<HTMLFormElement>} e - Form event
     */
    const handleDateSubmit = (e) => {
        e.preventDefault();
        showRepoDetails(selectedDate);
    };

    // Filter repos based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredRepos(repoList);
            return;
        }
        
        /** @type {RepoInvestment[]} */
        const filtered = repoList.filter(repo => 
            String(repo.repoId)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            repo.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            repo.repoType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            repo.repoDate?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRepos(filtered);
    }, [searchTerm, repoList]);

    /**
     * Opens a new tab with the repo letter for printing
     * @param {string|number} repoId - The ID of the repo to print
     */
    const repoLetterPrint = async (repoId) => {
        // Open new tab with voucher details
        const newTab = window.open(`/Printings/DisplayRepoLetter?repoId=${repoId}`, '_blank');
        // Optional: focus on the new tab
        if (newTab) {
            newTab.focus();
        }
    }

    /**
     * Formats currency amount
     * @param {string|number} amount - The amount to format
     * @returns {string} Formatted currency string
     */
    const formatCurrency = (amount) => {
        const number = parseFloat(String(amount || 0));
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(number);
    };

    /**
     * Formats date string
     * @param {string} dateString - The date string to format
     * @returns {string} Formatted date string
     */
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

    /**
     * Returns appropriate badge component based on repo type
     * @param {string} type - The repo type
     * @returns {JSX.Element} Badge component
     */
    const getRepoTypeBadge = (type) => {
        const typeLower = type?.toLowerCase() || "";
        
        /** @type {Object.<string, {bg: string, text: string, border: string}>} */
        const typeStyles = {
            par: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
            'non-par': { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200" },
            non: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200" },
            tr: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
            excess: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" }
        };

        // Find matching style
        for (const [key, style] of Object.entries(typeStyles)) {
            if (typeLower.includes(key)) {
                return (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text} border ${style.border}`}>
                        {type}
                    </span>
                );
            }
        }

        // Default style
        return (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                {type}
            </span>
        );
    };

    /**
     * Refreshes data to today's date
     */
    const refreshData = () => {
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
        showRepoDetails(today);
        setErrorMessage("");
        setSearchTerm("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto animate-fadeIn">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-t-xl shadow-lg p-6 mb-0">
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
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Print Repo Letters
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    Generate Repo investment letters for printing
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {totalRepos > 0 && (
                                <div className="text-white text-sm bg-white/20 px-3 py-1 rounded-lg">
                                    {totalRepos} repos • Rs.{formatCurrency(totalInvestment)}
                                </div>
                            )}
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
                                <span>Today</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Control Card */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Repo Investments
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Search and select Repo investments to print letters
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-semibold">{filteredRepos.length}</span> of <span className="font-semibold">{totalRepos}</span> repos
                            </div>
                        </div>
                    </div>

                    {/* Date Selection Form */}
                    <form onSubmit={handleDateSubmit} className="mb-6">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <label htmlFor="repoDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Repo Date
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
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <input
                                        type="date"
                                        id="repoDate"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                                                 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                                 transition-all duration-200 shadow-sm"
                                        required
                                    />
                                </div>
                                {displayDate && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        Showing data for: <span className="font-semibold text-indigo-600">{displayDate}</span>
                                    </p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={loadingStatus}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium 
                                         rounded-lg hover:from-indigo-700 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 
                                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                         active:translate-y-0 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                                         disabled:hover:translate-y-0 flex items-center justify-center gap-2 min-w-[120px]"
                            >
                                {loadingStatus ? (
                                    <>
                                        <Spinner size={20} />
                                        <span>Loading...</span>
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
                                        <span>Search</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Search Bar */}
                    <div className="mb-6">
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
                                placeholder="Search repos by ID, account number, type, or date..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                                         bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                         transition-all duration-200 shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Information Banner */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <svg 
                                className="w-5 h-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" 
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
                                <h4 className="text-sm font-semibold text-indigo-800 mb-1">
                                    Repo Letter Printing Information
                                </h4>
                                <p className="text-sm text-indigo-700">
                                    Select a date above and click Search to view repo investments for that day. 
                                    Then select a Repo investment below to generate and print its official letter.
                                </p>
                            </div>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="mb-6">
                            <ErrorMessage messageValue={errorMessage} />
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loadingStatus ? (
                    <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-lg p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <Spinner size={40} />
                            <p className="mt-4 text-gray-600">Loading repository details...</p>
                        </div>
                    </div>
                ) : filteredRepos.length > 0 ? (
                    /* Repos Table */
                    <div className="mt-8 animate-fadeIn">
                        {/* Table Header */}
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-gray-200 rounded-t-xl p-5">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-indigo-100 p-2 rounded-lg">
                                        <svg 
                                            className="w-5 h-5 text-indigo-600" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24" 
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth="2" 
                                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                            ></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Repo Investments Available for Printing
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {filteredRepos.length} repos found for {displayDate} • Total investment: Rs.{formatCurrency(totalInvestment)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span className="font-semibold">Ready to Print:</span> {filteredRepos.length} letters
                                </div>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Repo Details
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Bank Account
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Investment Type
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap text-right">
                                                Investment Value
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredRepos.map((item) => {
                                            // Destructure item for better IntelliSense
                                            const { repoId, accountNumber, repoType, investmentValue, repoDate } = item;
                                            
                                            return (
                                                <tr
                                                    key={String(repoId)}
                                                    className="bg-white border-b border-gray-200 hover:bg-indigo-50 transition-colors duration-150"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="font-medium text-gray-900 mb-1">
                                                                {String(repoId)}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {formatDate(repoDate)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            {accountNumber}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getRepoTypeBadge(repoType)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            Rs.{formatCurrency(investmentValue)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => repoLetterPrint(repoId)}
                                                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 
                                                                     rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 
                                                                     focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                                     active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                                     min-w-[120px]"
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
                                                                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                                                />
                                                            </svg>
                                                            <span>Print Letter</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footer */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-gray-600">
                                        Displaying <span className="font-semibold">{filteredRepos.length}</span> repository investment{filteredRepos.length !== 1 ? 's' : ''} for {displayDate}
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold">Total Investment Value:</span> 
                                            <span className="ml-2 text-lg font-bold text-indigo-700">
                                                Rs.{formatCurrency(totalInvestment)}
                                            </span>
                                        </div>
                                        {searchTerm && (
                                            <button
                                                onClick={() => setSearchTerm("")}
                                                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 
                                                         rounded-lg transition-all duration-200 flex items-center gap-2"
                                            >
                                                Clear Search
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : !loadingStatus ? (
                    /* No Results State */
                    <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-lg p-8 text-center">
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
                                No Repository Investments Found
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm 
                                    ? 'No repository investments match your search criteria.' 
                                    : `No repository investments available for ${displayDate}.`}
                            </p>
                            <div className="flex justify-center gap-3">
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 
                                                 rounded-lg transition-all duration-200"
                                    >
                                        Clear Search
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        const today = new Date().toISOString().split('T')[0];
                                        setSelectedDate(today);
                                        showRepoDetails(today);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 
                                             rounded-lg transition-all duration-200"
                                >
                                    View Today
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}