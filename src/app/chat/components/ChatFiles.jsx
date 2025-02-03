import {
  File,
  Calendar,
  IdCard,
  Tag,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useState } from "react";

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export default function ChatFiles({
  files,
  setFileContext,
  fileContext,
  onFileDelete,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState(null);

  const handleFileClick = (file) => {
    if (file.id && file.id !== fileContext) {
      setFileContext(file.id);
    } else if (file.id === fileContext) {
      setFileContext("");
    }
  };

  const handleDeleteFile = async (file, event) => {
    try {
      event.preventDefault();
      if (!confirm("Are you sure you want to delete this file?")) {
        return;
      }
      setDeletingFileId(file.id);
      const response = await fetch(`/api/files?id=${file.id}`, {
        method: "DELETE",
        timeout: 120000,
      });
      if (response.ok) {
        onFileDelete();
      } else {
        alert("Error deleting file, please try again.");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setDeletingFileId(null);
    }
  };

  return (
    <div className="mx-auto w-[90%] flex flex-col gap-2 border border-gray-200 rounded-md my-10 p-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h1 className="text-2xl font-bold">Files</h1>
        <span className="text-2xl">
          {isExpanded ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
        </span>
      </div>

      <div
        className={`flex justify-around flex-col flex-wrap sm:flex-row gap-4 ${
          isExpanded ? "block" : "hidden"
        }`}
      >
        {files?.map((file) => (
          <div
            key={file.id}
            className={`flex flex-col p-4 min-w-[300px] rounded-md shadow-md text-sm text-semibold cursor-pointer ${
              fileContext === file.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-black/80"
            }`}
            onClick={() => handleFileClick(file)}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs">{file.id}</span>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  handleDeleteFile(file, event);
                }}
                disabled={deletingFileId === file.id}
              >
                {deletingFileId === file.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
            <span className="flex items-center gap-2">
              <IdCard size={16} />
              {file.filename.length > 20
                ? file.filename.slice(0, 10) + "..." + file.filename.slice(-10)
                : file.filename}
            </span>
            <span className="flex items-center gap-2">
              <File size={16} />
              {formatBytes(file.bytes)}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(file.created_at * 1000).toLocaleDateString()}
            </span>
            {file.tags && file.tags.length > 0 && (
              <span className="flex items-center gap-2">
                <Tag size={16} />
                {file.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-500 text-white p-1 rounded-md text-xs flex items-center gap-1"
                  >
                    {tag}
                  </span>
                ))}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
