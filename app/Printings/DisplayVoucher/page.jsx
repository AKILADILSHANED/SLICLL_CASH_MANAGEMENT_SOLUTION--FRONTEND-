"use client"
import React, { Suspense } from 'react'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import ErrorMessage from '@/app/Messages/ErrorMessage/page'
import { amountToWords } from '@/app/utills/numberToWords'

function VoucherContent() {
    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables;
    const searchParams = useSearchParams();
    const voucherId = searchParams.get('voucherId');
    const [voucherData, setVoucherData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [voucherComponent, setVoucherComponent] = useState(false);

    useEffect(() => {
        const fetchVoucherDetails = async () => {
            setVoucherComponent(false);
            setError("");
            if (!voucherId) {
                setError("No voucher ID provided");
                setLoading(false);
                return;
            }
            try {
                const request = await fetch(
                    `${baseUrl}/api/v1/printing/getVoucherDetails?voucherNo=${voucherId}`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                const response = await request.json();
                if (request.status === 200) {                    
                    setVoucherComponent(true);
                    setVoucherData(response.responseObject);
                } else {
                    setError(response.message);
                }
            } catch (error) {
                setError("Response not received from server. Please contact administrator!");
            } finally {
                setLoading(false);
            }
        };
        fetchVoucherDetails();
    }, [voucherId, baseUrl]);

    return <div>
        <div>{voucherComponent &&
            <>
                <style>{`
                @media print {
                    /* Hide everything in the body by default */
                    body * {
                        visibility: hidden;
                    }
                    
                    /* Make the printable area and its children visible */
                    .printable-area, .printable-area * {
                        visibility: visible;
                    }
                    
                    /* Position the printable area to fill the page */
                    .printable-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        margin: 0 !important;
                        padding: 1.5rem !important; /* p-8 is 2rem, using 1.5rem for a better print fit */
                        width: 100% !important;
                        max-width: 100% !important;
                        height: auto;
                        border: none !important;
                        box-shadow: none !important;
                        font-size: 10pt; /* Adjust base font size for print */
                    }
                    
                    /* Force background colors to print */
                    .printable-area {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    
                    /* Set A4 page size and margins */
                    @page {
                        size: A4;
                        margin: 5mm;
                    }

                    /* Tweak specific font sizes for print */
                    .printable-area h1 {
                        font-size: 16pt;
                    }
                    .printable-area .text-5xl {
                        font-size: 40pt;
                    }
                    .printable-area .text-3xl {
                        font-size: 24pt;
                    }
                    .printable-area .text-sm {
                        font-size: 9pt;
                    }
                    .printable-area .text-xs {
                        font-size: 8pt;
                    }

                    /* Prevent sections from breaking across pages */
                    .printable-area section {
                        page-break-inside: avoid;
                    }
                }
            `}</style>

                {/* This outer div will be hidden on print */}
                <div className="bg-gray-100 p-10 min-h-screen">
                    {/* This is the main voucher content. 
                  We add `printable-area` class to it.
                */}
                    <div className="printable-area max-w-4xl mx-auto bg-white p-8 border border-gray-300 shadow-lg font-sans">

                        {/* Header Section: Logo and Title */}
                        <header className='flex flex-row justify-between gap-4'>
                            <div className='border-1 w-[200px] h-[80px]'>
                                <p className='ml-2 font-serif'>Audit Clearance:</p>
                            </div>
                            {/* Logo Block */}
                            <div className='flex flex-col w-[200px] rounded-xl'>
                                {/* Top Teal Part */}
                                <div className="flex flex-col bg-cyan-500 p-1 items-center justify-center rounded-t-xl">
                                    <div className="text-white text-5xl font-bold">SLIC</div>
                                    <div className='flex flex-col items-center'>
                                        <h2 className="text-white text-lg font-semibold">Sri Lanka Insurance</h2>                                        
                                    </div>
                                </div>
                                {/* Bottom Red Part */}
                                <div className="bg-yellow-400 p-1 rounded-b-xl">
                                    <h2 className="text-white text-3xl font-bold text-center ">LIFE</h2>
                                    <p className="text-white text-sm text-center">Like a father - Like a mother</p>
                                </div>
                            </div>

                            {/* Voucher Title and Meta Info */}
                            <div className="flex justify-between items-start mt-6 mb-8">
                                {/* Right Side: Meta Data */}
                                <div className="text-left text-sm text-gray-700">
                                    <div className="grid grid-cols-2 gap-x-4 mt-2">
                                        <span className="font-serif">Date</span>
                                        <span>: {voucherData.date}</span>
                                        <span className="font-serif">Cost Center</span>
                                        <span>:</span>
                                        <span className="font-serif">Payment Type</span>
                                        <span>:</span>
                                        <span className="font-serif">Payment Mode</span>
                                        <span>:</span>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Left Side: Title */}
                        <div className='flex flex-col items-center justify-center mt-5'>
                            <h1 className="text-xl font-bold font-serif text-gray-800">FUND TRANSFER PAYMENT VOUCHER</h1>
                            <p className="text-sm text-gray-700 font-sans">VOUCHER NO: {voucherData.voucherNumber}</p>
                        </div>

                        {/* Main Body: Key-Value Pairs */}
                        <section className="space-y-2 text-sm mt-10">
                            <div className="grid grid-cols-12 items-baseline">
                                <span className="col-span-4  text-gray-700">Payee's Name</span>
                                <span className="col-span-1 text-center">:</span>
                                <span className="col-span-7 font-medium">The Manager, {voucherData.toBank}, {voucherData.toBranch}, Sri Lanka Insurance Corporation Life Ltd. A/C No. {voucherData.toAccount}</span>
                            </div>
                            <div className="grid grid-cols-12 items-baseline">
                                <span className="col-span-4  text-gray-700">Payee Address</span>
                                <span className="col-span-1 text-center">:</span>
                                <span className="col-span-7 font-medium">No:21, Vauxhall Street, Colombo 02.</span>
                            </div>
                            <div className="grid grid-cols-12 items-baseline">
                                <span className="col-span-4  text-gray-700">Amount Payable (in words)</span>
                                <span className="col-span-1 text-center">:</span>
                                <span className="col-span-7 font-medium">
                                    {amountToWords(voucherData.transferAmount)}
                                    <br />
                                    (LKR. {voucherData.transferAmount?.toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })})
                                </span>
                            </div>
                            <div className="grid grid-cols-12 items-baseline">
                                <span className="col-span-4  text-gray-700">Description</span>
                                <span className="col-span-1 text-center">:</span>
                                <span className="col-span-7 font-medium">Transfer from {voucherData.fromBank}, {voucherData.fromBranch} A/C No. {voucherData.fromAccount} to, {voucherData.toBank}, {voucherData.toBranch} A/C No. {voucherData.toAccount} of Sri Lanka Insurance Corporation Life Ltd.</span>
                            </div>
                            <div className="grid grid-cols-12 items-baseline">
                                <span className="col-span-4  text-gray-700">Reference for the Approval</span>
                                <span className="col-span-1 text-center">:</span>
                                <span className="col-span-7 font-medium">..............................................................................</span>
                            </div>
                        </section>

                        {/* Bank Details Table */}
                        <section className="mt-6">
                            <table className="w-full border-collapse border border-black text-sm">
                                <thead>
                                    <tr className="bg-gray-300">
                                        <th className="border border-black p-1 text-center font-semibold">Bank Address</th>
                                        <th className="border border-black p-1 text-center font-semibold">Account No.</th>
                                        <th className="border border-black p-1 text-center font-semibold">Rs.</th>
                                        <th className="border border-black p-1 text-center font-semibold">Cts.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-black p-1">{voucherData.fromBank}, {voucherData.fromBranch}</td>
                                        <td className="border border-black p-1">{voucherData.fromAccount}</td>
                                        <td className="border border-black p-1 text-right">{voucherData.transferAmount?.toLocaleString('en-US', {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        })}</td>
                                        <td className="border border-black p-1 text-right">00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        {/* Signature Block 1: Prepared, Checked, Recommended */}
                        <section className="mt-6">
                            {/* Declaration */}
                            <p className="mt-4 text-xs">
                                <strong>Declaration:</strong> The above transaction has been carried out in accordance with company procedures and the voucher is in order for approval.
                            </p>
                            <table className="w-full border-collapse border border-black text-sm">
                                <thead>
                                    <tr className="bg-gray-300">
                                        <th className="border border-black p-1 text-center font-semibold w-1/4"></th>
                                        <th className="border border-black p-1 text-center font-semibold">Name</th>
                                        <th className="border border-black p-1 text-center font-semibold">Designation</th>
                                        <th className="border border-black p-1 text-center font-semibold">Signature</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-black p-2 font-semibold">Prepared By</td>
                                        <td className="border border-black p-2">{voucherData.preparedBy}</td>
                                        <td className="border border-black p-2">{voucherData.prepareUserPosition}</td>
                                        <td className="border border-black p-2">{voucherData.preparedSignature ? (
                                            <img
                                                src={`data:image/png;base64,${voucherData.preparedSignature}`}
                                                alt="Prepared Signature"
                                                className="max-h-8 mx-auto"
                                            />
                                        ) : (
                                            "No signature"
                                        )}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-black p-2 font-semibold">Checked By</td>
                                        <td className="border border-black p-2">{voucherData.checkedBy}</td>
                                        <td className="border border-black p-2">{voucherData.checkedUserPosition}</td>
                                        <td className="border border-black p-2">{voucherData.checkedSignature ? (
                                            <img
                                                src={`data:image/png;base64,${voucherData.checkedSignature}`}
                                                alt="Checked Signature"
                                                className="max-h-8 mx-auto"
                                            />
                                        ) : (
                                            "No signature"
                                        )}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-black p-2 font-semibold">
                                            Recommended By
                                            <br />
                                            (Head of Department)
                                        </td>
                                        <td className="border border-black p-2">{voucherData.approvedBy}</td>
                                        <td className="border border-black p-2">{voucherData.approvedUserPosition}</td>
                                        <td className="border border-black p-2">{voucherData.approvedSignature ? (
                                            <img
                                                src={`data:image/png;base64,${voucherData.approvedSignature}`}
                                                alt="Approved Signature"
                                                className="max-h-8 mx-auto"
                                            />
                                        ) : (
                                            "No signature"
                                        )}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        {/* Signature Block 2: Approving Authority */}
                        <section className="mt-2 flex justify-between items-end text-sm">
                            <table className="w-full border-collapse text-sm">
                                <tbody>
                                    <tr>
                                        <td className="p-2 font-semibold">Approving Authority</td>
                                        <td className=" p-2">...................................</td>
                                        <td className=" p-2">...................................</td>
                                        <td className=" p-2">...................................</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2 font-semibold">Director's Signature</td>
                                        <td className=" p-2">...................................</td>
                                        <td className=" p-2">...................................</td>
                                        <td className=" p-2">...................................</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        <section>
                            <table className="w-full border-collapse border border-black text-sm mt-5">
                                <thead>
                                    <tr className="bg-gray-300">
                                        <th className="border border-black p-1 text-left font-semibold" colSpan="4">Ledger Posting</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-black p-1 font-semibold">To</td>
                                        <td className="border border-black p-1">{voucherData.toGl}</td>
                                        <td className="border border-black p-1">{"Debit"}</td>
                                        <td className="border border-black p-1">{voucherData.transferAmount?.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-black p-1 font-semibold">From</td>
                                        <td className="border border-black p-1">{voucherData.fromGl}</td>
                                        <td className="border border-black p-1">{"Credit"}</td>
                                        <td className="border border-black p-1">{voucherData.transferAmount?.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        <section className='flex flex-row justify-between gap-4'>
                            <table className="border-collapse text-sm mt-5">
                                <tbody>
                                    <tr>
                                        <td className=" p-1 font-semibold">Checked By</td>
                                        <td className=" p-1">...................................</td>
                                    </tr>
                                    <tr>
                                        <td className=" p-1 font-semibold">Pass for Payment</td>
                                        <td className=" p-1">...................................</td>
                                    </tr>
                                    <tr>
                                        <td className=" p-1 font-semibold">Manager Finance</td>
                                        <td className=" p-1">...................................</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table className="border-collapse text-sm mt-5">
                                <tbody>
                                    <tr>
                                        <td className=" p-1 font-semibold">Bank Ac. No</td>
                                        <td className=" p-1">...................................</td>
                                    </tr>
                                    <tr>
                                        <td className=" p-1 font-semibold">Cheque No</td>
                                        <td className=" p-1">...................................</td>
                                    </tr>
                                    <tr>
                                        <td className=" p-1 font-semibold">Cheque Date</td>
                                        <td className=" p-1">...................................</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table className="border-collapse text-sm mt-5">
                                <tbody>
                                    <tr>
                                        <td className=" p-1 font-semibold">Name</td>
                                        <td className=" p-1">...................................</td>
                                    </tr>
                                    <tr>
                                        <td className=" p-1 font-semibold">EPF/ID No.</td>
                                        <td className=" p-1">...................................</td>
                                    </tr>
                                    <tr>
                                        <td className=" p-1 font-semibold">Signature</td>
                                        <td className=" p-1">...................................</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                    </div>
                </div>
            </>

        }
        </div>
        <div>
            {error && <ErrorMessage messageValue={error} />}
        </div>
        <div>
            {loading && "Voucher is being generated...."}
        </div>
    </div>
}

export default function DisplayVoucher() {
    return (
        <Suspense fallback={<div>Voucher is being generated....</div>}>
            <VoucherContent />
        </Suspense>
    )
}
