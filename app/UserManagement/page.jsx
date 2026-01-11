"use client";
import { useState } from "react";
import UserRegister from "../User/UserRegister/page";
import SearchUser from "../User/UserSearch/page";
import UpdateUser from "../User/UserUpdate/page";
import UserDelete from "../User/DeleteUser/page";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';

export default function UserManagement() {
  const [clickRegisterUser, setClickRegisterUser] = useState(false);
  const [clickSearchUser, setClickSearchUser] = useState(false);
  const [clickUpdateUser, setClickUpdateUser] = useState(false);
  const [clickDeleteUser, setClickDeleteUser] = useState(false);
  const router = useRouter();
  const { hasPermission } = useAuth();

  const arraySetters = [
    setClickRegisterUser,
    setClickSearchUser,
    setClickUpdateUser,
    setClickDeleteUser,
  ];

  //Define functions

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

  //Handle Cancel button in User Register
  const handleCancelUserRegister = () => {
    setClickRegisterUser(false);
  };
  //Handle Cancel button in User Search
  const handleCancelUserSearch = () => {
    setClickSearchUser(false);
  };
  //Handle Cancel button in User Update
  const handleCancelUserUpdate = () => {
    setClickUpdateUser(false);
  };
  //Handle Cancel button in User Delete
  const handleCancelUserDelete = () => {
    setClickDeleteUser(false);
  };

  return (
    <div>
      <div className="bg-slate-800 w-full h-[45px] flex flex-row items-center shadow-lg">
        <svg
          className="w-6 h-6 text-white dark:text-white ml-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <label className="text-white text-xl ml-4">User Management |</label>
        </div>

        <div
          onClick={() => handleClick(setClickRegisterUser, 'FUNC-001')}
          className="flex flex-row items-center justify-center ml-[100px]">
          <svg
            className="w-6 h-6 text-white dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm text-white hover:bg-slate-700 w-[110px] h-[32] flex flex-col items-center justify-center rounded-md">
            <button>Register New</button>
          </div>
        </div>

        <div
          onClick={() => handleClick(setClickSearchUser, 'FUNC-002')}
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

          <div className="text-sm text-white hover:bg-slate-700 w-[70px] h-[32] flex flex-col items-center justify-center rounded-md">
            <button>Search</button>
          </div>
        </div>

        <div
          onClick={() => handleClick(setClickUpdateUser, 'FUNC-003')}
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
            <button>Update Details</button>
          </div>
        </div>

        <div
          onClick={() => handleClick(setClickDeleteUser, 'FUNC-004')}
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

          <div className="text-sm text-white hover:bg-slate-700 w-[100px] h-[32] flex flex-col items-center justify-center rounded-md">
            <button>Delete User</button>
          </div>
        </div>
      </div>

      {/*Conditionally display the User Register window here*/}
      {clickRegisterUser && (
        <div className="mt-4">
          <UserRegister onCancel={handleCancelUserRegister}></UserRegister>
        </div>
      )}

      {/*Conditionally display the User Search window here*/}
      {clickSearchUser && (
        <div className="mt-4">
          <SearchUser onCancel={handleCancelUserSearch}></SearchUser>
        </div>
      )}

      {clickUpdateUser && (
        <div>
          <UpdateUser onCancel={handleCancelUserUpdate}></UpdateUser>
        </div>
      )}

      {clickDeleteUser && (
        <div>
          <UserDelete onCancel={handleCancelUserDelete}></UserDelete>
        </div>
      )}
    </div>
  );
}
