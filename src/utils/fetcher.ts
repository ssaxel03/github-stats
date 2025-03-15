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

// Optimized function to get user stats in a single query when possible
export async function getUserStats(username: string): Promise<UserStats> {
    const currentYear = new Date().getFullYear();
    const sinceDate = `${currentYear}-01-01T00:00:00Z`;

    try {
        // Step 1: Get contributions and repository count
        const profileQuery = `
        query ($username: String!, $since: DateTime!) {
            user(login: $username) {
                repositories(affiliations: OWNER) {
                    totalCount
                }
                contributionsCollection {
                    contributionCalendar {
                        totalContributions
                    }
                }
                contributionsThisYear: contributionsCollection(from: $since) {
                    contributionCalendar {
                        totalContributions
                    }
                    commitContributionsByRepository {
                        contributions {
                            totalCount
                        }
                    }
                }
            }
        }`;

        const profileData = await fetchGraphQL(profileQuery, { username, since: sinceDate });

        if (!profileData.user) {
            throw new Error("User not found");
        }

        const repoCount = profileData.user.repositories.totalCount;
        const totalContributions = profileData.user.contributionsCollection.contributionCalendar.totalContributions || 0;
        const contributionsThisYear = profileData.user.contributionsThisYear.contributionCalendar.totalContributions || 0;

        // Step 2: Get total stars from top 100 repositories
        const starsQuery = `
        query ($username: String!) {
            user(login: $username) {
                repositories(first: 100, affiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
                    nodes {
                        stargazerCount
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    totalCount
                }
            }
        }`;

        const stars = await fetchAllStars(username, null);

        // Step 4: Get commit counts
        // GitHub API doesn't provide a simple way to get all commit counts
        // We'll use the REST API to get a top repositories sample

        // First try to get contributions data as a proxy for commits
        const contributionsData = await getContributionCounts(username);
        let totalCommits = contributionsData.total;
        let commitsThisYear = contributionsData.thisYear;

        // If we couldn't get good data from contributions, use repository history
        if (totalCommits === 0) {
            // Get commits from top repositories as a sample
            const topRepoQuery = `
            query ($username: String!) {
                user(login: $username) {
                    repositories(first: 10, affiliations: OWNER, orderBy: {field: PUSHED_AT, direction: DESC}) {
                        nodes {
                            name
                            defaultBranchRef {
                                name
                            }
                        }
                    }
                }
            }`;

            const topRepoData = await fetchGraphQL(topRepoQuery, { username });

            // Get commit counts for top repositories using REST API
            let sampleCommits = 0;
            let sampleCommitsThisYear = 0;
            const yearStart = new Date(`${currentYear}-01-01T00:00:00Z`);

            for (const repo of topRepoData.user.repositories.nodes) {
                if (repo.defaultBranchRef?.name) {
                    try {
                        // Get total commits for this repo
                        const commitsResponse = await fetch(
                            `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1&sha=${repo.defaultBranchRef.name}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                                }
                            }
                        );

                        if (commitsResponse.ok) {
                            // GitHub returns commit count in the Link header for pagination
                            const linkHeader = commitsResponse.headers.get('Link') || '';
                            const match = linkHeader.match(/page=(\d+)>; rel="last"/);

                            if (match && match[1]) {
                                const repoCommitCount = parseInt(match[1], 10);
                                sampleCommits += repoCommitCount;

                                // Get commits since this year
                                const commitsThisYearResponse = await fetch(
                                    `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1&sha=${repo.defaultBranchRef.name}&since=${sinceDate}`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                                        }
                                    }
                                );

                                if (commitsThisYearResponse.ok) {
                                    const yearLinkHeader = commitsThisYearResponse.headers.get('Link') || '';
                                    const yearMatch = yearLinkHeader.match(/page=(\d+)>; rel="last"/);

                                    if (yearMatch && yearMatch[1]) {
                                        sampleCommitsThisYear += parseInt(yearMatch[1], 10);
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`Error fetching commits for ${repo.name}:`, error);
                    }
                }
            }

            // Scale the sample based on repository count
            if (sampleCommits > 0) {
                // For large accounts, we scale but cap the multiplier to avoid extreme estimates
                const scaleFactor = Math.min(repoCount / 10, 15);
                totalCommits = Math.round(sampleCommits * scaleFactor);
                commitsThisYear = Math.round(sampleCommitsThisYear * scaleFactor);
            } else {
                // If we still couldn't get commit data, fall back to contribution counts
                totalCommits = totalContributions;
                commitsThisYear = contributionsThisYear;
            }
        }

        // Return the combined stats
        return {
            stars: stars,
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

// Helper function to fetch all stars with pagination
async function fetchAllStars(username: string, cursor: string | null = null, initialCount: number = 0): Promise<number> {
    let totalStars = initialCount;
    let currentCursor = cursor;
    let batchSize = 100; // Fetch 100 repos per batch
    let batchCount = 1; // To keep track of the number of batches

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
                batchCount++;
            } else {
                break;
            }
        }

        // If more repositories are available, we return the total stars
        return totalStars;
    } catch (error) {
        console.error("Error fetching stars:", error);
        return totalStars; // Return what we have so far
    }
}

// Get commit contribution counts from GitHub API
async function getContributionCounts(username: string): Promise<{ total: number, thisYear: number }> {
    const currentYear = new Date().getFullYear();
    const sinceDate = `${currentYear}-01-01T00:00:00Z`;

    try {
        const query = `
        query ($username: String!, $since: DateTime!) {
            user(login: $username) {
                contributionsCollection {
                    totalCommitContributions
                }
                contributionsThisYear: contributionsCollection(from: $since) {
                    totalCommitContributions
                }
            }
        }`;

        const data = await fetchGraphQL(query, { username, since: sinceDate });

        return {
            total: data.user.contributionsCollection.totalCommitContributions || 0,
            thisYear: data.user.contributionsThisYear.totalCommitContributions || 0
        };
    } catch (error) {
        console.error("Error fetching contribution counts:", error);
        return { total: 0, thisYear: 0 };
    }
}