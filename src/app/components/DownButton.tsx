'use client'
import React from 'react'

const DownButton = () => {
  return (
    <div className='flex justify-center outline outline-black  w-30 h-15 rounded-full'>
    <button onClick={() => console.log('click')}>
      <img className='v-[90%] h-[90%]' src="down-arrow.svg" alt="Down Arrow" />
       </button>
    </div>
  )
}

export default DownButton