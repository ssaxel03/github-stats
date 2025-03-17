import Loading from "@/components/LoadingWrapper";

export default async function Home({ params } : { params: { username: string }}) {
  
  const username = await params.username;

  return (<>
    <main className="relative flex flex-col justify-center items-center w-full min-h-[100svh]">
      <Loading username={username} />
    </main >
  </>
  );
}
