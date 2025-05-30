import React from "react";

const LinkIcons = () => {
  return (
    <div className="flex link-icon-image w-[10rem] md:w-[18rem] gap-[2rem] md:gap-[4rem]">
      <a
        className="flex-1"
        href="https://www.linkedin.com/in/yali-goldstein/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/linkedin.svg" alt="LinkedIn icon" />
      </a>

      <a className="flex-1" href="mailto:goldstein.yali1@gmail.com">
        <img src="/email.svg" alt="Email icon" />
      </a>

      <a
        className="flex-1"
        href="https://github.com/Yali-G"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/github.svg" alt="GitHub icon" />
      </a>
    </div>
  );
};

export default LinkIcons;
