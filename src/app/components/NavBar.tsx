"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import LinkIcons from "./LinkIcons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex justify-start">
      <div className="max-w-7xl m-1 md:m-4 flex justify-between items-left">
        {/* for display on laptops and larger screens */}

        <div className="hidden md:flex gap-[5rem] items-center">
          <LinkIcons />
          <a
            href="https://drive.google.com/file/d/1nzzsGBrB5jxl_A27JevlmhLiA0d4Ir4b/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="paragraph header-links text-xl md:text-3xl">
              Resume
            </h2>
          </a>

          <a
            href="https://substack.com/@yaligoldstein?utm_source=user-menu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="paragraph header-links text-xl md:text-3xl">
              Substack
            </h2>
          </a>
        </div>

        {/* For display on mobile */}

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-8 pb-4 flex flex-col gap-2">
          <div className="border-b-2 border-black pb-2">
            <LinkIcons />
          </div>
          <a
            href="https://drive.google.com/file/d/1nzzsGBrB5jxl_A27JevlmhLiA0d4Ir4b/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b-2 border-black pb-2"
          >
            <h2 className="paragraph">Resume</h2>
          </a>

          <a
            href="https://substack.com/@yaligoldstein?utm_source=user-menu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="paragraph">Substack</h2>
          </a>
        </div>
      )}
    </nav>
  );
}

// import React from "react";
// const header = () => {
//   return (
//     <div className="flex flex-row justify-between w-[100vw] p-6">
//       <LinkIcons />
//       <ThemeSwitch />
//       <div className="flex flex-row justify-across items-center gap-4">
//         <a
//           href="https://drive.google.com/file/d/1nzzsGBrB5jxl_A27JevlmhLiA0d4Ir4b/view?usp=drive_link"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className="paragraph header-links">Resume</h2>
//         </a>

//         <a
//           href="https://substack.com/@yaligoldstein?utm_source=user-menu"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className="paragraph header-links">Substack</h2>
//         </a>
//       </div>
//     </div>
//   );
// };

// export default header;
