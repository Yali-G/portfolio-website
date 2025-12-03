import React from "react";
import ContactModule from "./ContactModule";

const ContactPage = () => {
  return (
    <section 
      className="section bg-[var(--contact-background)] flex justify-center items-center overflow-hidden"
      style={{ width: '100%', maxWidth: '100%' }}
    >
      <div className="flex flex-col items-center">
        <h1 className="header text-2xl md:text-5xl">Contact Me</h1>
        <ContactModule />
      </div>
    </section>
  );
};

export default ContactPage;
