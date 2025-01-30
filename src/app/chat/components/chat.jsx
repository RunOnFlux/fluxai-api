"use client";
import ChatBox from "./ChatBox";
import ChatFiles from "./ChatFiles";
import TokenBalance from "@/components/TokenBalance";
import { useState, useEffect } from "react";

export default function Chat() {
  const [balanceKey, setBalanceKey] = useState(0);
  const [fileContext, setFileContext] = useState("");
  const [files, setFiles] = useState([]);
  
  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/files");
      const data = await res.json();
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <section
      id="fluxgpt"
      className="flex flex-col w-full min-h-[calc(100vh-100px)]"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center pt-[50px] font-montserrat">
        <div className="col-xl-7 col-lg-10 col-md-10 col-sm-12 col-12 gap-4 flex flex-col justify-between px-0 lg:px-10">
          <div className="px-3 mx-auto flex w-full flex-col">
            <h1 className="text-[50px] mx-auto text-center sm:text-left font-bold md:text-[60px]">
              <span className="text-red-500/80">FluxGPT</span>
            </h1>
            <p className="text-center sm:text-left text-lg">
              Use FluxGPT to add AI to your projects using text based prompts.
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <TokenBalance balanceKey={balanceKey} />
        <ChatBox
          setBalanceKey={setBalanceKey}
          fileContext={fileContext}
          setFileContext={setFileContext}
          onFileUpload={fetchFiles}
        />
        <ChatFiles
          setFileContext={setFileContext}
          fileContext={fileContext}
          files={files}
        />
      </div>
    </section>
  );
}
