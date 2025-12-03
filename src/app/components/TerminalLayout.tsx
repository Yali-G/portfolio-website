"use client";

import { ReactNode, useState } from "react";
import Terminal from "./Terminal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ThemeSwitch } from "./ThemeSwitch";
import { useTerminal } from "./TerminalContext";

interface TerminalLayoutProps {
  children: ReactNode;
}

const TerminalLayout = ({ children }: TerminalLayoutProps) => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const { history, setHistory, currentPath, setCurrentPath } = useTerminal();

  const toggleTerminal = () => {
    setIsTerminalOpen(!isTerminalOpen);
  };

  return (
    <div className="h-screen bg-[var(--intro-background)] transition-all duration-300 flex overflow-hidden">
      {/* Terminal Section - Left Side */}
      <div
        className={`transition-all duration-300 ${
          isTerminalOpen ? "w-[400px] md:w-[500px]" : "w-0"
        } overflow-hidden flex-shrink-0`}
      >
        <Terminal 
          history={history}
          setHistory={setHistory}
          currentPath={currentPath}
          setCurrentPath={setCurrentPath}
          onClose={toggleTerminal}
        />
      </div>

      {/* Vertical Divider with Toggle Button */}
      {isTerminalOpen && (
        <div className="relative flex-shrink-0">
          <div className="w-[2px] h-full bg-gray-300 dark:bg-gray-700"></div>
          <button
            onClick={toggleTerminal}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 bg-[var(--components-background)] border-2 border-gray-300 dark:border-gray-700 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
            aria-label="Close terminal"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Content Section - Right Side */}
      <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        {/* Theme Switch in top right */}
        <div className="absolute top-4 right-4 z-20">
          <ThemeSwitch />
        </div>
        
        {/* Content area with proper scrolling */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full min-w-0">
          {children}
        </div>
      </div>

      {/* Toggle button when terminal is closed */}
      {!isTerminalOpen && (
        <div className="relative flex-shrink-0">
          <div className="w-[2px] h-full bg-gray-300 dark:bg-gray-700"></div>
          <button
            onClick={toggleTerminal}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 bg-[var(--components-background)] border-2 border-gray-300 dark:border-gray-700 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
            aria-label="Open terminal"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TerminalLayout;

