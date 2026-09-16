import { z } from "zod";
import { parseSyllabusWithRegexFallback } from "./regex-fallback";

export const SyllabusItemSchema = z.object({
  title: z.string().min(1, "Item title cannot be empty"),
  type: z.enum(["assignment", "quiz", "exam", "reading", "project"]),
  due_date: z.string().datetime({ message: "Must be a valid ISO 8601 UTC timestamp" }),
  weight_percent: z.number().min(0).max(100).default(0),
  description: z.string().default("")
});

export const WeightCategorySchema = z.object({
  category: z.string().min(1),
  percentage: z.number().min(0).max(100)
});

export const InstructorSchema = z.object({
  name: z.string().min(1),
  email: z.string().default(""),
  office_hours: z.string().default("")
});

export const ParsedSyllabusSchema = z.object({
  course_name: z.string().min(1),
  course_code: z.string().min(1),
  instructor: InstructorSchema,
  weight_distribution: z.array(WeightCategorySchema),
  items: z.array(SyllabusItemSchema)
});

export type ParsedSyllabus = z.infer<typeof ParsedSyllabusSchema>;

export const SYLLABUS_EXTRACTION_SYSTEM_PROMPT = `
You are the world's most precise academic document parsing engine.
Your task is to analyze course syllabi (PDF text, OCR transcripts, or document page images) and extract course metadata, grading policies, and assignment schedules.

STRICT SCHEMA REQUIREMENTS:
{
  "course_name": string,
  "course_code": string,
  "instructor": { "name": string, "email": string, "office_hours": string },
  "weight_distribution": [{ "category": string, "percentage": number }],
  "items": [{
    "title": string,
    "type": "assignment" | "quiz" | "exam" | "reading" | "project",
    "due_date": "YYYY-MM-DDTHH:MM:SSZ",
    "weight_percent": number,
    "description": string
  }]
}

GUIDELINES:
1. Extract the official course name and standardized course code (e.g., "CS 3110", "ECON 1010").
2. Extract the instructor's name, email, and office hours.
3. Extract the exact grading weight breakdown across categories.
4. Extract every scheduled academic deadline into the "items" list.
5. Classify each item strictly into one of: "assignment", "quiz", "exam", "reading", "project".
6. All due dates MUST be ISO 8601 UTC timestamps (format: "YYYY-MM-DDTHH:MM:SSZ").
   - If a specific due time is not mentioned in the syllabus, default to 23:59:59Z (end of day).
7. Return ONLY a valid JSON object strictly matching this schema with no markdown fences or surrounding commentary.
`;

export async function extractSyllabusFromContent(
  rawText: string,
  fileName = "syllabus.pdf"
): Promise<ParsedSyllabus> {
  // If OpenAI or Gemini API key is present in environment, we could invoke it:
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (apiKey && process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYLLABUS_EXTRACTION_SYSTEM_PROMPT },
            { role: "user", content: `Filename: ${fileName}\n\nDocument Text:\n${rawText.slice(0, 20000)}` }
          ]
        })
      });

      if (response.ok) {
        const json = await response.json();
        const content = json.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          const validated = ParsedSyllabusSchema.safeParse(parsed);
          if (validated.success) {
            return validated.data;
          }
        }
      }
    } catch (err) {
      console.warn("LLM API extraction failed, using heuristic regex parser:", err);
    }
  }

  // Fallback to high-precision heuristic regex parser
  return parseSyllabusWithRegexFallback(rawText);
}
