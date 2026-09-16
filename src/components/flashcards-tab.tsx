"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Layers,
  Sparkles,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Plus,
  Shuffle,
  Search,
  BookOpen,
  Brain,
  Trash2,
  RefreshCcw,
  Check,
  Filter,
  GraduationCap,
  Download,
  Upload
} from "lucide-react";
import confetti from "canvas-confetti";

export interface Flashcard {
  id: string;
  courseId: string;
  courseCode: string;
  deckTitle: string;
  front: string;
  back: string;
  tags: string[];
  mastered: boolean;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  createdAt: string;
  lastStudiedAt?: string;
}

import { Course } from "@/lib/types";

interface Props {
  courses?: Course[];
  isPro?: boolean;
  onOpenPaywall?: () => void;
}

export function FlashcardsTab({ courses = [], isPro = false, onOpenPaywall }: Props) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  // Create Card Form State
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  const [newCourse, setNewCourse] = useState("CS 2110");
  const [newDifficulty, setNewDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [newTags, setNewTags] = useState("");

  // AI Generation State
  const [aiTopic, setAiTopic] = useState("");
  const [aiCourse, setAiCourse] = useState("CS 2110");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Load cards from API + localStorage
  const loadCards = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/flashcards");
      if (res.ok) {
        const data = await res.json();
        if (data.cards && data.cards.length > 0) {
          // Merge with any locally stored cards
          const localSaved = localStorage.getItem("syllabiq_flashcards");
          if (localSaved) {
            try {
              const localCards = JSON.parse(localSaved);
              // deduplicate by id
              const cardMap = new Map<string, Flashcard>();
              data.cards.forEach((c: Flashcard) => cardMap.set(c.id, c));
              localCards.forEach((c: Flashcard) => cardMap.set(c.id, c));
              const merged = Array.from(cardMap.values());
              setCards(merged);
              localStorage.setItem("syllabiq_flashcards", JSON.stringify(merged));
              return;
            } catch (e) {}
          }
          setCards(data.cards);
          localStorage.setItem("syllabiq_flashcards", JSON.stringify(data.cards));
        }
      }
    } catch (err) {
      console.error("Failed to load flashcards:", err);
      // Fallback to localStorage
      const localSaved = localStorage.getItem("syllabiq_flashcards");
      if (localSaved) {
        setCards(JSON.parse(localSaved));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  // Filtered Cards
  const filteredCards = cards.filter((card) => {
    const matchesCourse = selectedCourse === "ALL" || card.courseCode === selectedCourse;
    const matchesSearch =
      !searchQuery ||
      card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.back.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCourse && matchesSearch;
  });

  // Safe current card
  const currentCard = filteredCards[currentIndex] || null;

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedCourse, searchQuery]);

  // Flip toggle
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Next Card
  const handleNext = () => {
    setIsFlipped(false);
    if (filteredCards.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  // Prev Card
  const handlePrev = () => {
    setIsFlipped(false);
    if (filteredCards.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  // Shuffle Cards
  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    localStorage.setItem("syllabiq_flashcards", JSON.stringify(shuffled));
  };

  // Toggle Mastery
  const handleToggleMastery = async (cardId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const updated = cards.map((c) => (c.id === cardId ? { ...c, mastered: newStatus } : c));
    setCards(updated);
    localStorage.setItem("syllabiq_flashcards", JSON.stringify(updated));

    if (newStatus) {
      confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
    }

    try {
      await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_STATUS",
          cardId,
          mastered: newStatus
        })
      });
    } catch (e) {
      console.error("Failed to sync mastery status to server:", e);
    }
  };

  // Delete Card
  const handleDeleteCard = async (cardId: string) => {
    const updated = cards.filter((c) => c.id !== cardId);
    setCards(updated);
    localStorage.setItem("syllabiq_flashcards", JSON.stringify(updated));
    if (currentIndex >= updated.length) {
      setCurrentIndex(Math.max(0, updated.length - 1));
    }
    setIsFlipped(false);

    try {
      await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DELETE", cardId })
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Create Card
  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    const tagsArray = newTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE",
          front: newFront.trim(),
          back: newBack.trim(),
          courseCode: newCourse,
          deckTitle: `${newCourse} Deck`,
          tags: tagsArray.length > 0 ? tagsArray : ["Study"],
          difficulty: newDifficulty
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.card) {
          const updated = [data.card, ...cards];
          setCards(updated);
          localStorage.setItem("syllabiq_flashcards", JSON.stringify(updated));
          setCurrentIndex(0);
          setIsFlipped(false);
          confetti({ particleCount: 50, spread: 60 });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setShowCreateModal(false);
      setNewFront("");
      setNewBack("");
      setNewTags("");
    }
  };

  // Generate AI Flashcards
  const handleGenerateAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setIsGeneratingAi(true);
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "AI_GENERATE",
          topic: aiTopic.trim(),
          courseCode: aiCourse
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.cards && data.cards.length > 0) {
          const updated = [...data.cards, ...cards];
          setCards(updated);
          localStorage.setItem("syllabiq_flashcards", JSON.stringify(updated));
          setCurrentIndex(0);
          setIsFlipped(false);
          confetti({ particleCount: 75, spread: 70 });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
      setShowAiModal(false);
      setAiTopic("");
    }
  };

  // Keyboard Shortcuts (Space to flip, Left/Right arrows to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Calculate Progress
  const totalCount = filteredCards.length;
  const masteredCount = filteredCards.filter((c) => c.mastered).length;
  const progressPercent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  // Course Options
  const courseOptions = [
    { code: "ALL", label: "All Decks" },
    { code: "CS 2110", label: "CS 2110: OOP & Data Structures" },
    { code: "CHEM 2070", label: "CHEM 2070: General Chemistry" },
    { code: "ECON 1110", label: "ECON 1110: Microeconomics" }
  ];

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* Top Header & Study Controls Bar */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#131B2E]/95 p-4 sm:p-6 backdrop-blur-md shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Active Recall &amp; Spaced Repetition</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>SyllabiQ Flashcards &amp; Study Decks</span>
              <span className="text-xs bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded-full">
                Saved &amp; Synced
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Turn syllabus exam objectives into high-yield flashcard decks with interactive 3D flip study mode.
            </p>
          </div>

          {/* Action Buttons: New Card & AI Generate */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => {
                if (!isPro) {
                  onOpenPaywall?.();
                  return;
                }
                setShowAiModal(true);
              }}
              className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition cursor-pointer"
            >
              <Brain className="h-4 w-4" />
              <span>AI Flashcard Generator</span>
              {!isPro && (
                <span className="text-[10px] bg-amber-400 text-slate-900 font-black px-1.5 py-0.2 rounded-md ml-1">
                  PRO
                </span>
              )}
            </button>

            <button
              onClick={() => {
                if (!isPro) {
                  onOpenPaywall?.();
                  return;
                }
                setShowCreateModal(true);
              }}
              className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 text-xs font-bold shadow-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Card</span>
            </button>
          </div>
        </div>

        {/* Filter, Search & Progress Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Course Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {courseOptions.map((opt) => (
              <button
                key={opt.code}
                onClick={() => setSelectedCourse(opt.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCourse === opt.code
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search Input & Shuffle */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="relative flex-1 sm:w-48">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <button
              onClick={handleShuffle}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              title="Shuffle Cards"
            >
              <Shuffle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* FLASHCARD INTERACTIVE 3D VIEWER */}
      {filteredCards.length > 0 && currentCard ? (
        <div className="flex flex-col items-center space-y-5">
          {/* Card Container with 3D Flip */}
          <div
            onClick={handleFlip}
            className="perspective-1000 w-full max-w-2xl cursor-pointer select-none group"
            style={{ minHeight: "340px" }}
          >
            <div
              className={`relative w-full h-full min-h-[340px] rounded-3xl transition-transform duration-500 transform-style-preserve-3d shadow-xl ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* FRONT SIDE */}
              <div className="absolute inset-0 backface-hidden rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-[#131B2E] dark:to-[#0B0F19] p-6 sm:p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-xs font-black border border-purple-200 dark:border-purple-800">
                      {currentCard.courseCode}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {currentCard.deckTitle}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {currentCard.mastered && (
                      <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <Check className="h-3 w-3" />
                        <span>Mastered</span>
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                        currentCard.difficulty === "HARD"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          : currentCard.difficulty === "EASY"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {currentCard.difficulty}
                    </span>
                  </div>
                </div>

                {/* Question / Prompt Center Content */}
                <div className="my-auto py-6 text-center space-y-3">
                  <div className="text-[11px] uppercase tracking-widest text-slate-400 font-extrabold">
                    QUESTION / PROMPT
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-relaxed max-w-xl mx-auto">
                    {currentCard.front}
                  </h3>
                </div>

                {/* Footer Hint */}
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex items-center space-x-1">
                    {currentCard.tags.map((t, idx) => (
                      <span key={idx} className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 group-hover:underline">
                    <RotateCw className="h-3.5 w-3.5" /> Click or Space to Reveal Answer
                  </span>
                </div>
              </div>

              {/* BACK SIDE */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-b from-purple-50/50 via-white to-slate-50 dark:from-[#1E1B4B] dark:via-[#131B2E] dark:to-[#0B0F19] p-6 sm:p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-black">
                      {currentCard.courseCode} · Answer
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCard(currentCard.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition cursor-pointer"
                    title="Delete Card"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Answer Center Content */}
                <div className="my-auto py-6 text-center space-y-3">
                  <div className="text-[11px] uppercase tracking-widest text-purple-600 dark:text-purple-400 font-extrabold">
                    ANSWER &amp; EXPLANATION
                  </div>
                  <div className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 leading-relaxed max-w-xl mx-auto whitespace-pre-line">
                    {currentCard.back}
                  </div>
                </div>

                {/* Back Controls (Mark Mastered vs Needs Review) */}
                <div className="flex items-center justify-between border-t border-purple-100 dark:border-purple-900/60 pt-3 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleMastery(currentCard.id, true);
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-bold transition cursor-pointer"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    <span>Study Again</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleMastery(currentCard.id, false);
                    }}
                    className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Got It! (Mark Mastered)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Bar & Progress Indicator */}
          <div className="w-full max-w-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Prev / Next & Flip Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                title="Previous Card (Left Arrow)"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={handleFlip}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-xs font-bold border border-purple-200 dark:border-purple-800 transition cursor-pointer"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>{isFlipped ? "Show Question" : "Flip Card"}</span>
              </button>

              <button
                onClick={handleNext}
                className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                title="Next Card (Right Arrow)"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Counter & Progress Bar */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                  Card {currentIndex + 1} of {filteredCards.length}
                </div>
                <div className="text-[10px] text-slate-400">
                  {masteredCount} mastered ({progressPercent}%)
                </div>
              </div>

              {/* Mini Progress Bar */}
              <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-4 bg-white/50 dark:bg-[#131B2E]/50">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 text-2xl">
            <BookOpen className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">No Flashcards Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
              {searchQuery
                ? "No flashcards match your search criteria. Try a different search or clear the filter."
                : "Create your first flashcard manually or generate a complete exam prep deck with Gemini AI."}
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer"
            >
              Add Card
            </button>
            <button
              onClick={() => setShowAiModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold cursor-pointer"
            >
              Generate with AI
            </button>
          </div>
        </div>
      )}

      {/* CREATE FLASHCARD MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                  +
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Create New Flashcard</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Course / Subject
                  </label>
                  <select
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="w-full text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none p-2.5 text-slate-900 dark:text-white font-bold outline-none"
                  >
                    <option value="CS 2110">CS 2110: OOP &amp; Data Structures</option>
                    <option value="CHEM 2070">CHEM 2070: General Chemistry</option>
                    <option value="ECON 1110">ECON 1110: Microeconomics</option>
                    <option value="CUSTOM">Custom Course</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none p-2.5 text-slate-900 dark:text-white font-bold outline-none"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Front Side (Question, Concept, or Formula)
                </label>
                <textarea
                  required
                  rows={3}
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="e.g. What is the time complexity of QuickSort in the average case?"
                  className="w-full text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none p-3 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Back Side (Answer, Explanation, or Proof)
                </label>
                <textarea
                  required
                  rows={3}
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder="e.g. O(n log n) average. Worst case is O(n^2) when chosen pivot is the minimum or maximum element."
                  className="w-full text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none p-3 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Sorting, Algorithms, Exam1"
                  className="w-full text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none p-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-xs hover:bg-purple-700 transition cursor-pointer"
                >
                  Save Flashcard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI FLASHCARD GENERATOR MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">AI Flashcard Generator</h3>
                  <p className="text-[11px] text-slate-400">Powered by Google Gemini 2.0</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleGenerateAi} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Course
                </label>
                <select
                  value={aiCourse}
                  onChange={(e) => setAiCourse(e.target.value)}
                  className="w-full text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none p-2.5 text-slate-900 dark:text-white font-bold outline-none"
                >
                  <option value="CS 2110">CS 2110: OOP &amp; Data Structures</option>
                  <option value="CHEM 2070">CHEM 2070: General Chemistry</option>
                  <option value="ECON 1110">ECON 1110: Microeconomics</option>
                  <option value="GENERAL">General Topic</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Topic, Chapter, or Syllabus Section
                </label>
                <input
                  required
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. Binary Search Trees &amp; AVL Rotations, or Acid-Base Equilibrium"
                  className="w-full text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none p-3 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/60 p-3 rounded-2xl border border-purple-200 dark:border-purple-800/80 text-xs text-purple-900 dark:text-purple-200 space-y-1">
                <div className="font-extrabold flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span>How it works:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  Gemini analyzes core syllabus exam concepts for this topic and generates 4 high-yield study cards automatically saved to your deck.
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  disabled={isGeneratingAi}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingAi}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:opacity-90 transition cursor-pointer flex items-center space-x-2"
                >
                  {isGeneratingAi ? (
                    <>
                      <RotateCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Generating Decks...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Generate 4 Flashcards</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
