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
    totalContributions: number;
    contributionsThisYear: number;
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

const fetchGraphQL = async (query: string, variables: Record<string, any> = {}): Promise<any> => {
    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query, variables })
    });

    const data = await response.json();
    if (data.errors) {
        throw new Error(`GitHub API Error: ${JSON.stringify(data.errors)}`);
    }

    return data.data;
};

const fetchAllRepositories = async (username: string): Promise<any[]> => {
    let repos: any[] = [];
    let cursor: string | null = null;

    do {
        const query = `
        query ($username: String!, $cursor: String) {
            user(login: $username) {
                repositories(first: 100, after: $cursor, affiliations: OWNER) {
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    nodes {
                        name
                        stargazerCount  # FIX: This ensures stars are retrieved
                        defaultBranchRef {
                            target {
                                ... on Commit {
                                    history {
                                        totalCount
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }`;

        const variables = { username, cursor };
        const data = await fetchGraphQL(query, variables);

        repos = repos.concat(data.user.repositories.nodes);
        cursor = data.user.repositories.pageInfo.hasNextPage ? data.user.repositories.pageInfo.endCursor : null;

    } while (cursor);

    return repos;
};

// Function to fetch commits for a specific repository (with pagination)
const fetchCommitsForRepo = async (username: string, repoName: string, since: string): Promise<number> => {
    let totalCommits = 0;
    let cursor: string | null = null;

    do {
        const query = `
        query ($username: String!, $repoName: String!, $cursor: String) {
            repository(owner: $username, name: $repoName) {
                defaultBranchRef {
                    target {
                        ... on Commit {
                            history(first: 100, after: $cursor) {
                                pageInfo {
                                    hasNextPage
                                    endCursor
                                }
                                edges {
                                    node {
                                        committedDate
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }`;

        const variables = { username, repoName, cursor };
        const data = await fetchGraphQL(query, variables);

        if (data.repository?.defaultBranchRef?.target?.history?.edges) {
            totalCommits += data.repository.defaultBranchRef.target.history.edges.filter(
                (commit: any) => new Date(commit.node.committedDate) >= new Date(since)
            ).length;
        }

        cursor = data.repository?.defaultBranchRef?.target?.history?.pageInfo?.hasNextPage
            ? data.repository.defaultBranchRef.target.history.pageInfo.endCursor
            : null;

    } while (cursor);

    return totalCommits;
};

// Main function to fetch all user stats
export async function getUserStats(username: string): Promise<UserStats> {
    const currentYear = new Date().getFullYear();
    const since = `${currentYear}-01-01T00:00:00Z`;

    // Fetch all repositories
    const repos = await fetchAllRepositories(username);

    console.log(repos);

    // Calculate total stars
    const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazerCount || 0), 0);

    console.log("totalStars : " + totalStars);

    // Fetch all-time commit count
    const totalCommits = repos.reduce((acc, repo) => acc + (repo.defaultBranchRef?.target?.history?.totalCount || 0), 0);

    // Fetch commits for this year using pagination
    let commitsThisYear = 0;
    for (const repo of repos) {
        commitsThisYear += await fetchCommitsForRepo(username, repo.name, since);
    }

    // GraphQL query to fetch total contributions
    const query = `
    query ($username: String!, $since: DateTime!) {
        user(login: $username) {
            contributionsCollection {
                contributionCalendar {
                    totalContributions
                }
            }
            contributionsThisYear: contributionsCollection(from: $since) {
                contributionCalendar {
                    totalContributions
                }
            }
        }
    }`;

    const variables = { username, since };
    const data = await fetchGraphQL(query, variables);

    console.log({
        stars: totalStars,
        totalCommits,
        commitsThisYear,
        totalContributions: data.user.contributionsCollection.contributionCalendar.totalContributions || 0,
        contributionsThisYear: data.user.contributionsThisYear.contributionCalendar.totalContributions || 0
    });

    return {
        stars: totalStars,
        totalCommits,
        commitsThisYear,
        totalContributions: data.user.contributionsCollection.contributionCalendar.totalContributions || 0,
        contributionsThisYear: data.user.contributionsThisYear.contributionCalendar.totalContributions || 0
    };
}