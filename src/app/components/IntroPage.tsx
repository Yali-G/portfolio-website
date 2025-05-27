import React from 'react'
import DownButton from './DownButton';
const IntroPage = () => {
  return (
    <section className="section bg-[var(--intro-background)]">
      <h1>Section One</h1> {/* No class on h1 */}
      <p>This is the Second section.</p> {/* No class on p */}
      <DownButton/>
    </section>
  );
}

export default IntroPage
