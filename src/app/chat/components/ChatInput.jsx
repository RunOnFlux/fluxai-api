"use client";
import React, { useState } from "react";
import { FileUp, Settings } from "lucide-react";

const ChatInput = ({
  isLoading,
  onSubmit,
  onClear,
  onFileSelect,
  onOpenUploadModal,
  onOpenSettingsModal,
  onStopGeneration,
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    onSubmit(message);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row mx-auto w-[90%] mt-4 gap-2"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="focus:outline-none focus:border-blue-500 flex-1 w-full rounded-lg text-black/80 border p-2 min-w-0 text-base"
        disabled={isLoading}
      />
      <div className="flex flex-row-reverse md:flex-row flex-wrap gap-2">
        <button
          type="submit"
          className={`rounded-lg px-4 py-2 transition ${isLoading ? "cursor-not-allowed bg-gray-400" : "hover:bg-blue-600 bg-blue-500 text-white"}`}
          disabled={isLoading}
          style={{ display: isLoading ? "none" : "block" }}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
        <button
          type="button"
          onClick={onStopGeneration}
          className="rounded-lg hover:bg-red-600 bg-red-500 px-4 py-2 text-white transition"
          style={{ display: isLoading ? "block" : "none" }}
        >
          Stop
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg hover:bg-red-600 bg-red-500 px-4 py-2 text-white transition"
        >
          Clear
        </button>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={onFileSelect}
        />
        <div className="inline-flex flex-row gap-2">
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="hover:bg-green-600 w-1/2 sm:w-auto text-center rounded-lg bg-green-500 px-4 py-2 text-white transition cursor-pointer"
          >
            <FileUp className="w-5 h-5 mx-auto" />
          </button>
          <button
            type="button"
            onClick={onOpenSettingsModal}
            className="hover:bg-gray-600 w-1/2 sm:w-auto text-center rounded-lg bg-gray-500 px-4 py-2 text-white transition cursor-pointer"
          >
            <Settings className="w-5 h-5 mx-auto" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
