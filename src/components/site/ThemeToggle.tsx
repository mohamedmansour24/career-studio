"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const buttonClassName =
        "inline-flex items-center justify-center rounded-lg border border-border bg-card/50 min-w-11 min-h-11 p-2 transition hover:bg-card focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background";

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Return placeholder with same dimensions to avoid layout shift
        return (
            <button
                type="button"
                className={buttonClassName}
                aria-label="Toggle theme"
            >
                <span className="h-4 w-4" />
            </button>
        );
    }

    const currentTheme = resolvedTheme ?? theme;
    const isDark = currentTheme === "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={buttonClassName}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        >
            {isDark ? (
                <Sun className="h-4 w-4 text-foreground" />
            ) : (
                <Moon className="h-4 w-4 text-foreground" />
            )}
        </button>
    );
}
