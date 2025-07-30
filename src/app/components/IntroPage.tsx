import React from "react";
import Navbar from "./NavBar";
import { ThemeSwitch } from "./ThemeSwitch";

const IntroPage = () => {
  return (
<section className="min-h-screen w-full bg-[var(--intro-background)] transition-all duration-300 flex flex-col">
      <div className="flex m-4 justify-between">
        <Navbar />
        <ThemeSwitch />
      </div>
  <div className="flex flex-col items-center justify-center flex-grow p-4 md:flex-row md:justify-around gap-10">
    <div className="flex flex-col max-w-md md:max-w-lg lg:max-w-xl gap-3 text-center md:text-left">
      <h1 className="header text-4xl sm:text-5xl md:text-6xl">Yali Goldstein</h1>
      <p className="paragraph text-lg sm:text-xl md:text-2xl">
            Hi! I’m Yali. A software engineer interested in full stack
            development and deploying apps in the cloud using AWS.
          </p>
        </div>
    <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden mb-4 relative">
          <img
            className="w-full h-full object-cover object-[50%_20%]"
            src="/prof-pic.jpeg"
            alt="Profile Picture"
          />
        </div>
      </div>
    </section>
  );
};

export default IntroPage;
