import React from "react";
import Navbar from "./NavBar";
import { ThemeSwitch } from "./ThemeSwitch";

const IntroPage = () => {
  return (
    <section className=" section bg-[var(--intro-background)] transition-all duration-300 flex flex-start">
      <div className="flex m-4 justify-between">
        <Navbar />
        <ThemeSwitch />
      </div>
      <div className="flex flex-col items-center md:justify-around p-4 md:flex-row h-[100vh] gap-10">
        <div className="flex flex-col md:w-[30%] gap-3">
          <h1 className="header text-2xl md:text-5xl">Yali Goldstein</h1>
          <p className="paragraph md:text-3xl">
            Hi! I’m Yali. A software engineer interested in full stack
            development and deploying apps in the cloud using AWS.
          </p>
        </div>
        <div className="w-[250px] h-[250px] rounded-full overflow-hidden mb-4 relative md:w-[500px] md:h-[500px]">
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
