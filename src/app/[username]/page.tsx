import Loading from "@/components/LoadingWrapper";
import { Metadata } from "next";

type Props = {
  params: Promise<{ username: string }>
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {

  const { username } = await params;

  return {
    title: `${username} - GitHub Stats`,
    description: `Check out ${username}'s activity on GitHub!`,
    robots: "index, follow",
    alternates: { canonical: "https://github-stats.ssaxel03.com" },
    icons: "icon.svg",
    openGraph: {
      type: "website",
      url: `https://github-stats.ssaxel03.com/${username}`,
      title: `${username} - GitHub Stats`,
      description: `Check out ${username}'s activity on GitHub.`,
      siteName: "GitHub Stats",
      images: `https://github-stats.ssaxel03.com/api/og?username=${username}`
    },
    twitter: {
      card: "summary_large_image",
      images: `https://github-stats.ssaxel03.com/api/og?username=${username}`
    },
  };
}


export default async function Home({ params }: {
  params: Promise<{ username: string }>
}) {

  const { username } = await params;

  return (
    <Loading username={username} />
  );
}
