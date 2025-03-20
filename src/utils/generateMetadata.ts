// app/utils/metadata.ts
import { Metadata } from "next";
import { getHeaderInfo } from "@/utils/fetcher";

export async function generateUserMetadata(username?: string): Promise<Metadata> {
  // Default metadata for landing page
  if (!username) {
    return {
      title: "GitHub Stats",
      description: "Find out now what your favorite developers have been building.",
      robots: "index, follow",
      alternates: { canonical: "https://github-stats.ssaxel03.com" },
      icons: "icon.svg",
      openGraph: {
        type: "website",
        url: "https://github-stats.ssaxel03.com",
        title: "GitHub Stats",
        description: "Find out now what your favorite developers have been building.",
        siteName: "GitHub Stats",
        images: "https://github-stats.ssaxel03.com/api/og"
      },
      twitter: {
        card: "summary_large_image",
        images: "https://github-stats.ssaxel03.com/api/og"
      },
    };
  }

  // Get user data
  const result = await getHeaderInfo(username);
  const login = result.login === "NOT FOUND" ? result.login : result.login.slice(1);
  
  const isUser = login != "NOT FOUND";
  
  // User-specific metadata
  return {
    title: `${isUser ? login + " - " : ""}GitHub Stats`,
    description: isUser 
      ? `Check out ${login}'s activity on GitHub` 
      : "Find out now what your favorite developers have been building.",
    robots: "index, follow",
    alternates: { 
      canonical: isUser 
        ? `https://github-stats.ssaxel03.com/${login}` 
        : "https://github-stats.ssaxel03.com" 
    },
    icons: "icon.svg",
    openGraph: {
      type: "website",
      url: isUser 
        ? `https://github-stats.ssaxel03.com/${login}` 
        : "https://github-stats.ssaxel03.com",
      title: `${isUser ? login + " - " : ""}GitHub Stats`,
      description: isUser 
        ? `Check out ${login}'s activity on GitHub` 
        : "Find out now what your favorite developers have been building.",
      siteName: "GitHub Stats",
      images: `https://github-stats.ssaxel03.com/api/og?username=${username}`
    },
    twitter: {
      card: "summary_large_image",
      images: `https://github-stats.ssaxel03.com/api/og?username=${username}`
    },
  };
}