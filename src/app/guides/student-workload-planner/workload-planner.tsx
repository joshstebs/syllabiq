"use client";

import { useMemo, useState } from "react";

type Task = { id: number; name: string; hours: number };

export default function WorkloadPlanner() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: "Major assignment", hours: 6 },
    { id: 2, name: "Reading and notes", hours: 3 },
    { id: 3, name: "Quiz review", hours: 2 },
  ]);
  const [availableHours, setAvailableHours] = useState(12);
  const [studyDays, setStudyDays] = useState(5);
  const totalHours = useMemo(() => tasks.reduce((sum, task) => sum + Math.max(0, task.hours || 0), 0), [tasks]);
  const remaining = availableHours - totalHours;
  const dailyAverage = studyDays > 0 ? totalHours / studyDays : 0;

  function updateTask(id: number, field: "name" | "hours", value: string) {
    setTasks(current => current.map(task => task.id === id ? { ...task, [field]: field === "hours" ? Number(value) : value } : task));
  }
  function addTask() {
    setTasks(current => current.length >= 8 ? current : [...current, { id: Math.max(0, ...current.map(task => task.id)) + 1, name: "", hours: 1 }]);
  }
  function removeTask(id: number) {
    setTasks(current => current.length === 1 ? current : current.filter(task => task.id !== id));
  }

  return <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-900" aria-labelledby="planner-heading">
    <h2 id="planner-heading" className="text-2xl font-black text-slate-950 dark:text-white">Build this week's workload estimate</h2>
    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Enter your own estimates. The calculator stays in this browser session and does not predict grades, completion time or deadline safety.</p>
    <div className="mt-6 space-y-3">
      {tasks.map((task, index) => <div key={task.id} className="grid gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-[1fr_9rem_auto] sm:items-end dark:border-slate-700">
        <label className="text-sm font-semibold">Task {index + 1}<input className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 dark:border-slate-600 dark:bg-slate-950 dark:text-white" value={task.name} onChange={event => updateTask(task.id, "name", event.target.value)} placeholder="Task name" /></label>
        <label className="text-sm font-semibold">Estimated hours<input className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 dark:border-slate-600 dark:bg-slate-950 dark:text-white" type="number" min="0" max="100" step="0.5" value={task.hours} onChange={event => updateTask(task.id, "hours", event.target.value)} /></label>
        <button type="button" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold hover:bg-slate-100 disabled:opacity-40 dark:border-slate-600 dark:hover:bg-slate-800" onClick={() => removeTask(task.id)} disabled={tasks.length === 1}>Remove</button>
      </div>)}
    </div>
    <button type="button" className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40" onClick={addTask} disabled={tasks.length >= 8}>Add task</button>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-semibold">Hours realistically available this week<input className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 dark:border-slate-600 dark:bg-slate-950 dark:text-white" type="number" min="0" max="168" step="0.5" value={availableHours} onChange={event => setAvailableHours(Number(event.target.value))} /></label>
      <label className="text-sm font-semibold">Days available for this work<input className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 dark:border-slate-600 dark:bg-slate-950 dark:text-white" type="number" min="1" max="7" step="1" value={studyDays} onChange={event => setStudyDays(Math.max(1, Number(event.target.value)))} /></label>
    </div>
    <div className="mt-6 rounded-xl bg-slate-100 p-5 dark:bg-slate-950" aria-live="polite">
      <p className="text-3xl font-black text-slate-950 dark:text-white">{totalHours.toFixed(1)} estimated hours</p>
      <p className="mt-2">About {dailyAverage.toFixed(1)} hours per selected day.</p>
      {remaining >= 0 ? <p className="mt-2 font-semibold text-emerald-700 dark:text-emerald-300">Your estimate leaves {remaining.toFixed(1)} unallocated hours.</p> : <p className="mt-2 font-semibold text-amber-700 dark:text-amber-300">Your estimate exceeds your available time by {Math.abs(remaining).toFixed(1)} hours. Reduce scope, move optional work, start earlier or ask for guidance before the conflict becomes urgent.</p>}
    </div>
  </section>;
}
