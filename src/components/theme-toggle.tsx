"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const next = resolvedTheme === "dark" ? "light" : "dark"

    return (
        <button
            onClick={() => setTheme(next)}
            aria-label="Toggle light or dark theme"
            className="inline-flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
            <Sun className="hidden h-[18px] w-[18px] dark:block" strokeWidth={1.5} />
            <Moon className="h-[18px] w-[18px] dark:hidden" strokeWidth={1.5} />
        </button>
    )
}
