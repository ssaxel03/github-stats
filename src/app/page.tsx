import { format } from "@/utils/numberFormatter";
import Header from "@/components/HeaderComponent";

export default function Home() {


  const exampleCommits = [
    { message: "feat: divided padding by all components for better visualization when using ids to navigate", repo: "web-portfolio" },
    { message: "fix: fixed README.md project directory", repo: "web-portfolio" },
    { message: "fix: tech icons size", repo: "web-portfolio" },
    { message: "reformat: optimized portfolio data by reusing technology icons and info", repo: "web-portfolio" },
    { message: "fix: removed unnecessary values from portfolio-data", repo: "web-portfolio" },
  ]

  const info = {
    totalCommits: 297300,
    yearCommits: 1032,
    stars: 2321,
  }

  return (<>
    <main className="flex justify-center items-center w-full">
      <div className="flex flex-col justify-center items-center w-full max-w-[800px] py-16 px-6">

        <Header username="ssaxel03" />

        <section className="flex flex-col items-center justify-center w-full px-2 my-4" id="last-commits">
          {exampleCommits.map((commit, key) => (
            <div className={`squares-aligned w-full`} key={key}>
              <div className={`relative bg-accent-orange h-full ${key == exampleCommits.length - 1 ? `rounded-b pb-16` : ''}`}>
                <div className="absolute aspect-square h-6 bg-second-light rounded-md border-b border-solid border-dark commit-timeline-point">

                </div>
              </div>
              <a href={`#${key}`} className={`pl-8 hover:text-accent-orange ${key == exampleCommits.length - 1 ? `` : `mb-8`}`}>{commit.message} @ {commit.repo}</a>
            </div>
          ))}

          <button className="bg-second-light hover:bg-light my-4 px-16 py-1 rounded-md border-b-2 border-solid border-dark">More</button>
        </section>

        <section className="flex flex-col gap-4 items-center justify-center w-full my-4" id="info">

          <div className="flex flex-row items-center justify-center w-full gap-6">
            <div className="aspect-square h-6 bg-second-light rounded-md border-b border-solid border-dark"></div>
            <div className="w-full">{format(info.stars)} stars</div>
          </div>

          <div className="flex flex-row items-center justify-center w-full gap-6">
            <div className="aspect-square h-6 bg-second-light rounded-md border-b border-solid border-dark"></div>
            <div className="w-full">{format(info.totalCommits)} total commits</div>
          </div>

          <div className="flex flex-row items-center justify-center w-full gap-6">
            <div className="aspect-square h-6 bg-second-light rounded-md border-b border-solid border-dark"></div>
            <div className="w-full">{format(info.yearCommits)} commits this year</div>
          </div>

        </section>

        <section className="flex flex-col w-full gap-4 items-center justify-center w-full my-4">

          <div className="w-full flex flex-col items-start gap-2">
            <p>Java</p>
            <div className="w-full h-4 rounded-md border-b border-solid border-dark h-6 bg-second-light overflow-hidden">
              <div className="h-full w-[75%] bg-orange-500 rounded-r-md border-b border-solid border-dark"></div>
            </div>
          </div>
          <div className="w-full flex flex-col items-start gap-2">
            <p>JavaScript</p>
            <div className="w-full h-4 rounded-md border-b border-solid border-dark h-6 bg-second-light overflow-hidden">
              <div className="flex items-start w-full h-4 rounded-md border-b border-solid border-dark h-6 bg-second-light overflow-hidden">
                <div className="h-full w-[15%] bg-yellow-500 rounded-r-md  border-b border-solid border-dark"></div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col items-start gap-2">
            <p>TypeScript</p>
            <div className="flex items-start w-full h-4 rounded-md border-b border-solid border-dark h-6 bg-second-light overflow-hidden">
              <div className="h-full w-[10%] bg-blue-500 rounded-r-md border-b border-solid border-dark"></div>
            </div>
          </div>

          <button className="bg-second-light hover:bg-light my-4 px-16 py-1 rounded-md border-b-2 border-solid border-dark">More</button>

        </section>

      </div>
    </main >
  </>
  );
}
