/**
 * Per-lesson notes stored in localStorage under "algolume-notes:<chapterId>/<lessonId>".
 * A parallel "algolume-notes-meta" map keeps an updatedAt timestamp per note so
 * cloud sync can resolve conflicts newest-wins. Used by LessonNotes, the global
 * /notes page, and the sync layer.
 */

export const NOTE_PREFIX = "algolume-notes:";
const META_KEY = "algolume-notes-meta";

export interface StoredNote {
  /** "chapterId/lessonId" */
  lessonKey: string;
  text: string;
  updatedAt: number;
}

const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((l) => l());
}

/** Subscribe to any note change (used by cloud sync + the notes page). */
export function subscribeNotes(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function loadMeta(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(META_KEY) ?? "{}");
  } catch {
    return {};
  }
}
function saveMeta(meta: Record<string, number>) {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch {
    /* ignore */
  }
}

export function noteKeyFor(lessonKey: string): string {
  return NOTE_PREFIX + lessonKey;
}

export function getNote(lessonKey: string): string {
  try {
    return localStorage.getItem(noteKeyFor(lessonKey)) ?? "";
  } catch {
    return "";
  }
}

/** Write a note's text + stamp its updatedAt; notifies subscribers. */
export function setNote(lessonKey: string, text: string, updatedAt: number = Date.now()) {
  try {
    if (text.trim()) {
      localStorage.setItem(noteKeyFor(lessonKey), text);
      const meta = loadMeta();
      meta[lessonKey] = updatedAt;
      saveMeta(meta);
    } else {
      removeNote(lessonKey, false);
    }
  } catch {
    /* ignore */
  }
  notify();
}

export function removeNote(lessonKey: string, doNotify = true) {
  try {
    localStorage.removeItem(noteKeyFor(lessonKey));
    const meta = loadMeta();
    delete meta[lessonKey];
    saveMeta(meta);
  } catch {
    /* ignore */
  }
  if (doNotify) notify();
}

export function getAllNotes(): StoredNote[] {
  const out: StoredNote[] = [];
  const meta = loadMeta();
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(NOTE_PREFIX)) continue;
      const text = localStorage.getItem(k) ?? "";
      if (text.trim()) {
        const lessonKey = k.slice(NOTE_PREFIX.length);
        out.push({ lessonKey, text, updatedAt: meta[lessonKey] ?? 0 });
      }
    }
  } catch {
    /* ignore */
  }
  return out;
}
