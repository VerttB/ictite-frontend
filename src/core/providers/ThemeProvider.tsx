'use client'
import { ReactNode, useContext, useEffect, useState, createContext } from "react";

type Theme = "light" | "dark";
interface ThemeContextProps {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({children}: { children: ReactNode }) => { 
   const [theme, setTheme] = useState<Theme>("light"); 

  useEffect(() => {
    try {
      const localTheme = localStorage.getItem("theme") as Theme | null;
      if (localTheme === "dark" || localTheme === "light") {
        setTheme(localTheme);
        document.documentElement.setAttribute("data-theme", localTheme);
      }
    } catch {}
  }, []);

    useEffect(() => {
        const root = document.documentElement;
            try {
            root.setAttribute("data-theme", theme);
            } catch {}
            try {
            localStorage.setItem("theme", theme);
            } catch {}
  }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};