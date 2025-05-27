import React from 'react'

const EducationPage = () => {
  return (
    <section className="section bg-[var(--education-background)] flex justify-around">
      <div>
        <h1 className='header'>Education</h1>
      </div>

      <div className='component w-[60vw]'>
        <div className='flex flex-row justify-start items-center w-[90%] gap-4'>
        <div className='w-20'><img className='h-[100%] w-[100%]' src="/ucsc-logo.png" alt="" /></div>
        <h1 className='title'>University of California, Santa Cruz</h1>
        </div>
        <div className='bg-black h-0.5 w-full mt-2 mb-4'/>
        <div>
          <p className='paragraph'> 
            I graduated from UC Santa Cruz in March 2025 with my B.S. in Computer Science.  
          </p>
        </div>

      </div>
       <div className='component w-[60vw]'>
        <div className='flex flex-row justify-start items-center w-[90%] gap-4'>
        <div className='w-10'><img className='h-[100%] w-[100%]' src="/fremonthigh-logo.png" alt="" /></div>
        <h1 className='title'>Fremont High School</h1>
        </div>
        <div className='bg-black h-0.5 w-full mt-2 mb-4'/>
        <div>
          <p className='paragraph'> 
            I grew up In Sunnyvale, CA where I graduated from Fremont High School in 2021. 
            I first found my passion for coding in the AP Computer Science course I took there (Specifically when we coded up tetris)!
          </p>
        </div>

      </div>
    </section>
  );
}

export default EducationPage
