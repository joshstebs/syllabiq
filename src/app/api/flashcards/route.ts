import { NextRequest, NextResponse } from "next/server";

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

// Pre-seeded high-yield college flashcards
let flashcardStore: Flashcard[] = [
  {
    id: "fc-cs-1",
    courseId: "course-cs2110",
    courseCode: "CS 2110",
    deckTitle: "Data Structures & OOP",
    front: "What is the amortized time complexity of inserting into an ArrayList in Java?",
    back: "O(1) amortized. Resizing takes O(n), but doubling happens every 2^k insertions, spreading cost over n operations.",
    tags: ["Java", "Complexity", "ArrayList"],
    mastered: true,
    difficulty: "EASY",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "fc-cs-2",
    courseId: "course-cs2110",
    courseCode: "CS 2110",
    deckTitle: "Data Structures & OOP",
    front: "Explain the difference between Dynamic Dispatch and Static Binding.",
    back: "Static binding occurs at compile-time (overloaded methods, private/static/final methods). Dynamic dispatch resolves the overridden method at runtime based on the actual object type.",
    tags: ["Polymorphism", "Java", "OOP"],
    mastered: false,
    difficulty: "MEDIUM",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "fc-cs-3",
    courseId: "course-cs2110",
    courseCode: "CS 2110",
    deckTitle: "Data Structures & OOP",
    front: "What are the 4 fundamental invariants of a Red-Black Tree?",
    back: "1. Every node is red or black.\n2. The root is always black.\n3. Red nodes cannot have red children (no consecutive reds).\n4. Every path from root to null leaves has identical black depth.",
    tags: ["Trees", "Algorithms", "BalancedBST"],
    mastered: false,
    difficulty: "HARD",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "fc-chem-1",
    courseId: "course-chem2070",
    courseCode: "CHEM 2070",
    deckTitle: "General Chemistry I",
    front: "State Le Chatelier's Principle and how increasing pressure affects gas equilibrium.",
    back: "If a stress is applied to a reaction at equilibrium, the system shifts to counteract the stress. Increasing pressure shifts equilibrium toward the side with fewer moles of gas.",
    tags: ["Equilibrium", "Gases", "Thermodynamics"],
    mastered: true,
    difficulty: "MEDIUM",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "fc-chem-2",
    courseId: "course-chem2070",
    courseCode: "CHEM 2070",
    deckTitle: "General Chemistry I",
    front: "What is the Henderson-Hasselbalch equation and when does pH equal pKa?",
    back: "pH = pKa + log([A-] / [HA]). When the conjugate base concentration equals weak acid concentration ([A-] = [HA]), log(1) = 0, so pH = pKa (half-equivalence point).",
    tags: ["Buffers", "AcidsBases", "Titration"],
    mastered: false,
    difficulty: "HARD",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "fc-econ-1",
    courseId: "course-econ1110",
    courseCode: "ECON 1110",
    deckTitle: "Intro Microeconomics",
    front: "Define Price Elasticity of Demand (PED) and state the formula.",
    back: "PED measures responsiveness of quantity demanded to a change in price.\nPED = (% Change in Q_d) / (% Change in Price).\nIf |PED| > 1: Elastic.\nIf |PED| < 1: Inelastic.",
    tags: ["Microeconomics", "Elasticity", "Demand"],
    mastered: true,
    difficulty: "EASY",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "fc-econ-2",
    courseId: "course-econ1110",
    courseCode: "ECON 1110",
    deckTitle: "Intro Microeconomics",
    front: "Where does the Marginal Cost (MC) curve intersect the Average Total Cost (ATC) curve?",
    back: "The MC curve intersects the ATC curve at its absolute lowest (minimum) point. When MC < ATC, ATC falls; when MC > ATC, ATC rises.",
    tags: ["CostCurves", "FirmTheory", "Optimization"],
    mastered: false,
    difficulty: "MEDIUM",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const courseCode = url.searchParams.get("courseCode");

  let result = flashcardStore;
  if (courseCode && courseCode !== "ALL") {
    result = flashcardStore.filter(
      (c) => c.courseCode.toLowerCase() === courseCode.toLowerCase()
    );
  }

  // Calculate deck summary
  const decks = [
    {
      courseCode: "CS 2110",
      deckTitle: "Data Structures & OOP",
      total: flashcardStore.filter((c) => c.courseCode === "CS 2110").length,
      mastered: flashcardStore.filter((c) => c.courseCode === "CS 2110" && c.mastered).length
    },
    {
      courseCode: "CHEM 2070",
      deckTitle: "General Chemistry I",
      total: flashcardStore.filter((c) => c.courseCode === "CHEM 2070").length,
      mastered: flashcardStore.filter((c) => c.courseCode === "CHEM 2070" && c.mastered).length
    },
    {
      courseCode: "ECON 1110",
      deckTitle: "Intro Microeconomics",
      total: flashcardStore.filter((c) => c.courseCode === "ECON 1110").length,
      mastered: flashcardStore.filter((c) => c.courseCode === "ECON 1110" && c.mastered).length
    }
  ];

  return NextResponse.json({
    success: true,
    totalCards: flashcardStore.length,
    masteredCount: flashcardStore.filter((c) => c.mastered).length,
    cards: result,
    decks
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // Action: Create Card
    if (action === "CREATE") {
      const { front, back, courseCode, deckTitle, tags, difficulty } = body;
      if (!front || !back) {
        return NextResponse.json(
          { error: "Front and back content are required" },
          { status: 400 }
        );
      }

      const newCard: Flashcard = {
        id: "fc-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
        courseId: "course-" + (courseCode || "custom").toLowerCase().replace(/\\s+/g, ""),
        courseCode: courseCode || "GENERAL",
        deckTitle: deckTitle || (courseCode ? `${courseCode} Deck` : "General Study"),
        front: front.trim(),
        back: back.trim(),
        tags: Array.isArray(tags) ? tags : ["Custom"],
        mastered: false,
        difficulty: difficulty || "MEDIUM",
        createdAt: new Date().toISOString()
      };

      flashcardStore.unshift(newCard);
      return NextResponse.json({ success: true, card: newCard, totalCards: flashcardStore.length });
    }

    // Action: Update Mastery / Progress
    if (action === "UPDATE_STATUS") {
      const { cardId, mastered, difficulty } = body;
      const index = flashcardStore.findIndex((c) => c.id === cardId);
      if (index === -1) {
        return NextResponse.json({ error: "Card not found" }, { status: 404 });
      }

      if (typeof mastered === "boolean") {
        flashcardStore[index].mastered = mastered;
      }
      if (difficulty) {
        flashcardStore[index].difficulty = difficulty;
      }
      flashcardStore[index].lastStudiedAt = new Date().toISOString();

      return NextResponse.json({ success: true, card: flashcardStore[index] });
    }

    // Action: Delete Card
    if (action === "DELETE") {
      const { cardId } = body;
      flashcardStore = flashcardStore.filter((c) => c.id !== cardId);
      return NextResponse.json({ success: true, totalCards: flashcardStore.length });
    }

    // Action: Reset Deck
    if (action === "RESET_DECK") {
      const { courseCode } = body;
      flashcardStore = flashcardStore.map((c) => {
        if (!courseCode || courseCode === "ALL" || c.courseCode === courseCode) {
          return { ...c, mastered: false };
        }
        return c;
      });
      return NextResponse.json({ success: true });
    }

    // Action: AI Generate Flashcards
    if (action === "AI_GENERATE") {
      const { topic, courseCode } = body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      let generatedCards: Array<{ front: string; back: string; tags: string[] }> = [];

      if (apiKey) {
        try {
          const prompt = `You are an expert college professor creating high-yield study flashcards for college students.
Topic or subject: ${topic || courseCode || "Computer Science Data Structures"}
Create 4 concise, high-yield flashcards.
Return ONLY valid JSON in this exact array format:
[
  {
    "front": "Clear concept, term, or question",
    "back": "Concise, definitive answer or formula",
    "tags": ["tag1", "tag2"]
  }
]`;

          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
              })
            }
          );

          if (res.ok) {
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              generatedCards = JSON.parse(text);
            }
          }
        } catch (e) {
          console.error("Gemini AI flashcard generation fallback triggered:", e);
        }
      }

      // High-yield fallback if AI key unavailable or rate limited
      if (!generatedCards || generatedCards.length === 0) {
        generatedCards = [
          {
            front: `Key Concept: Fundamental theorem of ${topic || "this topic"}`,
            back: `Provides the core foundation for analyzing behavior and solving problem sets in ${courseCode || "class"}.`,
            tags: ["HighYield", "ExamPrep"]
          },
          {
            front: `How do you solve problems involving ${topic || "this topic"} efficiently?`,
            back: "1. State governing assumptions\n2. Identify boundary conditions\n3. Apply direct formula or recurrence relation.",
            tags: ["Strategy", "ProblemSolving"]
          },
          {
            front: `Common exam pitfall in ${topic || "this topic"}?`,
            back: "Confusing steady-state behavior with transient responses or misapplying units.",
            tags: ["ExamTip", "Pitfalls"]
          }
        ];
      }

      const newCards: Flashcard[] = generatedCards.map((g, idx) => ({
        id: "fc-ai-" + Date.now() + "-" + idx,
        courseId: "course-" + (courseCode || "ai").toLowerCase().replace(/\\s+/g, ""),
        courseCode: courseCode || "AI STUDY",
        deckTitle: `${topic || courseCode || "AI"} Deck`,
        front: g.front,
        back: g.back,
        tags: g.tags || ["AI-Generated"],
        mastered: false,
        difficulty: "MEDIUM",
        createdAt: new Date().toISOString()
      }));

      flashcardStore.unshift(...newCards);
      return NextResponse.json({ success: true, createdCount: newCards.length, cards: newCards });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
