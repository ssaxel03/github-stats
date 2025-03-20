import { ThemeProvider } from "next-themes";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/FooterComponent";

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
