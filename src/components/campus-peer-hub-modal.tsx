"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Users,
  Share2,
  ThumbsUp,
  BookOpen,
  Sparkles,
  School,
  Plus,
  Copy,
  Check,
  MessageSquare,
  FileText
} from "lucide-react";
import confetti from "canvas-confetti";
import { Course, SharedNote } from "@/lib/types";

interface Props {
  courses: Course[];
  onClose: () => void;
}

export function CampusPeerHubModal({ courses, onClose }: Props) {
  const [university, setUniversity] = useState("Cornell University");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("ALL");
  const [universities, setUniversities] = useState<string[]>([]);
  const [classmates, setClassmates] = useState<any[]>([]);
  const [notes, setNotes] = useState<SharedNote[]>([]);
  const [showShareForm, setShowShareForm] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // New note form state
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<SharedNote["type"]>("homework_hints");
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || "course-cs3110");
  const [newContent, setNewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPeerData = async () => {
    try {
      const url = `/api/peers?university=${encodeURIComponent(university)}${
        selectedCourseId !== "ALL" ? `&courseId=${selectedCourseId}` : ""
      }`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setUniversities(data.universities || []);
        setClassmates(data.classmates || []);
        setNotes(data.notes || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPeerData();
  }, [university, selectedCourseId]);

  const handleUpvote = async (noteId: string) => {
    try {
      const res = await fetch("/api/peers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upvote", noteId })
      });
      if (res.ok) {
        const data = await res.json();
        setNotes((prev) =>
          prev.map((n) => (n.id === noteId ? data.note : n))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = (noteId: string) => {
    const link = `https://syllabiq.app/notes/${noteId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(noteId);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handlePostNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    try {
      const course = courses.find((c) => c.id === newCourseId);
      const res = await fetch("/api/peers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_note",
          courseId: newCourseId,
          courseCode: course?.code || "CS 3110",
          title: newTitle,
          type: newType,
          content: newContent,
          authorName: "Alex Student (You)",
          authorUniversity: university,
          tags: [course?.code || "Class", "Study"]
        })
      });

      if (res.ok) {
        confetti({ particleCount: 50, spread: 60 });
        setNewTitle("");
        setNewContent("");
        setShowShareForm(false);
        await fetchPeerData();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header with Campus Photo Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white shadow-xs">
          <img
            src="/images/student-group.jpg"
            alt="Students collaborating together on campus"
            className="w-full h-32 object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-5 flex flex-col justify-end">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold uppercase tracking-wider w-fit mb-1">
              <Users className="h-3 w-3 text-emerald-400" />
              <span>Campus Peer Study Circles</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Share Homework &amp; Notes with Classmates
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              Collaborate with students in your courses at {university}. 100% Honor Code compliant.
            </p>
          </div>
        </div>

        {/* University & Course Filter Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <School className="h-4 w-4 text-slate-400" />
            <select
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              aria-label="Select University"
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-2xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {universities.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowShareForm(!showShareForm)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2 shadow-xs transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{showShareForm ? "Close Form" : "Share Notes / PSet Hints"}</span>
          </button>
        </div>

        {/* Classmates Active In Your Section with Real Photos */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Classmates Active in {university}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {classmates.length} Peers Online
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            {classmates.map((cm) => (
              <div
                key={cm.id}
                className="flex items-center gap-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 shadow-2xs hover:border-emerald-300 transition"
              >
                {cm.photoUrl ? (
                  <img
                    src={cm.photoUrl}
                    alt={cm.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                ) : (
                  <span className="text-lg">{cm.avatar}</span>
                )}
                <div className="leading-tight">
                  <div className="text-xs font-black text-slate-900 dark:text-white">{cm.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[120px]">
                    {cm.major}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share New Note Form Drawer */}
        {showShareForm && (
          <form
            onSubmit={handlePostNote}
            className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-5 space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-emerald-950">
                Post Study Note or Homework Hints to Class Feed
              </h4>
              <span className="text-xs text-emerald-700 font-bold">100% Integrity Safe</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Select Course
                </label>
                <select
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
                  className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Note Category
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="homework_hints">💡 Homework / Problem Set Hints</option>
                  <option value="study_guide">📚 Exam Study Guide</option>
                  <option value="lecture_summary">🎙️ Lecture Takeaways &amp; Audio Summary</option>
                  <option value="exam_prep">🎯 Practice Exam Solutions</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. CS 3110 PSet 2: OCaml Tree Map Boundary Cases"
                className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Content &amp; Hints (Markdown supported)
              </label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={3}
                placeholder="Share helpful conceptual hints, formula derivations, or lecture summaries..."
                className="w-full rounded-xl border border-emerald-200 bg-white p-3 text-xs font-medium text-slate-800 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowShareForm(false)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-xs font-extrabold transition shadow-xs"
              >
                {isSubmitting ? "Posting..." : "Publish to Classmates"}
              </button>
            </div>
          </form>
        )}

        {/* Course Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
          <button
            onClick={() => setSelectedCourseId("ALL")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedCourseId === "ALL"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Courses ({notes.length})
          </button>

          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCourseId(c.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCourseId === c.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: c.colorHex }}
              />
              <span>{c.code}</span>
            </button>
          ))}
        </div>

        {/* Shared Notes Community Feed */}
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3 shadow-2xs hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      {note.courseCode}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        note.type === "homework_hints"
                          ? "bg-amber-100 text-amber-800"
                          : note.type === "study_guide"
                          ? "bg-blue-100 text-blue-800"
                          : note.type === "exam_prep"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {note.type.replace("_", " ")}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                    {note.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 font-medium">
                    Posted by <strong className="text-slate-700">{note.authorName}</strong> · {note.authorUniversity}
                  </p>
                </div>

                {/* Upvote & Share buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleUpvote(note.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      note.hasUpvoted
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-2xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{note.upvotes}</span>
                  </button>

                  <button
                    onClick={() => handleCopyLink(note.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                    title="Copy direct share link"
                  >
                    {copiedLink === note.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Share2 className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedLink === note.id ? "Copied!" : "Share"}</span>
                  </button>
                </div>
              </div>

              {/* Note Content */}
              <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 font-medium leading-relaxed border border-slate-100">
                {note.content}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {note.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {notes.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs">
              No notes posted for this course yet. Be the first to share notes or homework hints!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
