"use client";
import React, { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const currentMessage = message;
    const fluxData = {
      ...FLUX_ONE_TEMPLATE,
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
      <div className="max-[1200px] mx-auto mb-[100px] flex h-full w-[90%] flex-col rounded-lg shadow-custom">
        {/* Chat messages area */}
        <div className="flex-1 space-y-4 overflow-y-auto rounded-lg border border-gray-200 p-4">
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
                  className={`max-w-[80%] whitespace-pre-wrap rounded-lg p-3 ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
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

export default ImageBox;
