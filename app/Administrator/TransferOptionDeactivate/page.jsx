"use client"
import React from 'react'
import ErrorMessage from '@/app/Messages/ErrorMessage/page'
import { useState } from 'react';
import { useEffect } from 'react';
import Spinner from '@/app/Spinner/page';
import SUccessMessage from '@/app/Messages/SuccessMessage/page';

export default function TransferOptionDeactivate() {
    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables
    const [transferOptions, setTransferOptions] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [deactivateSpinner, setDeactivateSpinner] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deactivatingId, setDeactivatingId] = useState(null);

    //Define handleFetchOptions function
    const handleFetchOptions = async () => {
        setLoading(true);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/transferOption/option-deactivate`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            const response = await request.json();
            if (request.status !== 200) {                
                setErrorMessage(response.message);
            } else {
                setTransferOptions(response.responseObject);
                setErrorMessage("");
            }
        } catch (error) {
            setErrorMessage("Response not received from server. Please contact the administrator!");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleFetchOptions();
    }, []);

    //Define handleOptionDeactivate function;
    const handleOptionDeactivate = async (optionId, fromAccount, toAccount, channel) => {
        if (!window.confirm(`Are you sure you want to deactivate this transfer option?\n\nFrom: ${fromAccount}\nTo: ${toAccount}\nChannel: ${channel}\n\nThis action cannot be undone.`)) {
            return;
        }
        try {
            setDeactivatingId(optionId);
            setDeactivateSpinner(true);
            setErrorMessage("");
            setSuccessMessage("");
            const request = await fetch(
                `${baseUrl}/api/v1/transferOption/save-deactivation?optionId=${optionId}`,
                {
                    method: "PUT",
                    credentials: "include"
                }
            );
            const response = await request.json();
            if (request.status !== 200) {                
                setErrorMessage(response.message);
            } else {        
                setSuccessMessage(response.message);
                await handleFetchOptions(); //Page will be reloaded;
            }
        } catch (error) {
            setErrorMessage("Response not received from server. Please contact administrator!");
        } finally {
            setDeactivateSpinner(false);
            setDeactivatingId(null);
        }
    }

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
                                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Deactivate Transfer Options
                                </h1>
                                <p className="text-red-100 text-sm mt-1">
                                    Manage and deactivate existing transfer options between accounts
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleFetchOptions}
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
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                ></path>
                            </svg>
                            Refresh Data
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Options</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{transferOptions.length}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Today</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">
                                    {transferOptions.filter(item => 
                                        new Date(item.definedDate).toDateString() === new Date().toDateString()
                                    ).length}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Unique Accounts</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">
                                    {[...new Set(transferOptions.map(item => item.fromAccount + item.toAccount))].length}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Channels Used</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">
                                    {[...new Set(transferOptions.map(item => item.transferChannel))].length}
                                </p>
                            </div>
                            <div className="bg-red-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
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

                {/* Warning Banner */}
                {transferOptions.length > 0 && (
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
                                    Important: Deactivation Process
                                </h4>
                                <p className="text-sm text-red-700">
                                    Deactivating a transfer option will immediately stop transfers between the specified accounts using this channel.
                                    
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Card */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-red-50 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Active Transfer Options
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Click deactivate to remove transfer options from the system
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 mt-2 md:mt-0">
                                <div className="text-sm text-gray-600">
                                    Showing <span className="font-semibold">{transferOptions.length}</span> options
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="py-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                            <p className="mt-4 text-gray-600">Loading transfer options...</p>
                        </div>
                    ) : transferOptions.length > 0 ? (
                        /* Options Table */
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-red-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Option Details
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            From Account
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            To Account
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Transfer Channel
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {transferOptions.map((element, index) => (
                                        <tr 
                                            key={element.optionId}
                                            className="hover:bg-gray-50 transition-colors duration-150"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        Option ID: {element.optionId}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Defined: {new Date(element.definedDate).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
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
                                                    <div className="text-sm text-gray-900">
                                                        {element.fromAccount}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="bg-green-100 p-2 rounded-lg mr-3">
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
                                                    <div className="text-sm text-gray-900">
                                                        {element.toAccount}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
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
                                                    <div className="text-sm text-gray-900">
                                                        {element.transferChannel}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button 
                                                    onClick={() => handleOptionDeactivate(
                                                        element.optionId, 
                                                        element.fromAccount, 
                                                        element.toAccount, 
                                                        element.transferChannel
                                                    )} 
                                                    type="button" 
                                                    disabled={deactivateSpinner && deactivatingId === element.optionId}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                                                             rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                                                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                             disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[120px]"
                                                >
                                                    {deactivateSpinner && deactivatingId === element.optionId ? (
                                                        <>
                                                            <Spinner size={16} />
                                                            <span>Deactivating...</span>
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
                                                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                                                ></path>
                                                            </svg>
                                                            <span>Deactivate</span>
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="py-12 text-center">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Active Transfer Options</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                There are no active transfer options available for deactivation.
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Transfer options will appear here once they are created and activated.
                            </p>
                        </div>
                    )}

                    {/* Table Footer */}
                    {transferOptions.length > 0 && (
                        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-red-50 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Last updated: {new Date().toLocaleTimeString('en-US', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Note:</span> Deactivation takes effect immediately
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}