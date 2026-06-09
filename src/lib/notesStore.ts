/**
 * Helpers over the per-lesson notes that LessonNotes writes to localStorage
 * under "algolume-notes:<chapterId>/<lessonId>". Used by the global /notes page.
 */

export const NOTE_PREFIX = "algolume-notes:";

export interface StoredNote {
  /** "chapterId/lessonId" */
  lessonKey: string;
  text: string;
}

export function getAllNotes(): StoredNote[] {
  const out: StoredNote[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(NOTE_PREFIX)) continue;
      const text = localStorage.getItem(k) ?? "";
      if (text.trim()) out.push({ lessonKey: k.slice(NOTE_PREFIX.length), text });
    }
  } catch {
    /* ignore */
  }
  return out;
}

export function noteKeyFor(lessonKey: string): string {
  return NOTE_PREFIX + lessonKey;
}
