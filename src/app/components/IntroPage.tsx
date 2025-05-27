import React from 'react'
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
         <div className='w-[400px] h-[400px] rounded-full overflow-hidden mb-4 relative'>
            <img className=' object-cover object-[50%_20%]' src="/prof-pic.jpeg" alt="Profile Picture"  width={400} height={400}/>
        </div>
      </div>

    </section>
  );
}

export default IntroPage
