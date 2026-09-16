"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Table2, ExternalLink, RefreshCw, CheckCircle2, ArrowRightLeft, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  onClose: () => void;
  onSyncUpdated: () => void;
}

export function GoogleSheetsModal({ onClose, onSyncUpdated }: Props) {
  const [sheetData, setSheetData] = useState<{ headers: string[]; rows: (string | number)[][] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedTaskTitle, setSimulatedTaskTitle] = useState("");

  const loadData = async () => {
    try {
      const res = await fetch("/api/google/sync");
      const data = await res.json();
      if (data.sheetData) {
        setSheetData(data.sheetData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const simulateSheetUpdate = async () => {
    if (!sheetData?.rows.length) return;
    setIsSimulating(true);

    try {
      const firstRow = sheetData.rows[0];
      const taskId = String(firstRow[8]);
      const currentStatus = String(firstRow[6]);
      const nextStatus = currentStatus === "DONE" ? "IN_PROGRESS" : "DONE";
      const newGrade = nextStatus === "DONE" ? 98 : null;

      const res = await fetch("/api/google/sheets-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          newStatus: nextStatus,
          newGrade
        })
      });

      if (!res.ok) throw new Error("Webhook update failed");
      await res.json();

      setSimulatedTaskTitle(String(firstRow[1]));
      await loadData();
      onSyncUpdated();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch (err: any) {
      alert(`Simulation error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col justify-between"
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 text-xl shadow-xs">
                📊
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Google Sheets Master Tracker</h3>
                <p className="text-xs text-slate-500 font-medium">Two-way bidirectional synchronization with Apps Script triggers</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href="https://docs.google.com/spreadsheets/d/1SyLLabiQ_MasterTracker_AutoProv/edit"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 border border-slate-200 transition"
              >
                <span>Open in Google Sheets</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-2 rounded-full cursor-pointer">✕</button>
            </div>
          </div>

          {/* Banner */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-emerald-900">
              <ArrowRightLeft className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                <strong>Live Two-Way Bridge:</strong> Changing any status to DONE or logging test scores in Google Sheets immediately syncs back into SyllabiQ and your calendar.
              </span>
            </div>

            <button
              onClick={simulateSheetUpdate}
              disabled={isSimulating || !sheetData?.rows.length}
              className="flex items-center space-x-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-emerald-700 transition disabled:opacity-50 shrink-0 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isSimulating ? "Syncing Webhook..." : "Test 2-Way Sheet Edit"}</span>
            </button>
          </div>

          {simulatedTaskTitle && (
            <div className="text-xs text-emerald-800 bg-emerald-100/70 px-3.5 py-2 rounded-xl border border-emerald-200 font-semibold animate-fade-in">
              ⚡ Webhook Synchronized: Updated "{simulatedTaskTitle}" from Google Sheets.
            </div>
          )}

          {/* Table Container */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white max-h-[380px] overflow-y-auto shadow-2xs">
            {isLoading ? (
              <div className="py-16 text-center text-slate-500 text-xs flex items-center justify-center space-x-2">
                <RefreshCw className="h-4 w-4 animate-spin text-emerald-600" />
                <span>Loading Master Tracker rows...</span>
              </div>
            ) : sheetData ? (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 sticky top-0 font-bold">
                    {sheetData.headers.map((h, i) => (
                      <th key={i} className="p-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {sheetData.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50 transition">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 whitespace-nowrap">
                          {cIdx === 6 ? (
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                cell === "DONE"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : cell === "IN_PROGRESS"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {cell}
                            </span>
                          ) : (
                            String(cell)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <span className="text-xs text-slate-400 font-medium">Columns: Course | Title | Type | Due Date | Est Hours | Weight % | Status | Grade | Event ID</span>
          <button onClick={onClose} className="px-5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
