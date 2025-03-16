"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Prevents hydration mismatch

    return (
        <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="absolute right-4 top-4 h-[28px] aspect-square flex items-center justify-center dark:bg-second-dark bg-second-light dark:hover:bg-third-dark hover:bg-light my-4 px-1 py-1 rounded-md border-b-2 border-solid dark:border-third-dark border-dark"
        >
            {resolvedTheme === "dark" ?
                <svg className="w-full h-full fill-light" xmlns="http://www.w3.org/2000/svg" viewBox="-5.6 -5.6 67.20 67.20" strokeWidth="0.00056" transform="rotate(-15)">
                    <path d="M29,28c0-11.917,7.486-22.112,18-26.147C43.892,0.66,40.523,0,37,0C21.561,0,9,12.561,9,28 s12.561,28,28,28c3.523,0,6.892-0.66,10-1.853C36.486,50.112,29,39.917,29,28z"></path>
                </svg> :
                <svg className="w-full h-full fill-dark stroke-3 stroke-dark" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>}

        </button>
    );
}
