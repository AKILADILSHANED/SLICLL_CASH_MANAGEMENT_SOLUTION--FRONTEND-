"use client"
import React from 'react'
import SUccessMessage from '@/app/Messages/SuccessMessage/page'
import ErrorMessage from '@/app/Messages/ErrorMessage/page'
import { useState } from 'react'
import { useEffect } from 'react'
import Spinner from '@/app/Spinner/page'

export default function InvestmentReverse() {

    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables
    const [repoList, setRepoList] = useState([]);
    const [repoDetails, setRepoDetails] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [reversingId, setReversingId] = useState(null);

    //Define showRepoDetails function;
    const showRepoDetails = async () => {
        setLoadingStatus(true);
        setErrorMessage("");
        setSuccessMessage("");
        setRepoDetails(false);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/repo/display-invested-repo-details`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            const response = await request.json();
            if (request.status === 200) {
                setRepoList(response.responseObject);
            } else if (request.status === 409) {
                setErrorMessage(response.message);
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage("Un-expected error occurred. Please contact administrator!");
        } finally {
            setLoadingStatus(false);
        }
    }

    //Define initiateReversal function;
    const initiateReversal = async (repoId) => {
        if (!window.confirm(`Are you sure you want to reverse investment for REPO ${repoId}? This action cannot be undone.`)) {
            return;
        }
        
        try {
            setReversingId(repoId);
            setErrorMessage("");
            setSuccessMessage("");
            
            // Immediately remove the repo from the UI state
            setRepoList(prevList => prevList.filter(item => item.repoId !== repoId));
            
            const request = await fetch(
                `${baseUrl}/api/v1/repo/investment-reverse?repoId=${encodeURIComponent(repoId)}`,
                {
                    method: "PUT",
                    credentials: "include"
                }
            );
            const response = await request.json();
            if (request.status === 200) {                
                setSuccessMessage(response.message);
                // Refresh the list
                setTimeout(() => {
                    showRepoDetails();
                }, 500);
            } else if (request.status === 409) {
                setErrorMessage(response.message);
                // Refresh the list to get current state
                showRepoDetails();
            } else {
                setErrorMessage(response.message);
                // Refresh the list to get current state
                showRepoDetails();
            }
        } catch (error) {
            setErrorMessage("Un-expected error occurred. Please contact administrator!!");
        } finally {
            setReversingId(null);
        }
    }

    useEffect(() => {
        showRepoDetails();
    }, []);

    const formatCurrency = (value) => {
        if (typeof value === "number") {
            return value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        }
        return value;
    };

    const getRepoTypeBadge = (type) => {
        switch (type) {
            case 'PAR':
                return (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {type}
                    </span>
                );
            case 'NON-PAR':
                return (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {type}
                    </span>
                );
            case 'TR':
                return (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {type}
                    </span>
                );
            case 'Excess':
                return (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {type}
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {type || 'N/A'}
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto animate-fadeIn">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-xl shadow-lg p-6 mb-0">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Investment Reverse</h1>
                            <p className="text-red-100 text-sm mt-1">Reverse invested REPO accounts</p>
                        </div>
                    </div>
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

                {/* Loading State */}
                {loadingStatus && (
                    <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-12 text-center">
                        <div className="max-w-sm mx-auto">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="w-full h-full border-4 border-gray-200 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Invested REPOs</h3>
                            <p className="text-gray-600">Please wait while we fetch invested REPO accounts...</p>
                        </div>
                    </div>
                )}

                {/* Invested REPO List Table */}
                {!loadingStatus && repoList.length > 0 && (
                    <div className="mt-8 animate-fadeIn">
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-t-xl p-5">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-red-100 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">Invested REPO Accounts</h2>
                                        <p className="text-sm text-gray-600">Found {repoList.length} invested REPO account(s)</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => showRepoDetails()}
                                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                    Refresh List
                                </button>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                REPO Date
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                REPO ID
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                Bank Account
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                REPO Type
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                Investment Value
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {repoList.map((item) => (
                                            <tr 
                                                key={item.repoId}
                                                className="hover:bg-red-50 transition-all duration-150 group"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{item.repoDate}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                                                            <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                            </svg>
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-900">{item.repoId}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{item.accountNumber}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getRepoTypeBadge(item.repoType)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="text-sm font-semibold text-red-700">
                                                        Rs.{formatCurrency(item.investmentValue)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button 
                                                        onClick={() => initiateReversal(item.repoId)}
                                                        disabled={reversingId === item.repoId}
                                                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                                                                 rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                                                                 focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                                 active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                                 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                                                        {reversingId === item.repoId ? (
                                                            <>
                                                                <Spinner size={20} />
                                                                <span>Reversing...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                                                                </svg>
                                                                <span>Reverse</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Warning Section */}
                            <div className="bg-red-50 border-t border-red-200 p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Important Information</h3>
                                        <div className="mt-1 text-sm text-red-700">
                                            <p>Reversing an investment will return the REPO account to its pre-investment state.</p>
                                            <p className="mt-1">This action cannot be undone and will remove all investment details.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Invested REPOs Available */}
                {!loadingStatus && repoList.length === 0 && (
                    <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="bg-red-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Invested REPOs Found</h3>
                            <p className="text-gray-600 mb-4">
                                There are currently no invested REPO accounts available for reversal.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => showRepoDetails()}
                                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                    Refresh List
                                </button>
                                <a 
                                    href="/repo-investment"
                                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Go to Investments
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}