"use client"
import React, { useState } from 'react'
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import { useEffect } from 'react';
import Spinner from '@/app/Spinner/page';

export default function PaymentReport() {

    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables;
    const [paymentReport, setPaymentReport] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loadingMessage, setloadingMessage] = useState(false);
    const [totalPayments, setTotalPayments] = useState(0);
    const [activePayments, setActivePayments] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [selectedType, setSelectedType] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");

    //Define getAccountData function;
    const getPaymentData = async () => {
        setPaymentReport(false);
        setErrorMessage("");
        setloadingMessage(true);
        try {
            const request = await fetch(`${baseUrl}/api/v1/reports/get-payment-report`, {
                method: "GET",
                credentials: "include",
            });
            const response = await request.json();
            if (request.status === 200) {
                const payments = response.responseObject || [];
                setPaymentDetails(payments);
                setFilteredPayments(payments);
                setPaymentReport(true);
                setTotalPayments(payments.length);

                // Calculate active payments
                const active = payments.filter(payment =>
                    payment.status && payment.status.toLowerCase() === 'active'
                ).length;
                setActivePayments(active);
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage("Response not received from server. Please contact administrator!");
        } finally {
            setloadingMessage(false);
        }
    }
    useEffect(() => {
        getPaymentData();
    }, []);

    // Get unique payment types and statuses for filters
    const paymentTypes = [...new Set(paymentDetails.map(payment => payment.paymentType).filter(Boolean))];
    const statusTypes = [...new Set(paymentDetails.map(payment => payment.status).filter(Boolean))];

    // Filter payments based on search term and filters
    useEffect(() => {
        let filtered = paymentDetails;

        if (searchTerm.trim()) {
            filtered = filtered.filter(payment =>
                payment.paymentType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.registeredBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.paymentId?.toString().includes(searchTerm)
            );
        }

        if (selectedType !== "all") {
            filtered = filtered.filter(payment => payment.paymentType === selectedType);
        }

        if (selectedStatus !== "all") {
            filtered = filtered.filter(payment => payment.status === selectedStatus);
        }

        setFilteredPayments(filtered);
    }, [searchTerm, selectedType, selectedStatus, paymentDetails]);

    const refreshData = () => {
        getPaymentData();
        setErrorMessage("");
        setSearchTerm("");
        setSelectedType("all");
        setSelectedStatus("all");
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
        } else if (statusLower === 'pending') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
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

    const getPaymentTypeBadge = (type) => {
        const typeLower = type?.toLowerCase();
        if (typeLower.includes('bank')) {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    {type}
                </span>
            );
        } else if (typeLower.includes('cash')) {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                    {type}
                </span>
            );
        } else if (typeLower.includes('card')) {
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
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateString;
        }
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
                                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Payment Methods Report
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    Overview of all registered payment methods in the system
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
                                    <p className="text-sm font-medium text-blue-800 mb-1">Total Payment Methods</p>
                                    <p className="text-3xl font-bold text-blue-900">{totalPayments}</p>
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
                                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-800 mb-1">Active Methods</p>
                                    <p className="text-3xl font-bold text-green-900">{activePayments}</p>
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

                        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-800 mb-1">Unique Types</p>
                                    <p className="text-3xl font-bold text-red-900">{paymentTypes.length}</p>
                                </div>
                                <div className="bg-red-200 p-3 rounded-full">
                                    <svg
                                        className="w-6 h-6 text-red-700"
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
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Payment Methods Directory
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Search and filter through all registered payment methods
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-semibold">{filteredPayments.length}</span> of <span className="font-semibold">{totalPayments}</span> methods
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
                                    placeholder="Search payments by type, ID, or registered by..."
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
                                Filter by Type
                            </label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="block w-full py-3 px-3 text-sm border border-gray-300 rounded-lg 
                                         bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                         transition-all duration-200 shadow-sm"
                            >
                                <option value="all">All Types</option>
                                {paymentTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Filter by Status
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="block w-full py-3 px-3 text-sm border border-gray-300 rounded-lg 
                                         bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                         transition-all duration-200 shadow-sm"
                            >
                                <option value="all">All Status</option>
                                {statusTypes.map((status, index) => (
                                    <option key={index} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Information Banner */}
                    <div className="bg-gradient-to-r from-blue-50 to-red-50 border border-blue-200 rounded-lg p-4 mb-6">
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
                                    Payment Methods Information
                                </h4>
                                <p className="text-sm text-blue-700">
                                    This report displays all registered payment methods in the system.
                                    Use the filters above to find specific payment methods or types.
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
                                <p className="mt-4 text-gray-600">Generating payment report...</p>
                            </div>
                        </div>
                    ) : paymentReport && filteredPayments.length > 0 ? (
                        /* Payments Table */
                        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Payment ID
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Payment Type
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Registration Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Registered By
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Deleted Info
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPayments.map((element) => (
                                            <tr
                                                key={element.paymentId}
                                                className="bg-white border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                                                        {element.paymentId}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getPaymentTypeBadge(element.paymentType)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {formatDate(element.registeredDate)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-900">
                                                        {element.registeredBy}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(element.status)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {element.deletedBy ? (
                                                        <div className="space-y-1">
                                                            <div className="text-xs text-red-600 font-medium">
                                                                Deleted by: {element.deletedBy}
                                                            </div>                                                            
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-500">-</span>
                                                    )}
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
                                        Displaying <span className="font-semibold">{filteredPayments.length}</span> payment method{filteredPayments.length !== 1 ? 's' : ''}
                                        {selectedType !== "all" && ` (${selectedType})`}
                                        {selectedStatus !== "all" && ` - ${selectedStatus}`}
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold">Active:</span> {activePayments}
                                            <span className="mx-2">•</span>
                                            <span className="font-semibold">Inactive:</span> {totalPayments - activePayments}
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
                    ) : paymentReport && filteredPayments.length === 0 ? (
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
                                    No Payment Methods Found
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {searchTerm || selectedType !== "all" || selectedStatus !== "all"
                                        ? 'No payment methods match your search criteria.'
                                        : 'No payment methods found in the system.'}
                                </p>
                                {(searchTerm || selectedType !== "all" || selectedStatus !== "all") && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedType("all");
                                            setSelectedStatus("all");
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