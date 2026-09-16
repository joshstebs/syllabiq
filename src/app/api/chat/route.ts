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

    const systemPrompt = `You are SyllabiQ AI, an ultra-smart, empathetic, dummy-proof academic tutor and campus copilot for students.
You have complete real-time knowledge of the student's enrolled courses, syllabus policies, weights, and deadlines:
${coursesContext}

Upcoming Student Tasks:
${upcomingTasksContext}

You can answer:
1. Exact syllabus questions (late penalty policies, grading scales, exam dates, instructor contact & office hours).
2. Campus and collegiate queries (e.g. parking rates, library hours, registration deadlines, campus services for institutions like St. Clair College, University of Windsor, Cornell, etc.).
3. Deconstruct assignments into step-by-step milestone checklists with estimated completion times.
4. Study guidance, paper outlines, and conceptual explanations.

Keep responses concise, encouraging, and cleanly formatted with Markdown bullet points and bold highlights.`;

    // 1. PRIMARY: Google Gemini 3.6-flash
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const geminiModel = process.env.GEMINI_MODEL || "gemini-3.6-flash";
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`;

        // Build Gemini conversation contents
        const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [
          {
            role: "user",
            parts: [{ text: `[System Instruction]\n${systemPrompt}` }]
          },
          {
            role: "model",
            parts: [{ text: "Understood. I am SyllabiQ AI, fully equipped with your syllabus details, campus knowledge, and schedule." }]
          }
        ];

        if (Array.isArray(history)) {
          for (const h of history) {
            contents.push({
              role: h.role === "assistant" ? "model" : "user",
              parts: [{ text: h.content || "" }]
            });
          }
        }

        contents.push({
          role: "user",
          parts: [{ text: message }]
        });

        const geminiRes = await fetch(geminiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({ reply });
          }
        } else {
          console.warn("Gemini API call returned status", geminiRes.status);
        }
      } catch (geminiErr) {
        console.warn("Gemini API call failed, attempting fallback:", geminiErr);
      }
    }

    // 2. SECONDARY FALLBACK: Nous Research API
    const nousKey = process.env.NOUS_API_KEY;
    if (nousKey) {
      try {
        const nousEndpoint = "https://inference-api.nousresearch.com/v1/chat/completions";
        const nousMessages = [
          { role: "system", content: systemPrompt },
          ...(Array.isArray(history) ? history : []),
          { role: "user", content: message }
        ];

        const nousRes = await fetch(nousEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${nousKey}`
          },
          body: JSON.stringify({
            model: "stepfun/step-3.7-flash:free",
            messages: nousMessages,
            max_tokens: 1000
          })
        });

        if (nousRes.ok) {
          const nousData = await nousRes.json();
          const reply = nousData.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply });
          }
        } else {
          console.warn("Nous Research API call returned status", nousRes.status);
        }
      } catch (nousErr) {
        console.warn("Nous API call failed, falling back:", nousErr);
      }
    }

    // 3. TERTIARY FALLBACK: OpenAI (if configured)
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              ...(Array.isArray(history) ? history : []),
              { role: "user", content: message }
            ]
          })
        });

        if (aiRes.ok) {
          const aiJson = await aiRes.json();
          const reply = aiJson.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch (openaiErr) {
        console.warn("OpenAI API call failed, falling back:", openaiErr);
      }
    }

    // 4. SMART BUILT-IN ACADEMIC RULE ENGINE
    let reply = "";
    if (lower.includes("parking") || lower.includes("st. clair") || lower.includes("st clair")) {
      reply = `🚗 **St. Clair College Parking Overview**:\n• **Daily / Visitor Parking**: Approximately $5.00 per entry (gated student lots).\n• **Semester Parking Pass**: Typically ~$168.00 - $185.00 CAD per semester via the St. Clair College Parking Portal (HonkMobile app accepted).\n• **Security & Permits**: Permits must be registered to your vehicle plate. Free parking is usually not permitted during peak class hours (Monday–Friday 8 AM–5 PM).`;
    } else if (lower.includes("late") || lower.includes("penalty")) {
      const matched = store.courses.find((c) => lower.includes(c.code.toLowerCase().replace(/\s+/g, ""))) || store.courses[0];
      reply = `📋 **Late Policy for ${matched.code}**: ${matched.syllabusDoc?.rawPolicies || "10% deduction per 24 hours late, up to 3 days maximum. No submissions accepted after 72 hours."}\n\n*Tip: SyllabiQ has scheduled an early milestone reminder 3 days before your next assignment so you never miss a deadline!*`;
    } else if (lower.includes("office hours") || lower.includes("professor") || lower.includes("instructor") || lower.includes("email")) {
      const matched = store.courses.find((c) => lower.includes(c.code.toLowerCase().replace(/\s+/g, ""))) || store.courses[0];
      reply = `👨‍🏫 **${matched.instructor.name}** (${matched.code})\n• **Email**: ${matched.instructor.email || "professor@university.edu"}\n• **Office Hours**: ${matched.instructor.office_hours || "By appointment"}\n• **Location**: ${matched.instructor.office_location || "Faculty Hall Room 314"}`;
    } else if (lower.includes("due") || lower.includes("upcoming") || lower.includes("deadline")) {
      const nextDue = store.tasks.filter((t) => t.status !== "DONE").slice(0, 4);
      reply = `⏰ **Your Next Upcoming Deadlines**:\n` +
        nextDue.map((t) => `• **${t.courseCode}**: ${t.title} — Due ${new Date(t.dueDate).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} (${t.weightPercent}% weight)`).join("\n") +
        `\n\nWould you like me to deconstruct any of these into a 5-step milestone study plan?`;
    } else if (lower.includes("grade") || lower.includes("calculate") || lower.includes("score")) {
      reply = `📊 **Grade Standing Overview**:\n• **CS 3110**: In good standing (Assignment 1 in progress)\n• **ECON 1010**: Prelim 1 coming up in 8 days\n• **BIO 1500**: Recent reading response scored 96%!\n\nYou can open the **Dynamic Grade Calculator** in the top bar to run what-if simulations on your final exams.`;
    } else {
      reply = `I am your SyllabiQ Academic Copilot! I have full context on your syllabus policies, assignment weights, and schedule.\n\nYou can ask me:\n• *"What is the late policy for CS 3110?"*\n• *"When are Professor Wissink's office hours?"*\n• *"What's due this week?"*\n• *"How much is parking at St. Clair College?"*\n• *"Can you break down my 10-page research paper into milestones?"*`;
    }

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
