"use client"
import React, { useState } from 'react'
import { useEffect } from 'react';
import Spinner from '@/app/Spinner/page';
import ErrorMessage from '@/app/Messages/ErrorMessage/page';

export default function RequestHistory({ onCancel }) {
    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables;
    const [loadedPayments, setLoadedPayments] = useState([]);
    const [errorMessage, setErrorMessage] = useState();
    const [historyTable, setHistoryTable] = useState(false);
    const [viewSpinner, setViewSpinner] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [paymentType, setPaymentType] = useState(1);
    const [historyData, setHistoryData] = useState([]);
    const [totalRequests, setTotalRequests] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [approvedRequests, setApprovedRequests] = useState(0);

    //Define loadPayments function;
    const loadPaymentList = async () => {
        try {
            const request = await fetch(`${baseUrl}/api/v1/payment/getPaymentList`, {
                method: "GET",
                credentials: "include",
            });
            if (request.ok) {
                const response = await request.json();
                if (response.success == false) {
                    setErrorMessage(response.message);
                } else {
                    setLoadedPayments(response.responseObject);
                }
            } else {
                setErrorMessage("No response from server!");
            }
        } catch (error) {
            setErrorMessage("Unexpected error occurred. Please contact administrator!");
        }
    };
    useEffect(() => {
        loadPaymentList();
    }, []);

    //Define handleGetRequestHistory function;
    const handleGetRequestHistory = async (e) => {
        e.preventDefault()
        try {
            setErrorMessage("");
            setViewSpinner(true);
            setHistoryTable(false);
            const request = await fetch(
                `${baseUrl}/api/v1/reports/fundRequestHistory?fromDate=${fromDate}&toDate=${toDate}&paymentId=${paymentType}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if (!request.ok) {
                const response = await request.json();
                setErrorMessage(response.message || "Failed to load request history");
            } else {
                const response = await request.json();
                const requests = response.responseObject || [];
                setHistoryData(requests);
                setHistoryTable(true);
                setTotalRequests(requests.length);

                // Calculate total amount and approved requests
                const total = requests.reduce((sum, item) => {
                    return sum + (parseFloat(item.requestAmount) || 0);
                }, 0);
                setTotalAmount(total);

                const approved = requests.filter(request =>
                    request.approveStatus && request.approveStatus.toLowerCase() === 'approved'
                ).length;
                setApprovedRequests(approved);
            }
        } catch (error) {
            setErrorMessage("Unexpected error occurred. Please contact the administrator!");
        } finally {
            setViewSpinner(false);
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

    const getStatusBadge = (status) => {
        const statusLower = status?.toLowerCase();
        if (statusLower === 'approved') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                    {status}
                </span>
            );
        } else if (statusLower === 'pending') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                    {status}
                </span>
            );
        } else if (statusLower === 'rejected') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                    {status}
                </span>
            );
        } else if (statusLower === 'cancelled') {
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

    const clearFilters = () => {
        setFromDate("");
        setToDate("");
        setPaymentType(1);
        setHistoryTable(false);
        setErrorMessage("");
    };

    const getSelectedPaymentType = () => {
        if (paymentType == 1) return "All Payments";
        const selected = loadedPayments.find(p => p.paymentId == paymentType);
        return selected ? selected.paymentType : "All Payments";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto animate-fadeIn">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-t-xl shadow-lg p-6 mb-0">
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
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Fund Request History
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    Track and analyze fund request history with detailed filtering
                                </p>
                            </div>
                        </div>
                        {historyTable && (
                            <div className="text-white text-sm bg-white/20 px-3 py-1 rounded-lg">
                                {totalRequests} requests • Rs.{formatCurrency(totalAmount)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Filter Card */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Request History Filters
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Filter fund requests by date range and payment type
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
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleGetRequestHistory}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Date Range Row */}
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        From Required Date
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
                                            required
                                            value={fromDate}
                                            onChange={(e) => setFromDate(e.target.value)}
                                            className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                                                     bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                                     transition-all duration-200 shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        To Required Date
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
                                            required
                                            value={toDate}
                                            onChange={(e) => setToDate(e.target.value)}
                                            className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                                                     bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                                     transition-all duration-200 shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Type Row */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Type
                                </label>
                                <select
                                    value={paymentType}
                                    onChange={(e) => setPaymentType(e.target.value)}
                                    required
                                    className="block w-full py-3 px-3 text-sm border border-gray-300 rounded-lg 
                                             bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                             transition-all duration-200 shadow-sm"
                                >
                                    <option value={1}>All Payments</option>
                                    {loadedPayments.map((element) => (
                                        <option key={element.paymentId} value={element.paymentId}>
                                            {element.paymentType}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end space-x-4">
                                <button
                                    type="submit"
                                    disabled={viewSpinner || !fromDate || !toDate}
                                    className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
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
                                            <span>View History</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                                             rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                                             focus:outline-none transition-all duration-200 flex items-center justify-center gap-2"
                                >
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
                                            d="M6 18L18 6M6 6l12 12"
                                        ></path>
                                    </svg>
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Information Banner */}
                    <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <svg
                                className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0"
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
                                <h4 className="text-sm font-semibold text-purple-800 mb-1">
                                    Request History Information
                                </h4>
                                <p className="text-sm text-purple-700">
                                    View historical fund requests within a specific date range.
                                    Filter by payment type to analyze request patterns and approval status.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className="mt-6 animate-slideDown">
                        <ErrorMessage messageValue={errorMessage} />
                    </div>
                )}

                {/* History Table */}
                {historyTable && (
                    <div className="mt-8 animate-fadeIn">
                        {/* Table Header */}
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-gray-200 rounded-t-xl p-5">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-purple-100 p-2 rounded-lg">
                                        <svg
                                            className="w-5 h-5 text-purple-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Fund Request History Results
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {totalRequests} requests found • Total amount: Rs.{formatCurrency(totalAmount)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Payment Type: {getSelectedPaymentType()} • {approvedRequests} approved requests
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span className="font-semibold">Date Range:</span> {formatDate(fromDate)} to {formatDate(toDate)}
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
                                                Request ID
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Request Dates
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap text-right">
                                                Amount
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Account Details
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Payment Type
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Requested By
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyData.map((element) => (
                                            <tr
                                                key={element.requestId}
                                                className="bg-white border-b border-gray-200 hover:bg-purple-50 transition-colors duration-150"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                                                        {element.requestId}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="text-sm text-gray-900">
                                                            <span className="font-medium">Request:</span> {formatDate(element.requestDate)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            <span className="font-medium">Required:</span> {formatDate(element.requiredDate)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        Rs.{formatCurrency(element.requestAmount)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {element.accountNumber}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-900">
                                                        {element.paymentType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(element.approveStatus)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-900">
                                                        {element.requestBy}
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
                                        Showing <span className="font-semibold">{totalRequests}</span> request{totalRequests !== 1 ? 's' : ''}
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold">Total Amount:</span>
                                            <span className="ml-2 text-lg font-bold text-blue-700">
                                                Rs.{formatCurrency(totalAmount)}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold">Approved:</span> {approvedRequests}
                                            <span className="mx-2">•</span>
                                            <span className="font-semibold">Pending:</span> {totalRequests - approvedRequests}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State - Before Search */}
                {!historyTable && !viewSpinner && (
                    <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-lg p-8 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Generate Fund Request History
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Select a date range and payment type above to generate your fund request history report.
                            </p>
                            <p className="text-sm text-gray-500">
                                The report will display all fund requests within your selected criteria.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}