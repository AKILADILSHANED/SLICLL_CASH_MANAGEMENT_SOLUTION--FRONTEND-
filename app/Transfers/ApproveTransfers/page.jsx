"use client"
import React from 'react'
import Spinner from '@/app/Spinner/page'
import { useState } from 'react';
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import SUccessMessage from '@/app/Messages/SuccessMessage/page';
import { useEffect } from 'react';

export default function ApproveTransfers() {

    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables;
    const [approveList, setApproveList] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [approvingTransfer, setApprovingTransfer] = useState(null);
    const [totalPending, setTotalPending] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);

    //Define getTransferForApproving function;
    const getTransferForApproving = async () => {
        setErrorMessage("");
        setSuccessMessage("");
        setLoading(true);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/transfers/get-approve-list`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            const response = await request.json();
            if (request.status === 200) {
                const transfers = response.responseObject || [];
                setApproveList(transfers);
                setTotalPending(transfers.length);

                // Calculate total amount
                const total = transfers.reduce((sum, item) => {
                    return sum + (parseFloat(item.transferAmount) || 0);
                }, 0);
                setTotalAmount(total);
            } else {
                setErrorMessage(response.message || "Failed to load approval list");
            }
        } catch (error) {
            setErrorMessage("Response not received from server. Please contact administrator!");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getTransferForApproving();
    }, []);

    //Define approveTransfer function;
    const approveTransfer = async (transferId) => {
        setApprovingTransfer(transferId);
        setErrorMessage("");
        setSuccessMessage("");
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/transfers/approve-transfer?transferId=${transferId}`,
                {
                    method: "PUT",
                    credentials: "include"
                }
            );
            const response = await request.json();
            if (request.status === 200) {
                await getTransferForApproving();
                setSuccessMessage(response.message);

                // Auto-hide success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage("");
                }, 5000);
            } else {
                setErrorMessage(response.message || "Failed to approve transfer");
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("Response not received from server. Please contact administrator!");
        } finally {
            setApprovingTransfer(null);
        }
    }

    const refreshData = () => {
        getTransferForApproving();
        setSuccessMessage("");
        setErrorMessage("");
    };

    const formatCurrency = (amount) => {
        const number = parseFloat(amount || 0);
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(number);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto animate-fadeIn">
                {/* Header Card with Red/Blue Gradient */}
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
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Approve Transfers
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    Authorize and approve pending fund transfers
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
                        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-800 mb-1">Pending Approval</p>
                                    <p className="text-3xl font-bold text-red-900">{totalPending}</p>
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
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-800 mb-1">Total Amount</p>
                                    <p className="text-3xl font-bold text-blue-900">Rs.{formatCurrency(totalAmount)}</p>
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
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-800 mb-1">Ready to Approve</p>
                                    <p className="text-3xl font-bold text-green-900">{totalPending}</p>
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
                    </div>
                </div>

                {/* Information Banner */}
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-red-50 border border-blue-200 rounded-xl p-4">
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
                            <h4 className="text-sm font-semibold text-blue-800 mb-1">
                                Approval Authority Required
                            </h4>
                            <p className="text-sm text-gray-700">
                                Carefully review each transfer before approval. Ensure compliance with company policies and verify all transaction details are correct.
                            </p>
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
                <div className="mt-8 animate-fadeIn">
                    {loading ? (
                        /* Loading State */
                        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                                <Spinner size={40} />
                                <p className="mt-4 text-gray-600">Loading transfers for approval...</p>
                            </div>
                        </div>
                    ) : approveList && approveList.length > 0 ? (
                        <>
                            {/* Table Header */}
                            <div className="bg-gradient-to-r from-blue-50 to-red-50 border border-gray-200 rounded-t-xl p-5">
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
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                ></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800">
                                                Pending Transfers for Approval
                                            </h2>
                                            <p className="text-sm text-gray-600">
                                                {totalPending} transfers awaiting authorization • Total: Rs.{formatCurrency(totalAmount)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <span className="font-semibold">Approvals Required:</span> {totalPending}
                                    </div>
                                </div>
                            </div>

                            {/* Table Container */}
                            <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 font-semibold">
                                                    Transfer ID
                                                </th>
                                                <th scope="col" className="px-6 py-3 font-semibold">
                                                    Transfer Date
                                                </th>
                                                <th scope="col" className="px-6 py-3 font-semibold">
                                                    From Account
                                                </th>
                                                <th scope="col" className="px-6 py-3 font-semibold">
                                                    To Account
                                                </th>
                                                <th scope="col" className="px-6 py-3 font-semibold">
                                                    From Repo
                                                </th>
                                                <th scope="col" className="px-6 py-3 font-semibold">
                                                    To Repo
                                                </th>
                                                <th scope="col" className="px-6 py-3 font-semibold text-right">
                                                    Amount
                                                </th>
                                                <th scope="col" className="px-6 py-3 font-semibold text-center">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {approveList.map((element) => (
                                                <tr
                                                    key={element.transferId}
                                                    className="bg-white border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150"
                                                >
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                                                            {element.transferId}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            {element.transferDate}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 font-medium">
                                                            {element.fromAccount}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 font-medium">
                                                            {element.toAccount}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 font-medium">
                                                            {element.fromRepo}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 font-medium">
                                                            {element.toRepo}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            Rs.{formatCurrency(element.transferAmount)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center">
                                                            <button
                                                                onClick={() => approveTransfer(element.transferId)}
                                                                disabled={approvingTransfer === element.transferId}
                                                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                                                         rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                                                                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                                         disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[110px]"
                                                            >
                                                                {approvingTransfer === element.transferId ? (
                                                                    <>
                                                                        <Spinner size={16} />
                                                                        <span>Approving...</span>
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
                                                                                d="M5 13l4 4L19 7"
                                                                            ></path>
                                                                        </svg>
                                                                        <span>Approve</span>
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
                                            Showing <span className="font-semibold">{totalPending}</span> pending transfers
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-sm text-gray-600">
                                                <span className="font-semibold">Total Pending Amount:</span>
                                                <span className="ml-2 text-lg font-bold text-red-700">
                                                    Rs.{formatCurrency(totalAmount)}
                                                </span>
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
                                                <span>Refresh List</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="bg-green-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-green-500"
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
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    All Transfers Approved
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    There are no pending transfers requiring approval.
                                </p>
                                <p className="text-sm text-gray-500">
                                    New pending transfers will appear here automatically.
                                </p>
                                <button
                                    onClick={refreshData}
                                    className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 
                                             rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
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
                    )}
                </div>
            </div>
        </div>
    )
}