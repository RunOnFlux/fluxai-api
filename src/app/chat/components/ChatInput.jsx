"use client";
import React, { useState } from "react";

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
            onClick={onOpenSettingsModal}
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
      </div>
    </form>
  );
};

export default ChatInput;
