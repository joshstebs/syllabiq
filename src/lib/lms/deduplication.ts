export function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

export function normalizeTaskTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/^(?:hw|homework|assignment|quiz|exam|project|lab|pset|problem set)\s*#?\s*\d*\s*[-–:]?\s*/i, "")
    .replace(/[^\w\s]/gi, "")
    .trim()
    .split(/\s+/)
    .sort()
    .join(" ");
}

export function calculateFuzzySimilarity(title1: string, title2: string): number {
  const norm1 = normalizeTaskTitle(title1);
  const norm2 = normalizeTaskTitle(title2);
  const maxLen = Math.max(norm1.length, norm2.length);
  if (maxLen === 0) return 1.0;

  const distance = levenshteinDistance(norm1, norm2);
  return 1.0 - distance / maxLen;
}

export interface MinimalTask {
  id: string;
  title: string;
  dueDate: string;
  courseCode?: string;
}

/**
 * Deduplication matching pipeline:
 * Returns matching task if similarity > 0.85 and dueDate is within 48 hours.
 */
export function findDuplicateInCollection<T extends MinimalTask>(
  candidate: { title: string; dueDate: string; courseCode?: string },
  existingTasks: T[]
): { match: T; similarity: number; timeDiffHours: number } | null {
  const candidateDate = new Date(candidate.dueDate).getTime();
  const MAX_WINDOW_HOURS = 48;

  for (const existing of existingTasks) {
    const existingDate = new Date(existing.dueDate).getTime();
    const diffHours = Math.abs(candidateDate - existingDate) / (1000 * 60 * 60);

    if (diffHours <= MAX_WINDOW_HOURS) {
      const sim = calculateFuzzySimilarity(candidate.title, existing.title);
      if (sim >= 0.85) {
        return { match: existing, similarity: sim, timeDiffHours: diffHours };
      }
    }
  }
  return null;
}
