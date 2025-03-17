import Footer from "@/components/FooterComponent";
import NavigationForm from "@/components/NavigationForm";
import ThemeToggle from "@/components/ThemeToggle";
import { Viewport } from "next";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-content"
}

export default function Home() {

  return (<>
    <main className="relative flex flex-col justify-center items-center w-full min-h-[100svh]">
      <div className="h-[100svh] relative flex flex-col justify-center items-center w-full max-w-[800px] py-16 px-4">

        <ThemeToggle />

        <h1 className="text-2xl text-center font-bold my-8">Welcome to GitHub Stats</h1>

        <p className="text-center">Type a username below to see what they&apos;ve been building.</p>

        <NavigationForm />

        <Footer />

      </div>
    </main >
  </>
  );
}
