import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RF ZoneGuard" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      <SignedOut>
        <div className="relative w-full min-h-screen flex flex-col items-center justify-center gap-6">
          <Header />
          <p className="text-md text-gray-500 text-center">Real-time, zone-based, safety analytics platform</p>
          <SignIn />
          <div className="fixed bottom-4 w-full">
            <Footer />
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="relative w-full min-h-screen flex flex-col">
          <div className="p-4 flex flex-row items-center justify-between">
            <Header />
            <UserButton />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Welcome />
          </div>
        </div>
      </SignedIn>
    </>
  );
}
