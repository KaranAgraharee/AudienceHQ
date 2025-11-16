"use client";

import { createContext, useContext, useEffect, useState, useRef, startTransition } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const initialized = useRef(false);

  const updateTheme = (newTheme: Theme) => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (newTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  // Initialize theme on mount (sync with localStorage - external system)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    const getInitialTheme = (): Theme => {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      if (savedTheme) return savedTheme;
      // Default to light theme
      return "light";
    };
    
    const initialTheme = getInitialTheme();
    // Use startTransition to mark this as non-urgent update
    startTransition(() => {
      setTheme(initialTheme);
    });
    updateTheme(initialTheme);
  }, []);

  // Update DOM and localStorage whenever theme changes (after initialization)
  useEffect(() => {
    if (initialized.current) {
      updateTheme(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      // Update DOM immediately
      updateTheme(newTheme);
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
      }
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

