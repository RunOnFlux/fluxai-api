"use client";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import FileUploadModal from "./FileUploadModal";
import SettingsModal from "./SettingsModal";
import { Tag } from "lucide-react";

const ChatBox = ({ setBalanceKey, fileContext, setFileContext, onFileUpload }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileId, setFileId] = useState(fileContext);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [chatSettings, setChatSettings] = useState({
    preamble: "",
    intelMode: "rag",
    tags: []
  });

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

      const payload = {
        messages: currentMessage,
        stream: true,
      };

      console.log(fileId);
      // TODO: Add file attachments when stream is implemented on fluxINTEL
      if (fileId || chatSettings.tags.length > 0) {
        payload.attachments = {};
        if (fileId) {
          payload.attachments.files = [fileId];
        }
        if (chatSettings.tags.length > 0) {
          payload.attachments.tags = chatSettings.tags;
        }
        payload.mode = chatSettings.intelMode;
      }

      if (chatSettings.preamble) {
        payload.preamble = chatSettings.preamble;
      }

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
            const parsedLine = JSON.parse(line.replace(/^data:/, ""));
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

  useEffect(() => {
    setFileId(fileContext);
  }, [fileContext]);

  const handleClear = () => {
    setChatHistory([]);
    setFileName("");
    setFileId("");
    setFileContext("");
    document.getElementById("fileInput").value = "";
  };

  const handleFileSelect = (fileId) => {
    setFileId(fileId);
  };

  const handleSettingsSave = (newSettings) => {
    setChatSettings(newSettings);
    setIsSettingsModalOpen(false);
  };

  return (
    <div className="mx-auto w-[90%] flex flex-col flex-1 rounded-lg shadow-custom">
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
          type="submit"
          className={`rounded-lg px-4 py-2 transition ${isLoading ? "cursor-not-allowed bg-gray-400" : "hover:bg-blue-600 bg-blue-500 text-white"}`}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="hover:bg-red-600 rounded-lg bg-red-500 px-4 py-2 text-white transition"
        >
          Clear
        </button>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleFileSelect}
        />
        <div className="inline-flex flex-row gap-2">
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="hover:bg-green-600 w-1/2 sm:w-auto text-center rounded-lg bg-green-500 px-4 py-2 text-white transition cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setIsSettingsModalOpen(true)}
            className="hover:bg-gray-600 w-1/2 sm:w-auto text-center rounded-lg bg-gray-500 px-4 py-2 text-white transition cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.281Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </button>
        </div>
      </form>

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFileSelect={handleFileSelect}
        fileName={fileName}
        onFileUpload={onFileUpload}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        initialSettings={chatSettings}
        onSave={handleSettingsSave}
      />

      {fileName && (
        <div className="text-sm text-gray-500 mt-1">
          <span>Attached file: {fileName}</span>
        </div>
      )}
      {fileId && (
        <div className="text-sm text-gray-500 mt-1">
          <span>File context: {fileId}</span>
        </div>
      )}
      {chatSettings.tags && chatSettings.tags.length > 0 && (
        <span className="flex items-center gap-2 mt-2">
          <Tag size={16} />
          {chatSettings.tags.map((tag) => (
            <span key={tag} className="bg-blue-500 text-white p-1 rounded-md text-xs flex items-center gap-1">
              {tag}
            </span>
          ))}
        </span>
      )}
    </div>
  );
};

export default ChatBox;
