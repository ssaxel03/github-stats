"use client";

import { useEffect, useState } from "react";
import { getUserStats } from "@/utils/fetcher";
import { format } from "@/utils/numberFormatter";

export default function Stats({
    username, increaseLoaded
}: Readonly<{
    username: string;
    increaseLoaded: () => void;
}>) {

    const [userStats, setUserStats] = useState({
        stars: 0,
        totalCommits: 0,
        commitsThisYear: 0,
        totalContributions: -1,
        contributionsThisYear: 0,
    });

    useEffect(() => {
        async function fetchCommits() {
            const fetch = await getUserStats(username);
            setUserStats(fetch);
            increaseLoaded();
        }

        fetchCommits();
    }, [username]);

    return (
        <>
            {
                !(userStats.totalContributions == -1) && (
                    <section className="flex flex-col gap-4 items-center justify-center w-full my-4 px-2" id="info">

                        <div className="flex flex-row items-center justify-center w-full gap-6">
                            <div className="aspect-square h-6 dark:bg-second-dark bg-second-light rounded-md border-b-2 border-r-2 border-solid dark:border-third-dark border-dark"></div>
                            <div className="w-full">{format(userStats.stars)} stars</div>
                        </div>

                        <div className="flex flex-row items-center justify-center w-full gap-6">
                            <div className="aspect-square h-6 dark:bg-second-dark bg-second-light rounded-md border-b-2 border-r-2 border-solid dark:border-third-dark border-dark"></div>
                            <div className="w-full">{format(userStats.totalContributions)} contributions</div>
                        </div>

                        <div className="flex flex-row items-center justify-center w-full gap-6">
                            <div className="aspect-square h-6 dark:bg-second-dark bg-second-light rounded-md border-b-2 border-r-2 border-solid dark:border-third-dark border-dark"></div>
                            <div className="w-full">{format(userStats.contributionsThisYear)} contributions this year</div>
                        </div>

                        <div className="flex flex-row items-center justify-center w-full gap-6">
                            <div className="aspect-square h-6 dark:bg-second-dark bg-second-light rounded-md border-b-2 border-r-2 border-solid dark:border-third-dark border-dark"></div>
                            <div className="w-full">{format(userStats.totalCommits)} commits</div>
                        </div>

                        <div className="flex flex-row items-center justify-center w-full gap-6">
                            <div className="aspect-square h-6 dark:bg-second-dark bg-second-light rounded-md border-b-2 border-r-2 border-solid dark:border-third-dark border-dark"></div>
                            <div className="w-full">{format(userStats.commitsThisYear)} commits this year</div>
                        </div>

                    </section>
                )
            }
        </>
    );
}
