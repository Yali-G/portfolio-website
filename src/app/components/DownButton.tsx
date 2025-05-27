'use client'
import React from 'react'

const DownButton = () => {
  return (
    <div className='bg-white w-32 text-black rounded-full flex justify-center'>
    <button onClick={() => console.log('click')}>Hello World </button>
    </div>
  )
}

export default DownButton