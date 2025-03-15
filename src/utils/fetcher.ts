"use server";

interface ProfileInfo {
    avatar_url: string;
    avatar_url_dark: string;
    login: string;
    html_url: string;
}

interface GitHubEvent {
    type: string;
    public: boolean;
    created_at: string;
    repo: {
        name: string;
    };
    payload: {
        commits?: { message: string }[];
    };
}

interface CommitInfo {
    message: string;
    repository: string;
}

interface UserStats {
    stars: number;
    totalCommits: number;
    commitsThisYear: number;
}

export async function getHeaderInfo(username: string): Promise<ProfileInfo> {

    let profile: ProfileInfo = {
        avatar_url: "not-found-picture-light.svg",
        avatar_url_dark: "not-found-picture-dark.svg",
        login: "NOT FOUND",
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
        profile.login = "@" + profile.login;
        profile.avatar_url_dark = profile.avatar_url;
    }

    return profile;

}

export async function getRecentCommits(username: string): Promise<CommitInfo[]> {

    const githubResponse = await fetch(`https://api.github.com/users/${username}/events`, {
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }
    });

    if (!githubResponse.ok) return [];

    const events: GitHubEvent[] = await githubResponse.json();

    // Filter only PushEvent types
    const pushEvents = events
        .filter(event => event.type === "PushEvent" && event.public)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 15);

    // Extract commit messages and repository names
    const recentCommits: CommitInfo[] = pushEvents.flatMap(event =>
        (event.payload.commits || []).map(commit => ({
            message: commit.message,
            repository: event.repo.name
        }))
    );

    return recentCommits.slice(0, 15);
}

const fetchAllRepos = async (username: string): Promise<any[]> => {
    let repos: any[] = [];
    let page = 1;

    // Handle pagination for repositories
    while (true) {
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}`, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            },
        });

        if (!response.ok) return repos;

        const data = await response.json();
        repos = repos.concat(data);

        // Check if there are more pages
        const linkHeader = response.headers.get('Link');
        if (!linkHeader || !linkHeader.includes('rel="next"')) break;

        page++;
    }

    return repos;
};

const fetchAllCommits = async (username: string, repoName: string): Promise<any[]> => {
    let commits: any[] = [];
    let page = 1;

    // Handle pagination for commits in a repo
    while (true) {
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/commits?per_page=100&page=${page}`, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            },
        });

        if (!response.ok) return commits;

        const data = await response.json();
        commits = commits.concat(data);

        // Check if there are more pages
        const linkHeader = response.headers.get('Link');
        if (!linkHeader || !linkHeader.includes('rel="next"')) break;

        page++;
    }

    return commits;
};

export async function getUserStats(username: string): Promise<UserStats> {
    const currentYear = new Date().getFullYear();

    // Fetch all repositories for the user
    const repos = await fetchAllRepos(username);

    // Calculate total stars
    const totalStars = repos.reduce((acc: number, repo: { stargazers_count: number }) => acc + repo.stargazers_count, 0);

    // Initialize commit counters
    let totalCommits = 0;
    let commitsThisYear = 0;

    // Loop through each repo and get all commits
    for (const repo of repos) {
        const commits = await fetchAllCommits(username, repo.name);

        // Filter commits for this user only
        const userCommits = commits.filter((commit: any) => commit.author?.login === username);

        // Count total commits for this repository
        totalCommits += userCommits.length;

        // Count commits for the current year
        commitsThisYear += userCommits.filter((commit: any) => {
            const commitYear = new Date(commit.committer.date).getFullYear();
            return commitYear === currentYear;
        }).length;
    }

    return {
        stars: totalStars,
        totalCommits: totalCommits,
        commitsThisYear: commitsThisYear,
    };
}