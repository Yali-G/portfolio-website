"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import LinkIcons from "./LinkIcons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex flex-row justify-between w-[60%]">
      <div className="max-w-7xl m-1 md:m-4 flex justify-between items-left">
        {/* for display on laptops and larger screens */}

        <div className="hidden md:flex gap-[5rem] items-center">
          <LinkIcons />
          <Link href="/metrics">
            <h2 className="paragraph header-links text-xl md:text-3xl">
              Metrics
            </h2>
          </Link>
          <a
            href="https://drive.google.com/file/d/17jZGZaJnqarC50eosuoSCissMNYufGpz/view?usp=sharing"
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

        <div className="md:hidden items-end">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col items-center gap-2">
          <div className="border-b-2 border-black pb-2">
            <LinkIcons />
          </div>
          <Link
            href="/metrics"
            className="border-b-2 border-black pb-2"
            onClick={() => setIsOpen(false)}
          >
            <h2 className="paragraph">Metrics</h2>
          </Link>
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
