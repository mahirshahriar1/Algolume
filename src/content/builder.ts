import type {
  CalloutTone,
  Chapter,
  DerivationStep,
  Lesson,
  LessonBlock,
  VizModule,
} from "./types";

/**
 * Terse, typo-safe authoring helpers. A lesson is just an array of these:
 *
 *   lesson("quick-sort", "Quick sort", "…", 8, [
 *     prose("**Quick sort** is …"),
 *     viz("sorting", { algo: "quick" }),
 *     derive([step("…", "…")], "O(n log n)"),
 *     callout("complexity", "…"),
 *   ])
 *
 * See AUTHORING.md for the 3-step "add a lesson" guide.
 */

export const prose = (md: string): LessonBlock => ({ kind: "prose", md });

export const heading = (text: string): LessonBlock => ({ kind: "heading", text });

export const callout = (tone: CalloutTone, md: string): LessonBlock => ({
  kind: "callout",
  tone,
  md,
});

export const viz = (
  module: VizModule,
  opts: { algo?: string; variant?: string; size?: number; title?: string } = {},
): LessonBlock => ({ kind: "viz", module, ...opts });

export const playground = (starter: string, title?: string): LessonBlock => ({
  kind: "playground",
  title,
  starter,
});

export const divider = (): LessonBlock => ({ kind: "divider" });

/** Embed a practice problem card (links to /problems/:ref). */
export const problem = (ref: string): LessonBlock => ({ kind: "problem", ref });

export const step = (expr: string, note: string): DerivationStep => ({ expr, note });

export const derive = (
  steps: DerivationStep[],
  result: string,
  title?: string,
): LessonBlock => ({ kind: "derivation", title, steps, result });

export const lesson = (
  id: string,
  title: string,
  summary: string,
  estMinutes: number,
  blocks: LessonBlock[],
): Lesson => ({ id, title, summary, estMinutes, blocks });

export const chapter = (
  id: string,
  title: string,
  blurb: string,
  icon: string,
  lessons: Lesson[],
): Chapter => ({ id, title, blurb, icon, lessons });
