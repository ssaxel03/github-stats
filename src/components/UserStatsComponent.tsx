import { getUserStats } from "@/utils/fetcher";
import { format } from "@/utils/numberFormatter";

export default async function Stats({
    username,
}: Readonly<{
    username: string;
}>) {

    const userStats: {
        stars: number;
        totalCommits: number;
        commitsThisYear: number;
        totalContributions: number;
        contributionsThisYear: number;
    } = await getUserStats(username);

    return (
        <section className="flex flex-col gap-4 items-center justify-center w-full my-4" id="info">

            <div className="flex flex-row items-center justify-center w-full gap-6">
                <div className="aspect-square h-6 dark:bg-second-dark bg-second-light rounded-md border-b border-solid dark:border-third-dark border-dark"></div>
                <div className="w-full">{format(userStats.stars)} stars</div>
            </div>

            <div className="flex flex-row items-center justify-center w-full gap-6">
                <div className="aspect-square h-6 dark:bg-second-dark bg-second-light rounded-md border-b border-solid dark:border-third-dark border-dark"></div>
                <div className="w-full">{format(userStats.totalContributions)} contributions</div>
            </div>

            <div className="flex flex-row items-center justify-center w-full gap-6">
                <div className="aspect-square h-6 dark:bg-second-dark bg-second-light rounded-md border-b border-solid dark:border-third-dark border-dark"></div>
                <div className="w-full">{format(userStats.contributionsThisYear)} contributions this year</div>
            </div>

            <div className="flex flex-row items-center justify-center w-full gap-6">
                <div className="aspect-square h-6 dark:bg-second-dark bg-second-light rounded-md border-b border-solid dark:border-third-dark border-dark"></div>
                <div className="w-full">{format(userStats.totalCommits)} commits</div>
            </div>

            <div className="flex flex-row items-center justify-center w-full gap-6">
                <div className="aspect-square h-6 dark:bg-second-dark bg-second-light rounded-md border-b border-solid dark:border-third-dark border-dark"></div>
                <div className="w-full">{format(userStats.commitsThisYear)} commits this year</div>
            </div>

        </section>
    );
}
