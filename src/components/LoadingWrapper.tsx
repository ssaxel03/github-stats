"use client";
import { useState } from "react";
import Header from "./HeaderComponent";
import Commits from "./RecentCommitsComponent";
import Stats from "./UserStatsComponent";
import Languages from "./TopLanguagesComponent";
import Footer from "./FooterComponent";

export default function Loading({
    username,
}: Readonly<{
    username: string;
}>) {

    const [loaded, setLoaded] = useState(0);

    const increaseLoaded = () => {
        setLoaded((prev) => prev + 1);
    }

    return (
        <>
            <div hidden={loaded >= 4} className="min-h-[100svh] flex flex-col gap-4 items-center justify-center w-full max-w-[800px] px-4">
                Loading... [{loaded}/4]
                <div className="w-full max-w-[320px] dark:bg-second-dark bg-second-light h-4 rounded-md overflow-hidden">
                    <div className="h-full bg-accent-orange" style={{ width: `${loaded * 25}%` }}>

                    </div>
                </div>
            </div>
            <div hidden={!(loaded >= 4)} className="flex flex-col justify-center items-center w-full max-w-[800px] py-16 px-4">

                <Header username={username} increaseLoaded={increaseLoaded} />

                <Commits username={username} increaseLoaded={increaseLoaded} />

                <Stats username={username} increaseLoaded={increaseLoaded} />

                <Languages username={username} increaseLoaded={increaseLoaded} />
            </div>
            <Footer />
        </>
    );
}
