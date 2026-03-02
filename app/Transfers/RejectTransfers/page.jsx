"use client"
import React from 'react'
import Spinner from '@/app/Spinner/page'
import { useState } from 'react';
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import SUccessMessage from '@/app/Messages/SuccessMessage/page';

export default function RejectTransfers() {

    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables;
    const [viewSpinner, setViewSpinner] = useState(false);
    const [transferDataTable, settransferDataTable] = useState(false);
    const [transferData, setTransferData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [transferDate, setTransferDate] = useState("");
    const [rejectingCheck, setRejectingCheck] = useState(null);
    const [rejectingApproval, setRejectingApproval] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalTransfers, setTotalTransfers] = useState(0);

    //Define viewTransferData function;
    const viewTransferData = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");
        try {
            setViewSpinner(true)
            settransferDataTable(false);

            const request = await fetch(
                `${baseUrl}/api/v1/transfers/reject-transfers?transferDate=${encodeURIComponent(transferDate)}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const response = await request.json();
            if (request.status !== 200) {                
                setErrorMessage(response.message || "Failed to fetch transfers");
            } else {
                const transfers = response.responseObject || [];
                setTransferData(transfers);
                settransferDataTable(true);
                setTotalTransfers(transfers.length);

                // Calculate total amount
                const total = transfers.reduce((sum, item) => {
                    return sum + (parseFloat(item.transferAmount) || 0);
                }, 0);
                setTotalAmount(total);
            }

        } catch (error) {
            setErrorMessage("Response not received from server. Please contact administrator!");
        } finally {
            setViewSpinner(false);
        }
    }

    //Define handleRejectChecking function;
    const handleRejectChecking = async (transferId) => {
        setRejectingCheck(transferId);
        setErrorMessage("");
        setSuccessMessage("");
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/transfers/update-checking-rejection?transferId=${transferId}`,
                {
                    method: "PUT",
                    credentials: "include"
                }
            );
            const response = await request.json();
            if (request.status !== 200) {                
                setErrorMessage(response.message || "Failed to reject transfer");
            } else {
                setSuccessMessage(response.message);

                // Remove rejected transfer from list
                const updatedData = transferData.filter(item => item.transferId !== transferId);
                setTransferData(updatedData);
                setTotalTransfers(updatedData.length);

                // Recalculate total amount
                const total = updatedData.reduce((sum, item) => {
                    return sum + (parseFloat(item.transferAmount) || 0);
                }, 0);
                setTotalAmount(total);

                // Auto-hide success message
                setTimeout(() => {
                    setSuccessMessage("");
                }, 5000);
            }
        } catch (error) {
            setErrorMessage("Response not received from server. Please contact administrator!");
        } finally {
            setRejectingCheck(null);
        }
    }

    //Define handleRejectApproval function;
    const handleRejectApproval = async (transferId) => {
        setRejectingApproval(transferId);
        setErrorMessage("");
        setSuccessMessage("");
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/transfers/update-approval-rejection?transferId=${transferId}`,
                {
                    method: "PUT",
                    credentials: "include"
                }
            );
            const response = await request.json();
            if (request.status !== 200) {                
                setErrorMessage(response.message || "Failed to reject transfer");
            } else {
                setSuccessMessage(response.message);

                // Remove rejected transfer from list
                const updatedData = transferData.filter(item => item.transferId !== transferId);
                setTransferData(updatedData);
                setTotalTransfers(updatedData.length);

                // Recalculate total amount
                const total = updatedData.reduce((sum, item) => {
                    return sum + (parseFloat(item.transferAmount) || 0);
                }, 0);
                setTotalAmount(total);

                // Auto-hide success message
                setTimeout(() => {
                    setSuccessMessage("");
                }, 5000);
            }
        } catch (error) {
            setErrorMessage("Response not received from server. Please contact administrator!");
        } finally {
            setRejectingApproval(null);
        }
    }

    const formatCurrency = (amount) => {
        const number = parseFloat(amount || 0);
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(number);
    };

    const formatDateString = (dateString) => {
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
                <div className="bg-gradient-to-r from-red-600 via-red-700 to-blue-700 rounded-t-xl shadow-lg p-6 mb-0">
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
                                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Reject Transfers
                                </h1>
                                <p className="text-red-100 text-sm mt-1">
                                    Review and reject transfers for specific dates
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {transferDataTable && (
                                <div className="text-white text-sm bg-white/20 px-3 py-1 rounded-lg">
                                    {totalTransfers} transfers • Rs.{formatCurrency(totalAmount)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search Card */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Search Transfers by Date
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Select a date to view all transfers that can be rejected. This allows you to review and reject multiple transfers from a specific day.
                            </p>
                            <div className="bg-gradient-to-r from-red-50 to-blue-50 border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <svg
                                        className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
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
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">
                                            Warning: Rejecting transfers is a critical action. Ensure proper authorization before proceeding.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-6">
                            <form onSubmit={viewTransferData}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="transferDate" className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Transfer Date
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
                                                onChange={(e) => setTransferDate(e.target.value)}
                                                id="transferDate"
                                                type="date"
                                                value={transferDate}
                                                required
                                                className="block w-full pl-10 pr-3 py-3 text-base border border-gray-300 rounded-lg 
                                                         bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                                         transition-all duration-200 shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={viewSpinner || !transferDate}
                                        className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                                 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                                                 focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                 active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {viewSpinner ? (
                                            <>
                                                <Spinner size={20} />
                                                <span>Searching...</span>
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
                                                <span>Search Transfers</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {successMessage && (
                    <div className="mt-6 animate-slideDown">
                        <SUccessMessage messageValue={successMessage} />
                    </div>
                )}
                {errorMessage && (
                    <div className="mt-6 animate-slideDown">
                        <ErrorMessage messageValue={errorMessage} />
                    </div>
                )}

                {/* Transfers Table */}
                {transferDataTable && (
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
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            ></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Transfers for {formatDateString(transferDate)}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {totalTransfers} transfers found • Total amount: Rs.{formatCurrency(totalAmount)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span className="font-semibold">Actions Required:</span> Review each transfer carefully
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
                                                Transfer ID
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                From Account
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                To Account
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Amount
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Channel
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                From Repo
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                To Repo
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Initiated By
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap text-center">
                                                Checked Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap text-center">
                                                Approve Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap text-center">
                                                Action
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap text-center">
                                                Action
                                            </th>                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transferData.map((element) => (
                                            <tr
                                                key={element.transferId}
                                                className="bg-white border-b border-gray-200 hover:bg-red-50 transition-colors duration-150"
                                            >
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                                                        {element.transferId}
                                                    </div>
                                                </th>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 font-medium">
                                                        {element.fromAccount}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 font-medium">
                                                        {element.toAccount}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        Rs.{formatCurrency(element.transferAmount)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">
                                                        {element.channel}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">
                                                        {element.fromRepo}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">
                                                        {element.toRepo}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">
                                                        {element.initiatedBy}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">
                                                        {element.checkedStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">
                                                        {element.approveStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center justify-center">
                                                        <button
                                                            onClick={() => handleRejectChecking(element.transferId)}
                                                            disabled={rejectingCheck === element.transferId}
                                                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                                                                     rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                                                                     focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                                     active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                                     disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[110px]"
                                                        >
                                                            {rejectingCheck === element.transferId ? (
                                                                <>
                                                                    <Spinner size={16} />
                                                                    <span>Rejecting...</span>
                                                                </>
                                                            ) : (
                                                                <>
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
                                                                    <span>Reject Check</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center justify-center">
                                                        <button
                                                            onClick={() => handleRejectApproval(element.transferId)}
                                                            disabled={rejectingApproval === element.transferId}
                                                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                                                                     rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                                                                     focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                                     active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                                     disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[110px]"
                                                        >
                                                            {rejectingApproval === element.transferId ? (
                                                                <>
                                                                    <Spinner size={16} />
                                                                    <span>Rejecting...</span>
                                                                </>
                                                            ) : (
                                                                <>
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
                                                                    <span>Reject Approval</span>
                                                                </>
                                                            )}
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
                                        Showing <span className="font-semibold">{totalTransfers}</span> transfers for {formatDateString(transferDate)}
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold">Total Amount:</span>
                                            <span className="ml-2 text-lg font-bold text-red-700">
                                                Rs.{formatCurrency(totalAmount)}
                                            </span>
                                        </div>
                                        {transferData.length === 0 && (
                                            <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                                                All transfers processed for this date
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State - Before Search */}
                {!transferDataTable && !viewSpinner && (
                    <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-lg p-8 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-blue-500"
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
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Search Transfers by Date
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Select a date above to view transfers that require review and potential rejection.
                            </p>
                            <p className="text-sm text-gray-500">
                                All transfers from the selected date will be displayed for your review.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}