"use client"
import React, { useState } from 'react'
import { useEffect } from 'react';
import SUccessMessage from '@/app/Messages/SuccessMessage/page';
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import Spinner from '@/app/Spinner/page';

export default function RepoInvestment() {
    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables
    const [repoList, setRepoList] = useState([]);
    const [repoId, setRepoId] = useState("");
    const [investmentValue, setInvestmentValue] = useState("");
    const [repoDetails, setRepoDetails] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [selectedFromDate, setSelectedFromDate] = useState(
        new Date().toLocaleDateString("en-CA")
    );
    const [repoFromDate, setRepoFromDate] = useState(
        new Date().toLocaleDateString("en-CA")
    );
    const [selectedToDate, setSelectedToDate] = useState(
        new Date().toLocaleDateString("en-CA")
    );
    const [repoToDate, setRepoToDate] = useState(
        new Date().toLocaleDateString("en-CA")
    );
    const [rate, setRate] = useState("");
    const [method, setMethod] = useState("");
    const [maturityValue, setMaturityValue] = useState("");
    const [numberOfDays, setNumberOfDays] = useState("");
    const [calculating, setCalculating] = useState(false);
    const [initiating, setInitiating] = useState(false);

    //Define showRepoDetails function;
    const showRepoDetails = async () => {
        setLoadingStatus(true);
        setErrorMessage("");
        setSuccessMessage("");
        setRepoDetails(false);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/repo/display-repo-details`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            const response = await request.json();
            if (request.status === 200) {
                setRepoList(response.responseObject);
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage("Response not received from server. Please contact administrator!");
        } finally {
            setLoadingStatus(false);
        }
    }

    //Define investmentDetails function;
    const investmentDetails = (repoId, investValue) => {
        setErrorMessage("");
        setMaturityValue("");
        setMethod("");
        setRate("");
        setNumberOfDays("");
        setSuccessMessage("");
        // Immediately remove the repo from the UI state
        setRepoList(prevList => prevList.filter(item => item.repoId !== repoId));
        try {
            if (investValue <= 0) {
                setRepoDetails(false);
                setErrorMessage("Not enough value to invest under this Repo ID: " + repoId);
            } else {
                setRepoDetails(false);
                setRepoId(repoId);
                setInvestmentValue(investValue);
                setRepoDetails(true);
            }
        } catch (error) {
            setErrorMessage("Un-expected error occurred. Please contact administrator!");
        }
    }

    //Define maturityCalculation method;
    const maturityCalculation = (investValue, fromDate, toDate, interestRate, method) => {
        setErrorMessage("");
        setMaturityValue("");
        setCalculating(true);

        // Validate inputs
        if (!investValue || !fromDate || !toDate || !interestRate || method === undefined || method === "") {
            setErrorMessage("Please fill all required fields");
            setCalculating(false);
            return;
        }

        try {
            // Convert dates from string to Date objects
            const fromDateObj = new Date(fromDate);
            const toDateObj = new Date(toDate);

            // Calculate difference in days
            const timeDiff = toDateObj.getTime() - fromDateObj.getTime();
            const numDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            // Parse values to numbers
            const investVal = parseFloat(investValue);
            const rate = parseFloat(interestRate);

            if (isNaN(investVal) || isNaN(rate) || isNaN(numDays)) {
                setErrorMessage("Invalid input values");
                setCalculating(false);
                return;
            }

            let interest;
            if (method === "0") {
                interest = ((investVal / 100) * rate / 364) * numDays;
                setNumberOfDays(numDays);
            } else {
                interest = ((investVal / 100) * rate / 365) * numDays;
                setNumberOfDays(numDays);
            }

            const maturity = investVal + interest;

            // Format the maturity value
            setMaturityValue(maturity.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }));

        } catch (error) {
            setErrorMessage("Error in calculation: " + error.message);
            setMaturityValue("");
        } finally {
            setCalculating(false);
        }
    }

    //Define initiateInvestment function;
    const initiateInvestment = async (repoId, repoToDate, rate, method, maturityValue) => {
        setErrorMessage("");
        setSuccessMessage("");
        setInitiating(true);

        // Immediately remove the repo from the UI state
        setRepoList(prevList => prevList.filter(item => item.repoId !== repoId));

        try {
            const request = await fetch(
                `${baseUrl}/api/v1/repo/invest-repo?repoId=${encodeURIComponent(repoId)}&toDate=${encodeURIComponent(repoToDate)}&rate=${encodeURIComponent(rate)}&method=${encodeURIComponent(method)}&maturityValue=${encodeURIComponent(maturityValue.replace(/,/g, ''))}`,
                {
                    method: "PUT",
                    credentials: "include"
                }
            );

            const response = await request.json();
            if (request.status === 200) {
                setSuccessMessage(response.message);
                setRepoDetails(false);
                // Refresh the list after successful investment
                setTimeout(() => {
                    showRepoDetails();
                }, 500);
            } else {
                setErrorMessage(response.message || "Unexpected error occurred. Please contact administrator!");
            }
        } catch (error) {
            setErrorMessage("Response not received from server. Please contact administrator!");
        } finally {
            setInitiating(false);
        }
    }

    useEffect(() => {
        showRepoDetails();
    }, []);

    const formatCurrency = (value) => {
        if (typeof value === "number") {
            return value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        }
        return value;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto animate-fadeIn">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-t-xl shadow-lg p-6 mb-0">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Invest REPO</h1>
                            <p className="text-green-100 text-sm mt-1">Manage REPO investments and calculate maturity values</p>
                        </div>
                    </div>
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

                {/* Loading State */}
                {loadingStatus && (
                    <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-12 text-center">
                        <div className="max-w-sm mx-auto">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="w-full h-full border-4 border-gray-200 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading REPO Investments</h3>
                            <p className="text-gray-600">Please wait while we fetch available REPO accounts...</p>
                        </div>
                    </div>
                )}

                {/* REPO List Table */}
                {!loadingStatus && repoList.length > 0 && (
                    <div className="mt-8 animate-fadeIn">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-t-xl p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">Available REPO Accounts</h2>
                                        <p className="text-sm text-gray-600">Found {repoList.length} REPO account(s) available for investment</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => showRepoDetails()}
                                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                    Refresh List
                                </button>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                REPO Date
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                REPO ID
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                Bank Account
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                REPO Type
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                Investment Value
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {repoList.map((item) => (
                                            <tr
                                                key={item.repoId}
                                                className="hover:bg-green-50 transition-all duration-150"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{item.repoDate}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{item.repoId}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{item.accountNumber}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {item.repoType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="text-sm font-semibold text-green-700">
                                                        Rs.{formatCurrency(item.investmentValue)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => investmentDetails(item.repoId, item.investmentValue)}
                                                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 
                                                                 rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 
                                                                 focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                                 active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        Invest
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* No REPOs Available */}
                {!loadingStatus && repoList.length === 0 && (
                    <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No REPOs Available</h3>
                            <p className="text-gray-600 mb-4">
                                There are currently no REPO accounts available for investment.
                            </p>
                            <button
                                onClick={() => showRepoDetails()}
                                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mx-auto">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                Refresh
                            </button>
                        </div>
                    </div>
                )}

                {/* Investment Details Form */}
                {repoDetails && (
                    <div className="mt-8 animate-fadeIn">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-t-xl p-5">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">Investment Configuration</h2>
                                    <p className="text-sm text-gray-600">Configure investment details for REPO ID: <span className="font-medium text-blue-700">{repoId}</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <div className="text-xs text-gray-500 mb-1">REPO ID</div>
                                    <div className="text-lg font-semibold text-gray-900">{repoId}</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                    <div className="text-xs text-gray-500 mb-1">Investment Value</div>
                                    <div className="text-lg font-semibold text-green-700">Rs.{formatCurrency(investmentValue)}</div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                    <div className="text-xs text-gray-500 mb-1">From Date</div>
                                    <div className="text-sm font-medium text-gray-900">{selectedFromDate}</div>
                                </div>
                                {maturityValue && (
                                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                        <div className="text-xs text-gray-500 mb-1">Maturity Value</div>
                                        <div className="text-lg font-semibold text-indigo-700">Rs.{maturityValue}</div>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* To Date Input */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            To Date
                                            <span className="text-red-600 ml-1">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                required
                                                defaultValue={selectedToDate}
                                                min={new Date().toISOString().split('T')[0]}
                                                onChange={(e) => setRepoToDate(e.target.value)}
                                                className="w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                         hover:border-blue-400 hover:shadow-sm outline-none
                                                         dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">Select maturity date</p>
                                    </div>

                                    {/* Interest Rate Input */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Interest Rate (%)
                                            <span className="text-red-600 ml-1">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500">%</span>
                                            </div>
                                            <input
                                                type="text"
                                                onKeyPress={(e) => {
                                                    if (!/[0-9.]/.test(e.key)) {
                                                        e.preventDefault();
                                                        return;
                                                    }
                                                    if (e.key === '.' && e.target.value.includes('.')) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                required
                                                value={rate}
                                                onChange={(e) => setRate(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full p-3 pr-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                         hover:border-blue-400 hover:shadow-sm outline-none
                                                         dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">Enter annual interest rate</p>
                                    </div>

                                    {/* Calculation Method Select */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Calculation Method
                                            <span className="text-red-600 ml-1">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                required
                                                value={method}
                                                onChange={(e) => setMethod(e.target.value)}
                                                className="w-full p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                         hover:border-blue-400 hover:shadow-sm outline-none appearance-none"
                                            >
                                                <option value="">- Select Method -</option>
                                                <option value="0">Actual * 364 days</option>
                                                <option value="1">Actual * 365 days</option>
                                            </select>
                                        </div>
                                        <p className="text-xs text-gray-500">Choose interest calculation method</p>
                                    </div>

                                    {/* Calculate Button */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 opacity-0">
                                            Action
                                        </label>
                                        <button
                                            onClick={() => maturityCalculation(investmentValue, repoFromDate, repoToDate, rate, method)}
                                            disabled={calculating}
                                            className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                                     rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                                                     focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                     active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                     disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                                            {calculating ? (
                                                <>
                                                    <Spinner size={20} />
                                                    <span>Calculating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                                    </svg>
                                                    <span>Calculate Maturity</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Results Section */}
                            {(numberOfDays || maturityValue) && (
                                <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {numberOfDays && (
                                            <div className="bg-white p-4 rounded-lg border border-blue-100">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-700">Investment Period</div>
                                                        <div className="text-2xl font-bold text-blue-600 mt-1">{numberOfDays} days</div>
                                                    </div>
                                                    <div className="bg-blue-100 p-3 rounded-lg">
                                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-2">
                                                    From {selectedFromDate} to {repoToDate}
                                                </div>
                                            </div>
                                        )}

                                        {maturityValue && (
                                            <div className="bg-white p-4 rounded-lg border border-indigo-100">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-700">Maturity Value</div>
                                                        <div className="text-2xl font-bold text-indigo-700 mt-1">Rs.{maturityValue}</div>
                                                    </div>
                                                    <div className="bg-indigo-100 p-3 rounded-lg">
                                                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-2">
                                                    Includes principal + interest
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Initiate Investment Button */}
                                    {maturityValue && (
                                        <div className="mt-6">
                                            <button
                                                onClick={() => initiateInvestment(repoId, repoToDate, rate, method, maturityValue)}
                                                disabled={initiating}
                                                className="w-full md:w-auto px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 
                                                         rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 
                                                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                         disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                                                {initiating ? (
                                                    <>
                                                        <Spinner size={20} />
                                                        <span>Initiating Investment...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        <span>Initiate Investment</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}