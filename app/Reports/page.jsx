"use client"
import React from 'react'
import { useState } from 'react';
import RequestHistory from './RequestHistory/page';
import TransferHistory from './TransferHistory/page';
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';
import UserReport from './UserReport/page';
import AccountsReport from './AccountsReport/page';
import PaymentReport from './PaymentReport/page';
import BalanceReport from './BalanceReport/page';
import RepoReport from './RepoReport/page';

export default function Reports() {
    //Define states;
    const [requestHistory, setRequestHistory] = useState(false);
    const [transferHistory, setTransfertHistory] = useState(false);
    const [userReport, setUserReport] = useState(false);
    const [accountsReport, setAccountsReport] = useState(false);
    const [paymentsReport, setPaymentsReport] = useState(false);
    const [balanceReport, setBalanceReport] = useState(false);
    const [repoReport, setRepoReport] = useState(false);
    const router = useRouter();
    const { hasPermission } = useAuth();

    //Define cancel functionality;
    const handleCancel = (setterCancel) => {
        setterCancel(false);
    };

    //Define an array for setter functions;
    const arraySetters = [
        setRequestHistory,
        setTransfertHistory,
        setUserReport,
        setAccountsReport,
        setPaymentsReport,
        setBalanceReport,
        setRepoReport,
    ];

    //Define function for handling each main function user clicks;
    const handleClick = (setterFunction, requiredPermission) => {
        // First, check for permission
        if (requiredPermission && !hasPermission(requiredPermission)) {
            router.push('/AccessDenied'); // Redirect if no permission
            return;
        }
        arraySetters.forEach((setter) => {
            setter(false);
        });
        setterFunction(true);
    };
    return (
        <div>
            <div className="bg-slate-800 w-full h-[45px] flex flex-row items-center">
                <svg className="w-6 h-6 ml-2 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeWidth="2" d="M3 11h18M3 15h18m-9-4v8m-8 0h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                </svg>
                <div>
                    <label className="text-white text-xl ml-1">Reports |</label>
                </div>

                <div
                    onClick={() => handleClick(setUserReport, 'FUNC-039')}
                    className="flex flex-row items-center justify-center ml-[75px]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"

                    >
                        <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <div className="text-sm text-white hover:bg-slate-700 w-[50px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button className="flex items-center gap-2">
                            <span>Users</span>
                        </button>
                    </div>
                </div>

                <div
                    onClick={() => handleClick(setAccountsReport, 'FUNC-040')}
                    className="flex flex-row items-center justify-center ml-[20px]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <div className="text-sm text-white hover:bg-slate-700 w-[110px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button className="flex items-center gap-2">
                            <span>Bank Accounts</span>
                        </button>
                    </div>
                </div>

                <div
                    onClick={() => handleClick(setBalanceReport, 'FUNC-041')}
                    className="flex flex-row items-center justify-center ml-[20px]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                        <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                        <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                    </svg>
                    <div className="text-sm text-white hover:bg-slate-700 w-[80px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button className="flex items-center gap-2">
                            <span>Balances</span>
                        </button>
                    </div>
                </div>

                <div
                    onClick={() => handleClick(setPaymentsReport, 'FUNC-042')}
                    className="flex flex-row items-center justify-center ml-[20px]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <div className="text-sm text-white hover:bg-slate-700 w-[80px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button className="flex items-center gap-2">
                            <span>Payments</span>
                        </button>
                    </div>
                </div>

                <div
                    onClick={() => handleClick(setRequestHistory, 'FUNC-043')}
                    className="flex flex-row items-center justify-center ml-[20px]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                            clipRule="evenodd"
                        />
                        <path d="M10 2.586L12.414 5H10V2.586zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
                    </svg>

                    <div className="text-sm text-white hover:bg-slate-700 w-[100px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button>Fund Request</button>
                    </div>
                </div>

                <div
                    onClick={() => handleClick(setTransfertHistory, 'FUNC-044')}
                    className="flex flex-row items-center justify-center ml-[20px]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                        <path d="M5.293 4.293a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L7 6.414V16a1 1 0 11-2 0V6.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3zM15 3a1 1 0 011 1v9.586l1.293-1.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L14 13.586V4a1 1 0 011-1z" />
                    </svg>
                    <div className="text-sm text-white hover:bg-slate-700 w-[100px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button>Fund Transfer</button>
                    </div>
                </div>

                <div
                    onClick={() => handleClick(setRepoReport, 'FUNC-045')}
                    className="flex flex-row items-center justify-center ml-[20px]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                        <path d="M5.293 4.293a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L7 6.414V16a1 1 0 11-2 0V6.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3zM15 3a1 1 0 011 1v9.586l1.293-1.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L14 13.586V4a1 1 0 011-1z" />
                    </svg>
                    <div className="text-sm text-white hover:bg-slate-700 w-[50px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button>Repo</button>
                    </div>
                </div>
            </div>

            {userReport && (
                <div className="mt-4">
                    <UserReport onCancel={() => handleCancel(setUserReport)} />
                </div>
            )}

            {requestHistory && (
                <div className="mt-4">
                    <RequestHistory onCancel={() => handleCancel(setRequestHistory)} />
                </div>
            )}

            {transferHistory && (
                <div className="mt-4">
                    <TransferHistory onCancel={() => handleCancel(setTransfertHistory)} />
                </div>
            )}

            {accountsReport && (
                <div className="mt-4">
                    <AccountsReport onCancel={() => handleCancel(setAccountsReport)} />
                </div>
            )}

            {paymentsReport && (
                <div className="mt-4">
                    <PaymentReport onCancel={() => handleCancel(setPaymentsReport)} />
                </div>
            )}

            {balanceReport && (
                <div className="mt-4">
                    <BalanceReport onCancel={() => handleCancel(setBalanceReport)} />
                </div>
            )}

            {repoReport && (
                <div className="mt-4">
                    <RepoReport onCancel={() => handleCancel(setRepoReport)} />
                </div>
            )}
        </div>
    )
}
