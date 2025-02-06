import { SignIn } from "@clerk/nextjs";
import { SignedIn, SignOutButton } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto font-montserrat">
      <nav className="px-4 pt-4 flex justify-between items-center">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Sign In" }]}
        />
        <SignedIn>
          <SignOutButton>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              <LogOutIcon className="w-4 h-4" />
            </button>
          </SignOutButton>
        </SignedIn>
      </nav>
      <main className="min-h-96 mt-16 grid place-items-center">
        <SignIn />
      </main>
    </div>
  );
}
