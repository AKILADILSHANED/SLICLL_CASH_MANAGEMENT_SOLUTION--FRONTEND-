"use client"
import React, { useState } from 'react'
import Spinner from '../../Spinner/page'
import ErrorMessage from '../../Messages/ErrorMessage/page';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function IBTSheetPrint() {
    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables;
    const [sheetDate, setSheetDate] = useState("");
    const [sheetData, setSheetData] = useState([]);
    const [sheetDataTable, setSheetDataTable] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const [viewSpinner, setViewSpinner] = useState(false);
    const [downloadSpinner, setDownloadSpinner] = useState(false);
    const [exportSpinner, setExportSpinner] = useState(false);
    const [totalTransfers, setTotalTransfers] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    //Define getSheetData function;
    const getSheetData = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSheetDataTable(false);
        setViewSpinner(true);
        try {
            const request = await fetch(
                `${baseUrl}/api/v1/printing/printIBTSheet?sheetDate=${sheetDate}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            const response = await request.json();
            if (request.status === 200) {
                const data = response.responseObject || [];
                setSheetData(data);
                setSheetDataTable(true);
                setTotalTransfers(data.length);

                // Calculate total amount
                const total = data.reduce((sum, item) => {
                    return sum + (parseFloat(item.transferAmount) || 0);
                }, 0);
                setTotalAmount(total);
            } else {
                setErrorMessage(response.message);
                setSheetDataTable(false);
            }
        } catch (error) {
            setErrorMessage("Response not received from server. Please contact administrator!");
            setSheetDataTable(false);
        } finally {
            setViewSpinner(false);
        }
    }

    //Define download function;
    const downloadPDF = () => {
        setDownloadSpinner(true);

        const tableElement = document.querySelector('.min-w-full.border.border-blue-600');

        if (!tableElement) {
            setErrorMessage("Table not found for download");
            setDownloadSpinner(false);
            return;
        }

        // Create a container div for the entire PDF content
        const pdfContainer = document.createElement('div');
        pdfContainer.style.cssText = `
            position: fixed;
            left: -9999px;
            top: 0;
            width: 1000px;
            padding: 20px;
            background: white;
            z-index: -1000;
        `;

        // Create Company Name title
        const companyName = document.createElement('h1');
        companyName.textContent = "Sri Lanka Insurance Corporation Life Limited";
        companyName.style.cssText = `
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #000000;
            font-family: Arial, sans-serif;
        `;

        // Create header title
        const headerTitle = document.createElement('h2');
        headerTitle.textContent = `IBT Sheet for ${sheetDate}`;
        headerTitle.style.cssText = `
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #000000;
            font-family: Arial, sans-serif;
        `;

        // Create summary section
        const summaryDiv = document.createElement('div');
        summaryDiv.style.cssText = `
            text-align: center;
            margin-bottom: 20px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #000000;
        `;
        summaryDiv.innerHTML = `
            <div><strong>Total Transfers:</strong> ${totalTransfers}</div>
            <div><strong>Total Amount:</strong> ${formatCurrency(totalAmount)}</div>
            <div><strong>Date:</strong> ${sheetDate}</div>
        `;

        // Create a wrapper div to center the table
        const tableWrapper = document.createElement('div');
        tableWrapper.style.cssText = `
            display: flex;
            justify-content: center;
            width: 100%;
        `;

        const tableClone = tableElement.cloneNode(true);

        const applyPDFSafeStyles = (element) => {
            element.style.color = '#000000';
            element.style.backgroundColor = '#ffffff';
            element.style.borderColor = '#000000';

            const allElements = element.querySelectorAll('*');
            allElements.forEach(el => {
                el.style.color = '#000000';
                el.style.backgroundColor = el.tagName === 'TH' ? '#f8f9fa' : '#ffffff';
                el.style.borderColor = '#000000';

                el.classList.remove('dark:text-white', 'dark:bg-gray-700', 'dark:border-gray-600',
                    'text-gray-900', 'bg-gray-50', 'border-gray-300',
                    'text-gray-600', 'text-gray-700', 'text-gray-800',
                    'bg-blue-50', 'hover:bg-gray-50');
            });
        };

        applyPDFSafeStyles(tableClone);

        // Assemble the PDF content
        tableWrapper.appendChild(tableClone);
        pdfContainer.appendChild(companyName);
        pdfContainer.appendChild(headerTitle);
        pdfContainer.appendChild(summaryDiv);
        pdfContainer.appendChild(tableWrapper);
        document.body.appendChild(pdfContainer);

        html2canvas(pdfContainer, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            removeContainer: true,
            onclone: (clonedDoc, element) => {
                const allClonedElements = element.querySelectorAll('*');
                allClonedElements.forEach(el => {
                    const computedStyle = window.getComputedStyle(el);
                    if (computedStyle.color) {
                        el.style.color = '#000000';
                    }
                    if (computedStyle.backgroundColor && computedStyle.backgroundColor !== 'transparent') {
                        if (el.tagName === 'TH') {
                            el.style.backgroundColor = '#f8f9fa';
                        } else if (el.tagName !== 'H1' && el.tagName !== 'H2' && el.tagName !== 'DIV') {
                            el.style.backgroundColor = '#ffffff';
                        }
                    }
                    if (computedStyle.borderColor) {
                        el.style.borderColor = '#000000';
                    }
                });
            }
        }).then((canvas) => {
            // Clean up
            document.body.removeChild(pdfContainer);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgWidth = 297; // A4 landscape width in mm
            const pageHeight = 210; // A4 landscape height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`IBT-Sheet-${sheetDate}.pdf`);
            setDownloadSpinner(false);
        }).catch((error) => {
            console.error('Error generating PDF:', error);
            setErrorMessage("Failed to generate PDF. Please try again.");
            setDownloadSpinner(false);
            if (document.body.contains(pdfContainer)) {
                document.body.removeChild(pdfContainer);
            }
        });
    };

    //Define exportJv function;
    const exportJv = async () => {
        setExportSpinner(true);
        try {
            const response = await fetch(`${baseUrl}/api/v1/excel-export/je-export/excel?date=${sheetDate}`,
                {
                    method: 'GET',
                    credentials: "include"
                });
            if (response.status !== 200) {
                throw new Error('Export failed');
            }

            // Create blob from response
            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            // Add current date to filename
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            a.download = `je_export_${formattedDate}.xlsx`;

            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (error) {
            alert('Failed to export data');
        } finally {
            setExportSpinner(false);
        }
    }

    const formatCurrency = (amount) => {
        const number = parseFloat(amount || 0);
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(number);
    };

    const formatDateDisplay = (dateString) => {
        if (!dateString) return "";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    const clearFilters = () => {
        setSheetDate("");
        setSheetDataTable(false);
        setErrorMessage("");
        setSheetData([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto animate-fadeIn">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-green-700 rounded-t-xl shadow-lg p-6 mb-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    IBT Sheet Printing
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    Generate and export IBT (Inter-Bank Transfer) sheets
                                </p>
                            </div>
                        </div>
                        {sheetDataTable && (
                            <div className="text-white text-sm bg-white/20 px-3 py-1 rounded-lg">
                                {totalTransfers} transfers • Rs.{formatCurrency(totalAmount)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Control Card */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 md:p-8 -mt-2 relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                IBT Sheet Generation
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Select a date to view and export IBT sheet data
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 
                                         rounded-lg transition-all duration-200 flex items-center gap-2"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    ></path>
                                </svg>
                                Clear
                            </button>
                        </div>
                    </div>

                    <form onSubmit={getSheetData}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Transfer Date
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="w-5 h-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <input
                                        type="date"
                                        value={sheetDate}
                                        onChange={(e) => setSheetDate(e.target.value)}
                                        required
                                        className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg 
                                                 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                                 transition-all duration-200 shadow-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={viewSpinner || !sheetDate}
                                    className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                             rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                                             focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                             active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                             disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {viewSpinner ? (
                                        <>
                                            <Spinner size={20} />
                                            <span>Loading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                ></path>
                                            </svg>
                                            <span>View Sheet</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <svg
                                        className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    <div>
                                        <h4 className="text-sm font-semibold text-green-800 mb-1">
                                            IBT Sheet Information
                                        </h4>
                                        <p className="text-sm text-green-700">
                                            View inter-bank transfer details for a specific date and export to PDF or Excel.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className="mt-6 animate-slideDown">
                        <ErrorMessage messageValue={errorMessage} />
                    </div>
                )}

                {/* IBT Sheet Table */}
                {sheetDataTable && (
                    <div className="mt-8 animate-fadeIn">
                        {/* Table Header */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-gray-200 rounded-t-xl p-5">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <svg
                                            className="w-5 h-5 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            IBT Sheet for {formatDateDisplay(sheetDate)}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {totalTransfers} transfers • Total amount: Rs.{formatCurrency(totalAmount)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-sm text-gray-600">
                                        <span className="font-semibold">Date:</span> {sheetDate}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table id="ibt-sheet-table" className="min-w-full border border-blue-600 pdf-safe-table">
                                    <thead className="bg-blue-50">
                                        <tr>
                                            <th className="border border-blue-600 text-sm px-6 py-3 font-semibold text-gray-700 text-left">From Bank</th>
                                            <th className="border border-blue-600 text-sm px-6 py-3 font-semibold text-gray-700 text-left">From Account</th>
                                            <th className="border border-blue-600 text-sm px-6 py-3 font-semibold text-gray-700 text-left">To Bank</th>
                                            <th className="border border-blue-600 text-sm px-6 py-3 font-semibold text-gray-700 text-left">To Account</th>
                                            <th className="border border-blue-600 text-sm px-6 py-3 font-semibold text-gray-700 text-left">Amount (Rs.)</th>
                                            <th className="border border-blue-600 text-sm px-6 py-3 font-semibold text-gray-700 text-left">Channel</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {sheetData.map((element) => (
                                            <tr key={element.transferId} className="hover:bg-blue-50 transition duration-150">
                                                <td className="border border-blue-600 text-sm px-6 py-3 text-gray-600">{element.fromBank}</td>
                                                <td className="border border-blue-600 text-sm px-6 py-3 text-gray-600">{element.fromAccount}</td>
                                                <td className="border border-blue-600 text-sm px-6 py-3 text-gray-600">{element.toBank}</td>
                                                <td className="border border-blue-600 text-sm px-6 py-3 text-gray-600">{element.toAccount}</td>
                                                <td className="border border-blue-600 text-sm px-6 py-3 text-gray-600 text-right font-medium">
                                                    {formatCurrency(element.transferAmount)}
                                                </td>
                                                <td className="border border-blue-600 text-sm px-6 py-3 text-gray-600">{element.channel}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footer */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-gray-600">
                                        Showing <span className="font-semibold">{totalTransfers}</span> transfer{totalTransfers !== 1 ? 's' : ''}
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold">Total Amount:</span>
                                            <span className="ml-2 text-lg font-bold text-blue-700">
                                                Rs.{formatCurrency(totalAmount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Export Buttons */}
                        <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
                            <button
                                type="button"
                                onClick={downloadPDF}
                                disabled={downloadSpinner || !sheetDataTable}
                                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 
                                         rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 
                                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                         disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {downloadSpinner ? (
                                    <>
                                        <Spinner size={16} />
                                        <span>Generating PDF...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            ></path>
                                        </svg>
                                        <span>Download PDF Report</span>
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={exportJv}
                                disabled={exportSpinner || !sheetDataTable}
                                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                         rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 
                                         focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 
                                         active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2
                                         disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {exportSpinner ? (
                                    <>
                                        <Spinner size={16} />
                                        <span>Exporting Excel...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            ></path>
                                        </svg>
                                        <span>Export Journal Entries (Excel)</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State - Before Search */}
                {!sheetDataTable && !viewSpinner && (
                    <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-lg p-8 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="bg-gradient-to-r from-blue-100 to-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Generate IBT Sheet
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Select a date above to view and export the IBT (Inter-Bank Transfer) sheet.
                            </p>
                            <p className="text-sm text-gray-500">
                                The sheet will display all inter-bank transfers for the selected date.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}