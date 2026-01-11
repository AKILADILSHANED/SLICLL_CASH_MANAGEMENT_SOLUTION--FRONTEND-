"use client";
import React, { useState } from "react";
import PaymentRegister from "./RegisterPayment/page";
import PaymentSearch from "./PaymentSearch/page";
import UpdatePayment from "./PaymentUpdate/page";
import DeletePayment from "./PaymentDelete/page";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';

export default function AccountManagement() {
  //Define states;
  const [paymentRegister, setPaymentRegister] = useState(false);
  const [paymentSearch, setPaymentSearch] = useState(false);
  const [paymentUpdate, setPaymentUpdate] = useState(false);
  const [paymentDelete, setPaymentDelete] = useState(false);
  const router = useRouter();
  const { hasPermission } = useAuth();

  //Define cancel functionality;
  const handleCancel = (setterCancel) => {
    setterCancel(false);
  };

  //Define an array for setter functions;
  const arraySetters = [
    setPaymentRegister,
    setPaymentSearch,
    setPaymentUpdate,
    setPaymentDelete,
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
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 14h2m3 0h4m2 2h2m0 0h2m-2 0v2m0-2v-2m-5 4H4c-.55228 0-1-.4477-1-1V7c0-.55228.44772-1 1-1h16c.5523 0 1 .44772 1 1v4M3 10h18"
          />
        </svg>
        <div>
          <label className="text-white text-xl ml-1">
            Payment Management |
          </label>
        </div>

        <div
          onClick={() => handleClick(setPaymentRegister, 'FUNC-014')}
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

          <div className="text-sm text-white hover:bg-slate-700 w-[110px] h-[32] flex flex-col items-center justify-center rounded-md">
            <button>New Payment</button>
          </div>
        </div>

        <div
          onClick={() => handleClick(setPaymentSearch, 'FUNC-015')}
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

          <div className="text-sm text-white hover:bg-slate-700 w-[120px] h-[32] flex flex-col items-center justify-center rounded-md">
            <button>Payment Details</button>
          </div>
        </div>

        <div
          onClick={() => handleClick(setPaymentUpdate, 'FUNC-016')}
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

          <div className="text-sm text-white hover:bg-slate-700 w-[120px] h-[32] flex flex-col items-center justify-center rounded-md">
            <button>Payment Update</button>
          </div>
        </div>

        <div
          onClick={() => handleClick(setPaymentDelete, 'FUNC-017')}
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

          <div className="text-sm text-white hover:bg-slate-700 w-[120px] h-[32] flex flex-col items-center justify-center rounded-md">
            <button>Payment Delete</button>
          </div>
        </div>
      </div>

      {paymentRegister && (
        <div className="mt-4">
          <PaymentRegister onCancel={() => handleCancel(setPaymentRegister)} />
        </div>
      )}

      {paymentSearch && (
        <div>
          <PaymentSearch onCancel={() => handleCancel(setPaymentSearch)} />
        </div>
      )}

      {paymentUpdate && (
        <div>
          <UpdatePayment onCancel={() => handleCancel(setPaymentUpdate)} />
        </div>
      )}

      {paymentDelete && (
        <div>
          <DeletePayment onCancel={() => handleCancel(setPaymentDelete)} />
        </div>
      )}
    </div>
  );
}
