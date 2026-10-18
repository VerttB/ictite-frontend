"use client";
import {
    ReactNode,
    useContext,
    useEffect,
    useSyncExternalStore,
    createContext,
} from "react";

type Theme = "light" | "dark";
interface ThemeContextProps {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const theme = useSyncExternalStore(
        (onChange) => {
            window.addEventListener("storage", onChange);
            window.addEventListener("ictite-theme-change", onChange);
            return () => {
                window.removeEventListener("storage", onChange);
                window.removeEventListener("ictite-theme-change", onChange);
            };
        },
        () => {
            try {
                const saved = localStorage.getItem("theme");
                return saved === "dark" ? "dark" : "light";
            } catch {
                return "light";
            }
        },
        () => "light"
    ) as Theme;

    useEffect(() => {
        const root = document.documentElement;
        try {
            root.setAttribute("data-theme", theme);
        } catch {}
    }, [theme]);

    const toggleTheme = () => {
        try {
            localStorage.setItem("theme", theme === "light" ? "dark" : "light");
            window.dispatchEvent(new Event("ictite-theme-change"));
        } catch {}
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
