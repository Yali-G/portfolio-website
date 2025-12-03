import React from "react";
import Navbar from "./NavBar";

const IntroPage = () => {
  return (
    <section
      className="section bg-[var(--intro-background)] transition-all duration-300 min-h-full overflow-hidden"
      style={{ width: "100%", maxWidth: "100%" }}
    >
      <div className="flex m-4 gap-8 justify-evenly md:justify-between">
        <Navbar />
      </div>
      <div className="flex flex-col items-center md:justify-around p-4 md:flex-row min-h-[70vh] gap-4 md:gap-6 w-full max-w-full">
        <div className="flex flex-col flex-shrink md:flex-1 md:max-w-[40%] gap-3 min-w-0">
          <h1 className="header text-2xl md:text-4xl lg:text-5xl">
            Yali Goldstein
          </h1>
          <p className="paragraph text-lg md:text-2xl lg:text-3xl">
            Hi! I'm Yali. A software engineer interested in full stack
            development and deploying apps in the cloud using AWS.
          </p>
        </div>
        <div className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] xl:w-[450px] xl:h-[450px] flex-shrink-0 rounded-full overflow-hidden mb-4 relative max-w-[calc(100%-2rem)]">
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
