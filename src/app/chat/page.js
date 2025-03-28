import ChatHeader from "./components/chat";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SignedIn, SignOutButton } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";

export const metadata = {
  title: "Flux | ChatBot",
  description: "Chat with Flux.",
};

const getLLMs = async () => {
  try {
    const response = await fetch(`${process.env.FLUX_API_URL}/llms`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FLUX_API_KEY}`,
      },
    });
    const data = await response.json();
    return data.data.map((llm) => llm.nickname);
  } catch (error) {
    console.log("Error fetching LLMs:", error);
    return [];
  }
};

export default async function Chat() {
  const llms = await getLLMs();
  return (
    <div className="max-w-6xl mx-auto font-montserrat">
      <nav className="px-4 pt-4 flex justify-between items-center">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "FluxGPT" }]}
        />
        <SignedIn>
          <SignOutButton>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              <LogOutIcon className="w-4 h-4" />
            </button>
          </SignOutButton>
        </SignedIn>
      </nav>
      <ChatHeader llms={llms} />
    </div>
  );
}
