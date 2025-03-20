import Loading from "@/components/LoadingWrapper";
import { Metadata } from "next";
import { generateUserMetadata } from "@/utils/generateMetadata";

export const generateMetadata = async (
  { params }: { params: Promise<{ username: string }> }
): Promise<Metadata> => {
  const { username } = await params;
  return generateUserMetadata(username);
};

export default async function Home({ params }: {
  params: Promise<{ username: string }>
}) {

  const { username } = await params;

  return (
    <Loading username={username} />
  );
}
