import React from 'react'
import ContactModule from './ContactModule';

const ContactPage = () => {
  return (
    <section className="section bg-[var(--contact-background)]">
      <h1 className='header'>Contact Me</h1> {/* No class on h1 */}
      <ContactModule />
    </section>
  );
}

export default ContactPage
