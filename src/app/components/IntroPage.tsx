import React from 'react'
import DownButton from './DownButton';

const IntroPage = () => {
  return (
    <section className="h-screen bg-[var(--intro-background)] flex flex-col items-center justify-around">
      <h1>Section One</h1> {/* No class on h1 */}
      <p>This is the first section.</p> {/* No class on p */}
      <DownButton/>
    </section>
  );
}

export default IntroPage
