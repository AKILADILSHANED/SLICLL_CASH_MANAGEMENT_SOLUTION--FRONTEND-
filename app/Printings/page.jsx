"use client"
import React from 'react'
import { useState } from 'react';
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';
import IBTSheetPrint from './IBTSheetPrint/page';
import Voucher from './Voucher/page';
import RepoLetterPrint from './RepoLetterPrint/page';
import PrintCashFlow from './PrintCashFlow/page';

export default function Printings() {
    //Define states;
    const [ibtSheetPrint, setIbtSheetPrint] = useState(false);
    const [voucherPrint, setVoucherPrint] = useState(false);
    const [repoLetterPrint, setRepoLetterPrint] = useState(false);
    const [cashFlowPrint, setCashFlowPrint] = useState(false);
    const router = useRouter();
    const { hasPermission } = useAuth();

    //Define cancel functionality;
    const handleCancel = (setterCancel) => {
        setterCancel(false);
    };

    //Define an array for setter functions;
    const arraySetters = [
        setIbtSheetPrint,
        setVoucherPrint,
        setRepoLetterPrint,
        setCashFlowPrint,
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
            <div className="bg-slate-800 w-full h-[45px] flex flex-row items-center gap-3">
                <svg className="w-6 h-6 ml-2 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M16.444 18H19a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2.556M17 11V5a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h10ZM7 15h10v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-4Z" />
                </svg>


                <div>
                    <label className="text-white text-xl ml-1">Printings |</label>
                </div>

                <div
                    onClick={() => handleClick(setIbtSheetPrint, 'FUNC-046')}
                    className="flex flex-row items-center justify-center ml-[75px]">
                    <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7h1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h11.5M7 14h6m-6 3h6m0-10h.5m-.5 3h.5M7 7h3v3H7V7Z" />
                    </svg>

                    <div className="text-sm text-white hover:bg-slate-700 w-[80px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button>IBT Sheet</button>
                    </div>
                </div>
                <div
                    onClick={() => handleClick(setVoucherPrint, 'FUNC-047')}
                    className="flex flex-row items-center justify-center">
                    <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M16.444 18H19a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2.556M17 11V5a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h10ZM7 15h10v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-4Z" />
                    </svg>
                    <div className="text-sm text-white hover:bg-slate-700 w-[110px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button>Print Vouchers</button>
                    </div>
                </div>
                <div
                    onClick={() => handleClick(setRepoLetterPrint, 'FUNC-048')}
                    className="flex flex-row items-center justify-center">
                    <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M16.444 18H19a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2.556M17 11V5a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h10ZM7 15h10v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-4Z" />
                    </svg>
                    <div className="text-sm text-white hover:bg-slate-700 w-[110px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button>Repo Letters</button>
                    </div>
                </div>
                <div
                    onClick={() => handleClick(setCashFlowPrint, 'FUNC-049')}
                    className="flex flex-row items-center justify-center">
                    <svg
                        className="w-6 h-6 text-white dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v12m3-9.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm5.5 8.5-2.5-2.5m0 0L17 17m-2.5-2.5 2.5-2.5m-12 5 2.5-2.5m0 0L7 12m2.5 2.5L7 17"
                        />
                    </svg>
                    <div className="text-sm text-white hover:bg-slate-700 w-[90px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button>Cash Flow</button>
                    </div>
                </div>
            </div>

            {ibtSheetPrint && (
                <div className="mt-4">
                    <IBTSheetPrint onCancel={() => handleCancel(setIbtSheetPrint)} />
                </div>
            )}
            {voucherPrint && (
                <div className="mt-4">
                    <Voucher onCancel={() => handleCancel(setVoucherPrint)} />
                </div>
            )}
            {repoLetterPrint && (
                <div className="mt-4">
                    <RepoLetterPrint onCancel={() => handleCancel(setRepoLetterPrint)} />
                </div>
            )}
            {cashFlowPrint && (
                <div className="mt-4">
                    <PrintCashFlow onCancel={() => handleCancel(setCashFlowPrint)} />
                </div>
            )}
        </div>
    )
}
