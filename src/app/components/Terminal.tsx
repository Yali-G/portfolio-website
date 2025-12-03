"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface CommandHistory {
  command: string;
  output: string;
}

interface TerminalProps {
  history: CommandHistory[];
  setHistory: React.Dispatch<React.SetStateAction<CommandHistory[]>>;
  currentPath: string;
  setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
  onClose?: () => void;
}

const Terminal = ({ history, setHistory, currentPath, setCurrentPath, onClose }: TerminalProps) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Sync path with current route
  useEffect(() => {
    if (pathname === "/") {
      setCurrentPath("~");
    } else if (pathname === "/aboutme") {
      setCurrentPath("~/aboutme");
    } else if (pathname === "/projects") {
      setCurrentPath("~/projects");
    } else if (pathname === "/contactme") {
      setCurrentPath("~/contactme");
    } else if (pathname === "/metrics") {
      setCurrentPath("~/metrics");
    }
  }, [pathname, setCurrentPath]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output = "";

    if (trimmedCmd === "help") {
      output = `Available commands:
  whoami          - Navigate to About Me page
  cd projects     - Navigate to Projects page
  cd contactme    - Navigate to Contact Me page
  cd metrics      - Navigate to Metrics page
  cd ~            - Return to home directory
  ls              - List available directories
  pwd             - Print working directory
  close           - Close terminal
  clear           - Clear terminal
  help            - Show this help message`;
    } else if (trimmedCmd === "pwd") {
      output = currentPath;
    } else if (trimmedCmd === "ls") {
      output = `aboutme/  projects/  contactme/  metrics/`;
    } else if (trimmedCmd === "whoami") {
      setCurrentPath("~/aboutme");
      output = "Navigating to About Me...";
      setTimeout(() => {
        router.push("/aboutme");
      }, 500);
    } else if (trimmedCmd === "cd projects") {
      setCurrentPath("~/projects");
      output = "Navigating to Projects...";
      setTimeout(() => {
        router.push("/projects");
      }, 500);
    } else if (trimmedCmd === "cd contactme") {
      setCurrentPath("~/contactme");
      output = "Navigating to Contact Me...";
      setTimeout(() => {
        router.push("/contactme");
      }, 500);
    } else if (trimmedCmd === "cd metrics") {
      setCurrentPath("~/metrics");
      output = "Navigating to Metrics...";
      setTimeout(() => {
        router.push("/metrics");
      }, 500);
    } else if (trimmedCmd === "cd ~" || trimmedCmd === "cd") {
      setCurrentPath("~");
      output = "Returning to home...";
      setTimeout(() => {
        router.push("/");
      }, 500);
    } else if (trimmedCmd === "close") {
      output = "Closing terminal...";
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 300);
      }
    } else if (trimmedCmd === "clear") {
      setHistory([{
        command: "",
        output: "Terminal cleared.",
      }]);
      return;
    } else if (trimmedCmd === "") {
      output = "";
    } else {
      output = `Command not found: ${cmd}. Type 'help' to see available commands.`;
    }

    if (trimmedCmd !== "clear") {
      setHistory((prev) => [...prev, { command: cmd, output }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="h-screen bg-black transition-all duration-300 flex flex-col">
      <div className="w-full h-full flex flex-col">
        <div className="bg-black overflow-hidden flex flex-col h-full">
          {/* Terminal Header */}
          <div className="bg-gray-800 dark:bg-gray-900 px-4 py-2 flex items-center gap-2 flex-shrink-0">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="ml-4 text-gray-300 text-sm font-mono">
              yali@portfolio:~$
            </div>
          </div>

          {/* Terminal Body */}
          <div
            ref={terminalRef}
            className="bg-black text-green-400 font-mono p-6 flex-1 overflow-y-auto"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {history.map((item, index) => (
              <div key={index} className="mb-2">
                {item.command && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-400">yali@portfolio</span>
                    <span className="text-gray-500">:</span>
                    <span className="text-yellow-400">{currentPath}</span>
                    <span className="text-gray-500">$</span>
                    <span className="ml-2 text-white">{item.command}</span>
                  </div>
                )}
                {item.output && (
                  <div className="text-green-400 whitespace-pre-wrap ml-2">
                    {item.output}
                  </div>
                )}
              </div>
            ))}

            {/* Current Input Line */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-400">yali@portfolio</span>
                <span className="text-gray-500">:</span>
                <span className="text-yellow-400">{currentPath}</span>
                <span className="text-gray-500">$</span>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-green-400 outline-none caret-green-400"
                autoFocus
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;

