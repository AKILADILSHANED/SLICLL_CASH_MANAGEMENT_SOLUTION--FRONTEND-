"use client"
import React, { useEffect, useState } from 'react'
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import SUccessMessage from "@/app/Messages/SuccessMessage/page";
import Spinner from "@/app/Spinner/page";

export default function ManualTransfer() {
    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables;
    const [fundSendingOption, setFundSendingOption] = useState("");
    const [fundReceivingOption, setFundReceivingOption] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccesMessage] = useState("");
    const [accountList, setAccountList] = useState([]);
    const [repoList, setRepoList] = useState([]);
    const [chennelList, setChennelist] = useState([]);
    const [selectedFromBankAccount, setSelectedFromBankAccount] = useState("");
    const [selectedFromRepoAccount, setSelectedFromRepoAccount] = useState("");
    const [selectedToBankAccount, setSelectedToBankAccount] = useState("");
    const [selectedToRepoAccount, setSelectedToRepoAccount] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [selectedChannel, setSelectedChannel] = useState("");
    const [loading, setLoading] = useState(false);

    //Define loadBankAccounts function;
    const loadBankAccounts = async () => {
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
                    setAccountList(response.responseObject);
                }
            } else {
                setErrorMessage("No response from server!");
            }
        } catch (error) {
            setErrorMessage("Unexpected error occurred. Please contact administrator!");
        }
    };

    //Define loadRepoAccounts function;
    const loadRepoAccounts = async () => {
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/repo/get-repo`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const response = await request.json();
            if (request.status === 200) {
                setRepoList(response.responseObject);
            } else if (request.status === 409) {
                setErrorMessage(response.message);
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage("Unexpected error occurred. Please contact administrator!");
        }
    };

    //Define loadChannels function;
    const loadChannels = async () => {
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/channel/define-options`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const response = await request.json();
            if (request.ok) {
                if (response.success == false) {
                    setErrorMessage(response.message);
                } else {
                    setChennelist(response.responseObject);
                }
            } else {
                setErrorMessage("Unable to load Channel Details. Please contact administrator!");
            }
        } catch (error) {
            setErrorMessage("Unexpected error occurred. Please contact administrator!");
        }
    };

    useEffect(() => {
        loadBankAccounts();
        loadRepoAccounts();
        loadChannels();
    }, []);

    const changeFundSendingOption = (e) => {
        setFundSendingOption(e.target.value);
        setSelectedFromBankAccount("");
        setSelectedFromRepoAccount("");
    }

    const changeFundReceivingOption = (e) => {
        setFundReceivingOption(e.target.value);
        setSelectedToBankAccount("");
        setSelectedToRepoAccount("");
    }

    const getAccountNumber = (id) => {
        if (!id) return "";
        for (const account of accountList) {
            if (account.accountId === id) {
                return account.accountNumber;
            }
        }
        return "";
    }

    //Define initiateTransfer function;
    const initiate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setSuccesMessage("");
        
        const fromAccountNumber = getAccountNumber(selectedFromBankAccount);
        const toAccountNumber = getAccountNumber(selectedToBankAccount);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/transfers/initiate-manual-transfers?selectedFromBankAccount=${selectedFromBankAccount}&selectedFromAccountNumber=${fromAccountNumber}&selectedFromRepoAccount=${selectedFromRepoAccount}&selectedToBankAccount=${selectedToBankAccount}&selectedToAccountNumber=${toAccountNumber}&selectedToRepoAccount=${selectedToRepoAccount}&amount=${transferAmount}&transferChannel=${selectedChannel}`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );
            const response = await request.json();
            if (response.status === 200) {
                setSuccesMessage(response.message);
                // Clear form on success
                setTimeout(() => {
                    setFundSendingOption("");
                    setFundReceivingOption("");
                    setSelectedFromBankAccount("");
                    setSelectedFromRepoAccount("");
                    setSelectedToBankAccount("");
                    setSelectedToRepoAccount("");
                    setTransferAmount("");
                    setSelectedChannel("");
                    setSuccesMessage("");
                }, 3000);
            } else if (request.status === 409) {
                setErrorMessage(response.message);
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage("Unexpected error occurred. Please contact administrator!");
        } finally {
            setLoading(false);
        }
    }

    //Define handleFromSelectOption function;
    const HandleFromSelectOption = ({ fundSendingOption }) => {
        if (fundSendingOption === "1") {
            return (
                <div className="animate-fadeIn">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Bank Account
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                            </svg>
                        </div>
                        <select
                            onChange={(e) => setSelectedFromBankAccount(e.target.value)}
                            value={selectedFromBankAccount}
                            required
                            className="pl-10 w-full p-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                        >
                            <option value={""}>- Select Account Number -</option>
                            {
                                accountList.map(
                                    (element) => (
                                        <option key={element.accountId} value={element.accountId}>{element.accountNumber}</option>
                                    )
                                )
                            }
                        </select>
                    </div>
                </div>
            )
        } else if (fundSendingOption === "2") {
            return (
                <div className="animate-fadeIn">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Repo Account
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <select
                            onChange={(e) => setSelectedFromRepoAccount(e.target.value)}
                            value={selectedFromRepoAccount}
                            required
                            className="pl-10 w-full p-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                        >
                            <option value={""}>- Select Repo Account -</option>
                            {
                                repoList.map(
                                    (element) => (
                                        <option key={element.repoId} value={element.repoId}>{element.repoId + " - (" + element.repoAccount + ") - " + element.repoType}</option>
                                    )
                                )
                            }
                        </select>
                    </div>
                </div>
            )
        }
        return null;
    }

    //Define handleToSelectOption function;
    const HandleToSelectOption = ({ fundReceivingOption }) => {
        if (fundReceivingOption === "1") {
            return (
                <div className="animate-fadeIn">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        To Bank Account
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                            </svg>
                        </div>
                        <select
                            onChange={(e) => setSelectedToBankAccount(e.target.value)}
                            value={selectedToBankAccount}
                            required
                            className="pl-10 w-full p-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                        >
                            <option value={""}>- Select Account Number -</option>
                            {
                                accountList.map(
                                    (element) => (
                                        <option key={element.accountId} value={element.accountId}>{element.accountNumber}</option>
                                    )
                                )
                            }
                        </select>
                    </div>
                </div>
            )
        } else if (fundReceivingOption === "2") {
            return (
                <div className="animate-fadeIn">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        To Repo Account
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <select
                            onChange={(e) => setSelectedToRepoAccount(e.target.value)}
                            value={selectedToRepoAccount}
                            required
                            className="pl-10 w-full p-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                        >
                            <option value={""}>- Select Repo Account -</option>
                            {
                                repoList.map(
                                    (element) => (
                                        <option key={element.repoId} value={element.repoId}>{element.repoId + " - (" + element.repoAccount + ") - " + element.repoType}</option>
                                    )
                                )
                            }
                        </select>
                    </div>
                </div>
            )
        }
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto animate-fadeIn">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-red-700 rounded-t-xl shadow-xl p-6 mb-0">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Manual Transfer
                            </h1>
                            <p className="text-blue-100 text-sm mt-1">
                                Initiate manual fund transfers between accounts
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
                    <form onSubmit={(e) => initiate(e)} className="space-y-8">
                        {/* Sender Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl p-6 border border-blue-100">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-600 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-gray-800">Sender Details</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Source Type
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                        </div>
                                        <select
                                            onChange={(e) => changeFundSendingOption(e)}
                                            required
                                            value={fundSendingOption}
                                            className="pl-10 w-full p-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                        >
                                            <option value={""}>- Select Source Type -</option>
                                            <option value={"1"}>Send from Bank Account</option>
                                            <option value={"2"}>Send from Repo Account</option>
                                        </select>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Select where funds will be sent from
                                    </p>
                                </div>
                                
                                <div>
                                    <HandleFromSelectOption fundSendingOption={fundSendingOption} />
                                </div>
                            </div>
                        </div>

                        {/* Arrow Separator */}
                        <div className="flex justify-center">
                            <div className="bg-gradient-to-r from-blue-500 to-red-500 w-12 h-12 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-200">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                </svg>
                            </div>
                        </div>

                        {/* Receiver Section */}
                        <div className="bg-gradient-to-r from-red-50 to-gray-50 rounded-xl p-6 border border-red-100">
                            <div className="flex items-center mb-4">
                                <div className="bg-red-600 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-gray-800">Receiver Details</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Destination Type
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                        </div>
                                        <select
                                            onChange={(e) => changeFundReceivingOption(e)}
                                            required
                                            value={fundReceivingOption}
                                            className="pl-10 w-full p-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                        >
                                            <option value={""}>- Select Destination Type -</option>
                                            <option value={"1"}>Receive to Bank Account</option>
                                            <option value={"2"}>Receive to Repo Account</option>
                                        </select>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Select where funds will be received
                                    </p>
                                </div>
                                
                                <div>
                                    <HandleToSelectOption fundReceivingOption={fundReceivingOption} />
                                </div>
                            </div>
                        </div>

                        {/* Transfer Details Section */}
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                            <div className="flex items-center mb-4">
                                <div className="bg-gradient-to-r from-blue-600 to-red-600 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-gray-800">Transfer Details</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Amount Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Transfer Amount
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500">$</span>
                                        </div>
                                        <input
                                            onChange={(e) => setTransferAmount(e.target.value)}
                                            value={transferAmount}
                                            type="number"
                                            placeholder="0.00"
                                            required
                                            className="pl-10 w-full p-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Enter the amount to transfer
                                    </p>
                                </div>

                                {/* Channel Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Transfer Channel
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                                            </svg>
                                        </div>
                                        <select
                                            onChange={(e) => setSelectedChannel(e.target.value)}
                                            value={selectedChannel}
                                            required
                                            className="pl-10 w-full p-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                        >
                                            <option value={""}>- Select Channel -</option>
                                            {
                                                chennelList.map(
                                                    (element) => (
                                                        <option key={element.channelId} value={element.channelId}>{element.channelType + " (" + element.shortKey + ")"}</option>
                                                    )
                                                )
                                            }
                                        </select>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Select transfer method
                                    </p>
                                </div>

                                {/* Initiate Button */}
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-red-600 rounded-lg hover:from-blue-700 hover:to-red-700 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner size={16} />
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                                </svg>
                                                <span>Initiate Transfer</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Information Banner */}
                        <div className="bg-gradient-to-r from-blue-50 to-red-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <div>
                                    <h4 className="text-sm font-semibold text-blue-800 mb-1">
                                        Manual Transfer Information
                                    </h4>
                                    <p className="text-sm text-blue-700">
                                        All transfers are processed immediately. Please double-check all details before initiating. Ensure sufficient funds are available in the source account.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
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
            </div>
        </div>
    )
}