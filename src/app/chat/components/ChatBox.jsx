"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

const ChatBox = ({ setBalanceKey }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

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
      let file = document.getElementById("fileInput").files[0];
      let fileId = null;

      if (file) {
        const formData = new FormData();
        formData.append("files", file);

        const response = await fetch("/api/files", {
          headers: {
            "X-API-KEY": process.env.FLUX_API_KEY,
          },
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        fileId = data.data[0].id || null;
      }

      const payload = {
        messages: currentMessage,
        stream: true,
      };

      // TODO: Add file attachments when stream is implemented on fluxINTEL
      // if (fileId) {
      //   payload.attachments = {
      //     files: [fileId],
      //   };
      // }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
    setFileName("");
    document.getElementById("fileInput").value = "";
  };

  return (
    <div className="mx-auto w-[90%] flex flex-col flex-1 rounded-lg shadow-custom pb-[50px]">
      {/* Chat messages area */}
      <div className="flex-1 space-y-4 overflow-y-auto rounded-lg border border-gray-200 p-4 min-h-0">
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
                remarkPlugins={[remarkGfm]}
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
          onClick={handleClear}
          className="hover:bg-red-600 rounded-lg bg-red-500 px-4 py-2 text-white transition"
        >
          Clear
        </button>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={(e) => {
            setFileName(e.target.files[0].name);
          }}
        />
        <label
          htmlFor="fileInput"
          className="hover:bg-green-600 text-center rounded-lg bg-green-500 px-4 py-2 text-white transition cursor-pointer"
        >
          <span>Attach File</span>
        </label>
        <button
          type="submit"
          className={`rounded-lg px-4 py-2 transition ${isLoading ? "cursor-not-allowed bg-gray-400" : "hover:bg-blue-600 bg-blue-500 text-white"}`}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
      {fileName && (
        <div className="text-sm text-gray-500 mt-1">
          <span>Attached file: {fileName}</span>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
