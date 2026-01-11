"use client"
import React, { useState } from 'react'

export default function PrintCashFlow() {

    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables;
    const [cashFlowDate, setCashflowtDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Function to handle print cash flow
    const handlePrintCashFlow = () => {
        if (!cashFlowDate) {
            setErrorMessage("Please select a date first");
            return;
        }
        
        setErrorMessage("");
        setLoading(true);
        
        try {
            // Open new tab with cashflow details
            const newTab = window.open(`Printings/DisplayCashFlow?cashFlowDate=${cashFlowDate}`, '_blank');
            // Optional: focus on the new tab
            if (newTab) {
                newTab.focus();
            }
        } catch (error) {
            setErrorMessage("Failed to open cash flow. Please try again.");
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }

    const clearDate = () => {
        setCashflowtDate("");
        setErrorMessage("");
    };

    const formatDateDisplay = (dateString) => {
        if (!dateString) return "";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto animate-fadeIn">
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
                                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Print Cash Flow Statement
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    Generate cash flow statements for specific dates
                                </p>
                            </div>
                        </div>
                        {cashFlowDate && (
                            <div className="text-white text-sm bg-white/20 px-3 py-1 rounded-lg">
                                Selected: {cashFlowDate}
                            </div>
                        )}
                    </div>
                </div>

                {/* Control Card */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Cash Flow Date Selection
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Select a date to generate the cash flow statement
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={clearDate}
                                disabled={!cashFlowDate}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 
                                         rounded-lg transition-all duration-200 flex items-center gap-2
                                         disabled:opacity-50 disabled:cursor-not-allowed"
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
                                Clear Date
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cash Flow Date
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
                                    value={cashFlowDate}
                                    onChange={(e) => setCashflowtDate(e.target.value)}
                                    required
                                    className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                                             bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                             transition-all duration-200 shadow-sm"
                                />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handlePrintCashFlow}
                                disabled={loading || !cashFlowDate}
                                className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                         rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                         disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Opening...</span>
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
                                                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                            ></path>
                                        </svg>
                                        <span>Display Cash Flow</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <svg 
                                    className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" 
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
                                    <h4 className="text-sm font-semibold text-green-800 mb-1">
                                        Cash Flow Information
                                    </h4>
                                    <p className="text-sm text-green-700">
                                        Generate cash flow statements showing cash inflows and outflows for the selected date.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <svg 
                                    className="w-5 h-5 text-red-600 mr-2" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="2" 
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.282 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    ></path>
                                </svg>
                                <span className="text-sm text-red-700">{errorMessage}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Selected Date Info */}
                {cashFlowDate && !loading && (
                    <div className="mt-6 animate-fadeIn">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Ready to Generate Cash Flow
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Cash flow statement for {formatDateDisplay(cashFlowDate)}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                        Selected Date
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                    <div className="flex items-center">
                                        <svg 
                                            className="w-6 h-6 text-blue-600 mr-3" 
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
                                        <div>
                                            <p className="text-sm font-medium text-blue-800">Date Selected</p>
                                            <p className="text-lg font-bold text-blue-900">{cashFlowDate}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                                    <div className="flex items-center">
                                        <svg 
                                            className="w-6 h-6 text-green-600 mr-3" 
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
                                        <div>
                                            <p className="text-sm font-medium text-green-800">Status</p>
                                            <p className="text-lg font-bold text-green-900">Ready to Print</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                                    <div className="flex items-center">
                                        <svg 
                                            className="w-6 h-6 text-purple-600 mr-3" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24" 
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth="2" 
                                                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                            ></path>
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-purple-800">Action Required</p>
                                            <p className="text-lg font-bold text-purple-900">Click Display</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State - Before Date Selection */}
                {!cashFlowDate && !loading && (
                    <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-lg p-8 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="bg-gradient-to-r from-blue-100 to-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg 
                                    className="w-8 h-8 text-blue-600" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="2" 
                                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Generate Cash Flow Statement
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Select a date above to generate the cash flow statement.
                            </p>
                            <p className="text-sm text-gray-500">
                                The cash flow statement will display all financial transactions for the selected date.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}