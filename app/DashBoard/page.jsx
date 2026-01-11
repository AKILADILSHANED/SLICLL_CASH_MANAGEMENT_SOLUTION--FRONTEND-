"use client"
import React, { useState, useEffect } from 'react';

// New Combined Header Component with Messages
const DashboardHeaderWithMessages = ({ animate, isClient, TimeDisplay, forecastDetails, balanceDetails, balanceDetailsTable }) => {
    // Prepare forecast messages
    const getForecastMessages = () => {
        if (!forecastDetails || forecastDetails.length === 0) return [];

        return forecastDetails.map((forecast, index) => ({
            id: index,
            type: 'forecast',
            message: `📢 IMPORTANT: Forecasting Fund Request #${index + 1} - Payment Type: ${forecast.paymentType}, Account: ${forecast.bankAccount}, Amount: ${typeof forecast.amount === "number" ? "Rs. " + forecast.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : forecast.amount}, Required Date: ${forecast.date}`,
            color: 'bg-gradient-to-r from-blue-500 to-purple-500',
            icon: '💰'
        }));
    };

    // Prepare balance message
    const getBalanceMessage = () => {
        if (!balanceDetailsTable || balanceDetails.length === 0) return null;

        const totalBalance = balanceDetails.reduce((sum, item) => {
            const final = typeof item.finalBalance === "number" ? item.finalBalance : 0;
            return sum + final;
        }, 0);

        return {
            id: 'balance',
            type: 'balance',
            message: `✅ BALANCES ENTERED: ${balanceDetails.length} account${balanceDetails.length > 1 ? 's' : ''} have been updated with balances. Total Available: Rs. ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Funds can now be requested based on these updated balances.`,
            color: 'bg-gradient-to-r from-emerald-500 to-green-600',
            icon: '🏦'
        };
    };

    const forecastMessages = getForecastMessages();
    const balanceMessage = getBalanceMessage();

    // Combine all messages
    const allMessages = [...forecastMessages];
    if (balanceMessage) {
        allMessages.push(balanceMessage);
    }

    const hasMessages = allMessages.length > 0;

    return (
        <div className="mb-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 shadow-2xl">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Daily Cash Management Dashboard
                        </h1>
                        <p className="text-blue-100 text-sm md:text-base">
                            Real-time monitoring and financial insights
                        </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                        {isClient && <TimeDisplay />}
                    </div>
                </div>

                {/* Messages Section - Only shown if there are messages */}
                {hasMessages && (
                    <div className="mt-4 pt-4 border-t border-white/30">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/30 p-1.5 rounded-lg">
                                    <span className="text-white text-sm">📢</span>
                                </div>
                                <h3 className="text-sm font-bold text-white">
                                    Alerts & Notifications
                                </h3>
                            </div>

                        </div>

                        <div className="relative overflow-hidden bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
                            <div className="flex animate-marquee whitespace-nowrap">
                                {allMessages.map((msg) => (
                                    <div key={msg.id} className="inline-flex items-center mr-6">
                                        <div className={`${msg.color} p-1.5 rounded-md mr-2`}>
                                            <span className="text-white text-xs">{msg.icon}</span>
                                        </div>
                                        <span className="text-white text-md font-medium">
                                            {msg.message}
                                        </span>
                                        <div className="ml-2 w-0.5 h-3 bg-white/30 rounded-full"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add CSS for marquee animation */}
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                    animation: marquee 60s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};



//Transaction Summary Card (Keep as is)
const TransactionSummaryCard = ({ transactionDetails, isClient, calculatePercentage }) => (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 p-6 h-full">
        <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                <span className="text-white text-xl">📊</span>
            </div>
            <h5 className="text-xl font-bold text-slate-800">
                Transaction Summary
            </h5>
        </div>

        <div className="space-y-4">
            {[
                { label: "Total Transfers", value: transactionDetails.totalTransfers, color: "from-blue-500 to-cyan-500" },
                { label: "Approved", value: transactionDetails.approvedTransfers, color: "from-green-500 to-emerald-500" },
                { label: "Pending", value: transactionDetails.pendingTransfers || 0, color: "from-amber-500 to-orange-500" },
                { label: "Reversed", value: transactionDetails.rejectedTransfers, color: "from-red-500 to-rose-500" },
                { label: "IBT", value: transactionDetails.ibtTransfers, color: "from-teal-500 to-cyan-500" },
                { label: "CEFT", value: transactionDetails.ceftTransfers, color: "from-purple-500 to-indigo-500" },
                { label: "RTGS", value: transactionDetails.rtgsTransfers, color: "from-sky-500 to-blue-500" },
                { label: "Cheque", value: transactionDetails.chequeTransfers, color: "from-gray-500 to-slate-500" }
            ].map((item, index) => (
                <div key={index} className='flex justify-between items-center'>
                    <label className="text-sm font-medium text-slate-700">{item.label}:</label>
                    <div className='flex items-center gap-3'>
                        <span className={`bg-gradient-to-r ${item.color} text-white text-xs font-semibold px-3 py-2 rounded-lg min-w-[60px] text-center shadow-md`}>
                            {item.value}
                        </span>
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div
                                className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${calculatePercentage(item.value)}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-bold text-slate-600 min-w-[35px]">
                            {calculatePercentage(item.value)}%
                        </span>
                    </div>
                </div>
            ))}
        </div>

        <div className='mt-6 pt-4 border-t border-slate-200'>
            <label className='text-xs text-slate-500 font-medium'>
                📍 Last Updated: {isClient && new Date().toLocaleString()}
            </label>
        </div>
    </div>
);

//Forecasting Card
const ForecastingCard = ({ forecastDetails, forecastDetailsTable, errorMessageForecast, isClient, totalForecastAmount }) => (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 p-6 h-full">
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6'>
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                    <span className="text-white text-xl">💰</span>
                </div>
                <h5 className="text-xl font-bold text-slate-800">
                    Forecasting Fund Requests
                </h5>
            </div>
            <div className='bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl text-lg font-bold shadow-lg w-full lg:w-auto text-center'>
                Total: {" Rs." + totalForecastAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}
            </div>
        </div>

        {forecastDetailsTable && (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-sm bg-white">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
                            <th className="py-4 px-4 text-left font-semibold">Payment Type</th>
                            <th className="py-4 px-4 text-left font-semibold">Account</th>
                            <th className="py-4 px-4 text-left font-semibold">Amount</th>
                            <th className="py-4 px-4 text-left font-semibold hidden lg:table-cell">Required Date</th>
                            <th className="py-4 px-4 text-left font-semibold hidden xl:table-cell">Request By</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {forecastDetails.map((element, index) => (
                            <tr key={index} className="hover:bg-slate-50 transition-colors duration-200">
                                <td className="py-3 px-4 font-medium text-slate-800">{element.paymentType}</td>
                                <td className="py-3 px-4 text-slate-700">{element.bankAccount}</td>
                                <td className="py-3 px-4 font-semibold text-green-600">
                                    {typeof element.amount === "number"
                                        ? "Rs. " + element.amount.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })
                                        : element.amount}
                                </td>
                                <td className="py-3 px-4 text-slate-600 hidden lg:table-cell">{element.date}</td>
                                <td className="py-3 px-4 text-slate-600 hidden xl:table-cell">{element.requestedBy}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {errorMessageForecast && (
            <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-xl'>
                <label className='text-sm text-red-700 font-medium'>{errorMessageForecast}</label>
            </div>
        )}

        <div className='mt-6 pt-4 border-t border-slate-200'>
            <label className='text-xs text-slate-500 font-medium'>
                📍 Last Updated: {isClient && new Date().toLocaleString()}
            </label>
        </div>
    </div>
);

//Fund Request Card
const FundRequestCard = ({ requestDetails, requestDetailsTable, errorMessageFundRequest, isClient, totalRequestAmount }) => (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 p-6 h-full">
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6'>
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                    <span className="text-white text-xl">💰</span>
                </div>
                <h5 className="text-xl font-bold text-slate-800">
                    Fund Requests Information
                </h5>
            </div>
            <div className='bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl text-lg font-bold shadow-lg w-full lg:w-auto text-center'>
                Total: {" Rs." + totalRequestAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}
            </div>
        </div>

        {requestDetailsTable && (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-sm bg-white">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
                            <th className="py-4 px-4 text-left font-semibold">Payment Type</th>
                            <th className="py-4 px-4 text-left font-semibold">Amount</th>
                            <th className="py-4 px-4 text-left font-semibold">Account</th>
                            <th className="py-4 px-4 text-left font-semibold hidden lg:table-cell">Request Date</th>
                            <th className="py-4 px-4 text-left font-semibold hidden lg:table-cell">Required Date</th>
                            <th className="py-4 px-4 text-left font-semibold hidden xl:table-cell">Request By</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {requestDetails.map((element, index) => (
                            <tr key={index} className="hover:bg-slate-50 transition-colors duration-200">
                                <td className="py-3 px-4 font-medium text-slate-800">{element.paymentType}</td>
                                <td className="py-3 px-4 font-semibold text-green-600">
                                    {typeof element.amount === "number"
                                        ? "Rs. " + element.amount.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })
                                        : element.amount}
                                </td>
                                <td className="py-3 px-4 text-slate-700">{element.bankAccount}</td>
                                <td className="py-3 px-4 text-slate-600 hidden lg:table-cell">{element.requestDate}</td>
                                <td className="py-3 px-4 text-slate-600 hidden lg:table-cell">{element.requiredDate}</td>
                                <td className="py-3 px-4 text-slate-600 hidden xl:table-cell">{element.requestedBy}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {errorMessageFundRequest && (
            <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-xl'>
                <label className='text-sm text-red-700 font-medium'>{errorMessageFundRequest}</label>
            </div>
        )}

        <div className='mt-6 pt-4 border-t border-slate-200'>
            <label className='text-xs text-slate-500 font-medium'>
                📍 Last Updated: {isClient && new Date().toLocaleString()}
            </label>
        </div>
    </div>
);

// Component 4: Balance Summary Card (Keep as is)
const BalanceSummaryCard = ({ balanceDetails, balanceDetailsTable, errorMessageBalance, isClient }) => (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 p-6 h-full">
        <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-xl">
                <span className="text-white text-xl">🏦</span>
            </div>
            <h5 className="text-xl font-bold text-slate-800">
                Account Balance Summary
            </h5>
        </div>

        {balanceDetailsTable && (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-sm bg-white">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
                            <th className="py-4 px-4 text-left font-semibold">Account Number</th>
                            <th className="py-4 px-4 text-left font-semibold">Original Balance</th>
                            <th className="py-4 px-4 text-left font-semibold">Final Balance</th>
                            <th className="py-4 px-4 text-left font-semibold">Difference</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {balanceDetails.map((element, index) => {
                            const original = typeof element.originalBalance === "number" ? element.originalBalance : 0;
                            const final = typeof element.finalBalance === "number" ? element.finalBalance : 0;
                            const difference = final - original;

                            return (
                                <tr key={index} className="hover:bg-slate-50 transition-colors duration-200">
                                    <td className="py-3 px-4 font-medium text-slate-800">{element.accountNumber}</td>
                                    <td className="py-3 px-4 text-slate-700">
                                        Rs. {original.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </td>
                                    <td className="py-3 px-4 font-semibold text-slate-800">
                                        Rs. {final.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </td>
                                    <td className={`py-3 px-4 font-bold ${difference >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {difference >= 0 ? '+' : ''}{difference.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        )}

        {errorMessageBalance && (
            <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-xl'>
                <label className='text-sm text-red-700 font-medium'>{errorMessageBalance}</label>
            </div>
        )}

        <div className='mt-6 pt-4 border-t border-slate-200'>
            <label className='text-xs text-slate-500 font-medium'>
                📍 Last Updated: {isClient && new Date().toLocaleString()}
            </label>
        </div>
    </div>
);

// Component 5: Bank Links Card (Keep as is)
const BankLinksCard = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 p-6 h-full">
        <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
                <span className="text-white text-xl">🔗</span>
            </div>
            <h5 className="text-xl font-bold text-slate-800">
                Useful Bank Links
            </h5>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {[
                { name: "Commercial Bank Digital", url: "https://www.combankdigital.com/#/login" },
                { name: "Commercial Bank Online", url: "https://www.commercialbk.com/online/2/2/22001.aspx" },
                { name: "People's Bank", url: "https://www.digital.peoplesbank.lk/sde.cib.web/IC7Aen6rwhPuCBkeEBEyTg#1" },
                { name: "Bank of Ceylon", url: "https://online.boc.lk/T001/channel.jsp" },
                { name: "Sampath Vishwa", url: "https://www.sampathvishwa.com/SVCClientWebV2/ActionController" },
                { name: "Hatton National Bank", url: "https://hnbtxb.com/bib-webapp/app/auth/login" },
                { name: "Nations Trust Bank", url: "https://hnbtxb.com/bib-webapp/app/auth/login" },
                { name: "Seylan Bank", url: "https://www.seylanbank.lk/corporate/login" },
                { name: "Pan Asia Bank", url: "https://online.pabcbank.com/business/login" },
                { name: "DFCC Bank", url: "https://iconnect.dfcc.lk/iCashProGUI/?_gl=1*1fb53du*_ga*NDIyMDYxOTc3LjE3NTUwMjAxMTk.*_ga_NKW2NZ9CFC*czE3NTUwMjAxMTgkbzEkZzEkdDE3NTUwMjAxMjAkajU4JGwwJGgw#!/login" }
            ].map((bank, index) => (
                <a
                    key={index}
                    href={bank.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                >
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-sm group-hover:text-blue-700 transition-colors">
                            {bank.name}
                        </span>
                        <span className="text-slate-400 group-hover:text-blue-500 transition-colors">
                            ↗
                        </span>
                    </div>
                </a>
            ))}
        </div>
    </div>
);

// Component 6: Time Display Component (Keep as is)
const TimeDisplay = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
            <div className='text-white font-medium'>🕒 {currentTime.toLocaleTimeString()}</div>
            <div className='text-white font-medium'>📅 {currentTime.toLocaleDateString()}</div>
        </div>
    );
};

// Main Dashboard Component
export default function DashBoard() {
    // Define base url
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Define state variables
    const [transactionDetails, setTransactionDetails] = useState({
        totalTransfers: 0,
        approvedTransfers: 0,
        rejectedTransfers: 0,
        onlineTransfers: 0,
        ibtTransfers: 0,
        rtgsTransfers: 0,
        chequeTransfers: 0,
        pendingTransfers: 0
    });
    const [isClient, setIsClient] = useState(false);
    const [forecastDetails, setForecastDetails] = useState([]);
    const [requestDetails, setRequestDetails] = useState([]);
    const [balanceDetails, setBalanceDetails] = useState([]);
    const [forecastDetailsTable, setForecastDetailsTable] = useState(false);
    const [requestDetailsTable, setRequestDetailsTable] = useState(false);
    const [balanceDetailsTable, setBalanceDetailsTable] = useState(false);
    const [errorMessageForecast, setErrorMessageForecast] = useState("");
    const [errorMessageFundRequest, setErrorMessageFundRequest] = useState("");
    const [errorMessageBalance, setErrorMessageBalance] = useState("");
    const [totalForecastAmount, setTotalForecastAmount] = useState(0);
    const [totalRequestAmount, setTotalRequestAmount] = useState(0);
    const [animate, setAnimate] = useState(false);

    // Define getTransactionDetails function
    const getTransactionDetails = async () => {
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/dash-board/get-Transaction-Details`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (!request.ok) {
                setErrorMessageBalance("Unable to load Transaction Summary Data.");
            } else {
                const response = await request.json();
                setTransactionDetails(response.responseObject);
            }
        } catch (error) {
            setErrorMessageBalance("Unable to load Transaction Summary Data.");
        }
    }

    // Define getForecastDetails function
    const getForecastDetails = async () => {
        setErrorMessageForecast("");
        setForecastDetailsTable(false);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/dash-board/get-Forecasting-Details`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (!request.ok) {
                const response = await request.json();
                setErrorMessageForecast(response.message);
            } else {
                const response = await request.json();
                setForecastDetailsTable(true);
                setForecastDetails(response.responseObject);
                // Calculate and set the total amount here
                const total = response.responseObject.reduce((sum, item) => sum + item.amount, 0);
                setTotalForecastAmount(total);
            }
        } catch (error) {
            setErrorMessageForecast("Unable to load Forecast Data.");
        }
    }

    // Define getFundRequestDetails function
    const getFundRequestDetails = async () => {
        setErrorMessageForecast("");
        setForecastDetailsTable(false);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/dash-board/get-request-Details`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (!request.ok) {
                const response = await request.json();
                setErrorMessageForecast(response.message);
            } else {
                const response = await request.json();
                setRequestDetailsTable(true);
                setRequestDetails(response.responseObject);
                // Calculate and set the total amount here
                const total = response.responseObject.reduce((sum, item) => sum + item.amount, 0);
                setTotalRequestAmount(total);
            }
        } catch (error) {
            setErrorMessageForecast("Unable to load Fund Request Data.");
        }
    }

    // Define getBalanceDetails function
    const getBalanceDetails = async () => {
        setErrorMessageBalance("");
        setBalanceDetailsTable(false);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/dash-board/get-Balance-Details`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (!request.ok) {
                const response = await request.json();
                setErrorMessageBalance(response.message);
            } else {
                const response = await request.json();
                setBalanceDetailsTable(true);
                setBalanceDetails(response.responseObject);
            }
        } catch (error) {
            setErrorMessageBalance("Unable to load Balance Details.");
        }
    }

    // Calculate percentages for progress bars
    const calculatePercentage = (value) => {
        return transactionDetails.totalTransfers > 0 ?
            (value / transactionDetails.totalTransfers * 100).toFixed(0) : 0;
    };

    useEffect(() => {
        getTransactionDetails();
        getForecastDetails();
        getFundRequestDetails();
        getBalanceDetails();
        setIsClient(true);
        setAnimate(true);
    }, []);

    // Grid layout configuration - now more flexible
    const gridConfig = {
        lg: 'lg:grid-cols-2 xl:grid-cols-3', // Adjust as needed
        gap: 'gap-4 md:gap-6'
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 ${animate ? 'fade-in' : ''}`}>
            {/* Combined Header Section with Messages */}
            <DashboardHeaderWithMessages
                animate={animate}
                isClient={isClient}
                TimeDisplay={TimeDisplay}
                forecastDetails={forecastDetails}
                balanceDetails={balanceDetails}
                balanceDetailsTable={balanceDetailsTable}
            />



            {/* Flexible Grid Layout for Cards */}
            <div className={`grid grid-cols-1 ${gridConfig.lg} ${gridConfig.gap}`}>
                {/* Transaction Summary Card - Can be 1 or 2 columns based on grid */}
                <div className={`${gridConfig.lg.includes('xl:grid-cols-3') ? 'xl:col-span-1' : 'col-span-1'}`}>
                    <TransactionSummaryCard
                        transactionDetails={transactionDetails}
                        isClient={isClient}
                        calculatePercentage={calculatePercentage}
                    />
                </div>

                {/* Forecasting Card - Takes more space */}
                <div className={`${gridConfig.lg.includes('xl:grid-cols-3') ? 'xl:col-span-2' : 'col-span-1'}`}>
                    <ForecastingCard
                        forecastDetails={forecastDetails}
                        forecastDetailsTable={forecastDetailsTable}
                        errorMessageForecast={errorMessageForecast}
                        isClient={isClient}
                        totalForecastAmount={totalForecastAmount}
                    />
                </div>

                {/* Fund Request Card - Takes more space */}
                <div className={`${gridConfig.lg.includes('xl:grid-cols-3') ? 'xl:col-span-2' : 'col-span-1'}`}>
                    <FundRequestCard
                        requestDetails={requestDetails}
                        requestDetailsTable={requestDetailsTable}
                        errorMessageFundRequest={errorMessageFundRequest}
                        isClient={isClient}
                        totalRequestAmount={totalRequestAmount}
                    />
                </div>

                {/* Balance Summary Card - Takes more space */}
                <div className={`${gridConfig.lg.includes('xl:grid-cols-3') ? 'xl:col-span-2' : 'col-span-1'}`}>
                    <BalanceSummaryCard
                        balanceDetails={balanceDetails}
                        balanceDetailsTable={balanceDetailsTable}
                        errorMessageBalance={errorMessageBalance}
                        isClient={isClient}
                    />
                </div>

                {/* Bank Links Card */}
                <div className={`${gridConfig.lg.includes('xl:grid-cols-3') ? 'xl:col-span-1' : 'col-span-1'}`}>
                    <BankLinksCard />
                </div>
            </div>
        </div>
    );
}

// Optional: Export individual components if you want to use them elsewhere
export {
    TransactionSummaryCard,
    ForecastingCard,
    BalanceSummaryCard,
    BankLinksCard,
    DashboardHeaderWithMessages,
    SummaryAlertBanner
};