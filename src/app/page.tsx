import NavigationForm from "@/components/NavigationForm";
import { Viewport } from "next";
import { Metadata } from "next";
import { generateUserMetadata } from "@/utils/generateMetadata";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-content"
}

export const generateMetadata = async (): Promise<Metadata> => {
  return generateUserMetadata();
};

export default function Home() {

  return (
    <>

      <h1 className="text-2xl text-center font-bold my-8">Welcome to GitHub Stats</h1>

      <p className="text-center">Type a username below to see what they&apos;ve been building.</p>

      <NavigationForm />

    </>
  );
}
