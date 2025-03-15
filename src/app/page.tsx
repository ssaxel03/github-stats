import Header from "@/components/HeaderComponent";
import Commits from "@/components/RecentCommitsComponent";
import Stats from "@/components/UserStatsComponent";
import Languages from "@/components/TopLanguagesComponent";

export default function Home() {

  const username = "ssaxel03";

  return (<>
    <main className="flex justify-center items-center w-full">
      <div className="flex flex-col justify-center items-center w-full max-w-[800px] py-16 px-6">

        <Header username={username} />

        <Commits username={username} />

        <Stats username={username} />

        <Languages username={username} />

      </div>
    </main >
  </>
  );
}
