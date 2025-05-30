import React from "react";
import LinkIcons from "./LinkIcons";
import { ThemeSwitch } from "./ThemeSwitch";
const header = () => {
  return (
    <div className="flex flex-row justify-between w-[100vw] p-6">
      <LinkIcons />
      <ThemeSwitch />
      <div className="flex flex-row justify-across items-center gap-4">
        <a
          href="https://drive.google.com/file/d/1nzzsGBrB5jxl_A27JevlmhLiA0d4Ir4b/view?usp=drive_link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="paragraph header-links">Resume</h2>
        </a>

        <a
          href="https://substack.com/@yaligoldstein?utm_source=user-menu"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="paragraph header-links">Substack</h2>
        </a>
      </div>
    </div>
  );
};

export default header;
