"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Upload,
  Sliders,
  Sparkles,
  Check,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
  Eye,
  Link2
} from "lucide-react";
import { BackgroundConfig } from "@/lib/types";
import { WALLPAPER_TEMPLATES } from "./background-layer";
import { useTheme } from "./theme-provider";

interface Props {
  config: BackgroundConfig;
  onClose: () => void;
  onSaveConfig: (config: BackgroundConfig) => void;
}

export function BackgroundCustomizerModal({
  config: initialConfig,
  onClose,
  onSaveConfig
}: Props) {
  const [config, setConfig] = useState<BackgroundConfig>({ ...initialConfig });
  const [activeTab, setActiveTab] = useState<"TEMPLATES" | "UPLOAD" | "ADJUST">("TEMPLATES");
  const [customUrlInput, setCustomUrlInput] = useState(
    config.type === "custom" && config.customUrl?.startsWith("http") ? config.customUrl : ""
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  const handleSelectTemplate = (templateId: string) => {
    const updated: BackgroundConfig = {
      ...config,
      type: "template",
      templateId,
      customUrl: undefined
    };
    setConfig(updated);
    onSaveConfig(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }

    // Limit to 5MB for local storage safety
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image is too large (max 5MB). Please choose a smaller photo.");
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const updated: BackgroundConfig = {
        ...config,
        type: "custom",
        customUrl: dataUrl,
        templateId: undefined
      };
      setConfig(updated);
      onSaveConfig(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    const updated: BackgroundConfig = {
      ...config,
      type: "custom",
      customUrl: customUrlInput.trim(),
      templateId: undefined
    };
    setConfig(updated);
    onSaveConfig(updated);
  };

  const handleResetToDefault = () => {
    const defaultCfg: BackgroundConfig = {
      type: "default",
      templateId: "default-grid",
      blurPx: 0,
      overlayOpacity: 0.35,
      overlayTint: "auto"
    };
    setConfig(defaultCfg);
    setCustomUrlInput("");
    onSaveConfig(defaultCfg);
  };

  const handleUpdateControls = (patch: Partial<BackgroundConfig>) => {
    const updated = { ...config, ...patch };
    setConfig(updated);
    onSaveConfig(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-3xl rounded-3xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xl shadow-xs">
              🖼️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black tracking-tight">Background &amp; Wallpaper Studio</h3>
                <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300">
                  Customization
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Choose academic aesthetic wallpapers or upload your own background photo with live readability controls
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetToDefault}
              className="flex items-center space-x-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Reset to clean grid"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-full cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Live Preview Strip */}
        <div className="relative rounded-2xl p-4 overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Current Wallpaper:</span>
              <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                {config.type === "template"
                  ? WALLPAPER_TEMPLATES.find((t) => t.id === config.templateId)?.name || "Template"
                  : config.type === "custom"
                  ? "Custom Photo Upload"
                  : "Default Clean Notebook Grid"}
              </span>
            </div>

            {/* Quick Theme Switcher Pill */}
            <div className="flex items-center space-x-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  theme === "light"
                    ? "bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-300"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                }`}
                title="Light Mode"
              >
                <Sun className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  theme === "dark"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                }`}
                title="Dark Mode"
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  theme === "system"
                    ? "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                }`}
                title="Match System"
              >
                <Laptop className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("TEMPLATES")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === "TEMPLATES"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Curated Wallpapers ({WALLPAPER_TEMPLATES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("UPLOAD")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === "UPLOAD"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Custom Photo</span>
          </button>

          <button
            onClick={() => setActiveTab("ADJUST")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === "ADJUST"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Blur &amp; Dimmer Readability</span>
          </button>
        </div>

        {/* TAB 1: CURATED WALLPAPERS GRID */}
        {activeTab === "TEMPLATES" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-h-[380px] overflow-y-auto p-1">
              {WALLPAPER_TEMPLATES.map((tmpl) => {
                const isSelected = config.type === "template" && config.templateId === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl.id)}
                    className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-indigo-600 ring-2 ring-indigo-500/30 scale-[1.02]"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="h-28 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={tmpl.thumbnail}
                        alt={tmpl.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <span className="absolute top-2 left-2 text-[10px] font-extrabold bg-black/60 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {tmpl.category}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 bg-white dark:bg-[#1A233A] space-y-1">
                      <h4 className="text-xs font-black truncate">{tmpl.name}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {tmpl.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: UPLOAD CUSTOM PHOTO OR URL */}
        {activeTab === "UPLOAD" && (
          <div className="space-y-5">
            {/* File Upload Dropzone */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-3xl p-8 text-center space-y-3 bg-slate-50 dark:bg-slate-900/30 transition">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl">
                <Upload className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black">Upload a photo from your computer</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload your campus photo, study room, or favorite aesthetic wallpaper (PNG, JPG, WebP up to 5MB)
                </p>
              </div>

              <label className="inline-flex items-center space-x-2 rounded-full bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition cursor-pointer">
                <span>Browse Photo File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadError && (
                <p className="text-xs text-rose-600 font-bold">{uploadError}</p>
              )}
            </div>

            {/* Direct Image URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Or paste a direct Image URL (Unsplash, Pinterest, University Photo):
              </label>
              <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-900 rounded-2xl px-4 py-2 border border-slate-300 dark:border-slate-700 focus-within:border-indigo-500">
                <Link2 className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-medium"
                />
                <button
                  onClick={handleApplyCustomUrl}
                  className="rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition shrink-0 cursor-pointer"
                >
                  Apply Photo
                </button>
              </div>
            </div>

            {/* Quick Sample Photos */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Quick Academic Samples:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    name: "Oxford Radcliffe Camera",
                    url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=1920&auto=format&fit=crop"
                  },
                  {
                    name: "Cozy Books & Coffee",
                    url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1920&auto=format&fit=crop"
                  },
                  {
                    name: "Autumn Campus Walkway",
                    url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1920&auto=format&fit=crop"
                  }
                ].map((s) => (
                  <button
                    key={s.name}
                    onClick={() => {
                      setCustomUrlInput(s.url);
                      const updated: BackgroundConfig = {
                        ...config,
                        type: "custom",
                        customUrl: s.url,
                        templateId: undefined
                      };
                      setConfig(updated);
                      onSaveConfig(updated);
                    }}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                  >
                    + {s.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: READABILITY & DIMMER CONTROLS */}
        {activeTab === "ADJUST" && (
          <div className="space-y-6">
            {/* Overlay Dimmer / Contrast Slider */}
            <div className="space-y-2 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">
                  Background Dimmer / Overlay Opacity (Readability)
                </span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">
                  {Math.round(config.overlayOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.85"
                step="0.05"
                value={config.overlayOpacity}
                onChange={(e) =>
                  handleUpdateControls({ overlayOpacity: parseFloat(e.target.value) })
                }
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Higher opacity darkens or softens the background so homework due dates and timetable cards stand out with WCAG AA contrast.
              </p>
            </div>

            {/* Blur Slider */}
            <div className="space-y-2 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">
                  Background Blur
                </span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">
                  {config.blurPx}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={config.blurPx}
                onChange={(e) =>
                  handleUpdateControls({ blurPx: parseInt(e.target.value, 10) })
                }
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Smooth ambient blur turns high-detail photos into gentle focus backdrops.
              </p>
            </div>

            {/* Overlay Tint Selector */}
            <div className="space-y-2 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Overlay Tint Shade
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "auto", label: "Auto (Matches Theme)" },
                  { id: "navy", label: "Midnight Navy" },
                  { id: "black", label: "Deep Black" },
                  { id: "sepia", label: "Warm Sepia" }
                ].map((tint) => (
                  <button
                    key={tint.id}
                    onClick={() =>
                      handleUpdateControls({ overlayTint: tint.id as BackgroundConfig["overlayTint"] })
                    }
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      config.overlayTint === tint.id
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {tint.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
          <span className="text-[11px] text-slate-400 font-medium">
            Changes save automatically to your campus profile
          </span>
          <button
            onClick={onClose}
            className="rounded-full bg-indigo-600 px-6 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
