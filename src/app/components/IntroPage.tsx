import React from 'react'
import DownButton from './DownButton';
import Header from './Header';
const IntroPage = () => {
  return (
    <section className="section bg-[var(--intro-background)] flex flex-start gap-30">
      <div>
        <Header/> 
      </div>
      <div className='flex flex-row items-center justify-around p-6'>
        <div className='w-[30%]'>
          <h1 className='header'>Yali Goldstein</h1> 
          <p className='paragraph'>Hi! I’m Yali. A software engineer interested in full stack development and deploying apps in the cloud using AWS.</p> 
        </div>
         <div className='w-[400px] h-[400px] rounded-full overflow-hidden mb-4'>
            <img className='w-full h-full object-cover object-[50%_20%]' src="/prof-pic.jpeg" alt="Profile Picture" />
        </div>
      </div>

      {/* <div className='flex justify-center p-6'>

      <DownButton/>
      </div> */}

    </section>
  );
}

export default IntroPage
