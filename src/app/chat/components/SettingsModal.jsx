import React, { useState } from "react";

const SettingsModal = ({ isOpen, onClose, initialSettings, onSave }) => {
  const [preamble, setPreamble] = useState(initialSettings?.preamble || "");
  const [intelMode, setIntelMode] = useState(
    initialSettings?.intelMode || "query",
  );
  const [tags, setTags] = useState(initialSettings?.tags || []);
  const [newTag, setNewTag] = useState("");

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = () => {
    onSave({
      preamble,
      intelMode,
      tags,
    });
    onClose();
  };

  const handleClose = () => {
    // Reset all form values to initial settings
    setPreamble(initialSettings?.preamble || "");
    setIntelMode(initialSettings?.intelMode || "query");
    setTags(initialSettings?.tags || []);
    setNewTag("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-white">Chat Settings</h2>

        <div className="space-y-4">
          {/* Preamble */}
          <div>
            <label
              htmlFor="preamble"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Preamble
            </label>
            <textarea
              id="preamble"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
              value={preamble}
              onChange={(e) => setPreamble(e.target.value)}
              placeholder="Enter preamble text..."
            />
          </div>

          {/* Intel Mode */}
          <div>
            <label
              htmlFor="intelMode"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Intel Mode
            </label>
            <select
              id="intelMode"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              value={intelMode}
              onChange={(e) => setIntelMode(e.target.value)}
            >
              <option value="query">Query</option>
              <option value="rag">RAG</option>
              <option value="summarize">Summarize</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="tags"
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a tag..."
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
