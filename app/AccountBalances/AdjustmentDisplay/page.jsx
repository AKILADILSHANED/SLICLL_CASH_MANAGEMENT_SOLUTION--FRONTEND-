"use client"
import React from 'react'
import { useState } from 'react';
import Spinner from '@/app/Spinner/page';
import ErrorMessage from '@/app/Messages/ErrorMessage/page';

export default function AdjustmentDisplay({ onCancel }) {
    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables
    const [textBalanceId, setTextBalanceId] = useState("");
    const [spinner, setSpinner] = useState(false);
    const [adjustmentData, setAdjustmentData] = useState([]);
    const [adjustmentDataTable, setAdjustmentDataTable] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    //Define getAdjustmentsData function;
    const getAdjustmentsData = async (e) => {
        e.preventDefault();
        setSpinner(true);
        setErrorMessage("");
        setAdjustmentDataTable(false);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/account-balance/get-adjustments?balanceId=${encodeURIComponent(textBalanceId)}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if (request.ok) {
                const response = await request.json();
                setAdjustmentData(response.responseObject);
                setAdjustmentDataTable(true);
            } else {
                const response = await request.json();
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage("Un-expected error occurred. Please contact administrator!");
        } finally {
            setSpinner(false);
        }
    }

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (textBalanceId.trim()) {
                const syntheticEvent = { preventDefault: () => { } };
                getAdjustmentsData(syntheticEvent);
            }
        }
    };

    // Clear search
    const clearSearch = () => {
        setTextBalanceId("");
        setAdjustmentDataTable(false);
        setErrorMessage("");
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return "-";
        const num = parseFloat(amount);
        if (isNaN(num)) return amount;

        const absValue = Math.abs(num);
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(absValue);

        return num < 0 ? `(${formatted})` : formatted;
    };

    // Calculate totals
    const calculateTotals = () => {
        const openingBalance = adjustmentData[0]?.openingBalance || 0;
        const closingBalance = adjustmentData[0]?.closingBalance || 0;
        const totalAdjustments = adjustmentData.reduce((sum, item) => sum + (parseFloat(item.adjustmentAmount) || 0), 0);
        const positiveAdjustments = adjustmentData.reduce((sum, item) => {
            const amount = parseFloat(item.adjustmentAmount) || 0;
            return amount > 0 ? sum + amount : sum;
        }, 0);
        const negativeAdjustments = adjustmentData.reduce((sum, item) => {
            const amount = parseFloat(item.adjustmentAmount) || 0;
            return amount < 0 ? sum + Math.abs(amount) : sum;
        }, 0);

        return {
            openingBalance,
            closingBalance,
            totalAdjustments,
            positiveAdjustments,
            negativeAdjustments,
            netChange: closingBalance - openingBalance
        };
    };

    // Get totals if data exists
    const totals = adjustmentDataTable && adjustmentData.length > 0 ? calculateTotals() : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl shadow-lg p-6 mb-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Display Balance Adjustments</h1>
                                <p className="text-blue-100 text-sm mt-1">View adjustment history for account balances</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onCancel()}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            <span>Close</span>
                        </button>
                    </div>
                </div>

                {/* Search Card */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Search Balance Adjustments</h2>
                        <p className="text-sm text-gray-600">Enter Balance ID to view adjustment history</p>
                    </div>

                    <form onSubmit={getAdjustmentsData}>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex-1 w-full">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={textBalanceId}
                                        onChange={(e) => setTextBalanceId(e.target.value.toUpperCase())}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Enter Balance ID (e.g., BAL001)"
                                        className="pl-10 w-full p-3.5 text-gray-900 bg-white border-2 border-gray-200 rounded-xl 
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                 hover:border-blue-400 hover:shadow-sm outline-none
                                                 uppercase"
                                    />
                                    {textBalanceId && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
                                            aria-label="Clear search">
                                            <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Enter the complete Balance ID to search for adjustments</p>
                            </div>

                            <div className="flex items-center">
                                <button
                                    type="submit"
                                    disabled={spinner || !textBalanceId.trim()}
                                    className="px-8 py-3.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                             rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-3 focus:ring-blue-300 
                                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                             disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                                    {spinner ? (
                                        <>
                                            <Spinner size={20} />
                                            <span>Searching...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                            </svg>
                                            <span>Search Adjustments</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className="mt-6 animate-slideDown">
                        <ErrorMessage messageValue={errorMessage} />
                    </div>
                )}

                {/* Summary Statistics */}
                {totals && (
                    <div className="mt-8 animate-fadeIn">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-blue-800">Adjustment Summary</h2>
                                    <p className="text-blue-700">Bank Account: {adjustmentData[0]?.bankAccount || 'N/A'}</p>
                                </div>
                                <div className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">
                                    {adjustmentData.length} Adjustment{adjustmentData.length !== 1 ? 's' : ''}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <div className="text-xs text-gray-500 mb-1">Opening Balance</div>
                                    <div className={`text-2xl font-bold ${totals.openingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(totals.openingBalance)}
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <div className="text-xs text-gray-500 mb-1">Closing Balance</div>
                                    <div className={`text-2xl font-bold ${totals.closingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(totals.closingBalance)}
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <div className="text-xs text-gray-500 mb-1">Net Change</div>
                                    <div className={`text-2xl font-bold ${totals.netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(totals.netChange)}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {totals.netChange > 0 ? 'Increase' : totals.netChange < 0 ? 'Decrease' : 'No Change'}
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <div className="text-xs text-gray-500 mb-1">Adjustments</div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-600">Additions:</span>
                                            <span className="text-sm font-semibold text-green-600">
                                                {formatCurrency(totals.positiveAdjustments)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-600">Deductions:</span>
                                            <span className="text-sm font-semibold text-red-600">
                                                {formatCurrency(totals.negativeAdjustments)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Adjustments Table */}
                {adjustmentDataTable && adjustmentData.length > 0 && (
                    <div className="mt-8 animate-fadeIn">
                        <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                            <div className="bg-gray-50 p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800">Adjustment Details</h2>
                                <p className="text-gray-600 text-sm mt-1">Showing all adjustments for this balance</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Adjustment ID</th>
                                            <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Cross Adjustment</th>
                                            <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Remark</th>
                                            <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Date</th>
                                            <th className="p-4 text-right text-sm font-semibold text-gray-700 border-b border-gray-200">Adjustment Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {/* Opening Balance Row */}
                                        <tr className="bg-blue-50">
                                            <td className="p-4">
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-xs text-gray-500">Starting Balance</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm text-gray-600">Opening Balance</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-xs text-gray-500">—</span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className={`text-sm font-semibold ${adjustmentData[0]?.openingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatCurrency(adjustmentData[0]?.openingBalance || 0)}
                                                </span>
                                            </td>
                                        </tr>

                                        {/* Adjustments */}
                                        {adjustmentData.map((element) => (
                                            <tr key={element.adjustmentId} className="hover:bg-blue-50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                                        <span className="text-sm font-medium text-gray-900">{element.adjustmentId}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-sm text-gray-900">{element.crossAdjustment || '—'}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-sm text-gray-600">{element.remark || 'No remark'}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-xs text-gray-500">
                                                        {element.adjustmentDate ? new Date(element.adjustmentDate).toLocaleDateString() : '—'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end">
                                                        <span className={`text-sm font-semibold ${(element.adjustmentAmount || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {formatCurrency(element.adjustmentAmount)}
                                                        </span>
                                                        {(element.adjustmentAmount || 0) >= 0 ? (
                                                            <svg className="w-4 h-4 text-green-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-4 h-4 text-red-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                                                            </svg>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                        {/* Closing Balance Row */}
                                        <tr className="bg-purple-50 border-t-2 border-purple-200">
                                            <td className="p-4">
                                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-xs text-gray-500">Final Balance</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm font-semibold text-purple-800">Closing Balance</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-xs text-gray-500">—</span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className={`text-sm font-bold ${adjustmentData[0]?.closingBalance >= 0 ? 'text-purple-700' : 'text-red-600'}`}>
                                                    {formatCurrency(adjustmentData[0]?.closingBalance || 0)}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Export Options */}
                            <div className="bg-gray-50 p-4 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-600">
                                        Data as of {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                            </svg>
                                            Export Report
                                        </button>
                                        <button
                                            onClick={clearSearch}
                                            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                            </svg>
                                            New Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {adjustmentDataTable && adjustmentData.length === 0 && (
                    <div className="mt-8 animate-fadeIn">
                        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-12 text-center">
                            <div className="bg-blue-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">No Adjustments Found</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                No adjustment records were found for Balance ID: <span className="font-semibold">{textBalanceId}</span>
                            </p>
                            <button
                                onClick={clearSearch}
                                className="px-6 py-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                Search Another Balance
                            </button>
                        </div>
                    </div>
                )}

                {/* Initial State Message */}
                {!adjustmentDataTable && !errorMessage && (
                    <div className="mt-12 text-center animate-fadeIn">
                        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 md:p-12 max-w-2xl mx-auto">
                            <div className="bg-blue-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">View Balance Adjustments</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                Enter a Balance ID above to view the complete adjustment history including opening balance, all adjustments, and closing balance.
                            </p>
                            <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Track all balance adjustments in chronological order</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}