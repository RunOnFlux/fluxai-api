"use client";
import React, { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import ImageSettingsModal from "./ImageSettingsModal";

const FLUX_ONE_TEMPLATE = {
  height: 1024,
  width: 1024,
  guidance_scale: 0.5,
  file_format: "jpg",
  jpg_quality: 0.85,
  aspect_ratio: "1:1",
};

const ImageBox = ({ setBalanceKey }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [imageSettings, setImageSettings] = useState(FLUX_ONE_TEMPLATE);

  const handleSettingsSave = (newSettings) => {
    setImageSettings(newSettings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const currentMessage = message;
    const fluxData = {
      ...imageSettings,
      prompt: currentMessage,
    };
    setMessage("");

    setChatHistory((prev) => [
      ...prev,
      { role: "user", content: currentMessage },
    ]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fluxData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const imageData = await response.json();
      try {
        const imageUrl = `data:${imageData.data.content_type};base64,${imageData.data.image}`;
        const imageDetails = imageData.data.metadata || {};
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content: imageUrl,
            image_details: imageDetails,
          },
        ]);
      } catch (error) {
        console.error("Error:", error);
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              error.message ||
              "Sorry, I encountered an error processing your request.",
          },
        ]);
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
      <div className="mx-auto w-[90%] flex flex-1 h-full flex-col rounded-lg pb-[50px]">
        {/* Chat messages area */}
        <div className="flex-1 space-y-4 overflow-y-auto rounded-lg border  p-4 min-h-0">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && msg.content.includes(";base64,") ? (
                <div className="flex flex-col items-center">
                  <Image
                    src={msg.content}
                    alt="Generated"
                    width={1024}
                    height={1024}
                    className="mt-4 rounded-lg"
                  />
                  <div className="text-sm text-gray-500">
                    {console.log(msg.image_details)}
                    Image details: {JSON.stringify(msg.image_details)}
                  </div>
                </div>
              ) : (
                <div
                  className={`max-w-full sm:max-w-[90%] whitespace-pre-wrap rounded-lg p-3 ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="loader h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500"></div>
            </div>
          )}
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
            className="focus:outline-none focus:border-blue-500 flex-1 rounded-lg text-black border p-2"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`rounded-lg px-4 py-2 transition ${isLoading ? "cursor-not-allowed bg-gray-400" : "hover:bg-blue-600 bg-blue-500 text-white"}`}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="hover:bg-red-600 rounded-lg bg-red-500 px-4 py-2 text-white transition"
          >
            Clear
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
        </form>
        <ImageSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          initialSettings={imageSettings}
          onSave={handleSettingsSave}
        />
      </div>
    </>
  );
};

export default ImageBox;
