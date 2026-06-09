import { ALL_LESSONS } from "@/content";
import type { LessonBlock } from "@/content/types";
import { getAllNotes } from "@/lib/notesStore";

export interface LessonSearchResult {
  kind: "lesson";
  key: string;
  chapterId: string;
  lessonId: string;
  chapterTitle: string;
  lessonTitle: string;
  summary: string;
  snippet: string;
}

export interface NoteSearchResult {
  kind: "note";
  key: string;
  chapterId: string;
  lessonId: string;
  chapterTitle: string;
  lessonTitle: string;
  snippet: string;
}

export type SearchResult = LessonSearchResult | NoteSearchResult;

function blockText(block: LessonBlock): string {
  switch (block.kind) {
    case "prose":
    case "callout":
      return block.md;
    case "heading":
      return block.text;
    case "derivation":
      return [
        block.title,
        ...block.steps.flatMap((step) => [step.expr, step.note]),
        block.result,
      ]
        .filter(Boolean)
        .join(" ");
    case "viz":
      return [block.title, block.module, block.algo, block.variant].filter(Boolean).join(" ");
    case "playground":
      return [block.title, block.starter].filter(Boolean).join(" ");
    case "problem":
      return block.ref;
    case "divider":
      return "";
  }
}

function normalize(text: string): string {
  return text.replace(/[`*_#[\]()]/g, "").replace(/\s+/g, " ").trim();
}

function makeSnippet(text: string, query: string, fallback: string): string {
  const clean = normalize(text);
  const q = query.toLowerCase();
  const hit = clean.toLowerCase().indexOf(q);
  if (hit === -1) return normalize(fallback || clean).slice(0, 180);

  const start = Math.max(0, hit - 70);
  const end = Math.min(clean.length, hit + q.length + 110);
  const prefix = start > 0 ? "... " : "";
  const suffix = end < clean.length ? " ..." : "";
  return `${prefix}${clean.slice(start, end)}${suffix}`;
}

export function searchEverything(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const lessons = ALL_LESSONS.flatMap(({ chapter, lesson }) => {
    const body = lesson.blocks.map(blockText).join(" ");
    const haystack = `${chapter.title} ${lesson.title} ${lesson.summary} ${body}`;
    if (!haystack.toLowerCase().includes(q)) return [];
    return {
      kind: "lesson" as const,
      key: `lesson:${chapter.id}/${lesson.id}`,
      chapterId: chapter.id,
      lessonId: lesson.id,
      chapterTitle: chapter.title,
      lessonTitle: lesson.title,
      summary: lesson.summary,
      snippet: makeSnippet(body, q, lesson.summary),
    };
  });

  const notes = getAllNotes().flatMap((note) => {
    const [chapterId, lessonId] = note.lessonKey.split("/");
    const ref = ALL_LESSONS.find(
      (item) => item.chapter.id === chapterId && item.lesson.id === lessonId,
    );
    const title = ref ? `${ref.chapter.title} ${ref.lesson.title}` : note.lessonKey;
    const haystack = `${title} ${note.text}`;
    if (!haystack.toLowerCase().includes(q)) return [];
    return {
      kind: "note" as const,
      key: `note:${note.lessonKey}`,
      chapterId,
      lessonId,
      chapterTitle: ref?.chapter.title ?? "Saved note",
      lessonTitle: ref?.lesson.title ?? note.lessonKey,
      snippet: makeSnippet(note.text, q, note.text),
    };
  });

  return [...lessons, ...notes];
}
