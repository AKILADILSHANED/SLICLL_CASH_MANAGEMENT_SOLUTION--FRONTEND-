"use client";
import React, { useState } from "react";
import RegisterAccount from "./AccountRegister/page";
import SearchAccount from "./AccountSearch/page";
import UpdateAccount from "./AccountUpdate/page";
import DeleteAccount from "./AccountDelete/page";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';

export default function AccountManagement() {
  //Define states;
  const [accountRegister, setAccountRegister] = useState(false);
  const [accountSearch, setAccountSearch] = useState(false);
  const [accountUpdate, setAccountUpdate] = useState(false);
  const [accountDelete, setAccountDelete] = useState(false);
  const router = useRouter();
  const { hasPermission } = useAuth();

  //Define cancel functionality;
  const handleCancel = (setterCancel) => {
    setterCancel(false);
  };

  //Define an array for setter functions;
  const arraySetters = [
    setAccountRegister,
    setAccountSearch,
    setAccountUpdate,
    setAccountDelete,
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
        <svg
          className="w-6 h-6 text-white dark:text-white ml-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="M3 21h18M4 18h16M6 10v8m4-8v8m4-8v8m4-8v8M4 9.5v-.955a1 1 0 0 1 .458-.84l7-4.52a1 1 0 0 1 1.084 0l7 4.52a1 1 0 0 1 .458.84V9.5a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5Z"
          />
        </svg>
        <div>
          <label className="text-white text-xl ml-1">
            Account Management |
          </label>
        </div>

        <div
          onClick={() => handleClick(setAccountRegister, 'FUNC-005')}
          className="flex flex-row items-center justify-center ml-[100px]">
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
            <button>Register New</button>
          </div>
        </div>

        <div
          onClick={() => handleClick(setAccountSearch, 'FUNC-006')}
          className="flex flex-row items-center justify-center ml-5">
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
              strokeWidth="2"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>

          <div className="text-sm text-white hover:bg-slate-700 w-[110px] h-[32] flex flex-col items-center justify-center rounded-md">
            <button>Search Account</button>
          </div>
        </div>

        <div
          onClick={() => handleClick(setAccountUpdate, 'FUNC-007')}
          className="flex flex-row items-center justify-center ml-5">
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
              d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
            />
          </svg>

          <div className="text-sm text-white hover:bg-slate-700 w-[110px] h-[32] flex flex-col items-center justify-center rounded-md">
            <button>Update Details</button>
          </div>
        </div>

        <div
          onClick={() => handleClick(setAccountDelete, 'FUNC-008')}
          className="flex flex-row items-center justify-center ml-5">
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
              d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
            />
          </svg>

          <div className="text-sm text-white hover:bg-slate-700 w-[110px] h-[32] flex flex-col items-center justify-center rounded-md">
            <button>Delete Account</button>
          </div>
        </div>
      </div>

      {accountRegister && (
        <div className="mt-4">
          <RegisterAccount onCancel={() => handleCancel(setAccountRegister)} />
        </div>
      )}

      {accountSearch && (
        <div>
          <SearchAccount onCancel={() => handleCancel(setAccountSearch)} />
        </div>
      )}

      {accountUpdate && (
        <div>
          <UpdateAccount onCancel={() => handleCancel(setAccountUpdate)} />
        </div>
      )}

      {accountDelete && (
        <div>
          <DeleteAccount onCancel={() => handleCancel(setAccountDelete)} />
        </div>
      )}
    </div>
  );
}
