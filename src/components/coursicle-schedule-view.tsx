"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon, Clock, MapPin, X, Check } from "lucide-react";
import { Course, TaskItem } from "@/lib/types";

interface ScheduleBlock {
  id: string;
  courseCode: string;
  courseName: string;
  room: string;
  dayOfWeek: number; // 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri
  startHour: number; // e.g. 8.5 for 8:30am
  durationHours: number; // e.g. 1.25 for 1h15m
  color: "pink" | "blue" | "green" | "yellow" | "purple" | "peach";
}

const DEFAULT_BLOCKS: ScheduleBlock[] = [
  {
    id: "block-1",
    courseCode: "CS 3110",
    courseName: "Functional Programming",
    room: "Gates Hall 314",
    dayOfWeek: 1, // Mon
    startHour: 8.5, // 8:30am
    durationHours: 1.25,
    color: "pink"
  },
  {
    id: "block-2",
    courseCode: "CS 3110",
    courseName: "Functional Programming",
    room: "Gates Hall 314",
    dayOfWeek: 3, // Wed
    startHour: 8.5,
    durationHours: 1.25,
    color: "pink"
  },
  {
    id: "block-3",
    courseCode: "BIO 1500",
    courseName: "Cellular Biology Lab",
    room: "Corson Hall 210",
    dayOfWeek: 1, // Mon
    startHour: 10.25, // 10:15am
    durationHours: 2.25,
    color: "blue"
  },
  {
    id: "block-4",
    courseCode: "MATH 2210",
    courseName: "Linear Algebra",
    room: "Phillips Hall 332",
    dayOfWeek: 2, // Tue
    startHour: 10.0, // 10:00am
    durationHours: 1.25,
    color: "green"
  },
  {
    id: "block-5",
    courseCode: "MATH 2210",
    courseName: "Linear Algebra",
    room: "Phillips Hall 332",
    dayOfWeek: 4, // Thu
    startHour: 10.0,
    durationHours: 1.25,
    color: "green"
  },
  {
    id: "block-6",
    courseCode: "Lunch Break",
    courseName: "Campus Dining",
    room: "Willard Straight",
    dayOfWeek: 1, // Mon
    startHour: 12.75, // 12:45pm
    durationHours: 1.0,
    color: "yellow"
  },
  {
    id: "block-7",
    courseCode: "Lunch Break",
    courseName: "Campus Dining",
    room: "Willard Straight",
    dayOfWeek: 2, // Tue
    startHour: 11.5, // 11:30am
    durationHours: 0.75,
    color: "yellow"
  },
  {
    id: "block-8",
    courseCode: "Lunch Break",
    courseName: "Campus Dining",
    room: "Willard Straight",
    dayOfWeek: 3, // Wed
    startHour: 12.0, // 12:00pm
    durationHours: 0.75,
    color: "yellow"
  },
  {
    id: "block-9",
    courseCode: "ECON 1010",
    courseName: "Microeconomics",
    room: "Uris Hall 468",
    dayOfWeek: 2, // Tue
    startHour: 12.5, // 12:30pm
    durationHours: 1.25,
    color: "purple"
  },
  {
    id: "block-10",
    courseCode: "ECON 1010",
    courseName: "Microeconomics",
    room: "Uris Hall 468",
    dayOfWeek: 4, // Thu
    startHour: 12.5,
    durationHours: 1.25,
    color: "purple"
  },
  {
    id: "block-11",
    courseCode: "Campus Job",
    courseName: "TAs & Peer Tutoring",
    room: "Library Lab",
    dayOfWeek: 2, // Tue
    startHour: 14.4, // 2:25pm
    durationHours: 1.5,
    color: "peach"
  },
  {
    id: "block-12",
    courseCode: "Campus Job",
    courseName: "TAs & Peer Tutoring",
    room: "Library Lab",
    dayOfWeek: 4, // Thu
    startHour: 14.4,
    durationHours: 1.5,
    color: "peach"
  }
];

const COLOR_STYLES = {
  pink: "bg-[#FFE4E6] border-[#FDA4AF] text-[#9F1239] hover:bg-[#FECDD3]",
  blue: "bg-[#DBEAFE] border-[#93C5FD] text-[#1E40AF] hover:bg-[#BFDBFE]",
  green: "bg-[#DCFCE7] border-[#86EFAC] text-[#166534] hover:bg-[#BBF7D0]",
  yellow: "bg-[#FEF9C3] border-[#FDE047] text-[#854D0E] hover:bg-[#FEF08A]",
  purple: "bg-[#F3E8FF] border-[#D8B4FE] text-[#6B21A8] hover:bg-[#E9D5FF]",
  peach: "bg-[#FFEDD5] border-[#FDBA74] text-[#9A3412] hover:bg-[#FED7AA]"
};

const SWATCH_BG = {
  pink: "bg-[#FDA4AF]",
  blue: "bg-[#93C5FD]",
  green: "bg-[#86EFAC]",
  yellow: "bg-[#FDE047]",
  purple: "bg-[#D8B4FE]",
  peach: "bg-[#FDBA74]"
};

export function CoursicleScheduleView() {
  const [blocks, setBlocks] = useState<ScheduleBlock[]>(DEFAULT_BLOCKS);
  const [selectedDayIndex, setSelectedDayIndex] = useState(10); // July 10
  const [eventTitle, setEventTitle] = useState("");
  const [eventRoom, setEventRoom] = useState("");
  const [selectedColor, setSelectedColor] = useState<"pink" | "blue" | "green" | "yellow" | "purple" | "peach">("pink");
  const [startTime, setStartTime] = useState("10:00am");
  const [endTime, setEndTime] = useState("11:00am");
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(1);

  const days = [
    { name: "Mon", date: "9/15", dayNum: 1 },
    { name: "Tue", date: "9/16", dayNum: 2 },
    { name: "Wed", date: "9/17", dayNum: 3 },
    { name: "Thu", date: "9/18", dayNum: 4 },
    { name: "Fri", date: "9/19", dayNum: 5 }
  ];

  const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  const handleAddEvent = () => {
    if (!eventTitle.trim()) return;

    // Parse start time hour
    let startH = 10.0;
    if (startTime.includes("8")) startH = 8.5;
    else if (startTime.includes("9")) startH = 9.0;
    else if (startTime.includes("11")) startH = 11.0;
    else if (startTime.includes("12")) startH = 12.0;
    else if (startTime.includes("1")) startH = 13.0;
    else if (startTime.includes("2")) startH = 14.0;
    else if (startTime.includes("3")) startH = 15.0;

    const newBlock: ScheduleBlock = {
      id: `block-${Date.now()}`,
      courseCode: eventTitle.slice(0, 12).toUpperCase(),
      courseName: eventTitle,
      room: eventRoom || "Campus Hall",
      dayOfWeek: selectedDayOfWeek,
      startHour: startH,
      durationHours: 1.25,
      color: selectedColor
    };

    setBlocks([...blocks, newBlock]);
    setEventTitle("");
    setEventRoom("");
  };

  const removeBlock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
      {/* Top Header matching Media 2 */}
      <div className="border-b border-slate-200 p-4 sm:px-6 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black italic tracking-tighter text-blue-600">
              Syllabi<span className="text-indigo-600">Q</span>
            </span>
            <span className="text-xs font-bold text-slate-400">Timetable Grid</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-200 shadow-2xs">
            <span>Primary</span>
          </button>
          <button
            onClick={() => setEventTitle("Study Session")}
            className="flex items-center space-x-1 text-xs font-extrabold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Add Event</span>
          </button>
          <span className="text-xs font-semibold text-slate-400 pl-3 hidden sm:inline">Fall 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT PANEL: New Event & Mini Calendar (Media 2 style) */}
        <div className="lg:col-span-4 border-r border-slate-200 p-5 space-y-5 bg-white">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center space-x-2">
              <div className={`h-4 w-4 rounded-full ${SWATCH_BG[selectedColor]} border border-black/10`} />
              <h3 className="text-base font-black text-slate-900">New Event</h3>
            </div>
            <button
              onClick={() => {
                setEventTitle("");
                setEventRoom("");
              }}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Color swatch picker */}
          <div className="flex items-center space-x-2">
            {(["pink", "blue", "green", "yellow", "purple", "peach"] as const).map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`h-6 w-6 rounded-full ${SWATCH_BG[color]} border transition cursor-pointer flex items-center justify-center ${
                  selectedColor === color ? "ring-2 ring-blue-600 ring-offset-2" : "opacity-80 hover:opacity-100"
                }`}
              >
                {selectedColor === color && <Check className="h-3 w-3 text-slate-900 stroke-[3]" />}
              </button>
            ))}
          </div>

          {/* Title input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-slate-400">Title</label>
            <input
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="e.g. Study for bio midterm"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
            />
          </div>

          {/* Room input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-slate-400">Location / Room</label>
            <input
              value={eventRoom}
              onChange={(e) => setEventRoom(e.target.value)}
              placeholder="e.g. Uris Library 204"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
            />
          </div>

          {/* Mini Interactive Month Calendar (Media 2) */}
          <div className="rounded-2xl border border-slate-200 p-3 bg-slate-50/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <button className="p-1 hover:bg-slate-200 rounded">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span>September 2026</span>
              <button className="p-1 hover:bg-slate-200 rounded">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 pb-1">
              <span>S</span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-700">
              {[
                null, null, 1, 2, 3, 4, 5,
                6, 7, 8, 9, 10, 11, 12,
                13, 14, 15, 16, 17, 18, 19,
                20, 21, 22, 23, 24, 25, 26,
                27, 28, 29, 30
              ].map((day, idx) => (
                <div key={idx} className="flex justify-center">
                  {day !== null ? (
                    <button
                      onClick={() => {
                        setSelectedDayIndex(day);
                        setSelectedDayOfWeek(((day - 1) % 5) + 1);
                      }}
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold transition cursor-pointer ${
                        selectedDayIndex === day
                          ? "bg-blue-600 text-white shadow-xs"
                          : "hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {day}
                    </button>
                  ) : (
                    <div className="h-6 w-6" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Starts & Ends Inputs (Media 2) */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-600">Starts</span>
              <input
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-24 rounded-lg border border-slate-300 px-2.5 py-1 text-center font-bold text-slate-800"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-600">Ends</span>
              <input
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-24 rounded-lg border border-slate-300 px-2.5 py-1 text-center font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Action Buttons (Media 2) */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setEventTitle("CHEM 101 Study Group");
                setEventRoom("Murray Hall G202");
                setSelectedColor("pink");
              }}
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              More options
            </button>
            <button
              onClick={handleAddEvent}
              className="rounded-full bg-blue-600 px-5 py-2 text-xs font-extrabold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition cursor-pointer"
            >
              Add Event
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Coursicle Timetable Grid (Media 2) */}
        <div className="lg:col-span-8 p-4 sm:p-6 overflow-x-auto bg-slate-50/30">
          {/* Multi-day Banner Event (Media 2: "Career Fair") */}
          <div className="mb-3 flex items-center justify-center">
            <div className="w-full max-w-sm bg-[#FFEDD5] border border-[#FDBA74] text-[#9A3412] text-xs font-extrabold py-1 px-4 rounded-full text-center shadow-2xs">
              🍁 Fall Campus Career & Internship Fair (All Week)
            </div>
          </div>

          {/* Header Days of Week */}
          <div className="grid grid-cols-6 border-b border-slate-200 pb-2 text-center text-xs">
            <div className="text-slate-400 font-bold"></div>
            {days.map((d) => (
              <div key={d.dayNum} className="space-y-0.5">
                <span className="block font-bold text-slate-700">{d.name}</span>
                <span className="block text-[11px] text-slate-400 font-semibold">{d.date}</span>
              </div>
            ))}
          </div>

          {/* Time Rows & Event Positioning Grid */}
          <div className="relative mt-2" style={{ height: "660px" }}>
            {/* Background Hour Lines */}
            {hours.map((h, i) => (
              <div
                key={h}
                style={{ top: `${i * 60}px` }}
                className="absolute left-0 right-0 flex items-center border-t border-slate-200/80 text-[11px] font-semibold text-slate-400"
              >
                <span className="w-12 pr-2 text-right">
                  {h > 12 ? `${h - 12}pm` : h === 12 ? "12pm" : `${h}am`}
                </span>
                <div className="flex-1 h-[1px] bg-slate-100" />
              </div>
            ))}

            {/* Red Live Time Indicator Line across Tuesday/Wednesday */}
            <div
              style={{ top: "270px" }} // ~11:30 AM
              className="absolute left-12 right-0 flex items-center z-10 pointer-events-none"
            >
              <div className="h-2 w-2 rounded-full bg-red-500 ring-4 ring-red-100" />
              <div className="h-[2px] w-full bg-red-500 shadow-xs" />
            </div>

            {/* Course Blocks overlay matching Media 2 */}
            <div className="absolute left-12 right-0 top-0 bottom-0 grid grid-cols-5 gap-2 px-1">
              {days.map((d) => {
                const dayBlocks = blocks.filter((b) => b.dayOfWeek === d.dayNum);

                return (
                  <div key={d.dayNum} className="relative h-full">
                    {dayBlocks.map((b) => {
                      const topOffset = (b.startHour - 7) * 60;
                      const height = b.durationHours * 60;

                      return (
                        <div
                          key={b.id}
                          style={{
                            top: `${topOffset}px`,
                            height: `${height}px`
                          }}
                          className={`absolute left-0 right-0 rounded-2xl border p-2.5 text-xs transition-all shadow-2xs cursor-pointer flex flex-col justify-between overflow-hidden group ${
                            COLOR_STYLES[b.color]
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between font-black text-xs leading-tight">
                              <span>{b.courseCode}</span>
                              <button
                                onClick={(e) => removeBlock(b.id, e)}
                                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-700 p-0.5"
                                title="Remove event"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="text-[10px] opacity-85 font-medium truncate mt-0.5">
                              {b.courseName}
                            </div>
                          </div>

                          <div className="text-[9px] opacity-75 font-semibold flex items-center gap-1 pt-1">
                            <MapPin className="h-2.5 w-2.5 shrink-0" />
                            <span className="truncate">{b.room}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
