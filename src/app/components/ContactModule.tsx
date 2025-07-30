import React from "react";
import LinkIcons from "./LinkIcons";

const ContactModule = () => {
  return (
<div className="bg-[var(--components-background)] rounded-lg shadow-lg w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl flex flex-col items-center gap-6 p-6 sm:p-8 md:p-10">
  <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden">
        <img
          className="w-full h-full object-cover object-[50%_20%]"
          src="/prof-pic.jpeg"
          alt="Profile Picture"
        />
      </div>
  <div className="flex flex-col items-center text-center gap-3 md:gap-4">
    <h1 className="header text-3xl sm:text-4xl md:text-5xl">Yali Goldstein</h1>
    <p className="paragraph text-base sm:text-lg md:text-xl">
          Software Engineer, Computer Science B.S.
        </p>
        <LinkIcons />
      </div>
    </div>
  );
};

export default ContactModule;
