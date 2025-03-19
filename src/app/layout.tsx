import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/FooterComponent";

export const metadata: Metadata = {
  title: "GitHub Stats",
  description: "Find out now what your favorite developers have been building.",
  applicationName: "Axel's GitHub Stats",
  authors: [{ name: "Axel Soares", url: "https:github.com/ssaxel03" }],
  generator: "Next.js",
  keywords: "github, github stats, my github stats, commits, contributions, lanuages, top languages, stats, stars",
  creator: "Axel Soares",
  publisher: "Axel Soares",
  robots: "index, follow",
  alternates: { canonical: "https://github-stats.ssaxel03.com" },
  icons: "icon.svg",
  openGraph: {
    type: "website",
    url: "https://github-stats.ssaxel03.com",
    title: "GitHub Stats",
    description: "Find out now what your favorite developers have been building.",
    siteName: "GitHub Stats",
    images: `https://github-stats.ssaxel03.com/api/og`
  },
  twitter: {
    card: "summary_large_image",
    images: "https://github-stats.ssaxel03.com/api/og"
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`relative antialiased text-xl dark:bg-dark dark:text-light bg-light text-dark break-words whitespace-pre-wrap text-balance`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="relative flex flex-col justify-center items-center w-full min-h-[100svh]">
            <div className="min-h-[100svh] relative flex flex-col justify-center items-center w-full max-w-[800px] py-16 px-4">
              <ThemeToggle />

              {children}

            </div>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
