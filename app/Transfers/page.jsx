"use client"
import React from 'react'
import { useState } from 'react';
import NewTransfers from './NewTransfers/page';
import DisplayTransfer from './DisplayTransfer/page';
import DisplayAllTransfer from './DisplayAllTransfer/page';
import ApproveTransfers from './ApproveTransfers/page';
import RejectTransfers from './RejectTransfers/page';
import ReverseTransfers from './ReverseTransfers/page';
import { useAuth } from "@/app/context/AuthContext";
import CheckTransfer from './CheckTransfer/page';
import ManualTransfer from './ManualTransfer/page';
import { useRouter } from 'next/navigation';

export default function Transfers() {
    //Define states;
    const [newTransfer, setNewTransfer] = useState(false);
    const [displayTransfer, setDisplayTransfer] = useState(false);
    const [displayAllTransfer, setDisplayAllTransfer] = useState(false);
    const [checkAllTransfer, setCheckAllTransfer] = useState(false);
    const [approveTransfers, setApproveTransfers] = useState(false);
    const [rejectTransfers, setRejectTransfers] = useState(false);
    const [reverseTransfers, setReverseTransfers] = useState(false);
    const [manualTransfers, setManualTransfers] = useState(false);
    const router = useRouter();
    const { hasPermission } = useAuth();

    //Define cancel functionality;
    const handleCancel = (setterCancel) => {
        setterCancel(false);
    };

    //Define an array for setter functions;
    const arraySetters = [
        setNewTransfer,
        setDisplayTransfer,
        setDisplayAllTransfer,
        setCheckAllTransfer,
        setApproveTransfers,
        setRejectTransfers,
        setReverseTransfers,
        setManualTransfers,
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
                <svg className="w-6 h-6 text-white ml-2 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3" />
                </svg>


                <div>
                    <label className="text-white text-xl ml-1">Transfers |</label>
                </div>

                <div
                    onClick={() => handleClick(setNewTransfer, 'FUNC-024')}
                    className="flex flex-row items-center justify-center ml-[50px]">
                    <svg
                        className="w-6 h-6 text-white dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>

                    <div className="text-sm text-white hover:bg-slate-700 w-[90px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button>Initiate New</button>
                    </div>
                </div>

                <div
                    onClick={() => handleClick(setDisplayTransfer, 'FUNC-025')}
                    className="flex flex-row items-center justify-center ml-2">
                    <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v1M9 12H4m8 8V9h8v11h-8Zm0 0H9m8-4a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z" />
                    </svg>

                    <div className="text-sm text-white hover:bg-slate-700 w-[60px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button>Display</button>
                    </div>
                </div>

                <div
                    onClick={() => handleClick(setDisplayAllTransfer, 'FUNC-026')}
                    className="flex flex-row items-center justify-center ml-2">
                    <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v1M9 12H4m8 8V9h8v11h-8Zm0 0H9m8-4a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z" />
                    </svg>

                    <div className="text-sm text-white hover:bg-slate-700 w-[90px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button>All Transfers</button>
                    </div>
                </div>

                <div
                    onClick={() => handleClick(setCheckAllTransfer, 'FUNC-027')}
                    className="flex flex-row items-center justify-center ml-2">
                    <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v1M9 12H4m8 8V9h8v11h-8Zm0 0H9m8-4a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z" />
                    </svg>

                    <div className="text-sm text-white hover:bg-slate-700 w-[50px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button>Check</button>
                    </div>
                </div>

                <div
                    onClick={() => handleClick(setApproveTransfers, 'FUNC-028')}
                    className="flex flex-row items-center justify-center ml-2">
                    <svg
                        className="w-6 h-6 text-white dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 21a9 9 0 1 1 0-18c1.052 0 2.062.18 3 .512M7 9.577l3.923 3.923 8.5-8.5M17 14v6m-3-3h6"
                        />
                    </svg>

                    <div className="text-sm text-white hover:bg-slate-700 w-[70px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button>Approve</button>
                    </div>
                </div>

                <div
                    onClick={() => handleClick(setRejectTransfers, 'FUNC-029')}
                    className="flex flex-row items-center justify-center ml-2">
                    <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>


                    <div className="text-sm text-white hover:bg-slate-700 w-[120px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button>Reject Approvals</button>
                    </div>
                </div>

                <div
                    onClick={() => handleClick(setReverseTransfers, 'FUNC-030')}
                    className="flex flex-row items-center justify-center ml-2">
                    <svg
                        className="w-6 h-6 text-white dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 12h14M5 12l4-4m-4 4 4 4"
                        />
                    </svg>

                    <div className="text-sm text-white hover:bg-slate-700 w-[130px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button>Reverse Transfers</button>
                    </div>
                </div>
            </div>

            {newTransfer && (
                <div className="mt-4">
                    <NewTransfers manualTransfer={() => handleClick(setManualTransfers, 'FUNC-024')} />
                </div>
            )}

            {displayTransfer && (
                <div className="mt-4">
                    <DisplayTransfer onCancel={() => handleCancel(setDisplayTransfer)} />
                </div>
            )}

            {displayAllTransfer && (
                <div className="mt-4">
                    <DisplayAllTransfer onCancel={() => handleCancel(setDisplayAllTransfer)} />
                </div>
            )}

            {checkAllTransfer && (
                <div className="mt-4">
                    <CheckTransfer onCancel={() => handleCancel(setCheckAllTransfer)} />
                </div>
            )}

            {approveTransfers && (
                <div className="mt-4">
                    <ApproveTransfers onCancel={() => handleCancel(setApproveTransfers)} />
                </div>
            )}

            {rejectTransfers && (
                <div className="mt-4">
                    <RejectTransfers onCancel={() => handleCancel(setRejectTransfers)} />
                </div>
            )}

            {reverseTransfers && (
                <div className="mt-4">
                    <ReverseTransfers onCancel={() => handleCancel(setReverseTransfers)} />
                </div>
            )}

            {manualTransfers && (
                <div className="mt-4">
                    <ManualTransfer onCancel={() => handleCancel(setManualTransfers)} />
                </div>
            )}
        </div>
    )
}
