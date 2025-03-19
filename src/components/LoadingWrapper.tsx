"use client";
import { useState } from "react";
import Header from "./HeaderComponent";
import Commits from "./RecentCommitsComponent";
import Stats from "./UserStatsComponent";
import Languages from "./TopLanguagesComponent";
import HomeButton from "./HomeButton";

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
            <div hidden={loaded >= 4} className="w-full flex flex-col gap-2 justify-center items-center">

                <HomeButton />

                Loading... [{loaded}/4]
                <div className="w-full max-w-[320px] dark:bg-second-dark bg-second-light h-4 rounded-md border-b-2 border-r-2 border-solid dark:border-third-dark border-dark overflow-hidden">
                    <div className="h-full bg-accent-orange" style={{ width: `${loaded * 25}%` }}>

                    </div>
                </div>
            </div>

            <div hidden={!(loaded >= 4)} className="w-full h-full">

                <HomeButton />

                <Header username={username} increaseLoaded={increaseLoaded} />

                <Commits username={username} increaseLoaded={increaseLoaded} />

                <Stats username={username} increaseLoaded={increaseLoaded} />

                <Languages username={username} increaseLoaded={increaseLoaded} />
            </div>
        </>
    );
}
