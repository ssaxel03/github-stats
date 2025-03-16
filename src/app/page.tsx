import Header from "@/components/HeaderComponent";
import Commits from "@/components/RecentCommitsComponent";
import Stats from "@/components/UserStatsComponent";
import Languages from "@/components/TopLanguagesComponent";
import Loading from "@/components/LoadingWrapper";

export default function Home() {

  const owner_username = "ssaxel03";

  return (<>
    <main className="relative flex flex-col justify-center items-center w-full">
      <Loading username={owner_username} />
    </main >
  </>
  );
}
