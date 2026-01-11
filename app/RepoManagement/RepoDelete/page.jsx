"use client"
import React from 'react'
import Spinner from '@/app/Spinner/page'
import { useState } from 'react';
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import SUccessMessage from '@/app/Messages/SuccessMessage/page';

export default function RepoDelete({ onCancel }) {

    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables
    const [textRepoId, setTextRepoId] = useState("");
    const [spinnerSearch, setSpinnerSearch] = useState(false);
    const [spinnerDelete, setSpinnerDelete] = useState(false);
    const [repoDataTable, setRepoDataTable] = useState(false);
    const [repoDetails, setRepoDetails] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


    //Define getRepoDetails function;
    const getRepoDetails = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setRepoDataTable(false);
        setSpinnerSearch(true);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/repo/display-repo?repoId=${textRepoId}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if (request.status === 200) {
                const response = await request.json();
                setRepoDetails(response.responseObject);
                setRepoDataTable(true);
            } else if (request.status === 409) {
                const response = await request.json();
                setErrorMessage(response.message);
            } else if (request.status === 500) {
                const response = await request.json();
                setErrorMessage(response.message);
            } else {
                const response = await request.json();
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage("Un-expected error occurred. Please contact administrator!");
        } finally {
            setSpinnerSearch(false);
        }
    }

    //Define deleteRepo function;
    const deleteRepo = async () => {
        if (!window.confirm(`Are you sure you want to delete REPO ${textRepoId}? This action cannot be undone.`)) {
            return;
        }

        setErrorMessage("");
        setSuccessMessage("");
        setSpinnerDelete(true);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/repo/repo-delete?repoId=${textRepoId}`,
                {
                    method: "PUT",
                    credentials: "include"
                }
            );
            const response = await request.json();
            if (request.status === 200) {
                setSuccessMessage(response.message);
                setRepoDataTable(false);
                setTextRepoId("");
            } else if (request.status === 409) {
                setErrorMessage(response.message);
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage("Un-expected error occurred. Please contact administrator!!!");
        } finally {
            setSpinnerDelete(false);
        }
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const getStatusBadge = (status, deleteStatus) => {
        if (deleteStatus?.toLowerCase() === 'yes') {
            return (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    Deleted
                </span>
            );
        }

        const statusLower = status?.toLowerCase() || '';
        switch (statusLower) {
            case 'active':
                return (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                    </span>
                );
            case 'matured':
                return (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        Matured
                    </span>
                );
            case 'closed':
                return (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        Closed
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {status || 'Unknown'}
                    </span>
                );
        }
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto animate-fadeIn">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-xl shadow-lg p-6 mb-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">REPO Delete</h1>
                                <p className="text-red-100 text-sm mt-1">Delete REPO investment accounts</p>
                            </div>
                        </div>
                        {onCancel && (
                            <button
                                onClick={() => onCancel()}
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
                    <form onSubmit={(e) => getRepoDetails(e)}>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search REPO for Deletion
                                    <span className="text-red-600 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        onChange={(e) => setTextRepoId(e.target.value)}
                                        value={textRepoId.toUpperCase()}
                                        required
                                        placeholder="Enter REPO ID (e.g., REPO-202601-001)"
                                        className="pl-10 w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                 hover:border-blue-400 hover:shadow-sm outline-none
                                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Enter REPO ID to view details before deletion</p>
                            </div>

                            <div className="flex items-end">
                                <button
                                    type='submit'
                                    disabled={spinnerSearch}
                                    className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                             rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                             disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]">
                                    {spinnerSearch ? (
                                        <>
                                            <Spinner size={20} />
                                            <span>Searching...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                            </svg>
                                            <span>Search REPO</span>
                                        </>
                                    )}
                                </button>
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

                {/* Results Table */}
                {repoDataTable && repoDetails.length > 0 && (
                    <div className="mt-8 animate-fadeIn">
                        {/* Summary Header */}
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-t-xl p-5">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-red-100 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">REPO Details for Deletion</h2>
                                        <p className="text-sm text-gray-600">REPO ID: {repoDetails[0]?.repoId}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-sm">
                                        <span className="text-gray-600">Status:</span>
                                        <span className="ml-2">
                                            {getStatusBadge(repoDetails[0]?.investmentStatus, repoDetails[0]?.deleteStatus)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                REPO Details
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                Financial Information
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                Dates & Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                Deletion Info
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {repoDetails.map((element) => (
                                            <tr
                                                key={element.repoId}
                                                className="hover:bg-red-50 transition-all duration-150"
                                            >
                                                {/* Column 1: REPO Details */}
                                                <td className="px-6 py-4">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <div className="text-xs text-gray-500">REPO ID</div>
                                                            <div className="text-sm font-medium text-gray-900">{element.repoId}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Account Number</div>
                                                            <div className="text-sm text-gray-900">{element.accountNumber}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">REPO Type</div>
                                                            <div className="mt-1">{getRepoTypeBadge(element.repoType)}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Column 2: Financial Information */}
                                                <td className="px-6 py-4">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <div className="text-xs text-gray-500">Opening Balance</div>
                                                            <div className="text-sm font-semibold text-gray-900">
                                                                Rs.{formatCurrency(element.openingBalance)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Closing Balance</div>
                                                            <div className="text-sm font-semibold text-gray-900">
                                                                Rs.{formatCurrency(element.closingBalance)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Maturity Value</div>
                                                            <div className="text-sm font-semibold text-blue-700">
                                                                Rs.{formatCurrency(element.maturityValue)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Interest Rate</div>
                                                            <div className="text-sm font-semibold text-gray-900">{element.interestRate}%</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Column 3: Dates & Status */}
                                                <td className="px-6 py-4">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <div className="text-xs text-gray-500">Investment Status</div>
                                                            <div className="mt-1">{getStatusBadge(element.investmentStatus, element.deleteStatus)}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Invest Date</div>
                                                            <div className="text-sm text-gray-900">{element.investDate}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Maturity Date</div>
                                                            <div className="text-sm text-gray-900">{element.maturityDate}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Created Date</div>
                                                            <div className="text-sm text-gray-900">{element.createdDate}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Column 4: Deletion Info */}
                                                <td className="px-6 py-4">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <div className="text-xs text-gray-500">Created By</div>
                                                            <div className="text-sm text-gray-900">{element.createdBy}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Delete Status</div>
                                                            <div className="mt-1">
                                                                {element.deleteStatus}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Deleted User</div>
                                                            <div className="text-sm text-gray-900">{element.deleteUser || '—'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Action Section */}
                            <div className="bg-gray-50 border-t border-gray-200 p-6">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="flex-1">
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-red-800">Important Warning</h3>
                                                    <div className="mt-1 text-sm text-red-700">
                                                        <p>Deleting a REPO account is a permanent action that cannot be undone.</p>
                                                        <p className="mt-1">This will affect all associated financial records and adjustments.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-3">
                                        {repoDetails[0]?.deleteStatus?.toLowerCase() === 'yes' ? (
                                            <button
                                                disabled
                                                className="px-6 py-3 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                                <span>Already Deleted</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => deleteRepo()}
                                                disabled={spinnerDelete}
                                                className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                                                         rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                                                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                         disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                                                {spinnerDelete ? (
                                                    <>
                                                        <Spinner size={20} />
                                                        <span>Deleting...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                        </svg>
                                                        <span>Delete REPO</span>
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        <button
                                            onClick={() => onCancel?.()}
                                            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                                                     rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 
                                                     flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                            <span>Cancel</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Results Message */}
                {repoDataTable && repoDetails.length === 0 && (
                    <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No REPO Found</h3>
                            <p className="text-gray-600 mb-4">
                                No REPO investment details found for the provided ID. Please verify the REPO ID and try again.
                            </p>
                            <button
                                onClick={() => setTextRepoId("")}
                                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                                Clear Search
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}