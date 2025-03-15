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

interface GitHubUser {
    contributionsCollection: {
        totalCommitContributions: number;
        contributionCalendar: { totalContributions: number };
    };
    contributionsThisYear: {
        totalCommitContributions: number;
        contributionCalendar: { totalContributions: number };
    };
}

interface GraphQLResponse {
    user: GitHubUser | null;
}

// Returns the avatar url, login and url of the user's profile
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

// Returns the 15 most recent commits included in the last 100 events (REST API is more direct at getting the commit info even though it's slower due to
// having to process the info on my end)
// Will probably change in the future
export async function getRecentCommits(username: string): Promise<CommitInfo[]> {

    const githubResponse = await fetch(`https://api.github.com/users/${username}/events?per_page=100`, {
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
            repository: event.repo.name,
        }))
    );

    return recentCommits.slice(0, 15);
}

// Template function for fetching GitHub GraphQL API
const fetchGraphQL = async <T, V = Record<string, unknown>>(query: string, variables: V = {} as V): Promise<T> => {
    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query, variables })
    });

    const data: { data: T; errors?: unknown } = await response.json();

    if (data.errors) {
        console.error("GraphQL Error:", data.errors);
        throw new Error(`GitHub API Error: ${JSON.stringify(data.errors)}`);
    }

    return data.data;
};

// Optimized function to get user stats in a single query
export async function getUserStats(username: string): Promise<UserStats> {
    const currentYear = new Date().getFullYear();
    const sinceDate = `${currentYear}-01-01T00:00:00Z`;

    try {
        // Step 1: Get contributions and commits
        const profileQuery = `
        query ($username: String!, $since: DateTime!) {
            user(login: $username) {
                contributionsCollection {
                    totalCommitContributions
                    contributionCalendar {
                        totalContributions
                    }
                }
                contributionsThisYear: contributionsCollection(from: $since) {
                    totalCommitContributions
                    contributionCalendar {
                        totalContributions
                    }
                }
            }
        }`;

        const profileData = await fetchGraphQL<GraphQLResponse>(profileQuery, { username, since: sinceDate });

        if (!profileData || !profileData.user) {
            throw new Error("User not found");
        }

        const totalContributions = profileData.user.contributionsCollection.contributionCalendar.totalContributions || 0;
        const contributionsThisYear = profileData.user.contributionsThisYear.contributionCalendar.totalContributions || 0;
        const totalCommits = profileData.user.contributionsCollection.totalCommitContributions || 0;
        const commitsThisYear = profileData.user.contributionsThisYear.totalCommitContributions || 0;
        const stars = await fetchAllStars(username);

        // Return the combined stats
        return {
            stars,
            totalCommits,
            commitsThisYear,
            totalContributions,
            contributionsThisYear
        };
    } catch (error) {
        console.error("Error fetching user stats:", error);
        // Return default values in case of error
        return {
            stars: 0,
            totalCommits: 0,
            commitsThisYear: 0,
            totalContributions: 0,
            contributionsThisYear: 0
        };
    }
}

// Returns all stars a given user has
async function fetchAllStars(username: string, cursor: string | null = null, initialCount: number = 0): Promise<number> {
    let totalStars = initialCount;
    let currentCursor = cursor;
    const batchSize = 100; // Max number of repos per call

    const query = `
    query ($username: String!, $cursor: String, $batchSize: Int!) {
        user(login: $username) {
            repositories(first: $batchSize, after: $cursor, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
                totalCount
                nodes {
                    stargazers {
                        totalCount
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    }`;

    try {
        while (currentCursor !== undefined) {
            const variables = { username, cursor: currentCursor, batchSize };
            const data = await fetchGraphQL<{ user: { repositories: { nodes: { stargazers: { totalCount: number } }[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } } }>(query, variables);

            if (!data?.user?.repositories) break;


            const batchStars = data.user.repositories.nodes.reduce(
                (sum: number, repo: { stargazers: { totalCount: number } }) => sum + (repo.stargazers.totalCount || 0),
                0
            );

            totalStars += batchStars;

            // Check if there is more data
            if (data.user.repositories.pageInfo.hasNextPage) {
                currentCursor = data.user.repositories.pageInfo.endCursor;
            } else {
                break;
            }
        }

        // If no more repositories are available, return the total stars
        return totalStars;
    } catch (error) {
        console.error("Error fetching stars:", error);
        return totalStars;
    }
}

export async function getTopLanguages(username: string) {
    const languageStats: Record<string, { size: number; color: string }> = {};
    let cursor: string | null = null;
    const batchSize = 100; // Max repositories per request

    const query = `
    query ($username: String!, $cursor: String, $batchSize: Int!) {
        user(login: $username) {
            repositories(first: $batchSize, after: $cursor, ownerAffiliations: OWNER, isFork: false) {
                pageInfo {
                    hasNextPage
                    endCursor
                }
                nodes {
                    languages(first: 100) {
                        edges {
                            size
                            node {
                                name
                                color
                            }
                        }
                    }
                }
            }
        }
    }`;

    try {
        while (cursor !== undefined) {
            const variables: { username: string; cursor: string | null; batchSize: number } = { username, cursor, batchSize };
            const data = await fetchGraphQL<{
                user: {
                    repositories: {
                        nodes: {
                            languages: {
                                edges: { size: number; node: { name: string; color: string } }[];
                            };
                        }[];
                        pageInfo: {
                            hasNextPage: boolean;
                            endCursor: string | null;
                        };
                    };
                };
            }>(query, variables);


            if (!data.user?.repositories) break;

            data.user.repositories.nodes.forEach((repo: { languages: { edges: { size: number; node: { name: string; color: string } }[] } }) => {
                repo.languages.edges.forEach((lang) => {
                    const { name, color } = lang.node;
                    const size = lang.size;
                    if (!languageStats[name]) {
                        languageStats[name] = { size: 0, color };
                    }
                    languageStats[name].size += size;
                });
            });

            if (data.user.repositories.pageInfo.hasNextPage) {
                cursor = data.user.repositories.pageInfo.endCursor;
            } else {
                break;
            }
        }

        const totalSize = Object.values(languageStats).reduce((sum, lang) => sum + lang.size, 0);

        return Object.entries(languageStats)
            .map(([name, data]) => ({
                name,
                percent: ((data.size / totalSize) * 100).toFixed(2),
                color: data.color,
            }))
            .sort((a, b) => parseFloat(b.percent) - parseFloat(a.percent));
    } catch (error) {
        console.error("Error fetching languages:", error);
        return [];
    }
}