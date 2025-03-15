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
            repository: event.repo.name
        }))
    );

    return recentCommits.slice(0, 15);
}

const fetchGraphQL = async (query: string, variables: Record<string, any> = {}): Promise<any> => {
    try {
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
            console.error("GraphQL Error:", data.errors);
            throw new Error(`GitHub API Error: ${JSON.stringify(data.errors)}`);
        }

        return data.data;
    } catch (error) {
        console.error("Error fetching GraphQL data:", error);
        throw error;
    }
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

        const profileData = await fetchGraphQL(profileQuery, { username, since: sinceDate });

        if (!profileData.user) {
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
    let batchSize = 100; // Max number of repos per call

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
            const data = await fetchGraphQL(query, variables);

            console.log(data.user.repositories.nodes);

            if (!data.user?.repositories) break;

            const batchStars = data.user.repositories.nodes.reduce(
                (sum: number, repo: any) => sum + (repo.stargazers.totalCount || 0),
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