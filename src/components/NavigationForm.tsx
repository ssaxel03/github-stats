"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function NavigationForm() {

    const router = useRouter();
    const [username, setUsername] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (username.trim() && !username.includes(" ")) {
            router.push(`/${username}`);
        } else {
            alert("Please enter a valid username (no spaces).");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-row items-center justify-center gap-2">
            <input
                placeholder="torvalds"
                className="w-full max-w-[320px] focus:outline-1 focus:outline-accent-orange dark:bg-second-dark bg-second-light dark:hover:bg-third-dark hover:bg-light dark:focus:bg-third-dark focus:bg-ligth my-4 px-1        py-1 rounded-md border-b-2 border-r-2 border-solid dark:border-third-dark border-dark"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))} />
            <button type="submit" className="cursor-pointer h-[36px] aspect-square flex items-center justify-center dark:bg-second-dark bg-second-light dark:hover:bg-third-dark hover:bg-light px-1 py-1 rounded-md border-b-2 border-r-2 border-solid dark:border-third-dark border-dark">
                <svg className="stroke-dark dark:stroke-light" xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 600 600" strokeWidth="50">
                    <path d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6 s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2 S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7 S381.9,104.65,381.9,203.25z"></path>
                </svg>
            </button>
        </form>
    );
}
