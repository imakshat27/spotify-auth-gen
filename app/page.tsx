import Link from "next/link";
import authUri from "./lib/constants";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gray-800 flex items-center justify-center">
      <Link href={typeof authUri === "string" ? authUri : (authUri as any).authUri} className="px-6 py-4 bg-white rounded-full text-black">
        Sign in with Spotify
      </Link>
    </div>
  );
}
