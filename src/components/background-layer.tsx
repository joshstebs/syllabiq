"use client";

import React from "react";
import { BackgroundConfig } from "@/lib/types";
import { useTheme } from "./theme-provider";

export interface WallpaperTemplate {
  id: string;
  name: string;
  description: string;
  category: "Academic" | "Cozy" | "Minimal" | "Sci-Fi";
  thumbnail: string;
  fullImage: string;
}

export const WALLPAPER_TEMPLATES: WallpaperTemplate[] = [
  {
    id: "student-study-focus",
    name: "Student Study Focus",
    description: "Personal study desk, laptop open & warm focus lighting",
    category: "Academic",
    thumbnail: "/images/student-studying.jpg",
    fullImage: "/images/student-studying.jpg"
  },
  {
    id: "campus-study-circle",
    name: "Campus Study Circle",
    description: "Friends and classmates collaborating happily on university campus",
    category: "Academic",
    thumbnail: "/images/student-group.jpg",
    fullImage: "/images/student-group.jpg"
  },
  {
    id: "ivy-library",
    name: "Ivy Cathedral Library",
    description: "Towering mahogany bookshelves, arched stained glass & gentle rain",
    category: "Academic",
    thumbnail: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=400&auto=format&fit=crop",
    fullImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop"
  },
  {
    id: "coffee-shop",
    name: "Cozy Lofi Coffee Shop",
    description: "Warm espresso bar, bokeh string lights & quiet study booth",
    category: "Cozy",
    thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=400&auto=format&fit=crop",
    fullImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1920&auto=format&fit=crop"
  },
  {
    id: "midnight-study",
    name: "Midnight Study Sanctuary",
    description: "Warm desk lamp, potted monstera & quiet midnight concentration",
    category: "Cozy",
    thumbnail: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=400&auto=format&fit=crop",
    fullImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1920&auto=format&fit=crop"
  },
  {
    id: "campus-sunset",
    name: "Campus Quad Golden Hour",
    description: "Historic brick college halls bathed in golden hour sunlight",
    category: "Academic",
    thumbnail: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=400&auto=format&fit=crop",
    fullImage: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1920&auto=format&fit=crop"
  },
  {
    id: "deep-space",
    name: "Deep Cosmic Nebula",
    description: "Starry indigo and violet galaxy with sparkling starlight",
    category: "Sci-Fi",
    thumbnail: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=400&auto=format&fit=crop",
    fullImage: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1920&auto=format&fit=crop"
  },
  {
    id: "botanical-desk",
    name: "Minimalist Botanical Desk",
    description: "Clean Scandinavian oak, soft window daylight & green plants",
    category: "Minimal",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop",
    fullImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1920&auto=format&fit=crop"
  },
  {
    id: "math-blueprint",
    name: "Engineering Blueprint & Math",
    description: "Mathematical sketches, precision geometry & clean graph paper",
    category: "Academic",
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=400&auto=format&fit=crop",
    fullImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1920&auto=format&fit=crop"
  },
  {
    id: "corkboard-desk",
    name: "Student Notebook & Pen",
    description: "Handwritten class notes, fountain pen & warm paper textures",
    category: "Minimal",
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=400&auto=format&fit=crop",
    fullImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1920&auto=format&fit=crop"
  },
  {
    id: "neon-cyberpunk",
    name: "Cyberpunk Night Campus",
    description: "Electric cyan and magenta neon glowing in the city night",
    category: "Sci-Fi",
    thumbnail: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=400&auto=format&fit=crop",
    fullImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1920&auto=format&fit=crop"
  }
];

interface Props {
  config: BackgroundConfig;
}

export function BackgroundLayer({ config }: Props) {
  const { resolvedTheme } = useTheme();

  // Resolve background image URL
  let bgImage: string | null = null;
  if (config.type === "template" && config.templateId) {
    const found = WALLPAPER_TEMPLATES.find((t) => t.id === config.templateId);
    if (found) {
      bgImage = found.fullImage;
    }
  } else if (config.type === "custom" && config.customUrl) {
    bgImage = config.customUrl;
  }

  // Determine overlay color based on tint & theme
  let overlayColor = "rgba(248, 250, 252, ";
  if (config.overlayTint === "black") {
    overlayColor = "rgba(0, 0, 0, ";
  } else if (config.overlayTint === "navy") {
    overlayColor = "rgba(11, 15, 25, ";
  } else if (config.overlayTint === "sepia") {
    overlayColor = "rgba(254, 243, 199, ";
  } else {
    // "auto"
    overlayColor = resolvedTheme === "dark" ? "rgba(11, 15, 25, " : "rgba(248, 250, 252, ";
  }

  const overlayStyle = {
    backgroundColor: `${overlayColor}${config.overlayOpacity})`,
    backdropFilter: config.blurPx > 0 ? `blur(${config.blurPx}px)` : "none",
    WebkitBackdropFilter: config.blurPx > 0 ? `blur(${config.blurPx}px)` : "none"
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Background Image (if template or custom) */}
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 transform scale-105"
          style={{
            backgroundImage: `url("${bgImage}")`
          }}
        />
      )}

      {/* Dimmer & Blur Overlay */}
      {bgImage && (
        <div
          className="absolute inset-0 transition-all duration-300"
          style={overlayStyle}
        />
      )}

      {/* Default Ambient Glow Orbs (visible when default or complementing wallpaper) */}
      {!bgImage && (
        <>
          <div className="absolute -top-32 left-1/2 h-[540px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.09),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(99,102,241,0.14),transparent_70%)] blur-[140px]" />
          <div className="absolute top-[28%] right-[4%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.07),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(244,63,94,0.11),transparent_70%)] blur-[160px]" />
          <div className="absolute bottom-[20%] left-[6%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.07),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(245,158,11,0.10),transparent_70%)] blur-[160px]" />
        </>
      )}
    </div>
  );
}
