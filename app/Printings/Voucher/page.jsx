"use client"
import React from 'react'
import Spinner from '@/app/Spinner/page'
import { useState } from 'react';
import ErrorMessage from '@/app/Messages/ErrorMessage/page';

export default function PrintVoucherAndLetters() {
    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables;
    const [viewSpinner, setViewSpinner] = useState(false);
    const [sheetDate, setSheetDate] = useState("");
    const [sheetData, setSheetData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [sheetDataTable, setSheetDataTable] = useState();
    const [totalTransfers, setTotalTransfers] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    //Define getSheetData function;
    const getSheetData = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSheetDataTable(false);
        setViewSpinner(true);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/printing/getTransferList?transferDate=${sheetDate}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            const response = await request.json();
            if (request.status === 200) {                
                const data = response.responseObject || [];
                setSheetData(data);
                setSheetDataTable(true);
                setTotalTransfers(data.length);
                
                // Calculate total amount
                const total = data.reduce((sum, item) => {
                    return sum + (parseFloat(item.transferAmount) || 0);
                }, 0);
                setTotalAmount(total);
            } else {
                setErrorMessage(response.message);
                setSheetDataTable(false);
            }
        } catch (error) {
            setErrorMessage("Response not received from server. Please contact administrator!");
            setSheetDataTable(false);
        } finally {
            setViewSpinner(false);
        }
    }

    // Function to handle print voucher
    const handlePrintVoucher = (voucherId) => {
        // Open new tab with voucher details
        const newTab = window.open(`/Printings/DisplayVoucher?voucherId=${voucherId}`, '_blank');        
        // Optional: focus on the new tab
        if (newTab) {
            newTab.focus();
        }
    }

    // Function to handle print ibt letter
    const handlePrintLetter = (voucherId) => {
        // Open new tab with voucher details
        const newTab = window.open(`/Printings/DisplayIBTLtter?voucherId=${voucherId}`, '_blank');        
        // Optional: focus on the new tab
        if (newTab) {
            newTab.focus();
        }
    }

    // Function to handle print rtgs letter
    const handlePrintRtgsLetter = (voucherId) => {
        // Open new tab with voucher details
        const newTab = window.open(`/Printings/DisplayRTGSLetter?voucherId=${voucherId}`, '_blank');        
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

    const clearFilters = () => {
        setSheetDate("");
        setSheetDataTable(false);
        setErrorMessage("");
        setSheetData([]);
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
                                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Print Vouchers & Letters
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    Generate and print transfer vouchers, IBT letters, and RTGS letters
                                </p>
                            </div>
                        </div>
                        {sheetDataTable && (
                            <div className="text-white text-sm bg-white/20 px-3 py-1 rounded-lg">
                                {totalTransfers} transfers • Rs.{formatCurrency(totalAmount)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Control Card */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Transfer Date Selection
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Select a date to view transfers for printing
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 
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
                                        d="M6 18L18 6M6 6l12 12"
                                    ></path>
                                </svg>
                                Clear
                            </button>
                        </div>
                    </div>

                    <form onSubmit={getSheetData}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Transfer Date
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
                                        value={sheetDate}
                                        onChange={(e) => setSheetDate(e.target.value)}
                                        required
                                        className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                                                 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                                 transition-all duration-200 shadow-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={viewSpinner || !sheetDate}
                                    className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                             rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                             disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {viewSpinner ? (
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
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                ></path>
                                            </svg>
                                            <span>View Transfers</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="bg-gradient-to-r from-red-50 to-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <svg 
                                        className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" 
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
                                        <h4 className="text-sm font-semibold text-red-800 mb-1">
                                            Printing Information
                                        </h4>
                                        <p className="text-sm text-red-700">
                                            View transfers for a specific date and print vouchers, IBT letters, or RTGS letters as needed.
                                        </p>
                                    </div>
                                </div>
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

                {/* Transfers Table */}
                {sheetDataTable && (
                    <div className="mt-8 animate-fadeIn">
                        {/* Table Header */}
                        <div className="bg-gradient-to-r from-red-50 to-blue-50 border border-gray-200 rounded-t-xl p-5">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-red-100 p-2 rounded-lg">
                                        <svg 
                                            className="w-5 h-5 text-red-600" 
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
                                            ></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Transfers for {formatDateDisplay(sheetDate)}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {totalTransfers} transfers found • Total amount: Rs.{formatCurrency(totalAmount)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span className="font-semibold">Date:</span> {sheetDate}
                                </div>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table id="ibt-sheet-table" className="min-w-full border border-blue-600 table-fixed">
                                    <thead className="bg-blue-50">
                                        <tr>
                                            <th className="border border-blue-600 text-sm px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap w-28">Voucher No</th>
                                            <th className="border border-blue-600 text-sm px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap w-48">From Bank</th>
                                            <th className="border border-blue-600 text-sm px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap w-36">From Account</th>
                                            <th className="border border-blue-600 text-sm px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap w-48">To Bank</th>
                                            <th className="border border-blue-600 text-sm px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap w-36">To Account</th>
                                            <th className="border border-blue-600 text-sm px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap w-32">Amount</th>
                                            <th className="border border-blue-600 text-sm px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap w-28">Channel</th>
                                            <th className="border border-blue-600 text-sm px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap w-36">Print Options</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {sheetData.map((element) => (
                                            <tr key={element.transferId} className="hover:bg-red-50 transition duration-150">
                                                <td className="border border-blue-600 text-sm px-4 py-3 text-gray-600 font-medium">
                                                    {element.transferId}
                                                </td>
                                                <td className="border border-blue-600 text-sm px-4 py-3 text-gray-600">{element.fromBank}</td>
                                                <td className="border border-blue-600 text-sm px-4 py-3 text-gray-600">{element.fromAccount}</td>
                                                <td className="border border-blue-600 text-sm px-4 py-3 text-gray-600">{element.toBank}</td>
                                                <td className="border border-blue-600 text-sm px-4 py-3 text-gray-600">{element.toAccount}</td>
                                                <td className="border border-blue-600 text-sm px-4 py-3 text-gray-600 text-right font-semibold">
                                                    Rs.{formatCurrency(element.transferAmount)}
                                                </td>
                                                <td className="border border-blue-600 text-sm px-4 py-3 text-gray-600">
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                                        {element.channel}
                                                    </span>
                                                </td>
                                                <td className="border border-blue-600 text-sm px-4 py-3">
                                                    <div className="flex flex-col gap-2">
                                                        <button
                                                            onClick={() => handlePrintRtgsLetter(element.transferId)}
                                                            className="px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-700 
                                                                     rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 
                                                                     focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                                     active:translate-y-0 shadow-sm hover:shadow flex items-center justify-center gap-1"
                                                        >
                                                            <svg 
                                                                className="w-3 h-3" 
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
                                                                ></path>
                                                            </svg>
                                                            RTGS Letter
                                                        </button>
                                                        <button
                                                            onClick={() => handlePrintLetter(element.transferId)}
                                                            className="px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                                                     rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 
                                                                     focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                                     active:translate-y-0 shadow-sm hover:shadow flex items-center justify-center gap-1"
                                                        >
                                                            <svg 
                                                                className="w-3 h-3" 
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
                                                                ></path>
                                                            </svg>
                                                            IBT Letter
                                                        </button>
                                                        <button
                                                            onClick={() => handlePrintVoucher(element.transferId)}
                                                            className="px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                                                                     rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-2 focus:ring-red-500 
                                                                     focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                                     active:translate-y-0 shadow-sm hover:shadow flex items-center justify-center gap-1"
                                                        >
                                                            <svg 
                                                                className="w-3 h-3" 
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
                                                                ></path>
                                                            </svg>
                                                            Voucher
                                                        </button>
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
                                        Showing <span className="font-semibold">{totalTransfers}</span> transfer{totalTransfers !== 1 ? 's' : ''} for printing
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold">Total Amount:</span> 
                                            <span className="ml-2 text-lg font-bold text-red-700">
                                                Rs.{formatCurrency(totalAmount)}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold">Ready for Print</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State - Before Search */}
                {!sheetDataTable && !viewSpinner && (
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
                                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Print Vouchers & Letters
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Select a date above to view transfers available for printing.
                            </p>
                            <p className="text-sm text-gray-500">
                                You can print vouchers, IBT letters, or RTGS letters for each transfer.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}