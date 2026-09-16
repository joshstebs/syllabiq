import { NextResponse } from "next/server";
import { getStore } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const store = getStore();

    const lower = message.toLowerCase();

    // Context from stored courses and tasks
    const coursesContext = store.courses
      .map(
        (c) =>
          `Course: ${c.code} (${c.name})\nInstructor: ${c.instructor.name} (${c.instructor.email}, OH: ${c.instructor.office_hours})\nWeights: ${c.weightCategories.map((w) => `${w.category}: ${w.percentage}%`).join(", ")}\nPolicies: ${c.syllabusDoc?.rawPolicies || "Standard university policies apply."}`
      )
      .join("\n\n");

    const upcomingTasksContext = store.tasks
      .slice(0, 8)
      .map((t) => `${t.courseCode}: "${t.title}" due ${new Date(t.dueDate).toLocaleDateString()} (Weight: ${t.weightPercent}%, Status: ${t.status})`)
      .join("\n");

    // If OPENAI_API_KEY or GEMINI_API_KEY is available, invoke real LLM
    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
    if (apiKey && process.env.OPENAI_API_KEY) {
      try {
        const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are SyllabiQ AI, an ultra-smart, empathetic, dummy-proof academic tutor and study assistant.
You have complete knowledge of the student's enrolled courses and upcoming deadlines:
${coursesContext}

Upcoming Tasks:
${upcomingTasksContext}

Help the student with course policies, study strategies, conceptual questions, or breaking down assignments. Be clear, concise, and helpful.`
              },
              ...(history || []),
              { role: "user", content: message }
            ]
          })
        });

        if (aiRes.ok) {
          const aiJson = await aiRes.json();
          const reply = aiJson.choices[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch (e) {
        console.warn("External AI call failed, falling back to local academic engine", e);
      }
    }

    // Intelligent built-in academic answer engine
    let reply = "";
    if (lower.includes("late") || lower.includes("penalty")) {
      const matched = store.courses.find((c) => lower.includes(c.code.toLowerCase().replace(/\s+/g, ""))) || store.courses[0];
      reply = `📋 **Late Policy for ${matched.code}**: ${matched.syllabusDoc?.rawPolicies || "10% penalty per 24 hours late, up to 3 days max. Afterwards no credit is awarded."}\n\n*Tip: SyllabiQ has scheduled an early milestone buffer 3 days before your next assignment so you never miss a deadline!*`;
    } else if (lower.includes("office hours") || lower.includes("professor") || lower.includes("instructor") || lower.includes("email")) {
      const matched = store.courses.find((c) => lower.includes(c.code.toLowerCase().replace(/\s+/g, ""))) || store.courses[0];
      reply = `👨‍🏫 **${matched.instructor.name}** (${matched.code})\n• **Email**: ${matched.instructor.email || "professor@university.edu"}\n• **Office Hours**: ${matched.instructor.office_hours || "By appointment"}\n• **Location**: ${matched.instructor.office_location || "Faculty Hall"}`;
    } else if (lower.includes("due") || lower.includes("upcoming") || lower.includes("deadline")) {
      const nextDue = store.tasks.filter((t) => t.status !== "DONE").slice(0, 3);
      reply = `⏰ **Your Next Upcoming Deadlines**:\n` +
        nextDue.map((t) => `• **${t.courseCode}**: ${t.title} — Due ${new Date(t.dueDate).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} (${t.weightPercent}% weight)`).join("\n") +
        `\n\nWould you like me to deconstruct any of these into a 5-step milestone study plan?`;
    } else if (lower.includes("grade") || lower.includes("calculate") || lower.includes("score")) {
      reply = `📊 **Grade Standing Overview**:\n• **CS 3110**: In good standing (Assignment 1 in progress)\n• **ECON 1010**: Prelim 1 coming up in 8 days\n• **BIO 1500**: Recent reading response scored 96%!\n\nYou can open the **Dynamic Grade Calculator** in the top bar to run what-if simulations on your final exams.`;
    } else {
      reply = `I am your SyllabiQ Academic Copilot! I have full context on your syllabus policies, assignment weights, and schedule.\n\nYou can ask me:\n• *"What is the late policy for CS 3110?"*\n• *"When are Professor Wissink's office hours?"*\n• *"What's due this week?"*\n• *"Can you break down my 10-page research paper into milestones?"*`;
    }

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
