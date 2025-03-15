import { format } from "@/utils/numberFormatter";
import Header from "@/components/HeaderComponent";
import Commits from "@/components/RecentCommitsComponent";

export default function Home() {

  const info = {
    totalCommits: 297300,
    yearCommits: 1032,
    stars: 2321,
  }

  return (<>
    <main className="flex justify-center items-center w-full">
      <div className="flex flex-col justify-center items-center w-full max-w-[800px] py-16 px-6">

        <Header username="ssaxel03" />

        <Commits username="ssaxel03" />

        <section className="flex flex-col gap-4 items-center justify-center w-full my-4" id="info">

          <div className="flex flex-row items-center justify-center w-full gap-6">
            <div className="aspect-square h-6 dark:bg-second-dark bg-second-light rounded-md border-b border-solid border-dark"></div>
            <div className="w-full">{format(info.stars)} stars</div>
          </div>

          <div className="flex flex-row items-center justify-center w-full gap-6">
            <div className="aspect-square h-6 dark:bg-second-dark bg-second-light rounded-md border-b border-solid border-dark"></div>
            <div className="w-full">{format(info.totalCommits)} total commits</div>
          </div>

          <div className="flex flex-row items-center justify-center w-full gap-6">
            <div className="aspect-square h-6 dark:bg-second-dark bg-second-light rounded-md border-b border-solid border-dark"></div>
            <div className="w-full">{format(info.yearCommits)} commits this year</div>
          </div>

        </section>

        <section className="flex flex-col w-full gap-4 items-center justify-center w-full my-4">

          <div className="w-full flex flex-col items-start gap-2">
            <p>Java</p>
            <div className="w-full h-4 rounded-md border-b border-solid border-dark h-6 dark:bg-second-dark bg-second-light overflow-hidden">
              <div className="h-full w-[75%] bg-orange-500 rounded-r-md border-b border-solid border-dark"></div>
            </div>
          </div>
          <div className="w-full flex flex-col items-start gap-2">
            <p>JavaScript</p>

            <div className="w-full h-4 flex items-start w-full h-4 rounded-md border-b border-solid border-dark h-6 dark:bg-second-dark bg-second-light overflow-hidden">
              <div className="h-full w-[15%] bg-yellow-500 rounded-r-md  border-b border-solid border-dark"></div>
            </div>

          </div>
          <div className="w-full flex flex-col items-start gap-2">
            <p>TypeScript</p>
            <div className="w-full h-4 flex items-start w-full h-4 rounded-md border-b border-solid border-dark h-6 dark:bg-second-dark bg-second-light overflow-hidden">
              <div className="h-full w-[10%] bg-blue-500 rounded-r-md border-b border-solid border-dark"></div>
            </div>
          </div>

          <button className="dark:bg-second-dark bg-second-light dark:hover:bg-third-dark hover:bg-light my-4 px-16 py-1 rounded-md border-b-2 border-solid dark:border-third-dark border-dark">More</button>

        </section>

      </div>
    </main >
  </>
  );
}
