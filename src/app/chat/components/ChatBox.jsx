"use client";
import React, { useEffect, useRef, useState } from "react";
import { Markdown } from "@/components/Markdown";

const ChatBox = ({ chatHistory }) => {
  const containerRef = useRef(null);
  const lastMessageRef = useRef(null);
  const [prevMessageCount, setPrevMessageCount] = useState(chatHistory.length);

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
              <Markdown content={msg.content} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBox;
