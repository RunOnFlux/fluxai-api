import React, { useState } from "react";

const ImageSettingsModal = ({ isOpen, onClose, initialSettings, onSave }) => {
  const [settings, setSettings] = useState(initialSettings);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]:
        name === "jpg_quality"
          ? parseFloat(value)
          : name === "height" || name === "width"
            ? parseInt(value)
            : value,
    }));
  };

  const handleSave = () => {
    settings.height > 1024 ? (settings.height = 1024) : settings.height;
    settings.width > 1024 ? (settings.width = 1024) : settings.width;
    settings.height < 64 ? (settings.height = 64) : settings.height;
    settings.width < 64 ? (settings.width = 64) : settings.width;
    settings.jpg_quality < 0
      ? (settings.jpg_quality = 0)
      : settings.jpg_quality;
    settings.jpg_quality > 1
      ? (settings.jpg_quality = 1)
      : settings.jpg_quality;
    // Adjust height and width to be divisible by 8 before saving
    const adjustedSettings = {
      ...settings,
      height: Math.round(settings.height / 8) * 8,
      width: Math.round(settings.width / 8) * 8,
    };
    onSave(adjustedSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Image Generation Settings
        </h2>

        <div className="space-y-4">
          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Width
              </label>
              <input
                type="number"
                name="width"
                value={settings.width}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                min="64"
                max="1024"
                step="64"
              />
              <span className="text-xs text-blue-400">Max 1024px</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Height
              </label>
              <input
                type="number"
                name="height"
                value={settings.height}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                min="64"
                max="1024"
                step="64"
              />
              <span className="text-xs text-blue-400">Max 1024px</span>
            </div>
          </div>
          {/* File Format */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              File Format
            </label>
            <select
              name="file_format"
              value={settings.file_format}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
            </select>
          </div>

          {/* JPEG Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              JPEG Quality: {settings.jpg_quality * 100}%
            </label>
            <input
              type="range"
              name="jpg_quality"
              value={settings.jpg_quality}
              onChange={handleChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              min="0"
              max="1"
              step="0.05"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0</span>
              <span>100</span>
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Aspect Ratio
            </label>
            <select
              name="aspect_ratio"
              value={settings.aspect_ratio}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="1:1">1:1 Square</option>
              <option value="4:3">4:3 Standard</option>
              <option value="16:9">16:9 Widescreen</option>
              <option value="9:16">9:16 Portrait</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
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

export default ImageSettingsModal;
