"use client";
import React, { useEffect, useRef, useState } from "react";
import { Markdown } from "@/components/Markdown";

const ChatBox = ({ chatHistory }) => {
  const containerRef = useRef(null);
  const lastMessageRef = useRef(null);
  const [prevMessageCount, setPrevMessageCount] = useState(chatHistory.length);
  const [expandedThoughts, setExpandedThoughts] = useState({});

  useEffect(() => {
    // Only scroll when a new message is added
    if (chatHistory.length > prevMessageCount && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ block: "start" });
      setPrevMessageCount(chatHistory.length);
    }
  }, [chatHistory, prevMessageCount]);

  return (
    <div className="mx-auto w-[90%] min-h-[calc(50vh)] flex flex-col flex-1 rounded-lg">
      {chatHistory.length == 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl font-semibold">What can I help you with?</p>
        </div>
      )}
      <div
        ref={containerRef}
        className="flex-1 space-y-4 overflow-y-auto rounded-lg p-4 min-h-0"
      >
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            ref={index === chatHistory.length - 1 ? lastMessageRef : null}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`prose max-w-full sm:max-w-[90%] rounded-lg p-3 ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.thinking && (
                <div className="group mb-2">
                  <div
                    className="text-sm bg-background px-4 py-2 rounded-md text-white flex items-center justify-between gap-1 cursor-pointer"
                    onClick={() => {
                      const elem = document.getElementById(`thinking-${index}`);
                      elem.classList.toggle("hidden");
                      setExpandedThoughts((prev) => ({
                        ...prev,
                        [index]: !prev[index],
                      }));
                    }}
                  >
                    <span className="font-semibold">Thoughts</span>
                    <span className="text-xs">
                      {expandedThoughts[index] ? "▲" : "▼"}
                    </span>
                  </div>
                  <div
                    id={`thinking-${index}`}
                    className="text-sm italic text-gray-500 mt-1 cursor-default border-l-4 border-gray-400 px-4"
                  >
                    <Markdown content={msg.thinking} />
                  </div>
                </div>
              )}
              <Markdown content={msg.content} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBox;
