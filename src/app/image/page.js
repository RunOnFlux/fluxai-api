import ImageChat from "./components/ImageChat";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SignedIn, SignOutButton } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";

export const metadata = {
  title: "Flux | Image Generator",
  description: "Generate an image with FluxAI.",
};

export default function Image() {
  return (
    <div className="max-w-6xl mx-auto font-montserrat">
      <nav className="px-4 pt-4 flex justify-between items-center">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "FluxONE" }]}
        />
        <SignedIn>
          <SignOutButton>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              <LogOutIcon className="w-4 h-4" />
            </button>
          </SignOutButton>
        </SignedIn>
      </nav>
      <ImageChat />
    </div>
  );
}
