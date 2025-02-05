import ChatHeader from "./components/chat";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Flux | ChatBot",
  description: "Chat with Flux.",
};

export default function Chat() {
  return (
    <div className="max-w-6xl mx-auto font-montserrat">
      <nav className="px-4 pt-4">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "FluxGPT" }]}
        />
      </nav>
      <ChatHeader />
    </div>
  );
}
