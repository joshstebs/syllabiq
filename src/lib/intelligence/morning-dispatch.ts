import { TaskItem, DispatchSummary } from "../types";

export function generateDailyMorningDispatch(tasks: TaskItem[], userName = "Alex"): DispatchSummary {
  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 3600 * 1000);
  const next48h = new Date(now.getTime() + 48 * 3600 * 1000);

  const tasksDueNext24h = tasks.filter((t) => {
    const due = new Date(t.dueDate);
    return due >= now && due <= next24h && t.status !== "DONE";
  });

  const tasksDueNext48h = tasks.filter((t) => {
    const due = new Date(t.dueDate);
    return due > next24h && due <= next48h && t.status !== "DONE";
  });

  // AI milestone blocks starting today (3-5 days before heavy assignments)
  const milestonesStartingToday = tasks.filter((t) => {
    const due = new Date(t.dueDate);
    const daysUntilDue = Math.round((due.getTime() - now.getTime()) / (24 * 3600 * 1000));
    return (daysUntilDue === 3 || daysUntilDue === 5) && t.status !== "DONE";
  });

  const todayStr = now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  return {
    date: todayStr,
    greeting: `Good morning, ${userName}! Here is your SyllabiQ Academic Dispatch for ${todayStr}.`,
    tasksDueNext24h,
    tasksDueNext48h,
    milestonesStartingToday,
    weatherAlert: {
      summary: "Rain & windy. High 54°F.",
      temp: 54,
      commuteBufferMinutes: 15
    }
  };
}

export function formatDiscordDispatchPayload(dispatch: DispatchSummary) {
  const fields = [];

  if (dispatch.tasksDueNext24h.length > 0) {
    fields.push({
      name: `🚨 Due in Next 24 Hours (${dispatch.tasksDueNext24h.length})`,
      value: dispatch.tasksDueNext24h
        .map((t) => `• **${t.courseCode}**: ${t.title} (${t.weightPercent}% grade) - *Due ${new Date(t.dueDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}*`)
        .join("\n")
    });
  } else {
    fields.push({
      name: "🎉 Next 24 Hours",
      value: "No hard deadlines due today! Ideal time for deep work."
    });
  }

  if (dispatch.milestonesStartingToday.length > 0) {
    fields.push({
      name: `⚡ AI Prep Tasks to Start Today (${dispatch.milestonesStartingToday.length})`,
      value: dispatch.milestonesStartingToday
        .map((t) => `• **${t.courseCode}**: ${t.title} (~${t.estimatedHours}h effort) - *Early prep buffer*`)
        .join("\n")
    });
  }

  if (dispatch.weatherAlert) {
    fields.push({
      name: "🌧️ Campus Transit & Weather Buffer",
      value: `${dispatch.weatherAlert.summary} SyllabiQ added a **+${dispatch.weatherAlert.commuteBufferMinutes} min** buffer to your Google Calendar travel events.`
    });
  }

  return {
    username: "SyllabiQ Dispatch",
    avatar_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128",
    embeds: [
      {
        title: `📚 Morning Academic Briefing • ${dispatch.date}`,
        description: dispatch.greeting,
        color: 0x6366f1, // Indigo
        fields,
        footer: { text: "Synced automatically with Google Calendar & Master Tracker" }
      }
    ]
  };
}

export function formatWhatsAppMessage(dispatch: DispatchSummary): string {
  let msg = `*📚 SyllabiQ Morning Dispatch* (${dispatch.date})\n\n`;
  msg += `${dispatch.greeting}\n\n`;

  if (dispatch.tasksDueNext24h.length > 0) {
    msg += `*🚨 DUE IN 24H:*\n`;
    dispatch.tasksDueNext24h.forEach((t) => {
      msg += `• [${t.courseCode}] ${t.title} (${t.weightPercent}%) - ${new Date(t.dueDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}\n`;
    });
    msg += `\n`;
  } else {
    msg += `*🎉 24H:* Clear schedule!\n\n`;
  }

  if (dispatch.milestonesStartingToday.length > 0) {
    msg += `*⚡ START TODAY (AI Buffer):*\n`;
    dispatch.milestonesStartingToday.forEach((t) => {
      msg += `• [${t.courseCode}] ${t.title} (~${t.estimatedHours}h)\n`;
    });
    msg += `\n`;
  }

  if (dispatch.weatherAlert) {
    msg += `*🌧️ Transit:* ${dispatch.weatherAlert.summary} (+${dispatch.weatherAlert.commuteBufferMinutes}m buffer)\n`;
  }

  return msg;
}
