import React from 'react'
import { ClipLoader } from "react-spinners";

export default function Spinner({size}) {
  return (
    <div className='flex flex-row items-center justify-center'>
        <ClipLoader color="#36d7b7" size={size}/>
    </div>
  )
}

