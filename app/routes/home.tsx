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
    <div>
      <div className="flex flex-col items-center justify-center gap-16 min-h-screen">
        <Header />
        <SignedIn>
          <Welcome />
        </SignedIn>
        <SignedOut>
          <SignIn />
        </SignedOut>
      </div>
      <div className="fixed bottom-4 w-full">
        <Footer />
      </div>
    </div>
  );
}
