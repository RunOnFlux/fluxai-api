"use client";
import ChatBox from "./ChatBox";
import ChatFiles from "./ChatFiles";
import ChatInput from "./ChatInput";
import TokenBalance from "@/components/TokenBalance";
import SettingsModal from "./SettingsModal";
import FileUploadModal from "./FileUploadModal";
import { useState, useEffect } from "react";

export default function Chat() {
  const [balanceKey, setBalanceKey] = useState(0);
  const [fileContext, setFileContext] = useState("");
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [controller, setController] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [chatSettings, setChatSettings] = useState({
    preamble: "",
    intelMode: "query",
    tags: [],
  });

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/files");
      if (res.ok) {
        const data = await res.json();
        setFiles(data || []);
      } else {
        console.error("Error fetching files:", res.status);
        setFiles([]);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      setFiles([]);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleSubmit = async (message) => {
    if (!message.trim() || isLoading) return;

    const newController = new AbortController();
    setController(newController);

    const currentMessage = [...chatHistory, { role: "user", content: message }];
    setChatHistory(currentMessage);
    setChatHistory((prev) => [...prev, { role: "assistant", content: "" }]);

    setIsLoading(true);

    try {
      let fullResponse = "";
      let buffer = "";

      const payload = {
        messages: currentMessage,
        stream: true,
      };

      if (fileContext || chatSettings.tags.length > 0) {
        payload.attachments = {};
        if (fileContext) {
          payload.attachments.files = [fileContext];
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
        signal: newController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
            // eslint-disable-next-line no-unused-vars
          } catch (e) {
            console.log("Skipping invalid JSON:", line);
            continue;
          }
        }
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request was aborted");
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: "Request cancelled." },
        ]);
      } else {
        console.error("Error:", error);
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error processing your request.",
          },
        ]);
      }
    } finally {
      setIsLoading(false);
      if (setBalanceKey) {
        setBalanceKey((prev) => prev + 1);
      }
    }
  };

  const handleClear = () => {
    setChatHistory([]);
    setFileContext("");
  };

  const handleFileSelect = (fileId) => {
    setFileContext(fileId);
  };

  const handleSettingsSave = (newSettings) => {
    setChatSettings(newSettings);
    setIsSettingsModalOpen(false);
  };

  return (
    <section
      id="fluxgpt"
      className="flex flex-col w-full min-h-[calc(100vh-100px)]"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center font-montserrat">
        <div className="col-xl-7 col-lg-10 col-md-10 col-sm-12 col-12 gap-4 flex flex-col justify-between px-0 lg:px-10">
          <div className="px-3 mx-auto flex w-full flex-col">
            <h1 className="text-[50px] text-red-500/80 mx-auto text-center sm:text-left font-semibold md:text-[60px]">
              FluxGPT
            </h1>
            <p className="text-center sm:text-left text-lg">
              Use FluxGPT to add AI to your projects using text based prompts.
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col relative">
        <TokenBalance balanceKey={balanceKey} />
        <div className="flex-1 overflow-y-auto">
          <ChatBox chatHistory={chatHistory} />
        </div>
        <div className="sticky bottom-0 bg-background">
          <ChatInput
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onClear={handleClear}
            onFileSelect={handleFileSelect}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
            onStopGeneration={() => {
              if (controller) {
                controller.abort();
                setController(null);
              }
            }}
          />
          <ChatFiles
            setFileContext={setFileContext}
            fileContext={fileContext}
            files={files}
            chatSettings={chatSettings}
            onFileDelete={fetchFiles}
          />
        </div>
      </div>

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFileSelect={handleFileSelect}
        onFileUpload={fetchFiles}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        initialSettings={chatSettings}
        onSave={handleSettingsSave}
      />
    </section>
  );
}
