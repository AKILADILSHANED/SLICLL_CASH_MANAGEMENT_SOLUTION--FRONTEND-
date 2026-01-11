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
      if (request.ok) {
        const response = await request.json();
        if (response.success == false) {
          setErrorMessage(response.message);
        } else {
          login(response.responseObject);
          router.push(`/User/DashBoard?userFullName=${encodeURIComponent(response.responseObject.userTitle + " " + response.responseObject.userFirstName + " " + response.responseObject.userLastName + ".")}`);
        }
      } else {
        setErrorMessage("Response not received from server. Please contact the administrator!");
      }
    } catch (error) {
      setErrorMessage("Unexpected error occurred. Please contact administrator!");
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
        if (!request.ok) {
          const response = await request.json();
          SetModalErrorMessage(response.message);
          return;
        } else {
          const response = await request.json();
          setModalSuccessMessage(response.message);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Main Login Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Header Section */}
        <div className="text-center mb-3">
          <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl p-1 border border-white/20 shadow-2xl">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent mb-2">
              Cash Management Solution
            </h1>
            <p className="text-blue-100 text-sm md:text-base font-medium">Sri Lanka Insurance Corporation General Ltd.</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Card Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3">
            <h2 className="text-xl font-semibold text-white text-center">
              Welcome Back
            </h2>
            <p className="text-blue-100 text-sm text-center mt-1">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Card Body */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 outline-none text-white placeholder-blue-200"
                  placeholder="Enter your email address"
                  required
                  ref={emailRef}
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 outline-none text-white placeholder-blue-200"
                  placeholder="Enter your password"
                  required
                  ref={passwordRef}
                />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-red-500/20 border border-red-400/50 rounded-xl backdrop-blur-sm">
                  <p className="text-red-200 text-sm text-center">{errorMessage}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  disabled={loadingStatus}
                >
                  {loadingStatus && <Spinner size={20} />}
                  {loadingStatus ? "Signing In..." : "Sign In"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="flex-1 bg-white/10 hover:bg-white/20 border border-white/30 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-1 text-center">
          <p className="text-blue-200/80 text-xs backdrop-blur-sm bg-black/20 rounded-lg py-2 px-4">
            Solution by Akila Edirisooriya. All Rights Reserved &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/20 shadow-2xl w-full max-w-md mx-auto overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Reset Your Password</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white transition-all duration-200 p-2 rounded-xl hover:bg-white/10"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  type="email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 outline-none text-white placeholder-blue-200"
                  placeholder="Your email address"
                />
              </div>

              {/* Temporary Password */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Temporary Password
                </label>
                <input
                  value={resetTempPassword}
                  onChange={(e) => SetResetTempPassword(e.target.value)}
                  required
                  type="password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 outline-none text-white placeholder-blue-200"
                  placeholder="Your temporary password"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  New Password
                </label>
                <input
                  maxLength={10}
                  value={resetPassword}
                  onChange={(e) => SetResetPassword(e.target.value)}
                  required
                  type="password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 outline-none text-white placeholder-blue-200"
                  placeholder="Your new password"
                />
              </div>

              {/* Re-type Password */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Confirm New Password
                </label>
                <input
                  maxLength={10}
                  value={resetRetypedPassword}
                  onChange={(e) => SetResetRetypedPassword(e.target.value)}
                  required
                  type="password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 outline-none text-white placeholder-blue-200"
                  placeholder="Re-type your new password"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 pt-2">
              <button
                onClick={handlePasswordReset}
                disabled={modalLoadingStatus}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {modalLoadingStatus && <Spinner size={20} />}
                {modalLoadingStatus ? "Updating..." : "Update Password"}
              </button>

              {/* Success/Error Messages */}
              <div className="mt-4 space-y-2">
                {modalSuccessMessage && (
                  <div className="p-3 bg-green-500/20 border border-green-400/50 rounded-xl backdrop-blur-sm">
                    <p className="text-green-200 text-sm text-center">{modalSuccessMessage}</p>
                  </div>
                )}
                {modalErrorMessage && (
                  <div className="p-3 bg-red-500/20 border border-red-400/50 rounded-xl backdrop-blur-sm">
                    <p className="text-red-200 text-sm text-center">{modalErrorMessage}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}