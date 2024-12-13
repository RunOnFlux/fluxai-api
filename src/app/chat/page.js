import ChatHeader from "./components/chat";

export const metadata = {
  title: "Flux | ChatBot",
  description: "Chat with Flux.",
};

export default function Chat() {
  return (
    <div className="max-w-4xl mx-auto">
      <ChatHeader />
    </div>
  );
}
