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
        <>

            <div className="overflow-hidden mb-4 border-b-2 border-solid rounded-[17px] aspect-square h-24">
                <img className="w-full h-full aspect-square" src={profile.avatar_url} alt="Profile picture" />
            </div>
            <a href={profile.html_url}>
                <h1 className="text-2xl mb-16 hover:text-accent-orange">
                    {profile.name}
                </h1>
            </a>
        </>
    );
}
