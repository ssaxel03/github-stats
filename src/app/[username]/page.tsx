import Loading from "@/components/LoadingWrapper";
import { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: { username: string } },
): Promise<Metadata> {
  
  const { username } = params; // No need for await

  return {
    title: `${username} - GitHub Stats`,
    description: `Check out ${username}'s activity on GitHub!`,
    robots: "index, follow",
    alternates: { canonical: "https://githubstats.ssaxel03.com" },
    icons: "icon.svg",
    openGraph: {
      type: "website",
      url: `githubstats.ssaxel03.com/${username}`,
      title: `${username} - GitHub Stats`,
      description: `Check out ${username}'s activity on GitHub.`,
      siteName: "GitHub Stats",
      images: `githubstats.ssaxel03.com/${username}/opengraphImage`
    },
    twitter: {
      card: "summary_large_image",
      images: `githubstats.ssaxel03.com/${username}/opengraphImage`
    },
  };
}


export default async function Home({ params }: {
  params: Promise<{ username: string }>
}) {

  const { username } = await params;

  return (<>
    <main className="relative flex flex-col justify-center items-center w-full min-h-[100svh]">
      <Loading username={username} />
    </main >
  </>
  );
}
