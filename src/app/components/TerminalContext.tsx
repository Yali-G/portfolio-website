"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CommandHistory {
  command: string;
  output: string;
}

interface TerminalContextType {
  history: CommandHistory[];
  setHistory: React.Dispatch<React.SetStateAction<CommandHistory[]>>;
  currentPath: string;
  setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export const TerminalProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: "",
      output: "Welcome to Yali's Portfolio Terminal!\nType 'help' to see available commands.",
    },
  ]);
  const [currentPath, setCurrentPath] = useState("~");

  return (
    <TerminalContext.Provider value={{ history, setHistory, currentPath, setCurrentPath }}>
      {children}
    </TerminalContext.Provider>
  );
};

export const useTerminal = () => {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error("useTerminal must be used within a TerminalProvider");
  }
  return context;
};

