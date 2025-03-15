"use client";
import { useState, useEffect } from "react";
import { getRecentCommits } from "@/utils/fetcher";

export default function Commits({
    username,
}: Readonly<{
    username: string;
}>) {

    const [recentCommits, setRecentCommits] = useState<{ message: string; repository: string }[]>([]);
    const [commitsShown, setCommitsShown] = useState<{ message: string; repository: string }[]>([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        async function fetchCommits() {
            const commits = await getRecentCommits(username);
            console.log(commits);
            setRecentCommits(commits.slice(0, 15));
            setCommitsShown(commits.slice(0, 5));
        }

        fetchCommits();
    }, [username]);

    return (

        <section className="flex flex-col items-center justify-center w-full px-2 my-4" id="last-commits">
            {commitsShown.map((commit, key) => (
                <div className={`squares-aligned w-full`} key={key}>
                    <div className={`relative bg-accent-orange h-full ${key == commitsShown.length - 1 ? `rounded-b pb-16` : ''}`}>
                        <div className="absolute aspect-square h-6 dark:bg-second-dark bg-second-light rounded-md border-b-2 border-solid dark:border-third-dark border-dark commit-timeline-point">

                        </div>
                    </div>
                    <a href={`#${key}`} className={`pl-8 dark:text-light hover:text-accent-orange ${key == commitsShown.length - 1 ? `` : `mb-8`}`}>{commit.message} @ {commit.repository}</a>
                </div>
            ))}
            {!showAll && (
                <button className="dark:bg-second-dark bg-second-light dark:hover:bg-third-dark hover:bg-light my-4 px-16 py-1 rounded-md border-b-2 border-solid dark:border-third-dark border-dark"
                    onClick={() => {
                        setCommitsShown(recentCommits);
                        setShowAll(true);
                    }}>More</button>
            )}
        </section>
    );
}
