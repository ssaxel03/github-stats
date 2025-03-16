import ThemeToggle from "@/components/ThemeToggle";
import Loading from "@/components/LoadingWrapper";

export default function Home() {

  const owner_username = "ssaxel03";

  return (<>
    <main className="relative flex flex-col justify-center items-center w-full min-h-[100svh]">
      <Loading username={owner_username} />
    </main >
  </>
  );
}
