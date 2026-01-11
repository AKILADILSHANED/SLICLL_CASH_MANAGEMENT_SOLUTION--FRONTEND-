"use client"
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import Spinner from '@/app/Spinner/page';

export default function RepoLetterPrint() {
    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables
    const [repoList, setRepoList] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [totalRepos, setTotalRepos] = useState(0);
    const [totalInvestment, setTotalInvestment] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredRepos, setFilteredRepos] = useState([]);

    //Define showRepoDetails function;
    const showRepoDetails = async () => {
        setLoadingStatus(true);
        setErrorMessage("");
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/repo/display-repo-details-for-print`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            const response = await request.json();
            if (request.status === 200) {
                const repos = response.responseObject || [];
                setRepoList(repos);
                setFilteredRepos(repos);
                setTotalRepos(repos.length);
                
                // Calculate total investment
                const total = repos.reduce((sum, repo) => {
                    return sum + (parseFloat(repo.investmentValue) || 0);
                }, 0);
                setTotalInvestment(total);
            } else if (request.status === 409) {
                setErrorMessage(response.message);
            } else {
                setErrorMessage(response.message || "Failed to load repo details");
            }
        } catch (error) {
            setErrorMessage("Unexpected error occurred. Please contact administrator!");
        } finally {
            setLoadingStatus(false);
        }
    }

    useEffect(() => {
        showRepoDetails();
    }, []);

    // Filter repos based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredRepos(repoList);
            return;
        }
        
        const filtered = repoList.filter(repo => 
            repo.repoId?.toString().includes(searchTerm.toLowerCase()) ||
            repo.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            repo.repoType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            repo.repoDate?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRepos(filtered);
    }, [searchTerm, repoList]);

    //Define repoLetterPrint function;
    const repoLetterPrint = async (repoId) => {
        // Open new tab with voucher details
        const newTab = window.open(`/Printings/DisplayRepoLetter?repoId=${repoId}`, '_blank');
        // Optional: focus on the new tab
        if (newTab) {
            newTab.focus();
        }
    }

    const formatCurrency = (amount) => {
        const number = parseFloat(amount || 0);
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(number);
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

    const getRepoTypeBadge = (type) => {
        const typeLower = type?.toLowerCase();
        if (typeLower.includes('par')) {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    {type}
                </span>
            );
        } else if (typeLower.includes('non') || typeLower.includes('non-par')) {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                    {type}
                </span>
            );
        } else if (typeLower.includes('tr')) {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                    {type}
                </span>
            );
        } else if (typeLower.includes('excess')) {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
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

    const refreshData = () => {
        showRepoDetails();
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
                                <span>Refresh</span>
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
                                    Select a Repo investment below to generate and print its official letter. 
                                    
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
                                            {filteredRepos.length} repos found • Total investment: Rs.{formatCurrency(totalInvestment)}
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
                                        {filteredRepos.map((item) => (
                                            <tr
                                                key={item.repoId}
                                                className="bg-white border-b border-gray-200 hover:bg-indigo-50 transition-colors duration-150"
                                            >
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900 mb-1">
                                                            {item.repoId}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {formatDate(item.repoDate)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {item.accountNumber}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getRepoTypeBadge(item.repoType)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        Rs.{formatCurrency(item.investmentValue)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => repoLetterPrint(item.repoId)}
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
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footer */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-gray-600">
                                        Displaying <span className="font-semibold">{filteredRepos.length}</span> repository investment{filteredRepos.length !== 1 ? 's' : ''}
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
                                    : 'No repository investments available for printing.'}
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
    )
}