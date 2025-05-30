import React from "react";
import ContactModule from "./ContactModule";

const ContactPage = () => {
  return (
    <section className="section bg-[var(--contact-background)]">
      <h1 className="header text-2xl md:text-5xl">Contact Me</h1>
      <ContactModule />
    </section>
  );
};

export default ContactPage;
