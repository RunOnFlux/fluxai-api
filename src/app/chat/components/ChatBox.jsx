"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import TokenBalance from "@/components/TokenBalance";

const ChatBox = ({ setBalanceKey }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const currentMessage = [...chatHistory, { role: "user", content: message }];
    setChatHistory(currentMessage);
    setChatHistory((prev) => [...prev, { role: "assistant", content: "" }]);

    setMessage("");
    setIsLoading(true);

    try {
      let fullResponse = "";
      let buffer = "";

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: currentMessage, stream: true }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        buffer += chunk;

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const parsedLine = JSON.parse(line);
            if (parsedLine.error) {
              setChatHistory((prev) => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1].content =
                  "Sorry, I encountered an error processing your request.";
                return newHistory;
              });
              continue;
            }
            if (parsedLine.choices[0].finish_reason !== null) continue;

            if (parsedLine.choices[0].delta?.content) {
              if (parsedLine.choices[0].delta.content.includes("<|eot_id|>"))
                continue;

              let text = parsedLine.choices[0].delta.content;
              fullResponse += text;

              setChatHistory((prev) => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1].content = fullResponse;
                return newHistory;
              });
            }
          } catch (e) {
            console.log("Skipping invalid JSON:", line);
            continue;
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
      if (setBalanceKey) {
        setBalanceKey((prev) => prev + 1);
      }
    }
  };

  const handleClear = () => {
    setChatHistory([]);
  };

  return (
    <>
      <div className="max-[1200px] mx-auto mb-[100px] flex h-full w-[90%] flex-col rounded-lg shadow-custom">
        {/* Chat messages area */}
        <div className="flex-1 space-y-4 overflow-y-auto rounded-lg border border-gray-200 p-4">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`prose max-w-[80%] whitespace-pre-wrap rounded-lg p-3 ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                <ReactMarkdown
                  removeExtraSpaces
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        {/* Updated input form */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full gap-2 flex-col sm:flex-row flex-wrap mt-4"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="focus:outline-none focus:border-blue-500 flex-1 rounded-lg text-black/80 border p-2"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`rounded-lg px-4 py-2 transition ${isLoading ? "cursor-not-allowed bg-gray-400" : "hover:bg-blue-600 bg-blue-500 text-white"}`}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
          <button
            onClick={handleClear}
            className="hover:bg-red-600 rounded-lg bg-red-500 px-4 py-2 text-white transition"
          >
            Clear
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatBox;
