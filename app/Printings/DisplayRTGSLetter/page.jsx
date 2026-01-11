"use client"
import React, { Suspense, useState } from 'react'
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation'
import { amountToWords } from '@/app/utills/numberToWords'

function RTGCLetterContent() {
    //Define base url;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    //Define state variables;
    const searchParams = useSearchParams();
    const [letterComponent, setLetterComponent] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [letterData, setLetterData] = useState([]);
    const voucherId = searchParams.get('voucherId');



    //Define fetchTransferDetails function;
    useEffect(() => {
        const fetchTransferDetails = async () => {
            setLetterComponent(false);
            setError("");
            if (!voucherId) {
                setError("No Transfer ID provided");
                setLoading(false);
                return;
            }
            try {
                const request = await fetch(
                    `${baseUrl}/api/v1/printing/rtgs-letter-details?voucherNo=${voucherId}`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                if (request.ok) {
                    const response = await request.json();
                    setLetterComponent(true);
                    setLetterData(response.responseObject);
                } else {
                    const response = await request.json();
                    setError(response.message);
                }
            } catch (error) {
                setError("Unexpected error occurred. Please contact administrator!");
            } finally {
                setLoading(false);
            }
        };
        fetchTransferDetails();
    }, [voucherId, baseUrl]);

    // Get current date in dd/mm/yyyy format
    const getCurrentDateFormatted = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = today.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return <div>
        {letterComponent && (
            <>
                <style>{`
                                @media print {
                                    @page {
                                        size: A4;
                                        margin: 0; /* Keeps browser headers/footers off */
                                    }
        
                                    body {
                                        margin: 0;
                                        padding: 0;
                                        -webkit-print-color-adjust: exact;
                                    }
        
                                    /* Hide UI elements */
                                    body * {
                                        visibility: hidden;
                                    }
        
                                    /* Show and position the letter */
                                    .printable-area, .printable-area * {
                                        visibility: visible;
                                    }
        
                                    .printable-area {
                                        position: absolute;
                                        left: 0;
                                        top: 0;
                                        width: 210mm; /* Exact A4 Width */
                                        height: 297mm; /* Exact A4 Height */
                                        
                                        /* SPACE FOR LETTERHEAD */
                                        padding-top: 60mm !important; 
                                        
                                        /* Side and Bottom Margins */
                                        padding-left: 10mm !important;
                                        padding-right: 15mm !important;
                                        padding-bottom: 20mm !important;
                                        
                                        margin: 0 !important;
                                        box-sizing: border-box; /* Ensures padding doesn't push width over 210mm */
                                        border: none !important;
                                        box-shadow: none !important;
                                    }
                                }
        
                                /* Screen styles - Making it look like a real paper on screen */
                                @media screen {
                                    .letter-preview-bg {
                                        background-color: #525659; /* Darker gray like a PDF viewer */
                                        padding: 50px 0;
                                        min-height: 100vh;
                                        display: flex;
                                        justify-content: center;
                                    }
                                    .printable-area {
                                        width: 210mm;
                                        min-height: 297mm;
                                        background: white;
                                        /* Space for letterhead also visible on screen so you can preview layout */
                                        padding-top: 60mm; 
                                        padding-left: 25mm;
                                        padding-right: 25mm;
                                        padding-bottom: 20mm;
                                        box-shadow: 0 0 20px rgba(0,0,0,0.4);
                                        box-sizing: border-box;
                                    }
                                }
                            `}</style>

                <div className="letter-preview-bg">
                    <div className="printable-area  text-[12pt] leading-relaxed text-black">
                        <section>
                            <p>Finance Department,</p>
                            <p>{getCurrentDateFormatted()}</p>
                        </section>

                        <section className='mt-10'>
                            <p>The Manager.</p>
                            <p>{letterData.fromBank}</p>
                            <p>{letterData.fromBranch}</p>
                        </section>

                        <section className='mt-8'>
                            <p>Dear Sir / Madam,</p>
                        </section>

                        <section className='mt-8 font-bold flex flex-col'>
                            <p className='decoration-1 underline-offset-4 flex flex-row justify-between'>
                                <label>FUND TRANSFER:</label>
                                <label className='text-right'>LKR {letterData.transferAmount?.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}</label>
                            </p>
                            <p className="flex flex-row justify-between border-b border-black pb-1">
                                <label>DATE OF TRANSFER:</label>
                                <label className="text-right">{letterData.valueDate}</label>
                            </p>

                        </section>

                        <br />
                        <section>
                            Further to the discussion had with our investment department,
                        </section>

                        <section className='mt-8'>
                            <p className="text-justify">
                                Please make a transfer for <label className='font-bold'>{amountToWords(letterData.transferAmount)} (LKR. {letterData.transferAmount?.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })})</label>
                                {" "} from {letterData.fromBank}, {letterData.fromBranch} A/C No. <label className='font-bold'>{letterData.fromAccount}</label> to {letterData.toBank}, {letterData.toBranch} A/C No. <label className='font-bold'>{letterData.toAccount}</label> of Sri Lanka Insurance Corporation General Ltd.
                                on <label className='font-bold'>{letterData.valueDate}</label>, under advice to us.
                            </p>
                        </section>

                        <section className='mt-12'>
                            <p>SRI LANKA INSURANCE CORPORATION GENERAL LTD.</p>
                        </section>

                        <section className='mt-20 flex flex-row justify-between'>
                            <div className='flex flex-col items-center w-64'>
                                <span>................................................</span>
                                <span className="mt-2 font-semibold">Authorized Officer</span>
                            </div>
                            <div className='flex flex-col items-center w-64'>
                                <span>................................................</span>
                                <span className="mt-2 font-semibold">Authorized Officer</span>
                            </div>
                        </section>
                    </div>
                </div>
            </>
        )}

        {error && <div className="p-4 text-red-600">{error}</div>}
        {loading && <div className="p-4">Letter is being generated....</div>}
    </div>
}

export default function DisplayRTGSLetter() {
    return (
        <Suspense fallback={<div>Letter is being generated....</div>}>
            <RTGCLetterContent/>
        </Suspense>
    )
}
