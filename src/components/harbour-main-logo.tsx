"use client";

import React from "react";

interface Props {
  variant?: "horizontal" | "stacked" | "icon";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  lightModeOnly?: boolean;
}

export function HarbourMainLogo({
  variant = "horizontal",
  className = "",
  size = "md",
  showTagline = true,
  lightModeOnly = false
}: Props) {
  // Height & scale classes based on size
  const iconSizes = {
    sm: "h-7 w-7",
    md: "h-10 w-10",
    lg: "h-14 w-14",
    xl: "h-20 w-20"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl"
  };

  const taglineSizes = {
    sm: "text-[9px]",
    md: "text-[11px]",
    lg: "text-xs",
    xl: "text-sm"
  };

  // The Monogram Icon SVG
  const MonogramSvg = ({ svgClass = iconSizes[size] }: { svgClass?: string }) => (
    <svg
      viewBox="0 0 160 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${svgClass} shrink-0`}
    >
      {/* Golden Sand Sun Circle */}
      <circle cx="82" cy="35" r="18" fill="#DCC9A8" />

      {/* Left Vertical Pillar of "H" */}
      <rect x="18" y="22" width="16" height="98" rx="2" fill="#0E2F49" className={lightModeOnly ? "" : "dark:fill-slate-100"} />

      {/* Middle Vertical Pillar */}
      <rect x="68" y="70" width="16" height="50" rx="2" fill="#0E2F49" className={lightModeOnly ? "" : "dark:fill-slate-100"} />

      {/* Right Vertical Pillar of "M" */}
      <rect x="126" y="22" width="16" height="98" rx="2" fill="#0E2F49" className={lightModeOnly ? "" : "dark:fill-slate-100"} />

      {/* Right Diagonal of "M" */}
      <path
        d="M126 24L88 88H106L142 24H126Z"
        fill="#0E2F49"
        className={lightModeOnly ? "" : "dark:fill-slate-100"}
      />

      {/* Coastal Teal Wave (Bridges H crossbar & M left diagonal) */}
      <path
        d="M18 64C34 50 48 48 68 58C86 67 98 84 112 80C118 78 124 72 130 64L118 62C110 68 104 70 98 66C84 57 74 44 48 45C32 46 22 56 18 64Z"
        fill="#4E8D8F"
      />
      <path
        d="M18 64C32 54 46 50 68 62C84 71 96 86 112 80L102 96C88 98 78 85 64 76C46 65 32 68 18 78V64Z"
        fill="#4E8D8F"
        fillOpacity="0.9"
      />
    </svg>
  );

  if (variant === "icon") {
    return <MonogramSvg />;
  }

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <MonogramSvg svgClass={iconSizes[size]} />
        <div className="mt-2 space-y-0.5">
          <div className={`${textSizes[size]} font-black tracking-tight flex items-center justify-center space-x-1.5`}>
            <span className={`text-[#0E2F49] ${lightModeOnly ? "" : "dark:text-white"}`}>Harbour</span>
            <span className="text-[#4E8D8F] font-light italic text-[1.1em]">&amp;</span>
            <span className={`text-[#0E2F49] ${lightModeOnly ? "" : "dark:text-white"}`}>Main</span>
          </div>
          {showTagline && (
            <p className={`${taglineSizes[size]} font-medium text-slate-500 dark:text-slate-400 tracking-wide`}>
              Websites built to bring local businesses more business.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={`flex items-center space-x-3.5 ${className}`}>
      <MonogramSvg svgClass={iconSizes[size]} />
      <div>
        <div className={`${textSizes[size]} font-black tracking-tight leading-none flex items-center space-x-1.5`}>
          <span className={`text-[#0E2F49] ${lightModeOnly ? "" : "dark:text-white"}`}>Harbour</span>
          <span className="text-[#4E8D8F] font-light italic text-[1.1em]">&amp;</span>
          <span className={`text-[#0E2F49] ${lightModeOnly ? "" : "dark:text-white"}`}>Main</span>
        </div>
        {showTagline && (
          <p className={`${taglineSizes[size]} font-medium text-slate-500 dark:text-slate-400 mt-1 leading-snug`}>
            Websites built to bring local businesses more business.
          </p>
        )}
      </div>
    </div>
  );
}
