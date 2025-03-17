"use client";

import { getHeaderInfo } from "@/utils/fetcher";
import { useEffect, useState } from "react";

export default function Header({
    username, increaseLoaded
}: Readonly<{
    username: string;
    increaseLoaded: () => void;
}>) {

    const [profile, setProfile] = useState({
        avatar_url: "not-found-picture-light.svg",
        avatar_url_dark: "not-found-picture-dark.svg",
        login: "init",
        html_url: "#NOT_FOUND"
    })

    useEffect(() => {
        async function fetchCommits() {
            const fetch = await getHeaderInfo(username);
            setProfile(fetch);
            if (profile.login == "NOT FOUND") {
                await Promise.all(
                    [...Array(4)].map((_, i) =>
                        new Promise(() =>
                            increaseLoaded()
                        )
                    )
                );
            } else {
                increaseLoaded();
            }
        }

        fetchCommits();
    }, [username]);

    return (
        <>

            {!(profile.login == "init") && (
                <section className="flex flex-col items-center justify-center w-full px-2 my-4">

                    <div className="overflow-hidden mb-4 border-b-2 border-r-2 dark:border-third-dark border-solid border-dark rounded-[17px] aspect-square h-24">
                        <img className="block dark:hidden w-full h-full aspect-square" src={profile.avatar_url} alt="Profile picture" />
                        <img className="dark:block hidden w-full h-full aspect-square" src={profile.avatar_url_dark} alt="Profile picture" />
                    </div>
                    <a target={profile.html_url == "#NOT_FOUND" ? `_self` : `_blank`} href={profile.html_url}>
                        <h1 className="text-2xl mb-16 dark:text-light hover:text-accent-orange">
                            {profile.login}
                        </h1>
                    </a>
                </section>
            )}
        </>

    );
}
