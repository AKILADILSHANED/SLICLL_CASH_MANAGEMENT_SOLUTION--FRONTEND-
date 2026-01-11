"use client";
import React, { useState } from "react";
import NewRequest from "./NewRequest/page";
import SearchRequest from "./RequestDetails/page";
import UpdateRequest from "./RequestUpdate/page";
import DeleteRequest from "./RequestDelete/page";
import ApproveRequest from "./RequestApprove/page";
import ReverseApprove from "./ApproveReverse/page";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';

export default function FundRequest() {
  //Define states;
  const [newRequest, setNewRequest] = useState(false);
  const [requestDetails, setRequestDetails] = useState(false);
  const [requestUpdate, setRequestUpdate] = useState(false);
  const [requestDelete, setRequestDelete] = useState(false);
  const [requestApprove, setRequestApprove] = useState(false);
  const [reverseApprove, setReverseApprove] = useState(false);
  const router = useRouter();
  const { hasPermission } = useAuth();

  //Define cancel functionality;
  const handleCancel = (setterCancel) => {
    setterCancel(false);
  };

  //Define an array for setter functions;
  const arraySetters = [
    setNewRequest,
    setRequestDetails,
    setRequestUpdate,
    setRequestDelete,
    setRequestApprove,
    setReverseApprove,
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
            d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
          />
        </svg>
        <div>
          <label className="text-white text-xl ml-1">Fund Request |</label>
        </div>

        <div
          onClick={() => handleClick(setNewRequest, 'FUNC-018')}
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

          <div className="text-sm text-white hover:bg-slate-700 w-[105px] h-[32] flex flex-col items-center justify-center rounded-md">
            <button>New Request</button>
          </div>
        </div>

        <div
          onClick={() => handleClick(setRequestDetails, 'FUNC-019')}
          className="flex flex-row items-center justify-center ml-1">
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

          <div className="text-sm text-white hover:bg-slate-700 w-[115px] h-[32] flex flex-col items-center justify-center rounded-md">
            <button>Request Details</button>
          </div>
        </div>

        <div
          onClick={() => handleClick(setRequestUpdate, 'FUNC-020')}
          className="flex flex-row items-center justify-center ml-1">
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
            <button>Request Update</button>
          </div>
        </div>

        <div
          onClick={() => handleClick(setRequestDelete, 'FUNC-021')}
          className="flex flex-row items-center justify-center ml-1">
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
            <button>Request Delete</button>
          </div>
        </div>

        <div
          onClick={() => handleClick(setRequestApprove, 'FUNC-022')}
          className="flex flex-row items-center justify-center ml-1">
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

          <div className="text-sm text-white hover:bg-slate-700 w-[80px] h-[32] flex flex-col items-center justify-center rounded-md">
            <button>Approvals</button>
          </div>
        </div>

        <div
          onClick={() => handleClick(setReverseApprove, 'FUNC-023')}
          className="flex flex-row items-center justify-center ml-1">
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

          <div className="text-sm text-white hover:bg-slate-700 w-[125px] h-[32] flex flex-col items-center justify-center rounded-md">
            <button>Reverse Approval</button>
          </div>
        </div>
      </div>

      {newRequest && (
        <div className="mt-4">
          <NewRequest onCancel={() => handleCancel(setNewRequest)} />
        </div>
      )}

      {requestDetails && (
        <div>
          <SearchRequest onCancel={() => handleCancel(setRequestDetails)} />
        </div>
      )}

      {requestUpdate && (
        <div>
          <UpdateRequest onCancel={() => handleCancel(setRequestUpdate)} />
        </div>
      )}

      {requestDelete && (
        <div>
          <DeleteRequest onCancel={() => handleCancel(setRequestDelete)} />
        </div>
      )}

      {requestApprove && (
        <div>
          <ApproveRequest onCancel={() => handleCancel(setRequestApprove)} />
        </div>
      )}

      {reverseApprove && (
        <div>
          <ReverseApprove onCancel={() => handleCancel(setReverseApprove)} />
        </div>
      )}
    </div>
  );
}
