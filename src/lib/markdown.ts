/**
 * Parser for the small Markdown subset lessons are authored in (see
 * components/lesson/MarkdownLite.tsx). Plain data, no React, so the build-time
 * prerender (lib/seoStatic.ts) renders exactly what the app renders.
 */

/** Inline tokens: `code`, **bold**, *italic*, [link](url). */
export const INLINE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g;

export type MdBlock =
  | { t: "code"; lines: string[] }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "p"; text: string };

export function parseMarkdown(md: string): MdBlock[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: MdBlock[] = [];
  let i = 0;
  const isBullet = (l: string) => l.trim().startsWith("- ");
  const isNum = (l: string) => /^\d+\.\s/.test(l.trim());
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith("```")) {
      i++;
      const code: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith("```")) code.push(lines[i++]);
      i++; // closing fence
      blocks.push({ t: "code", lines: code });
    } else if (line.trim() === "") {
      i++;
    } else if (isBullet(line)) {
      const items: string[] = [];
      while (i < lines.length && isBullet(lines[i])) items.push(lines[i++].trim().slice(2));
      blocks.push({ t: "ul", items });
    } else if (isNum(line)) {
      const items: string[] = [];
      while (i < lines.length && isNum(lines[i])) items.push(lines[i++].trim().replace(/^\d+\.\s/, ""));
      blocks.push({ t: "ol", items });
    } else {
      const para: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !lines[i].trim().startsWith("```") &&
        !isBullet(lines[i]) &&
        !isNum(lines[i])
      ) {
        para.push(lines[i++]);
      }
      blocks.push({ t: "p", text: para.join(" ") });
    }
  }
  return blocks;
}
