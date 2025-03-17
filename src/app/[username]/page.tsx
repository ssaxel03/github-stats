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
      url: "https://githubstats.ssaxel03.com",
      title: `${username} - GitHub Stats`,
      description: `Check out ${username}'s activity on GitHub.`,
      siteName: "GitHub Stats",
    },
    twitter: {
      card: "summary_large_image",
      images: "card.jpg"
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
