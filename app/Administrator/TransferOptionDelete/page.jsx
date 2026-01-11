"use client";
import React, { useEffect, useState } from 'react'
import Spinner from "@/app/Spinner/page";
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import SUccessMessage from '@/app/Messages/SuccessMessage/page';

export default function TransferOptionDelete() {

    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define State Variables;
    const [fromAccountId, setFromAccountId] = useState("");
    const [toAccountId, setToAccountId] = useState("");
    const [chanelId, setChanelId] = useState("");
    const [fromAccountList, setFromAccountList] = useState([]);
    const [toAccountList, setToAccountList] = useState([]);
    const [chanelList, setChanelList] = useState([]);
    const [transferOption, setTransferOption] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [viewSpinner, setViewSpinner] = useState(false);
    const [optionDetailsTable, setOptionDetailsTable] = useState(false);
    const [deleteSpriner, setDeleteSpriner] = useState(false);
    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [loadingChannels, setLoadingChannels] = useState(true);

    //Define getFromAccountList function;
    const getFromAccountList = async () => {
        setLoadingAccounts(true);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/bank-account/getBankAccounts`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (request.ok) {
                const response = await request.json();
                if (response.success == false) {
                    setErrorMessage(response.message);
                } else {
                    setFromAccountList(response.responseObject);
                }
            } else {
                setErrorMessage(
                    "Unable to load Account Numbers. Please contact administrator!"
                );
            }
        } catch (error) {
            setErrorMessage(
                "Un-expected error occurred. Please contact administrator!"
            );
        } finally {
            setLoadingAccounts(false);
        }
    }

    useEffect(() => {
        getFromAccountList()
    }, []);

    //Define getToAccountList function;
    const getToAccountList = async () => {
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/bank-account/getBankAccounts`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (request.ok) {
                const response = await request.json();
                if (response.success == false) {
                    setErrorMessage(response.message);
                } else {
                    setToAccountList(response.responseObject);
                }
            } else {
                setErrorMessage(
                    "Unable to load Account Numbers. Please contact administrator!"
                );
            }
        } catch (error) {
            setErrorMessage(
                "Un-expected error occurred. Please contact administrator!"
            );
        }
    }

    useEffect(() => {
        getToAccountList()
    }, []);

    //Define getChannells function;
    const getChanells = async () => {
        setLoadingChannels(true);
        try {
            const request = await fetch(`${baseUrl}/api/v1/channel/define-options`, {
                method: "GET",
                credentials: "include",
            });
            if (request.ok) {
                const response = await request.json();
                if (response.success == false) {
                    setErrorMessage(response.message);
                } else {
                    setChanelList(response.responseObject);
                }
            } else {
                setErrorMessage(
                    "Unable to load Channel Details. Please contact administrator!"
                );
            }
        } catch (error) {
            setErrorMessage(
                "Un-expected error occurred. Please contact administrator!"
            );
        } finally {
            setLoadingChannels(false);
        }
    };
    useEffect(() => {
        getChanells();
    }, []);

    //Define displayOptionDetails function;
    const displayOptionDetails = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setViewSpinner(true);
        setTransferOption(null);
        setOptionDetailsTable(false);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/transferOption/displayAvailableOptionsForDelete?fromAccount=${fromAccountId}&toAccount=${toAccountId}&transferChannel=${chanelId}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if (!request.ok) {
                const response = await request.json();
                if (response.success == false) {
                    setErrorMessage(response.message);
                    return;
                }
            } else {
                const response = await request.json();
                setTransferOption(response.responseObject)
                setOptionDetailsTable(true);
            }
        } catch (error) {
            setErrorMessage("Un-expected error occurred. Please contact administrator!");
        } finally {
            setViewSpinner(false);
        }
    }

    //Define handleOptionDelete function;
    const handleOptionDelete = async (optionId, fromAccount, toAccount, channel) => {
        if (!window.confirm(`Are you sure you want to permanently delete this transfer option?\n\nOption ID: ${optionId}\nFrom: ${fromAccount}\nTo: ${toAccount}\nChannel: ${channel}\n\n⚠️ WARNING: This action cannot be undone!`)) {
            return;
        }

        try {
            setDeleteSpriner(true);
            setErrorMessage("");
            setSuccessMessage("");
            const request = await fetch(
                `${baseUrl}/api/v1/transferOption/delete-option?optionId=${optionId}`,
                {
                    method: "PUT",
                    credentials: "include"
                }
            );
            if (!request.ok) {
                const response = await request.json();
                setErrorMessage(response.message);
            } else {
                const response = await request.json();
                setSuccessMessage(response.message);
                setOptionDetailsTable(false);
                setFromAccountId("");
                setToAccountId("");
                setChanelId("");
            }
        } catch (error) {
            setErrorMessage("Un-expected error occurred. Please contact administrator!");
        } finally {
            setDeleteSpriner(false);
        }
    }

    const clearForm = () => {
        setFromAccountId("");
        setToAccountId("");
        setChanelId("");
        setTransferOption(null);
        setOptionDetailsTable(false);
        setErrorMessage("");
        setSuccessMessage("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto animate-fadeIn">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-t-xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center space-x-3 mb-4 md:mb-0">
                            <div className="bg-white/20 p-3 rounded-xl">
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
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Delete Transfer Option
                                </h1>
                                <p className="text-red-100 text-sm mt-1">
                                    Permanently remove transfer options from the system
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={clearForm}
                            className="px-4 py-2 text-sm font-medium text-white bg-white/20 hover:bg-white/30 
                                     rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
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
                            Clear Form
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Accounts</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{fromAccountList.length}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Channels</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{chanelList.length}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Option Found</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">
                                    {transferOption ? '1' : '0'}
                                </p>
                            </div>
                            <div className="bg-red-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Warning Banner */}
                <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4 animate-slideDown">
                    <div className="flex items-start">
                        <div className="bg-red-100 p-2 rounded-lg mr-3">
                            <svg 
                                className="w-6 h-6 text-red-600" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                ></path>
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-red-800 mb-1">
                                ⚠️ Permanent Deletion Warning
                            </h4>
                            <p className="text-sm text-red-700">
                                Deleting a transfer option is permanent and cannot be undone. 
                                This will completely remove the option from the system and all associated data.
                                Make sure you have selected the correct option before proceeding.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {successMessage && (
                    <div className="mb-6 animate-slideDown">
                        <SUccessMessage messageValue={successMessage} />
                    </div>
                )}
                {errorMessage && (
                    <div className="mb-6 animate-slideDown">
                        <ErrorMessage messageValue={errorMessage} />
                    </div>
                )}

                {/* Main Content Card */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8">
                    {/* Form Section */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Search Transfer Option
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Select accounts and channel to find the transfer option for deletion
                        </p>
                        
                        <form onSubmit={displayOptionDetails}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* From Account Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        From Account Number
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
                                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <select
                                            value={fromAccountId}
                                            onChange={(e) => setFromAccountId(e.target.value)}
                                            required
                                            className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                                                     bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                                     transition-all duration-200 shadow-sm appearance-none"
                                            disabled={loadingAccounts}
                                        >
                                            <option value="">- Select From Account -</option>
                                            {fromAccountList.map((element) => (
                                                <option key={element.accountId} value={element.accountId}>
                                                    {element.accountNumber}
                                                </option>
                                            ))}
                                        </select>
                                        {loadingAccounts && (
                                            <div className="absolute right-3 top-3">
                                                <Spinner size={16} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* To Account Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        To Account Number
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
                                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <select
                                            value={toAccountId}
                                            onChange={(e) => setToAccountId(e.target.value)}
                                            required
                                            className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                                                     bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                                     transition-all duration-200 shadow-sm appearance-none"
                                            disabled={loadingAccounts}
                                        >
                                            <option value="">- Select To Account -</option>
                                            {toAccountList.map((element) => (
                                                <option key={element.accountId} value={element.accountId}>
                                                    {element.accountNumber}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Channel Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Channel Type
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
                                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <select
                                            value={chanelId}
                                            onChange={(e) => setChanelId(e.target.value)}
                                            required
                                            className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                                                     bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                                     transition-all duration-200 shadow-sm appearance-none"
                                            disabled={loadingChannels}
                                        >
                                            <option value="">- Select Channel -</option>
                                            {chanelList.map((element) => (
                                                <option key={element.channelId} value={element.channelId}>
                                                    {element.channelType} ({element.shortKey})
                                                </option>
                                            ))}
                                        </select>
                                        {loadingChannels && (
                                            <div className="absolute right-3 top-3">
                                                <Spinner size={16} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex justify-center">
                                <button
                                    type="submit"
                                    disabled={viewSpinner || loadingAccounts || loadingChannels}
                                    className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                             rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                             disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]"
                                >
                                    {viewSpinner ? (
                                        <>
                                            <Spinner size={16} />
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
                                            <span>Search Option</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Transfer Option Details */}
                    {optionDetailsTable && transferOption && (
                        <div className="animate-fadeIn">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Transfer Option Found
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Review the option details before permanent deletion
                                </p>
                            </div>
                            
                            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl shadow-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="bg-white/20 p-2 rounded-lg mr-3">
                                            <svg 
                                                className="w-5 h-5 text-white" 
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
                                            <h4 className="font-bold text-white text-lg">
                                                Option ID: {transferOption.optionId}
                                            </h4>
                                            <p className="text-red-100 text-sm">
                                                Review details below before deletion
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-gray-500">Option ID</p>
                                            <p className="text-sm font-semibold text-gray-800">{transferOption.optionId}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-gray-500">Defined Date</p>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {new Date(transferOption.definedDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-gray-500">Defined By</p>
                                            <p className="text-sm font-semibold text-gray-800">{transferOption.definedBy}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-gray-500">From Account</p>
                                            <div className="flex items-center">
                                                <div className="bg-blue-100 p-2 rounded-lg mr-2">
                                                    <svg 
                                                        className="w-4 h-4 text-blue-600" 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        viewBox="0 0 24 24" 
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path 
                                                            strokeLinecap="round" 
                                                            strokeLinejoin="round" 
                                                            strokeWidth="2" 
                                                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                        ></path>
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800">{transferOption.fromAccount}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-gray-500">To Account</p>
                                            <div className="flex items-center">
                                                <div className="bg-green-100 p-2 rounded-lg mr-2">
                                                    <svg 
                                                        className="w-4 h-4 text-green-600" 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        viewBox="0 0 24 24" 
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path 
                                                            strokeLinecap="round" 
                                                            strokeLinejoin="round" 
                                                            strokeWidth="2" 
                                                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                        ></path>
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800">{transferOption.toAccount}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-gray-500">Transfer Channel</p>
                                            <div className="flex items-center">
                                                <div className="bg-purple-100 p-2 rounded-lg mr-2">
                                                    <svg 
                                                        className="w-4 h-4 text-purple-600" 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        viewBox="0 0 24 24" 
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path 
                                                            strokeLinecap="round" 
                                                            strokeLinejoin="round" 
                                                            strokeWidth="2" 
                                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                                        ></path>
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800">{transferOption.transferChannel}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-red-200">
                                        <div className="flex justify-center">
                                            <button 
                                                onClick={() => handleOptionDelete(
                                                    transferOption.optionId, 
                                                    transferOption.fromAccount, 
                                                    transferOption.toAccount, 
                                                    transferOption.transferChannel
                                                )}
                                                disabled={deleteSpriner}
                                                className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                                                         rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                                                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                         disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[160px]"
                                            >
                                                {deleteSpriner ? (
                                                    <>
                                                        <Spinner size={16} />
                                                        <span>Deleting...</span>
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
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            ></path>
                                                        </svg>
                                                        <span>Delete Permanently</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Empty State - No search performed */}
                    {!optionDetailsTable && (
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
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Search Transfer Option
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Select from account, to account, and channel above to search for a transfer option to delete.
                                </p>
                                <p className="text-sm text-gray-500">
                                    Deletion is permanent and cannot be undone. Please verify all details before proceeding.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}