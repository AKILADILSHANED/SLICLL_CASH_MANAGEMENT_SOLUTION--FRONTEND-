"use client"
import React, { useState } from 'react'
import { useEffect } from 'react';
import Spinner from '@/app/Spinner/page';
import ErrorMessage from '@/app/Messages/ErrorMessage/page';
import SUccessMessage from '@/app/Messages/SuccessMessage/page';

export default function Adjustments() {

    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables;
    const [saveSpinner, setSaveSpinner] = useState(false);
    const [transferSpinner, setTransferSpinner] = useState(false);

    const [newRepo, setNewRepo] = useState(false);
    const [existingRepo, setExistingRepo] = useState(false);
    const [fromRepo, setFromRepo] = useState("");
    const [toRepo, setToRepo] = useState("");
    const [transferValue, setTransferValue] = useState("");
    const [adjustmentType, setAdjustmentType] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [repoType, setRepoType] = useState("");
    const [repoValue, setRepoValue] = useState("");
    const [eligibility, setEligibility] = useState("0");
    const [transferChanel, setTransferChanel] = useState("0");

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [bankAccountList, setBankAccountList] = useState([]);
    const [fromRepoList, setFromRepoList] = useState([]);
    const [toRepoList, setToRepoList] = useState([]);
    const [transferChanelList, setTransferChanelList] = useState([]);
    const [chanelDropdown, setChanelDropdown] = useState(false);
    const [repoLoading, setRepoLoading] = useState("Load Repos");

    //Define adjustmentChange function;
    const adjustmentChange = (adjustmentType, fromRepo) => {
        if (adjustmentType === "1" && fromRepo !== "") {
            setAdjustmentType(adjustmentType);
            setExistingRepo(false);
            setNewRepo(true);
        } else if (adjustmentType === "2") {
            setAdjustmentType(adjustmentType);
            setExistingRepo(true);
            setNewRepo(false);
        } else {
            setAdjustmentType(adjustmentType);
            setExistingRepo(false);
            setNewRepo(false);
        }
    }

    //Define fromRepoChange function;
    const fromRepoChange = (fromRepo, adjustmentType) => {
        if (fromRepo !== "" && adjustmentType === "1") {
            setFromRepo(fromRepo);
            setExistingRepo(false);
            setNewRepo(true);
        } else if (fromRepo !== "" && adjustmentType === "2") {
            setFromRepo(fromRepo);
            setExistingRepo(true);
            setNewRepo(false);
        }
        else {
            setFromRepo(fromRepo);
            setExistingRepo(false);
            setNewRepo(false);
        }
    }

    //Define cancel functionality;
    const handleCancel = (setterCancel) => {
        setterCancel(false);
    };

    //Define getBankAccount function;
    const getBankAccount = async () => {
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
                    setBankAccountList(response.responseObject);
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
    };

    //Define fromrepoList function;
    const fromrepoList = async () => {
        setErrorMessage(false);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/repo/get-from-Repo-List`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (request.status === 200) {
                const response = await request.json();
                setFromRepoList(response.responseObject);
            } else if (request.status === 409) {
                const response = await request.json();
                setErrorMessage(response.message);
            }
        } catch (error) {
            const response = await request.json();
            setErrorMessage(response.message);
        }
    }

    //Define torepoList function;
    const torepoList = async () => {
        setErrorMessage(false);
        setRepoLoading("Loading...");
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/repo/get-To-Repo-List?selectedRepo=${fromRepo}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (request.status === 200) {
                const response = await request.json();
                setToRepoList(response.responseObject);
                setRepoLoading("Repo Loaded Successfully");
            } else if (request.status === 409) {
                const response = await request.json();
                setErrorMessage(response.message);
                setRepoLoading("Error");
            }
        } catch (error) {
            const response = await request.json();
            setErrorMessage(response.message);
            setRepoLoading("Error");
        }
    }

    //Define getChannels function;
    const getChannels = async () => {
        setErrorMessage(false);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/channel/getChanel`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (request.status === 200) {
                const response = await request.json();
                setTransferChanelList(response.responseObject);
            } else if (request.status === 409) {
                const response = await request.json();
                setErrorMessage(response.message);
            }
        } catch (error) {
            const response = await request.json();
            setErrorMessage(response.message);
        }
    }

    useEffect(() => {
        getBankAccount();
        fromrepoList();
        getChannels();
    }, []);

    //define handleKeyDown function; This will be restricted typing minus values in the text box;
    const handleKeyDown = (e) => {
        if (e.key === "-") {
            e.preventDefault();
        } else {
            //No code block to be run;
        }
    }

    //Define createNewRepo function;
    const createNewRepo = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setSaveSpinner(true);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/repo/create-new-repo`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(
                        {
                            fromRepo: fromRepo,
                            adjustmentType: adjustmentType,
                            repoAccount: accountNumber,
                            repoType: repoType,
                            repoValue: repoValue,
                            eligibility: eligibility,
                            transferChanel: transferChanel
                        }
                    )
                },
            );
            if (request.status === 200) {
                const response = await request.json();
                setSuccessMessage(response.message);
            } else if (request.status === 409) {
                const response = await request.json();
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage("Un-expected error occurred. Please contact administrator!");
        } finally {
            setSaveSpinner(false);
        }
    }

    //Define existingRepoTransfer function;
    const existingRepoTransfer = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setTransferSpinner(true);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/repo/transfer-repo`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(
                        {
                            fromRepo: fromRepo,
                            toRepo: toRepo,
                            repoValue: repoValue,
                            transferChanel: transferChanel
                        }
                    )
                },

            );
            if (request.status === 200) {
                const response = await request.json();
                setSuccessMessage(response.message);
            } else if (request.status === 409) {
                const response = await request.json();
                setErrorMessage(response.message);
            } else if (request.status === 500) {
                const response = await request.json();
                setErrorMessage(response.message);
            }
        } catch (error) {
            console.log(error)
            setErrorMessage("Un-expected error occurred. Please contact administrator!");
        } finally {
            setTransferSpinner(false);
        }
    }

    //Define setUpTransferChannel function;
    const setUpTransferChannel = async (newRepoAccountId, fromRepoId) => {
        setAccountNumber(newRepoAccountId);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/bank-account/checkBankAccountForNewRepo?newRepoAccountId=${encodeURIComponent(newRepoAccountId)}&fromRepoId=${encodeURIComponent(fromRepoId)}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if (request.status === 200) {
                const response = await request.json();
                if (response.responseObject == true) {
                    setChanelDropdown(false);
                } else {
                    setChanelDropdown(true);
                }
                setAccountNumber(newRepoAccountId);
            }
        } catch (error) {
            setErrorMessage("Un-expected error occurred, while fetching Bank Accounts!");
        }
    }

    //Define setUpTransferChannel function;
    const setUpTransferChannelForExistingRepo = async (toRepo, fromRepoId) => {
        setToRepo(toRepo);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/bank-account/checkBankAccountForExistingRepo?toRepoId=${encodeURIComponent(toRepo)}&fromRepoId=${encodeURIComponent(fromRepoId)}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if (request.status === 200) {
                const response = await request.json();
                if (response.responseObject == true) {
                    setChanelDropdown(false);
                } else {
                    setChanelDropdown(true);
                }
                setToRepo(toRepo);
            }
        } catch (error) {
            setErrorMessage("Un-expected error occurred, while fetching Bank Accounts!");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto animate-fadeIn">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl shadow-lg p-6 mb-0">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">REPO Adjustments</h1>
                            <p className="text-blue-100 text-sm mt-1">Transfer funds or create new REPO accounts</p>
                        </div>
                    </div>
                </div>

                {/* Selection Form Card */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
                    <div className="space-y-6">
                        <div className="flex items-center mb-4">
                            <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                            <h2 className="text-lg font-semibold text-gray-800">Adjustment Configuration</h2>
                        </div>
                        
                        <form>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* From Repo Selector */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Transfer From REPO
                                        <span className="text-red-600 ml-1">*</span>
                                    </label>
                                    <div className="relative group">
                                        <select
                                            required
                                            onChange={(e) => fromRepoChange(e.target.value, adjustmentType)}
                                            className="w-full p-3 pl-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                     hover:border-blue-400 hover:shadow-sm outline-none appearance-none
                                                     dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                        >
                                            <option value="" className="text-gray-400">- Select From REPO -</option>
                                            {fromRepoList.map((element) => (
                                                <option key={element.repoId} value={element.repoId} className="py-2">
                                                    {element.repoId}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">Select source REPO account</p>
                                </div>

                                {/* Adjustment Type Selector */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Adjustment Type
                                        <span className="text-red-600 ml-1">*</span>
                                    </label>
                                    <div className="relative group">
                                        <select
                                            onChange={(e) => adjustmentChange(e.target.value, fromRepo)}
                                            required
                                            className="w-full p-3 pl-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                     hover:border-blue-400 hover:shadow-sm outline-none appearance-none
                                                     dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                        >
                                            <option value="" className="text-gray-400">- Select Adjustment Type -</option>
                                            <option value={1} className="py-2">Create New REPO</option>
                                            <option value={2} className="py-2">Transfer to Existing REPO</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">Choose adjustment action</p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* New REPO Form */}
                {newRepo && (
                    <div className="mt-8 animate-fadeIn">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-t-xl p-5">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">Create New REPO Account</h2>
                                    <p className="text-sm text-gray-600">Configure new REPO from selected source</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg p-6 md:p-8">
                            <form onSubmit={(e) => createNewRepo(e)}>
                                <div className="space-y-8">
                                    {/* Bank Account & Repo Type Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Bank Account Number
                                                <span className="text-red-600 ml-1">*</span>
                                            </label>
                                            <div className="relative group">
                                                <select
                                                    onChange={(e) => setUpTransferChannel(e.target.value, fromRepo)}
                                                    required
                                                    className="w-full p-3 pl-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                             hover:border-blue-400 hover:shadow-sm outline-none appearance-none
                                                             dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                >
                                                    <option value="" className="text-gray-400">- Select Account Number -</option>
                                                    {bankAccountList.map((element) => (
                                                        <option key={element.accountId} value={element.accountId} className="py-2">
                                                            {element.accountNumber}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                REPO Type
                                                <span className="text-red-600 ml-1">*</span>
                                            </label>
                                            <div className="relative group">
                                                <select
                                                    onChange={(e) => setRepoType(e.target.value)}
                                                    required
                                                    className="w-full p-3 pl-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                             hover:border-blue-400 hover:shadow-sm outline-none appearance-none
                                                             dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                >
                                                    <option value="" className="text-gray-400">- Select REPO Type -</option>
                                                    <option value={1} className="py-2">PAR</option>
                                                    <option value={2} className="py-2">NON-PAR</option>
                                                    <option value={3} className="py-2">TR</option>
                                                    <option value={4} className="py-2">Excess</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Channel Selector (Conditional) */}
                                    {chanelDropdown && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Transfer Channel
                                                    <span className="text-red-600 ml-1">*</span>
                                                </label>
                                                <div className="relative group">
                                                    <select
                                                        onChange={(e) => setTransferChanel(e.target.value)}
                                                        required
                                                        className="w-full p-3 pl-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                                 hover:border-blue-400 hover:shadow-sm outline-none appearance-none
                                                                 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                    >
                                                        <option value="" className="text-gray-400">- Select Transfer Channel -</option>
                                                        {transferChanelList.map((element) => (
                                                            <option key={element.channelId} value={element.channelId} className="py-2">
                                                                {element.channelType}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Repo Value Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                REPO Value
                                                <span className="text-red-600 ml-1">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">Rs.</span>
                                                </div>
                                                <input
                                                    onChange={(e) => setRepoValue(e.target.value)}
                                                    value={repoValue}
                                                    type="number"
                                                    onKeyDown={handleKeyDown}
                                                    placeholder="Enter REPO Value"
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full pl-10 p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                             hover:border-blue-400 hover:shadow-sm outline-none
                                                             dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Investment Value (Auto-calculated)
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">Rs.</span>
                                                </div>
                                                <input
                                                    value={repoValue}
                                                    disabled
                                                    type="number"
                                                    className="w-full pl-10 p-3 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg 
                                                             cursor-not-allowed opacity-70
                                                             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Eligibility Section */}
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-4">
                                            Transfer Eligibility Configuration
                                        </label>
                                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                            Please confirm whether this REPO is eligible to initiate fund transfers for other bank accounts when existing funds are insufficient for daily payments.
                                        </p>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <input
                                                    type="radio"
                                                    onChange={(e) => setEligibility(e.target.value)}
                                                    name="transferEligibility"
                                                    value={1}
                                                    checked={eligibility === "1"}
                                                    required
                                                    className="sr-only peer"
                                                    id="eligibleNew"
                                                />
                                                <label 
                                                    htmlFor="eligibleNew"
                                                    className="flex items-center p-4 cursor-pointer bg-white border-2 border-gray-200 rounded-lg 
                                                             hover:border-blue-400 transition-all duration-200
                                                             peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:shadow-sm">
                                                    <div className="w-5 h-5 border-2 border-blue-500 rounded-full mr-3 flex items-center justify-center 
                                                                 peer-checked:bg-blue-500 transition-all duration-200">
                                                        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-700">Eligible</span>
                                                        <p className="text-xs text-gray-500 mt-1">Can initiate transfers</p>
                                                    </div>
                                                </label>
                                            </div>
                                            
                                            <div className="relative">
                                                <input
                                                    type="radio"
                                                    onChange={(e) => setEligibility(e.target.value)}
                                                    name="transferEligibility"
                                                    value={0}
                                                    required
                                                    checked={eligibility === "0"}
                                                    className="sr-only peer"
                                                    id="notEligibleNew"
                                                />
                                                <label 
                                                    htmlFor="notEligibleNew"
                                                    className="flex items-center p-4 cursor-pointer bg-white border-2 border-gray-200 rounded-lg 
                                                             hover:border-red-400 transition-all duration-200
                                                             peer-checked:border-red-500 peer-checked:bg-red-50 peer-checked:shadow-sm">
                                                    <div className="w-5 h-5 border-2 border-red-500 rounded-full mr-3 flex items-center justify-center 
                                                                 peer-checked:bg-red-500 transition-all duration-200">
                                                        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-700">Not Eligible</span>
                                                        <p className="text-xs text-gray-500 mt-1">Cannot initiate transfers</p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-6 border-t border-gray-200">
                                        <div className="flex flex-wrap gap-4">
                                            <button
                                                type="submit"
                                                disabled={saveSpinner}
                                                className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                                         rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                                                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                         disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                                                {saveSpinner ? (
                                                    <>
                                                        <Spinner size={20} />
                                                        <span>Creating REPO...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                                        </svg>
                                                        <span>Create New REPO</span>
                                                    </>
                                                )}
                                            </button>
                                            
                                            <button
                                                type="button"
                                                onClick={() => handleCancel(setNewRepo)}
                                                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                                                         rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                                                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                                <span>Cancel</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Existing REPO Transfer Form */}
                {existingRepo && (
                    <div className="mt-8 animate-fadeIn">
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-t-xl p-5">
                            <div className="flex items-center space-x-3">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">Transfer to Existing REPO</h2>
                                    <p className="text-sm text-gray-600">Transfer funds between existing REPO accounts</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg p-6 md:p-8">
                            <form onSubmit={(e) => existingRepoTransfer(e)}>
                                <div className="space-y-8">
                                    {/* To REPO Selector */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    To REPO Account
                                                    <span className="text-red-600 ml-1">*</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => torepoList()}
                                                    disabled={repoLoading === "Loading..."}
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline 
                                                             flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {repoLoading === "Loading..." ? (
                                                        <>
                                                            <Spinner size={16} />
                                                            <span>Loading...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                                            </svg>
                                                            <span>{repoLoading}</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <div className="relative group">
                                                <select
                                                    onChange={(e) => setUpTransferChannelForExistingRepo(e.target.value, fromRepo)}
                                                    required
                                                    className="w-full p-3 pl-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                             hover:border-blue-400 hover:shadow-sm outline-none appearance-none
                                                             dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                >
                                                    <option value="" className="text-gray-400">- Select REPO ID -</option>
                                                    {toRepoList.map((element) => (
                                                        <option key={element.repoId} value={element.repoId} className="py-2">
                                                            {element.repoId}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Transfer Value
                                                <span className="text-red-600 ml-1">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">Rs.</span>
                                                </div>
                                                <input
                                                    onChange={(e) => setRepoValue(e.target.value)}
                                                    value={repoValue}
                                                    type="number"
                                                    onKeyDown={handleKeyDown}
                                                    placeholder="Enter Transfer Value"
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full pl-10 p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                             hover:border-blue-400 hover:shadow-sm outline-none
                                                             dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Channel Selector (Conditional) */}
                                    {chanelDropdown && (
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Transfer Channel
                                                <span className="text-red-600 ml-1">*</span>
                                            </label>
                                            <div className="relative group">
                                                <select
                                                    onChange={(e) => setTransferChanel(e.target.value)}
                                                    required
                                                    className="w-full p-3 pl-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                                                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                             hover:border-blue-400 hover:shadow-sm outline-none appearance-none
                                                             dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                >
                                                    <option value="" className="text-gray-400">- Select Transfer Channel -</option>
                                                    {transferChanelList.map((element) => (
                                                        <option key={element.channelId} value={element.channelId} className="py-2">
                                                            {element.channelType}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="pt-6 border-t border-gray-200">
                                        <div className="flex flex-wrap gap-4">
                                            <button
                                                type="submit"
                                                disabled={transferSpinner}
                                                className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 
                                                         rounded-lg hover:from-purple-700 hover:to-purple-800 focus:ring-4 focus:ring-purple-300 
                                                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                                         disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                                                {transferSpinner ? (
                                                    <>
                                                        <Spinner size={20} />
                                                        <span>Transferring...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                                        </svg>
                                                        <span>Transfer Funds</span>
                                                    </>
                                                )}
                                            </button>
                                            
                                            <button
                                                type="button"
                                                onClick={() => handleCancel(setExistingRepo)}
                                                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 
                                                         rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 
                                                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                                <span>Cancel</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

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
            </div>
        </div>
    )
}