import { File, Calendar, IdCard, Tag } from "lucide-react";
const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export default function ChatFiles({ files, setFileContext, fileContext }) {
  const handleFileClick = (file) => {
    if (file.id && file.id !== fileContext) {
      setFileContext(file.id);
    } else if (file.id === fileContext) {
      setFileContext("");
    }
  };

  return (
    <div className="mx-auto w-[90%] flex flex-col gap-2 min-h-[185px] border border-gray-200 rounded-md my-10 p-4">
      <h1 className="text-2xl font-bold">Files</h1>
      <div className="flex justify-around flex-col flex-wrap sm:flex-row gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className={`flex flex-col p-4 min-w-[300px] rounded-md shadow-md text-sm text-semibold cursor-pointer ${
              fileContext === file.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-black/80"
            }`}
            onClick={() => handleFileClick(file)}
          >
            <span className="text-xs">{file.id}</span>
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
                  <span key={tag} className="bg-blue-500 text-white p-1 rounded-md text-xs flex items-center gap-1">
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
