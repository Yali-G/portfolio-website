import React from "react";
import LinkIcons from "./LinkIcons";

const ContactModule = () => {
  return (
    <div className="component w-[80vw] h-[50vh] md:h-[70vh] md:w-[50vw] rounded-full overflow-hidden shadow-lg flex flex-col justify-evenly">
      <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] lg:w-[250px] lg:h-[250px] rounded-full overflow-hidden mt-4">
        <img
          className="w-full h-full object-cover object-[50%_20%]"
          src="/prof-pic.jpeg"
          alt="Profile Picture"
        />
      </div>
      <div className="flex flex-col items-center justify-between mb-6 gap-3 md:gap-6">
        <h1 className="header text-2xl md:text-5xl">Yali Goldstein </h1>
        <p className="paragraph md:text-3xl">
          Software Engineer, Computer Science B.S.
        </p>
        <LinkIcons />
      </div>
    </div>
  );
};

export default ContactModule;
