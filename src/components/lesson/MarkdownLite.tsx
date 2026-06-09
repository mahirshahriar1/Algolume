import { type ReactNode } from "react";

/**
 * A deliberately small Markdown renderer for the subset we author by hand (and
 * that users type into notes): paragraphs, bullet/numbered lists, fenced code,
 * and inline **bold**, *italic*, `code` and [links](url). A line-based scanner,
 * so a ``` code fence is recognised even without surrounding blank lines.
 */

const INLINE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  INLINE.lastIndex = 0;
  while ((m = INLINE.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("`")) {
      out.push(
        <code key={key++} className="rounded bg-elevated px-1.5 py-0.5 font-mono text-[0.85em] text-fg">
          {tok.slice(1, -1)}
        </code>,
      );
    } else if (tok.startsWith("**")) {
      out.push(<strong key={key++} className="font-semibold text-fg">{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("*")) {
      out.push(<em key={key++} className="italic">{tok.slice(1, -1)}</em>);
    } else {
      const link = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok)!;
      out.push(
        <a key={key++} href={link[2]} target="_blank" rel="noreferrer" className="font-medium text-run underline decoration-run/30 underline-offset-2 hover:decoration-run">
          {link[1]}
        </a>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

type Block =
  | { t: "code"; lines: string[] }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "p"; text: string };

function parse(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
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

export function MarkdownLite({ md }: { md: string }) {
  const blocks = parse(md);
  return (
    <>
      {blocks.map((b, i) => {
        if (b.t === "code") {
          return (
            <pre key={i} className="my-4 overflow-auto rounded-xl border border-line bg-elevated/60 p-4 font-mono text-[13px] leading-relaxed text-fg">
              <code>{b.lines.join("\n")}</code>
            </pre>
          );
        }
        if (b.t === "ul") {
          return (
            <ul key={i} className="my-4 space-y-2">
              {b.items.map((it, j) => (
                <li key={j} className="flex gap-2.5 text-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-run/70" />
                  <span>{renderInline(it)}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (b.t === "ol") {
          return (
            <ol key={i} className="my-4 space-y-2">
              {b.items.map((it, j) => (
                <li key={j} className="flex gap-2.5 text-muted">
                  <span className="font-mono text-sm font-semibold text-run">{j + 1}.</span>
                  <span>{renderInline(it)}</span>
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i} className="my-4 leading-[1.75] text-muted">
            {renderInline(b.text)}
          </p>
        );
      })}
    </>
  );
}
