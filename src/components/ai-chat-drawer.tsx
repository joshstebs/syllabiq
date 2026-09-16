"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, X, User, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "🦉 **Hoo goes there! I'm Syllabird**, your AI academic assistant.\n\nI have read all your course syllabi, grading rubrics, and deadlines. Ask me anything about course rules, office hours, or ask me to break down an assignment!"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const newMsgs: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: newMsgs.map((m) => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get reply");

      setMessages([...newMsgs, { role: "assistant", content: data.reply }]);
    } catch (err: any) {
      setMessages([
        ...newMsgs,
        { role: "assistant", content: `⚠️ Error: ${err.message}. Please try again.` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "What is the late policy for CS 3110?",
    "When are Professor Wissink's office hours?",
    "What's due in the next 48 hours?",
    "Break down my 10-page paper into steps"
  ];

  return (
    <>
      {/* Floating Mascot Button matching Due Gooder's Duey character */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 z-40 flex items-center space-x-2.5 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 p-2 sm:px-4 sm:py-2 text-slate-800 dark:text-slate-200 shadow-xl hover:shadow-2xl transition cursor-pointer"
      >
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 border border-blue-200 text-xl">
          🦉
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
        </div>
        <div className="text-left hidden sm:block">
          <span className="text-xs font-black text-slate-900 block leading-tight">Ask Syllabird</span>
          <span className="text-[10px] text-blue-600 font-bold block">AI Study Buddy</span>
        </div>
      </motion.button>

      {/* Chat Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[560px] rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl shadow-xs">
                  🦉
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h4 className="text-xs font-extrabold text-slate-900">Syllabird AI</h4>
                    <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.2 text-[9px] font-bold border border-emerald-200">
                      ONLINE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">Your 24/7 personal syllabus & tutor copilot</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#F8FAFC]">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-start space-x-2 ${m.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-white text-[11px] font-bold ${
                      m.role === "user" ? "bg-blue-600" : "bg-blue-100 text-slate-900 border border-blue-200"
                    }`}
                  >
                    {m.role === "user" ? <User className="h-4 w-4" /> : "🦉"}
                  </div>

                  <div
                    className={`rounded-2xl p-3.5 max-w-[82%] leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none shadow-xs"
                        : "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center space-x-2 text-slate-500 text-xs">
                  <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-sm">
                    🦉
                  </div>
                  <span className="animate-pulse text-[11px] font-semibold text-blue-600">Syllabird is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto">
              {quickPrompts.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-3 py-1 text-[11px] font-semibold whitespace-nowrap border border-slate-200 transition shrink-0 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about late policies, office hours, or concepts..."
                className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 border border-slate-200 focus:outline-none focus:border-blue-500 transition"
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="rounded-xl bg-blue-600 p-2.5 text-white shadow-xs hover:bg-blue-700 transition disabled:opacity-50 shrink-0 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
