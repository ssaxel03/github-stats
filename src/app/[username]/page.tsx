import Loading from "@/components/LoadingWrapper";
import { getHeaderInfo } from "@/utils/fetcher";
import { Metadata } from "next";

type Props = {
  params: Promise<{ username: string }>
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {

  const { username } = await params;

  const { login } = await getHeaderInfo(username);

  return {
    title: `${login} - GitHub Stats`,
    description: `Check out ${login}'s activity on GitHub!`,
    robots: "index, follow",
    alternates: { canonical: "https://github-stats.ssaxel03.com" },
    icons: "icon.svg",
    openGraph: {
      type: "website",
      url: `https://github-stats.ssaxel03.com/${login}`,
      title: `${login} - GitHub Stats`,
      description: `Check out ${login}'s activity on GitHub.`,
      siteName: "GitHub Stats",
      images: `https://github-stats.ssaxel03.com/api/og?username=${login}`
    },
    twitter: {
      card: "summary_large_image",
      images: `https://github-stats.ssaxel03.com/api/og?username=${login}`
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
