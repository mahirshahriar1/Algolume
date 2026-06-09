import type { Chapter, Lesson } from "./types";
import { foundations } from "./chapters/foundations";
import { arrays } from "./chapters/arrays";
import { searching } from "./chapters/searching";
import { sorting } from "./chapters/sorting";
import { recursion } from "./chapters/recursion";
import { linkedLists } from "./chapters/linked-lists";
import { stacksQueues } from "./chapters/stacks-queues";
import { hashing } from "./chapters/hashing";
import { trees } from "./chapters/trees";
import { traversals } from "./chapters/traversals";
import { pathfinding } from "./chapters/pathfinding";
import { minimumSpanningTrees } from "./chapters/minimum-spanning-trees";
import { competitiveProgramming } from "./chapters/competitive-programming";

// Reading order starts with practical CP onboarding, then follows the algorithm outline.
export const CHAPTERS: Chapter[] = [
  competitiveProgramming,
  foundations,
  arrays,
  searching,
  sorting,
  recursion,
  linkedLists,
  stacksQueues,
  hashing,
  trees,
  traversals,
  pathfinding,
  minimumSpanningTrees,
];

export interface LessonRef {
  chapter: Chapter;
  lesson: Lesson;
}

/** Every lesson in reading order, with its chapter — used for prev/next nav. */
export const ALL_LESSONS: LessonRef[] = CHAPTERS.flatMap((chapter) =>
  chapter.lessons.map((lesson) => ({ chapter, lesson })),
);

export function getChapter(chapterId: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === chapterId);
}

export function getLesson(chapterId: string, lessonId: string): LessonRef | undefined {
  const chapter = getChapter(chapterId);
  const lesson = chapter?.lessons.find((l) => l.id === lessonId);
  return chapter && lesson ? { chapter, lesson } : undefined;
}

/** Previous/next lesson across the whole book (chapters flow into each other). */
export function adjacentLessons(chapterId: string, lessonId: string): {
  prev?: LessonRef;
  next?: LessonRef;
} {
  const i = ALL_LESSONS.findIndex(
    (r) => r.chapter.id === chapterId && r.lesson.id === lessonId,
  );
  if (i === -1) return {};
  return {
    prev: i > 0 ? ALL_LESSONS[i - 1] : undefined,
    next: i < ALL_LESSONS.length - 1 ? ALL_LESSONS[i + 1] : undefined,
  };
}

export const LESSON_COUNT = ALL_LESSONS.length;
export const TOTAL_MINUTES = ALL_LESSONS.reduce(
  (sum, r) => sum + r.lesson.estMinutes,
  0,
);
