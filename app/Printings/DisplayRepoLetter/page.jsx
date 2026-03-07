"use client"
import React, { Suspense, useState } from 'react'
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation'
import { amountToWords } from '@/app/utills/numberToWords'

function RepoLetterContent() {
  //Define base url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //Define state variables;
  const searchParams = useSearchParams();
  const [letterComponent, setLetterComponent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [letterData, setLetterData] = useState([]);
  const repoId = searchParams.get('repoId');


  //Define fetchRepoDetails function;
  useEffect(() => {
    const fetchRepoDetails = async () => {
      setLetterComponent(false);
      setError("");
      if (!repoId) {
        setError("No Repo ID provided");
        setLoading(false);
        return;
      }
      try {
        const request = await fetch(
          `${baseUrl}/api/v1/printing/repo-letter-details?repoId=${repoId}`,
          {
            method: "GET",
            credentials: "include"
          }
        );
        const response = await request.json();
        if (request.status === 200) {
          setLetterComponent(true);
          setLetterData(response.responseObject[0]);
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError("Response not received from server. Please contact administrator!");
      } finally {
        setLoading(false);
      }
    };
    fetchRepoDetails();
  }, [repoId, baseUrl]);

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
                                    padding-top: 45mm !important; 
                                    
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
                                    padding-top: 45mm; 
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

            <section className='mt-5'>
              <p>Head of Global Market,</p>
              <p>Treasury Devision,</p>
              <p>Commercial Bank of Ceylon PLC,</p>
              <p>Commercial House,</p>
              <p>Colombo 01.</p>
            </section>

            <section className='mt-5'>
              <p>Dear Sir / Madam,</p>
            </section>

            <section className='mt-5 font-bold'>
              <p className='underline decoration-1 underline-offset-4'>
                TREASURY BILL / BOND REPO INVESTMENT VALUE: Rs.{letterData.investmentValue && parseFloat(letterData.investmentValue).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
              <p className='underline decoration-1 underline-offset-4'>
                DATE OF INVESTMENT: {letterData.investmentDate}
              </p>
            </section>

            <section className='mt-5 text-justify'>
              <p className="text-justify">
                Further to the discussion had with our investment department regarding above,
              </p>
              <p className='mt-2'>
                Please arrange to invest Rs.{letterData.investmentValue && parseFloat(letterData.investmentValue).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} {" "}
                {"("}{amountToWords(letterData.investmentValue)}{")"} {" "}
                in Treasury Bill / Bond Repo for {letterData.numberOfDays} days from {letterData.investmentDate} to {letterData.maturityDate} at an interest rate of {letterData.interestRate}% p.a. as agreed.
              </p>

              <p className='mt-2'>
                The investment amount to be debited from our Current Account No.{letterData.bankAccount} of Sri Lanka Insurance Corporation Life Ltd.
                at {letterData.bank}, {letterData.bankBranch} Branch on {letterData.investmentDate}.
              </p>

              <p className='mt-2'>
                Please credit the maturity value to our Current Account No.{letterData.bankAccount + " "}of Sri Lanka Insurance Corporation Life Ltd.
                at {letterData.bank}, {letterData.bankBranch} Branch. If we are not providing the instructions on maturity proceeds, please rollover the above Repo until further notice.
              </p>

              <p className='mt-2'>
                Please confirm and arrange to send the Govt. Securities for this Investment (CDS No. PB 5208).
              </p>
            </section>

            <section className='mt-4'>
              <p>SRI LANKA INSURANCE CORPORATION LIFE LTD.</p>
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

export default function DisplayRepoLetter() {
  return (
    <Suspense fallback={<div>Letter is being generated...</div>}>
      <RepoLetterContent/>
    </Suspense>
  )
}
