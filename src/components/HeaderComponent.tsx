export default async function Header({
    username,
}: Readonly<{
    username: string;
}>) {

    let profile = {
        avatar_url: "",
        name: "NOT FOUND",
        html_url: "#NOT_FOUND"
    }

    const githubResponse = await fetch(`https://api.github.com/users/${username}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            }
        }
    )

    if (githubResponse.ok) {
        profile = await githubResponse.json();
    }

    return (
        <section className="flex flex-col items-center justify-center w-full px-2 my-4">

            <div className="overflow-hidden mb-4 border-b-2 dark:border-third-dark border-solid border-dark rounded-[17px] aspect-square h-24">
                <img className="w-full h-full aspect-square" src={profile.avatar_url} alt="Profile picture" />
            </div>
            <a href={profile.html_url}>
                <h1 className="text-2xl mb-16 dark:text-light hover:text-accent-orange">
                    {profile.name}
                </h1>
            </a>
        </section>
    );
}
