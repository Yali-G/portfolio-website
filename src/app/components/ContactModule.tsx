import React from 'react'
import LinkIcons from './LinkIcons'
const ContactModule = () => {
  return (
    <div className="component h-[70vh] w-[50vw] rounded-full overflow-hidden shadow-lg ">
        <div className='w-[200px] h-[200px] rounded-full overflow-hidden mb-4'>
            <img className='w-full h-full object-cover object-[50%_20%]' src="/prof-pic.jpeg" alt="Profile Picture" />
        </div>
        <div className="flex flex-col items-center justify-between">
            <h1 className='header'>Yali Goldstein</h1>
            <p className='paragraph'>Software Engineer, Computer Science B.S.</p>
        </div>
            <LinkIcons/>
    </div>
  )
}

export default ContactModule
