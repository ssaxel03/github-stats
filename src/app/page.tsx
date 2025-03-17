import Footer from "@/components/FooterComponent";
import NavigationForm from "@/components/NavigationForm";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {

  return (<>
    <main className="relative flex flex-col justify-center items-center w-full min-h-[100svh]">
      <div className="min-h-[100svh] relative flex flex-col justify-center items-center w-full max-w-[800px] py-16 px-4">

        <ThemeToggle />

        <h1 className="text-2xl text-center font-bold my-4">Welcome to GitHub Stats</h1>

        <p className="text-center">Type a username below to see what they've been doing.</p>

        <NavigationForm />

        <Footer />

      </div>
    </main >
  </>
  );
}
