"use client"
import React, { Suspense } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation'

function CashFlowContent() {
    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables;
    const searchParams = useSearchParams();
    const [cashFlowComponent, setCashFlowComponent] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [repoOpeningBlance, setRepoOpeningBlance] = useState([]);
    const [repoClosingBlance, setRepoClosingBlance] = useState([]);
    const [accountBalanceList, setAccountBalanceList] = useState([]);
    const [overdraftBalances, setOverdraftBalances] = useState([]);
    const [fundRequestList, setFundRequestList] = useState([]);
    const repoDate = searchParams.get('cashFlowDate');

    // Get current date in dd/mm/yyyy format
    const getCurrentDateFormatted = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Format date from URL parameter for display
    const formatDisplayDate = (dateString) => {
        if (!dateString) return getCurrentDateFormatted();
        try {
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
        } catch (error) {
            return dateString;
        }
    };

    //Define fetchOpeningRepoData function;
    const fetchOpeningRepoData = async () => {
        if (!repoDate) {
            setError("No Cash Flow date provided");
            setLoading(false);
            return;
        }
        try {
            setCashFlowComponent(false);
            setError("");
            const request = await fetch(
                `${baseUrl}/api/v1/repo/get-repo-opening-balances?repoDate=${repoDate}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if (request.ok) {
                const response = await request.json();
                setCashFlowComponent(true);
                setRepoOpeningBlance(response.responseObject);
            } else {
                const response = await request.json();
                setError(response.message);
            }
        } catch (error) {
            console.log(error);
            setError("Unexpected error occurred. Please contact administrator!");
        }
    }

    //Define fetchAccountBalances function;
    const fetchAccountBalances = async () => {
        if (!repoDate) {
            setError("No Cash Flow date provided");
            setLoading(false);
            return;
        }
        try {
            setCashFlowComponent(false);
            setError("");
            const request = await fetch(
                `${baseUrl}/api/v1/account-balance/get-account-balances?balanceDate=${repoDate}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if (request.ok) {
                const response = await request.json();
                setCashFlowComponent(true);
                setAccountBalanceList(response.responseObject);
            } else {
                const response = await request.json();
                setError(response.message);
            }
        } catch (error) {
            console.log(error);
            setError("Unexpected error occurred. Please contact administrator!");
        }
    }

    //Define fetchRequestBalances function;
    const fetchRequestBalances = async () => {
        if (!repoDate) {
            setError("No Cash Flow date provided");
            setLoading(false);
            return;
        }
        try {
            setCashFlowComponent(false);
            setError("");
            const request = await fetch(
                `${baseUrl}/api/v1/fund-request/get-request-balances?requestDate=${repoDate}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if (request.ok) {
                const response = await request.json();
                setCashFlowComponent(true);
                setFundRequestList(response.responseObject);
            } else {
                const response = await request.json();
                setError(response.message);
            }
        } catch (error) {
            console.log(error);
            setError("Unexpected error occurred. Please contact administrator!");
        }
    }

    //Define fetchRepoClosingBalances function;
    const fetchRepoClosingBalances = async () => {
        if (!repoDate) {
            setError("No Cash Flow date provided");
            setLoading(false);
            return;
        }
        try {
            setCashFlowComponent(false);
            setError("");
            const request = await fetch(
                `${baseUrl}/api/v1/repo/get-repo-closing-balances?repoDate=${repoDate}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if (request.ok) {
                const response = await request.json();
                setCashFlowComponent(true);
                setRepoClosingBlance(response.responseObject);
            } else {
                const response = await request.json();
                setError(response.message);
            }
        } catch (error) {
            console.log(error);
            setError("Unexpected error occurred. Please contact administrator!");
        }
    }

    //Define fetchOverdraftBalances function;
    const fetchOverdraftBalances = async () => {
        if (!repoDate) {
            setError("No Cash Flow date provided");
            setLoading(false);
            return;
        }
        try {
            setCashFlowComponent(false);
            setError("");
            const request = await fetch(
                `${baseUrl}/api/v1/account-balance/get-overdraft-balances?balanceDate=${repoDate}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if (request.ok) {
                const response = await request.json();
                setCashFlowComponent(true);
                setOverdraftBalances(response.responseObject);
            } else {
                const response = await request.json();
                setError(response.message);
            }
        } catch (error) {
            console.log(error);
            setError("Unexpected error occurred. Please contact administrator!");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchAllData = async () => {
            await Promise.all([
                fetchOpeningRepoData(),
                fetchAccountBalances(),
                fetchRequestBalances(),
                fetchRepoClosingBalances(),
                fetchOverdraftBalances()
            ]);
        };

        fetchAllData();
    }, [repoDate, baseUrl]);

    //Calculate total repo balances
    const repoTotal = repoOpeningBlance.reduce((sum, element) => {
        const balance = parseFloat(element.balance) || 0;
        return sum + balance;
    }, 0);

    //Calculate total account balances
    const accountBalanceTotal = accountBalanceList.reduce((sum, element) => {
        const balance = parseFloat(element.balance) || 0;
        return sum + balance;
    }, 0);

    //Calculate total cash in flow
    const totalCashInFlow = repoTotal + accountBalanceTotal;

    //Calculate totalCashOutFlow
    const totalOutFlow = fundRequestList.reduce((sum, element) => {
        const amount = parseFloat(element.amount) || 0;
        return sum + amount;
    }, 0);

    //Calculate overdraftRecovery
    const overdraftRecovery = overdraftBalances.reduce((sum, element) => {
        const overdraftBalance = parseFloat(element.overdraftBalance) || 0;
        return sum + overdraftBalance;
    }, 0);

    //Calculate Total Cash Out Flow
    const totalOutflow = totalOutFlow - overdraftRecovery;

    //Calculate Net Cash Flow
    const netCashFlow = totalCashInFlow - totalOutflow;

    //Calculate Total Repo Investments
    const totalRepoInvestments = repoClosingBlance.reduce((sum, element) => {
        const investValue = parseFloat(element.investValue) || 0;
        return sum + investValue;
    }, 0);

    //Calculate outstanding cash in flow
    const outstanding = netCashFlow - totalRepoInvestments;

    // Print handler
    const handlePrint = () => {
        window.print();
    };

    return <div className="min-h-screen bg-gray-50 p-4 print:p-0">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:max-w-full">
            {/* Header with print button (hidden when printing) */}
            <div className="p-6 border-b print:hidden">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Cash Flow Statement</h1>
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Statement
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="p-8 print:p-6">
                {/* Company Header */}
                <div className="text-center mb-8 border-b pb-6 print:pb-4">
                    <div className="mb-2">
                        <h1 className="text-3xl font-bold text-gray-900 print:text-2xl">
                            Sri Lanka Insurance Corporation Life Ltd
                        </h1>
                        <p className="text-lg font-semibold text-gray-700 mt-1 print:text-base">
                            Fund Position - Life Fund
                        </p>
                    </div>
                    <div className="mt-4">
                        <p className="text-gray-600">
                            As at: <span className="font-bold">{repoDate ? formatDisplayDate(repoDate) : getCurrentDateFormatted()}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Generated on: {getCurrentDateFormatted()}
                        </p>
                    </div>
                </div>

                {/* Loading and Error States */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Generating Cash Flow Statement...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-red-700 font-medium">Error: {error}</p>
                        </div>
                    </div>
                )}

                {/* Cash Flow Table */}
                {cashFlowComponent && !loading && !error && (
                    <div className="overflow-x-auto print:overflow-visible">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-300 print:border">
                            <thead className="bg-gray-50 print:bg-gray-100">
                                <tr>
                                    <th rowSpan={2} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 align-top print:px-3 print:py-2">
                                        Description
                                    </th>
                                    <th colSpan={2} className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300 print:px-3 print:py-2">
                                        Amount (Rs.)
                                    </th>
                                </tr>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 border-r border-gray-300 print:px-3 print:py-2">
                                        Details
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 print:px-3 print:py-2">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* Cash In Flow - Repo Balances */}
                                <tr className="bg-blue-50 print:bg-gray-50">
                                    <td className="px-4 py-3 font-bold text-blue-800 text-sm uppercase print:px-3 print:py-2">
                                        (+) CASH IN FLOW (Repo Balances)
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300 print:px-3 print:py-2"></td>
                                    <td className="px-4 py-3 print:px-3 print:py-2"></td>
                                </tr>

                                {repoOpeningBlance.map((element) => (
                                    <tr key={element.repoId} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-gray-700 text-sm print:px-3 print:py-1">
                                            {element.repoId} ({element.bankAccount})
                                        </td>
                                        <td className="px-4 py-2 text-right text-gray-600 border-r border-gray-300 print:px-3 print:py-1">
                                            {element.balance && parseFloat(element.balance).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </td>
                                        <td className="px-4 py-2 print:px-3 print:py-1"></td>
                                    </tr>
                                ))}

                                <tr className="bg-gray-50 font-semibold">
                                    <td className="px-4 py-2 text-gray-800 print:px-3 print:py-1">
                                        TOTAL Repo Value
                                    </td>
                                    <td className="px-4 py-2 border-r border-gray-300 print:px-3 print:py-1"></td>
                                    <td className="px-4 py-2 text-right font-bold text-gray-900 print:px-3 print:py-1">
                                        {repoTotal.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </td>
                                </tr>

                                {/* Cash In Flow - Account Balances */}
                                <tr className="bg-blue-50 print:bg-gray-50">
                                    <td className="px-4 py-3 font-bold text-blue-800 text-sm uppercase print:px-3 print:py-2">
                                        (+) CASH IN FLOW (Account Balances)
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300 print:px-3 print:py-2"></td>
                                    <td className="px-4 py-3 print:px-3 print:py-2"></td>
                                </tr>

                                {accountBalanceList.map((element) => (
                                    <tr key={element.accountNumber} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-gray-700 text-sm print:px-3 print:py-1">
                                            {element.accountNumber}
                                        </td>
                                        <td className="px-4 py-2 text-right text-gray-600 border-r border-gray-300 print:px-3 print:py-1">
                                            {element.balance && parseFloat(element.balance).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </td>
                                        <td className="px-4 py-2 print:px-3 print:py-1"></td>
                                    </tr>
                                ))}

                                <tr className="bg-gray-50 font-semibold">
                                    <td className="px-4 py-2 text-gray-800 print:px-3 print:py-1">
                                        Total Account Collection
                                    </td>
                                    <td className="px-4 py-2 border-r border-gray-300 print:px-3 print:py-1"></td>
                                    <td className="px-4 py-2 text-right font-bold text-gray-900 print:px-3 print:py-1">
                                        {accountBalanceTotal.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </td>
                                </tr>

                                {/* Total Cash In Flow */}
                                <tr className="bg-green-50 border-t-2 border-gray-300">
                                    <td className="px-4 py-3 font-bold text-green-800 print:px-3 print:py-2">
                                        TOTAL CASH IN FLOW
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300 print:px-3 print:py-2"></td>
                                    <td className="px-4 py-3 text-right font-bold text-green-900 text-lg print:px-3 print:py-2">
                                        {totalCashInFlow.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </td>
                                </tr>

                                {/* Cash Out Flow - Payments */}
                                <tr className="bg-red-50 print:bg-gray-50">
                                    <td className="px-4 py-3 font-bold text-red-800 text-sm uppercase print:px-3 print:py-2">
                                        (-) CASH OUT FLOW (Payments)
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300 print:px-3 print:py-2"></td>
                                    <td className="px-4 py-3 print:px-3 print:py-2"></td>
                                </tr>

                                {fundRequestList.map((element) => (
                                    <tr key={element.requestId} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-gray-700 text-sm print:px-3 print:py-1">
                                            {element.requestId} ({element.payment})
                                        </td>
                                        <td className="px-4 py-2 text-right text-red-600 border-r border-gray-300 print:px-3 print:py-1">
                                            -{element.amount && parseFloat(element.amount).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </td>
                                        <td className="px-4 py-2 print:px-3 print:py-1"></td>
                                    </tr>
                                ))}

                                <tr className="bg-gray-50 font-semibold">
                                    <td className="px-4 py-2 text-gray-800 print:px-3 print:py-1">
                                        Total Cash Out Flow (Payments)
                                    </td>
                                    <td className="px-4 py-2 border-r border-gray-300 print:px-3 print:py-1"></td>
                                    <td className="px-4 py-2 text-right font-bold text-red-700 print:px-3 print:py-1">
                                        -{totalOutFlow.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </td>
                                </tr>

                                {/* Overdraft Recovery */}
                                <tr className="bg-red-50 print:bg-gray-50">
                                    <td className="px-4 py-3 font-bold text-red-800 text-sm uppercase print:px-3 print:py-2">
                                        (-) Overdraft Recovery
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300 print:px-3 print:py-2"></td>
                                    <td className="px-4 py-3 print:px-3 print:py-2"></td>
                                </tr>

                                {overdraftBalances.map((element) => (
                                    <tr key={element.balanceId} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-gray-700 text-sm print:px-3 print:py-1">
                                            {element.balanceId} ({element.accountNumber})
                                        </td>
                                        <td className="px-4 py-2 text-right text-gray-600 border-r border-gray-300 print:px-3 print:py-1">
                                            {element.overdraftBalance && parseFloat(element.overdraftBalance).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </td>
                                        <td className="px-4 py-2 print:px-3 print:py-1"></td>
                                    </tr>
                                ))}

                                <tr className="bg-gray-50 font-semibold">
                                    <td className="px-4 py-2 text-gray-800 print:px-3 print:py-1">
                                        Total Overdraft Recovery
                                    </td>
                                    <td className="px-4 py-2 border-r border-gray-300 print:px-3 print:py-1"></td>
                                    <td className="px-4 py-2 text-right font-bold text-gray-900 print:px-3 print:py-1">
                                        {overdraftRecovery.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </td>
                                </tr>

                                {/* Total Cash Out Flow */}
                                <tr className="bg-red-50 border-t-2 border-gray-300">
                                    <td className="px-4 py-3 font-bold text-red-800 print:px-3 print:py-2">
                                        TOTAL CASH OUT FLOW
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300 print:px-3 print:py-2"></td>
                                    <td className="px-4 py-3 text-right font-bold text-red-700 text-lg print:px-3 print:py-2">
                                        -{totalOutflow.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </td>
                                </tr>

                                {/* Net Cash Flow */}
                                <tr className="bg-blue-100 border-t-2 border-b-2 border-gray-300">
                                    <td className="px-4 py-4 font-bold text-blue-900 text-lg print:px-3 print:py-3">
                                        NET CASH FLOW
                                    </td>
                                    <td className="px-4 py-4 border-r border-gray-300 print:px-3 print:py-3"></td>
                                    <td className="px-4 py-4 text-right font-bold text-blue-900 text-xl print:px-3 print:py-3">
                                        {netCashFlow.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </td>
                                </tr>

                                {/* Repo Investments */}
                                <tr className="bg-purple-50 print:bg-gray-50">
                                    <td className="px-4 py-3 font-bold text-purple-800 text-sm uppercase print:px-3 print:py-2">
                                        Repo Investments
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-300 print:px-3 print:py-2"></td>
                                    <td className="px-4 py-3 print:px-3 print:py-2"></td>
                                </tr>

                                {repoClosingBlance.map((element) => (
                                    <tr key={element.repoId} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-gray-700 text-sm print:px-3 print:py-1">
                                            {element.repoId} ({element.account}) - ({element.repoType})
                                        </td>
                                        <td className="px-4 py-2 text-right text-gray-600 border-r border-gray-300 print:px-3 print:py-1">
                                            {element.investValue && parseFloat(element.investValue).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </td>
                                        <td className="px-4 py-2 print:px-3 print:py-1"></td>
                                    </tr>
                                ))}

                                <tr className="bg-gray-50 font-semibold">
                                    <td className="px-4 py-2 text-gray-800 print:px-3 print:py-1">
                                        Total Repo Investments
                                    </td>
                                    <td className="px-4 py-2 border-r border-gray-300 print:px-3 print:py-1"></td>
                                    <td className="px-4 py-2 text-right font-bold text-gray-900 print:px-3 print:py-1">
                                        {totalRepoInvestments.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </td>
                                </tr>

                                {/* Outstanding Balance */}
                                <tr className="bg-yellow-50 border-t-2 border-gray-300">
                                    <td className="px-4 py-4 font-bold text-yellow-800 print:px-3 print:py-3">
                                        OUTSTANDING BALANCE
                                    </td>
                                    <td className="px-4 py-4 border-r border-gray-300 print:px-3 print:py-3"></td>
                                    <td className="px-4 py-4 text-right font-bold text-yellow-800 text-lg print:px-3 print:py-3">
                                        {outstanding.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Summary Section */}
                        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 print:mt-6">
                            <h3 className="font-bold text-gray-800 mb-3">Summary</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600">Total Cash In Flow:</p>
                                    <p className="font-bold text-green-700">
                                        Rs. {totalCashInFlow.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Total Cash Out Flow:</p>
                                    <p className="font-bold text-red-700">
                                        Rs. {totalOutflow.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Net Cash Flow:</p>
                                    <p className={`font-bold ${netCashFlow >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                                        Rs. {netCashFlow.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Outstanding Balance:</p>
                                    <p className={`font-bold ${outstanding >= 0 ? 'text-yellow-700' : 'text-red-700'}`}>
                                        Rs. {outstanding.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500 print:mt-6">
                            <p>This is a computer-generated statement. No signature is required.</p>
                            <p className="mt-1">Generated by Sri Lanka Insurance Corporation Life Ltd.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Print-specific styles */}
        <style jsx global>{`
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                        background: white !important;
                    }
                    
                    .print\\:max-w-full {
                        max-width: 100% !important;
                    }
                    
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    
                    .print\\:bg-gray-50 {
                        background-color: #f9fafb !important;
                    }
                    
                    .print\\:bg-gray-100 {
                        background-color: #f3f4f6 !important;
                    }
                    
                    table {
                        page-break-inside: auto !important;
                    }
                    
                    tr {
                        page-break-inside: avoid !important;
                        page-break-after: auto !important;
                    }
                    
                    thead {
                        display: table-header-group !important;
                    }
                    
                    tfoot {
                        display: table-footer-group !important;
                    }
                }
            `}</style>
    </div>
}

export default function DisplayCashFlow() {

    return (
        <Suspense fallback={<div>Cash Flow is being generated...</div>}>
            <CashFlowContent/>
        </Suspense>
    )
}