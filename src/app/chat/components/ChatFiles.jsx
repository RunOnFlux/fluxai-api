import { useState, useEffect } from "react";
import { File, Calendar, IdCard } from "lucide-react";
const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export default function ChatFiles({ setFileContext, fileContext }) {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch("/api/files");
      const data = await res.json();
      setFiles(data);
    };
    fetchFiles();
  }, []);
  const handleFileClick = (file) => {
    if (file.id && file.id !== fileContext) {
      setFileContext(file.id);
    } else if (file.id === fileContext) {
      setFileContext("");
    }
  };
  return (
    <div className="mx-auto w-[90%] flex flex-col my-10">
      <h1 className="text-2xl font-bold">Files</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className={`flex flex-col p-2 rounded-md shadow-md text-sm text-semibold cursor-pointer ${
              fileContext === file.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-black/80"
            }`}
            onClick={() => handleFileClick(file)}
          >
            <span className="text-xs">{file.id}</span>
            <span className="flex items-center gap-2">
              <IdCard size={16} />
              {file.filename.slice(0, 10)}...{file.filename.slice(-10)}
            </span>
            <span className="flex items-center gap-2">
              <File size={16} />
              {formatBytes(file.bytes)}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(file.created_at * 1000).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
