"use client"
import React, { useState } from 'react'
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import { useEffect } from 'react';
import Spinner from '@/app/Spinner/page';

export default function RepoReport() {

    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables;
    const [repoReport, setRepoReport] = useState(false);
    const [repoDetails, setRepoDetails] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loadedAccounts, setLoadedAccount] = useState([]);
    const [viewSpinner, setViewSpinner] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [repoType, setRepoType] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [investStatus, setInvestStatus] = useState("");
    const [deleteStatus, setDeleteStatus] = useState("");
    const [totalRepos, setTotalRepos] = useState(0);
    const [totalInvestment, setTotalInvestment] = useState(0);
    const [activeRepos, setActiveRepos] = useState(0);

    //Define getRepoData function;
    const getRepoData = async (e) => {
        e.preventDefault()
        setRepoReport(false);
        setErrorMessage("");
        setViewSpinner(true);
        try {
            const request = await fetch(`${baseUrl}/api/v1/reports/get-repo-report?fromDate=${fromDate}&toDate=${toDate}&repoType=${repoType}&accountNumber=${accountNumber}&investStatus=${investStatus}&deleteStatus=${deleteStatus}`, {
                method: "GET",
                credentials: "include",
            });
            const response = await request.json();
            if (request.status === 200) {
                const repos = response.responseObject || [];
                setRepoDetails(repos);
                setRepoReport(true);
                setTotalRepos(repos.length);

                // Calculate total investment and active repos
                const totalInvestmentAmount = repos.reduce((sum, repo) => {
                    return sum + (parseFloat(repo.openingBalance) || 0);
                }, 0);
                setTotalInvestment(totalInvestmentAmount);

                const active = repos.filter(repo =>
                    repo.deleteStatus === "0" || repo.deleteStatus?.toLowerCase() === 'active'
                ).length;
                setActiveRepos(active);
            }else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage("Response not received from server. Please contact administrator!");
        } finally {
            setViewSpinner(false);
        }
    }

    //Define loadAccounts function;
    const loadAccounts = async () => {
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/bank-account/getBankAccounts`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const response = await request.json();
            if (request.status === 200) {
                setLoadedAccount(response.responseObject || []);
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage("Response not received from server. Please contact administrator!");
        }
    };

    useEffect(() => {
        loadAccounts();
    }, []);

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

    const getRepoTypeBadge = (type) => {
        const typeStr = type?.toString();
        if (typeStr === '1' || typeStr?.toLowerCase() === 'par') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    Par
                </span>
            );
        } else if (typeStr === '2' || typeStr?.toLowerCase() === 'non-par') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                    Non-Par
                </span>
            );
        } else if (typeStr === '3' || typeStr?.toLowerCase() === 'tr') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                    TR
                </span>
            );
        } else if (typeStr === '4' || typeStr?.toLowerCase() === 'excess') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                    Excess
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                {type}
            </span>
        );
    };

    const getInvestmentBadge = (status) => {
        const statusStr = status?.toString();
        if (statusStr === '1' || statusStr?.toLowerCase() === 'invested') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                    Invested
                </span>
            );
        } else if (statusStr === '0' || statusStr?.toLowerCase() === 'not-invested') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                    Not Invested
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                {status}
            </span>
        );
    };

    const getDeleteStatusBadge = (status) => {
        const statusStr = status?.toString();
        if (statusStr === '0' || statusStr?.toLowerCase() === 'active') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                    Active
                </span>
            );
        } else if (statusStr === '1' || statusStr?.toLowerCase() === 'deleted') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                    Deleted
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                {status}
            </span>
        );
    };

    const clearFilters = () => {
        setFromDate("");
        setToDate("");
        setRepoType("");
        setAccountNumber("");
        setInvestStatus("");
        setDeleteStatus("");
        setRepoReport(false);
        setErrorMessage("");
    };

    const getSelectedRepoTypeLabel = () => {
        if (!repoType) return "All Types";
        switch (repoType) {
            case "1": return "Par";
            case "2": return "Non-Par";
            case "3": return "TR";
            case "4": return "Excess";
            default: return "All Types";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto animate-fadeIn">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-t-xl shadow-lg p-6 mb-0">
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
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Repos Report
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    Investment Repos tracking and analysis
                                </p>
                            </div>
                        </div>
                        {repoReport && (
                            <div className="text-white text-sm bg-white/20 px-3 py-1 rounded-lg">
                                {totalRepos} repos • Rs.{formatCurrency(totalInvestment)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Filter Card */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Repo Report Filters
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Filter repository investments by date range and status
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

                    <form onSubmit={getRepoData}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Date Range Row */}
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        From Date
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
                                        To Date
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

                            {/* Repo Type and Account Row */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Repo Type
                                </label>
                                <select
                                    value={repoType}
                                    onChange={(e) => setRepoType(e.target.value)}
                                    className="block w-full py-3 px-3 text-sm border border-gray-300 rounded-lg 
                                             bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                             transition-all duration-200 shadow-sm"
                                >
                                    <option value="">All Types</option>
                                    <option value="1">Par</option>
                                    <option value="2">Non-Par</option>
                                    <option value="3">TR</option>
                                    <option value="4">Excess</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bank Account
                                </label>
                                <select
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    className="block w-full py-3 px-3 text-sm border border-gray-300 rounded-lg 
                                             bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                             transition-all duration-200 shadow-sm"
                                >
                                    <option value="">All Accounts</option>
                                    {loadedAccounts.map((element) => (
                                        <option key={element.accountId} value={element.accountNumber}>
                                            {element.accountNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status Filters Row */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Investment Status
                                </label>
                                <select
                                    value={investStatus}
                                    onChange={(e) => setInvestStatus(e.target.value)}
                                    className="block w-full py-3 px-3 text-sm border border-gray-300 rounded-lg 
                                             bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                             transition-all duration-200 shadow-sm"
                                >
                                    <option value="">All Status</option>
                                    <option value="1">Invested</option>
                                    <option value="0">Not-Invested</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Delete Status
                                </label>
                                <select
                                    value={deleteStatus}
                                    onChange={(e) => setDeleteStatus(e.target.value)}
                                    className="block w-full py-3 px-3 text-sm border border-gray-300 rounded-lg 
                                             bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                             transition-all duration-200 shadow-sm"
                                >
                                    <option value="">All Status</option>
                                    <option value="0">Active</option>
                                    <option value="1">Deleted</option>
                                </select>
                            </div>

                            {/* Submit Button */}
                            <div className="lg:col-span-2 flex justify-center">
                                <button
                                    type="submit"
                                    disabled={viewSpinner || !fromDate || !toDate}
                                    className="w-full max-w-md px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
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
                                            <span>Generate Report</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Information Banner */}
                    <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <svg
                                className="w-5 h-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0"
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
                                <h4 className="text-sm font-semibold text-indigo-800 mb-1">
                                    Repo Report Information
                                </h4>
                                <p className="text-sm text-indigo-700">
                                    Track and analyze investment repositories within a specific date range.
                                    Filter by repo type, account, and status to get detailed investment insights.
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

                {/* Repo Report Table */}
                {repoReport && (
                    <div className="mt-8 animate-fadeIn">
                        {/* Table Header */}
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-gray-200 rounded-t-xl p-5">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-indigo-100 p-2 rounded-lg">
                                        <svg
                                            className="w-5 h-5 text-indigo-600"
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
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Repo Report Results
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {totalRepos} repos found • Total investment: Rs.{formatCurrency(totalInvestment)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Repo Type: {getSelectedRepoTypeLabel()} • Active: {activeRepos} • Deleted: {totalRepos - activeRepos}
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
                                                Repo Details
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Dates & Account
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Financial Details
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Investment Info
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">
                                                Status & Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {repoDetails.map((element) => (
                                            <tr
                                                key={element.repoId}
                                                className="bg-white border-b border-gray-200 hover:bg-indigo-50 transition-colors duration-150"
                                            >
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900 mb-1">
                                                            Repo ID: {element.repoId}
                                                        </div>
                                                        <div className="mt-2">
                                                            {getRepoTypeBadge(element.repoType)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-2">
                                                        <div>
                                                            <div className="text-xs text-gray-500">Created</div>
                                                            <div className="text-sm text-gray-900">
                                                                {formatDate(element.createdDate)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Account</div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {element.account}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-2">
                                                        <div>
                                                            <div className="text-xs text-gray-500">Opening Balance</div>
                                                            <div className="text-sm font-semibold text-gray-900">
                                                                Rs.{formatCurrency(element.openingBalance)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Maturity Value</div>
                                                            <div className="text-sm font-semibold text-gray-900">
                                                                Rs.{formatCurrency(element.maturityValue)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Interest Rate</div>
                                                            <div className="text-sm text-gray-900">
                                                                {element.interestRate}%
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-2">
                                                        <div>
                                                            <div className="text-xs text-gray-500">Invested Date</div>
                                                            <div className="text-sm text-gray-900">
                                                                {formatDate(element.investedDate)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Maturity Date</div>
                                                            <div className="text-sm text-gray-900">
                                                                {formatDate(element.maturityDate)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Method</div>
                                                            <div className="text-sm text-gray-900">
                                                                {element.calculationMethod}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <div className="text-xs text-gray-500 mb-1">Investment Status</div>
                                                            {getInvestmentBadge(element.investmentStatus)}
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500 mb-1">Delete Status</div>
                                                            {getDeleteStatusBadge(element.deleteStatus)}
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500">Entered By</div>
                                                            <div className="text-sm text-gray-900">
                                                                {element.enterBy}
                                                            </div>
                                                        </div>
                                                        {element.deletedBy && (
                                                            <div>
                                                                <div className="text-xs text-red-600">
                                                                    Deleted by: {element.deletedBy}
                                                                </div>
                                                            </div>
                                                        )}
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
                                        Showing <span className="font-semibold">{totalRepos}</span> repo{totalRepos !== 1 ? 's' : ''}
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold">Total Investment:</span>
                                            <span className="ml-2 text-lg font-bold text-indigo-700">
                                                Rs.{formatCurrency(totalInvestment)}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold">Active:</span> {activeRepos}
                                            <span className="mx-2">•</span>
                                            <span className="font-semibold">Deleted:</span> {totalRepos - activeRepos}
                                        </div>
                                        <button
                                            onClick={() => window.print()}
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
                                                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                                ></path>
                                            </svg>
                                            <span>Print Report</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State - Before Search */}
                {!repoReport && !viewSpinner && (
                    <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-lg p-8 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="bg-gradient-to-r from-indigo-100 to-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-indigo-600"
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
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Generate Repo Report
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Select a date range and apply filters above to generate your repository investment report.
                            </p>
                            <p className="text-sm text-gray-500">
                                The report will display all repository investments within your selected criteria.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}