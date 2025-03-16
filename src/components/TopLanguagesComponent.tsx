"use client";
import { useState, useEffect } from "react";
import { getTopLanguages } from "@/utils/fetcher";

export default function Languages({
    username, increaseLoaded
}: Readonly<{
    username: string;
    increaseLoaded: () => void;
}>) {

    const [topLanguages, setTopLanguages] = useState<{ name: string; percent: string, color: string }[]>([]);
    const [languagesShown, setLanguagesShown] = useState<{ name: string; percent: string, color: string }[]>([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        async function fetchCommits() {
            const langs = await getTopLanguages(username);

            setTopLanguages(langs);
            setLanguagesShown(langs.slice(0, 5));
            increaseLoaded();
        }

        fetchCommits();
    }, [username]);

    return (

        <section className="flex flex-col items-center justify-center w-full px-2 my-4" id="last-commits">
            {languagesShown.map((language, key) => (
                <div key={key} className="w-full flex flex-col gap-2">
                    <div className="flex flex-row items-center justify-between">
                        <p>{language.name}</p>
                        <p>{language.percent} %</p>
                    </div>

                    <div className="w-full h-4 rounded-md border-b-2 border-r-2 border-solid dark:border-third-dark border-dark h-6 dark:bg-second-dark bg-second-light overflow-hidden">
                        <div
                            className="h-full rounded-r-md"
                            style={{ width: `${language.percent}%`, background: language.color }}
                        ></div>
                    </div>
                </div>
            ))}
            {!showAll && (languagesShown.length < topLanguages.length) && (
                <button className="dark:bg-second-dark bg-second-light dark:hover:bg-third-dark hover:bg-light my-4 px-16 py-1 rounded-md border-b-2 border-solid dark:border-third-dark border-dark"
                    onClick={() => {
                        setShowAll(true);
                        setLanguagesShown(topLanguages);
                    }}>More</button>
            )}
        </section>
    );
}
