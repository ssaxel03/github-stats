export default async function Commits({
    username,
}: Readonly<{
    username: string;
}>) {

    const exampleCommits = [
        { message: "feat: divided padding by all components for better visualization when using ids to navigate", repo: "web-portfolio" },
        { message: "fix: fixed README.md project directory", repo: "web-portfolio" },
        { message: "fix: tech icons size", repo: "web-portfolio" },
        { message: "reformat: optimized portfolio data by reusing technology icons and info", repo: "web-portfolio" },
        { message: "fix: removed unnecessary values from portfolio-data", repo: "web-portfolio" },
    ]

    let commits : Array<any>;

    const githubResponse = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`,
        {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            }
        }
    )

    if (githubResponse.ok) {
        const lastEvents = await githubResponse.json();
        const lastCommits = lastEvents.filter((event: any) => event.type == "PushEvent").slice(0, 5);

        console.log("COMMITS ");
        console.log(lastCommits);

    } else {
        return (<></>);
    }

    return (

        <section className="flex flex-col items-center justify-center w-full px-2 my-4" id="last-commits">
            {exampleCommits.map((commit, key) => (
                <div className={`squares-aligned w-full`} key={key}>
                    <div className={`relative bg-accent-orange h-full ${key == exampleCommits.length - 1 ? `rounded-b pb-16` : ''}`}>
                        <div className="absolute aspect-square h-6 dark:bg-second-dark bg-second-light rounded-md border-b border-solid dark:border-third-dark border-dark commit-timeline-point">

                        </div>
                    </div>
                    <a href={`#${key}`} className={`pl-8 dark:text-light hover:text-accent-orange ${key == exampleCommits.length - 1 ? `` : `mb-8`}`}>{commit.message} @ {commit.repo}</a>
                </div>
            ))}

            <button className="dark:bg-second-dark bg-second-light dark:hover:bg-third-dark hover:bg-light my-4 px-16 py-1 rounded-md border-b-2 border-solid dark:border-third-dark border-dark">More</button>
        </section>
    );
}
