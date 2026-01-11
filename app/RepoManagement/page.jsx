"use client"
import React from 'react'
import { useState } from 'react';
import CreateNewRepo from './CreateNewRepo/page';
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';
import RepoAdjustments from './RepoAdjustments/page';
import DisplayRepo from './DisplayRepo/page';
import Adjustments from './Adjustments/page';
import AdjustmentDelete from './AdjustmentDelete/page';
import RepoDelete from './RepoDelete/page';
import RepoInvestment from './RepoInvestment/page';
import InvestmentReverse from './InvestmentReverse/page';

export default function RepoManagement() {
    //Define states;
    const [newRepo, setNewRepo] = useState(false);
    const [displayRepo, setDisplayRepo] = useState(false);
    const [adjustments, setAdjustments] = useState(false);
    const [adjustmentDisplay, setAdjustmentDisplay] = useState(false);
    const [adjustmentDelete, setAdjustmentDelete] = useState(false);
    const [adjustmentDropDown, setAdjustmentDropDown] = useState(false);
    const [investmentDropDown, setInvestmentDropDown] = useState(false);
    const [investmentReverse, setInvestmentReverse] = useState(false);
    const [repoDelete, setRepoDelete] = useState(false);
    const [repoInvestment, setRepoInvestment] = useState(false);


    const router = useRouter();
    const { hasPermission } = useAuth();

    //Define cancel functionality;
    const handleCancel = (setterCancel) => {
        setterCancel(false);
    };

    //Define an array for setter functions;
    const arraySetters = [
        setNewRepo,
        setDisplayRepo,
        setAdjustmentDisplay,
        setAdjustments,
        setAdjustmentDelete,
        setRepoDelete,
        setRepoInvestment,
        setInvestmentReverse
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
                <svg className="w-6 h-6 text-white dark:text-white ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M9 15a6 6 0 1 1 12 0 6 6 0 0 1-12 0Zm3.845-1.855a2.4 2.4 0 0 1 1.2-1.226 1 1 0 0 1 1.992-.026c.426.15.809.408 1.111.749a1 1 0 1 1-1.496 1.327.682.682 0 0 0-.36-.213.997.997 0 0 1-.113-.032.4.4 0 0 0-.394.074.93.93 0 0 0 .455.254 2.914 2.914 0 0 1 1.504.9c.373.433.669 1.092.464 1.823a.996.996 0 0 1-.046.129c-.226.519-.627.94-1.132 1.192a1 1 0 0 1-1.956.093 2.68 2.68 0 0 1-1.227-.798 1 1 0 1 1 1.506-1.315.682.682 0 0 0 .363.216c.038.009.075.02.111.032a.4.4 0 0 0 .395-.074.93.93 0 0 0-.455-.254 2.91 2.91 0 0 1-1.503-.9c-.375-.433-.666-1.089-.466-1.817a.994.994 0 0 1 .047-.134Zm1.884.573.003.008c-.003-.005-.003-.008-.003-.008Zm.55 2.613s-.002-.002-.003-.007a.032.032 0 0 1 .003.007ZM4 14a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1Zm3-2a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Zm6.5-8a1 1 0 0 1 1-1H18a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-.796l-2.341 2.049a1 1 0 0 1-1.24.06l-2.894-2.066L6.614 9.29a1 1 0 1 1-1.228-1.578l4.5-3.5a1 1 0 0 1 1.195-.025l2.856 2.04L15.34 5h-.84a1 1 0 0 1-1-1Z" clipRule="evenodd" />
                </svg>

                <div>
                    <label className="text-white text-xl ml-1">Repo Management |</label>
                </div>

                <div
                    onClick={() => handleClick(setNewRepo, 'FUNC-031')}
                    className="flex flex-row items-center justify-center ml-[75px]">
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

                    <div className="text-sm text-white hover:bg-slate-700 w-[100px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button>Create New</button>
                    </div>
                </div>

                <div
                    onClick={() => handleClick(setDisplayRepo, 'FUNC-032')}
                    className="flex flex-row items-center justify-center ml-5">
                    <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                    </svg>
                    <div className="text-sm text-white hover:bg-slate-700 w-[110px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button>Display REPO</button>
                    </div>
                </div>


                <div
                    onMouseEnter={() => setAdjustmentDropDown(true)}
                    onMouseLeave={() => setAdjustmentDropDown(false)}
                    className="relative inline-block text-left ml-5">
                    <div className="flex flex-row items-center">
                        <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M6 4v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2m6-16v2m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v10m6-16v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2" />
                        </svg>
                        <button
                            type="button"
                            className="inline-flex w-full border-none bg-slate-800 hover:bg-slate-700 justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm text-white shadow-xs"
                            id="menu-button"
                            aria-expanded="true"
                            aria-haspopup="true">
                            Adjustments
                            <svg
                                className="-mr-1 size-5 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                                data-slot="icon">
                                <path
                                    fillRule="evenodd"
                                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>

                    {adjustmentDropDown && (
                        <div
                            className="absolute right-0 z-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="menu-button"
                            tabIndex="-1">
                            <div
                                onClick={() => handleClick(setAdjustments, 'FUNC-033')}
                                className="py-1"
                                role="none">
                                <button
                                    className="block text-left px-4 py-2 w-56 text-sm text-gray-700 hover:bg-slate-300"
                                    role="menuitem"
                                    tabIndex="-1"
                                    id="menu-item-0">
                                    New REPO Adjustment
                                </button>
                            </div>

                            <div
                                onClick={() => handleClick(setAdjustmentDisplay, 'FUNC-034')}
                                className="py-1"
                                role="none">
                                <button
                                    className="block text-left px-4 py-2 w-56 text-sm text-gray-700 hover:bg-slate-300"
                                    role="menuitem"
                                    tabIndex="-1"
                                    id="menu-item-0">
                                    REPO Adjustment Display
                                </button>
                            </div>

                            <div
                                onClick={() => handleClick(setAdjustmentDelete, 'FUNC-035')}
                                className="py-1"
                                role="none">
                                <button
                                    className="block text-left px-4 py-2 w-56 text-sm text-gray-700 hover:bg-slate-300"
                                    role="menuitem"
                                    tabIndex="-1"
                                    id="menu-item-0">
                                    Adjustment Delete
                                </button>
                            </div>

                        </div>
                    )}
                </div>

                <div
                    onClick={() => handleClick(setRepoDelete, 'FUNC-036')}
                    className="flex flex-row items-center justify-center ml-5">
                    <svg className="w-6 h-6 text-white  cursor-pointer"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                        </path>
                    </svg>
                    <div className="text-sm text-white hover:bg-slate-700 w-[110px] h-[32] flex flex-col items-center justify-center rounded-md">
                        <button>Delete REPO</button>
                    </div>
                </div>

                <div
                    onMouseEnter={() => setInvestmentDropDown(true)}
                    onMouseLeave={() => setInvestmentDropDown(false)}
                    className="relative inline-block text-left ml-5">
                    <div className="flex flex-row items-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <button
                            type="button"
                            className="inline-flex w-full border-none bg-slate-800 hover:bg-slate-700 justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm text-white shadow-xs"
                            id="menu-button"
                            aria-expanded="true"
                            aria-haspopup="true">
                            Investments
                            <svg
                                className="-mr-1 size-5 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                                data-slot="icon">
                                <path
                                    fillRule="evenodd"
                                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>

                    {investmentDropDown && (
                        <div
                            className="absolute right-0 z-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="menu-button"
                            tabIndex="-1">
                            <div
                                onClick={() => handleClick(setRepoInvestment, 'FUNC-037')}
                                className="py-1"
                                role="none">
                                <button
                                    className="block text-left px-4 py-2 w-56 text-sm text-gray-700 hover:bg-slate-300"
                                    role="menuitem"
                                    tabIndex="-1"
                                    id="menu-item-0">
                                    Invest Repo
                                </button>
                            </div>
                            <div
                                onClick={() => handleClick(setInvestmentReverse, 'FUNC-038')}
                                className="py-1"
                                role="none">
                                <button
                                    className="block text-left px-4 py-2 w-56 text-sm text-gray-700 hover:bg-slate-300"
                                    role="menuitem"
                                    tabIndex="-1"
                                    id="menu-item-0">
                                    Reverse Investment
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {newRepo && (
                <div className="mt-4">
                    <CreateNewRepo onCancel={() => handleCancel(setNewRepo)} />
                </div>
            )}
            {adjustmentDisplay && (
                <div className="mt-4">
                    <RepoAdjustments onCancel={() => handleCancel(setNewRepo)} />
                </div>
            )}
            {displayRepo && (
                <div className="mt-4">
                    <DisplayRepo onCancel={() => handleCancel(setDisplayRepo)} />
                </div>
            )}
            {adjustments && (
                <div className="mt-4">
                    <Adjustments onCancel={() => handleCancel(setAdjustments)} />
                </div>
            )}
            {adjustmentDelete && (
                <div className="mt-4">
                    <AdjustmentDelete onCancel={() => handleCancel(setAdjustmentDelete)} />
                </div>
            )}
            {repoDelete && (
                <div className="mt-4">
                    <RepoDelete onCancel={() => handleCancel(setRepoDelete)} />
                </div>
            )}
            {repoInvestment && (
                <div className="mt-4">
                    <RepoInvestment onCancel={() => handleCancel(setRepoInvestment)} />
                </div>
            )}
            {investmentReverse && (
                <div className="mt-4">
                    <InvestmentReverse onCancel={() => handleCancel(setInvestmentReverse)} />
                </div>
            )}
        </div>
    )
}
