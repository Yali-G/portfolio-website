"use client";

import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
<<<<<<< HEAD

=======
>>>>>>> development
  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full overflow-hidden transition-all duration-300 h-[2rem] w-[2rem] md:h-[4rem] md:w-[4rem]"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
<<<<<<< HEAD
        <FaMoon className="h-[1.2rem] w-[1.2rem] transform transition-transform duration-300 rotate-0 scale-100" />
=======
        <FaMoon className="transform transition-transform duration-300 rotate-0 scale-100 md:scale-200 " />
>>>>>>> development
      ) : (
        <FaSun className="transform transition-transform duration-300 rotate-180 scale-100 md:scale-200" />
      )}
    </Button>
  );
}
