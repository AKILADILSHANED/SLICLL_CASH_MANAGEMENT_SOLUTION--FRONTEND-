"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/app/Spinner/page";
import { useAuth } from '@/app/context/AuthContext';

export default function UserLogin() {
  // Define base url
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [errorMessage, setErrorMessage] = useState("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const router = useRouter();
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // States for password change
  const [resetEmail, setResetEmail] = useState("");
  const [resetTempPassword, SetResetTempPassword] = useState("");
  const [resetPassword, SetResetPassword] = useState("");
  const [resetRetypedPassword, SetResetRetypedPassword] = useState("");
  const [modalSuccessMessage, setModalSuccessMessage] = useState("");
  const [modalErrorMessage, SetModalErrorMessage] = useState("");
  const [modalLoadingStatus, setModalLoadingStatus] = useState(false);
  const { login } = useAuth();

  // Handle Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    setLoadingStatus(true);
    try {
      const request = await fetch(
        `${baseUrl}/api/v1/user/user-login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: email,
            userPassword: password,
          }),
        }
      );
      const response = await request.json();
      if (request.status === 200) {
        login(response.responseObject);
        router.push(`/User/DashBoard?userFullName=${encodeURIComponent(response.responseObject.userTitle + " " + response.responseObject.userFirstName + " " + response.responseObject.userLastName + ".")}`);
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage("Response not received from server. Please contact the administrator!");
    } finally {
      setLoadingStatus(false);
    }
  };

  // Handle Password Reset function
  const handlePasswordReset = async () => {
    setModalSuccessMessage("");
    SetModalErrorMessage("");
    setModalLoadingStatus(true);
    if (resetPassword != resetRetypedPassword) {
      SetModalErrorMessage("New Password and Re-typed password should be same!");
      setModalLoadingStatus(false);
    } else {
      try {
        const request = await fetch(
          `${baseUrl}/api/v1/user/password-reset`,
          {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userEmail: resetEmail,
              temporaryPassword: resetTempPassword,
              changedPassword: resetPassword
            }),
          }
        );
        const response = await request.json();
        if (request.status === 200) {
          setModalSuccessMessage(response.message);
          return;
        } else {
          SetModalErrorMessage(response.message);
          return;
        }
      } catch (error) {
        SetModalErrorMessage("Unexpected error occurred. Please contact administrator!");
      } finally {
        setModalLoadingStatus(false);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center p-4">
      {/* Main Login Container */}
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block bg-cyan-500 p-3 rounded-2xl mb-4">
            <svg className="w-12 h-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-cyan-900 mb-2">
            Cash Management Solution
          </h1>
          <p className="text-cyan-700 font-medium">Sri Lanka Insurance Corporation Life Ltd.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-4">
          <h2 className="text-2xl font-bold text-cyan-900 mb-6 text-center">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                placeholder="Enter your email"
                required
                ref={emailRef}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                placeholder="Enter your password"
                required
                ref={passwordRef}
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{errorMessage}</p>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              disabled={loadingStatus}
            >
              {loadingStatus && <Spinner size={20} />}
              {loadingStatus ? "Signing In..." : "Sign In"}
            </button>

            {/* Reset Password Button */}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-cyan-900 font-semibold py-3 rounded-lg transition-all shadow-md"
            >
              Reset Password
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-cyan-700 text-sm">
            Solution by Akila Edirisooriya. All Right Reserved &copy; 2026
          </p>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-cyan-500 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Reset Password</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-yellow-400 transition-all p-1"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                  placeholder="Your email"
                />
              </div>

              {/* Temporary Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Temporary Password
                </label>
                <input
                  value={resetTempPassword}
                  onChange={(e) => SetResetTempPassword(e.target.value)}
                  required
                  type="password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                  placeholder="Temporary password"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  maxLength={10}
                  value={resetPassword}
                  onChange={(e) => SetResetPassword(e.target.value)}
                  required
                  type="password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                  placeholder="New password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  maxLength={10}
                  value={resetRetypedPassword}
                  onChange={(e) => SetResetRetypedPassword(e.target.value)}
                  required
                  type="password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                  placeholder="Confirm password"
                />
              </div>

              {/* Update Button */}
              <button
                onClick={handlePasswordReset}
                disabled={modalLoadingStatus}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 mt-6"
              >
                {modalLoadingStatus && <Spinner size={20} />}
                {modalLoadingStatus ? "Updating..." : "Update Password"}
              </button>

              {/* Messages */}
              {modalSuccessMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm text-center">{modalSuccessMessage}</p>
                </div>
              )}
              {modalErrorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm text-center">{modalErrorMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
