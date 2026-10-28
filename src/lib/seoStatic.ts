import { CHAPTERS, adjacentLessons, getLesson } from "@/content";
import type { LessonBlock } from "@/content/types";
import { INLINE, parseMarkdown } from "@/lib/markdown";
import { DIFFICULTY_LABEL, DIFFICULTY_ORDER, PROBLEMS, getProblem, problemTopics, topicLabel } from "@/lib/problems";
import { SITE_NAME, SITE_URL, indexablePaths, metaFor } from "@/lib/seo";
import { VISUALIZERS, VIZ_BY_ID } from "@/pages/visualizers/registry";

/**
 * Build-time only (loaded by scripts/prerender.mjs). Renders each route's
 * content as plain semantic HTML that sits inside #root until React mounts and
 * replaces it, plus sitemap.xml, robots.txt and llms.txt. Crawlers that don't
 * execute JS (most AI answer engines) read this; users see the app.
 */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function inline(text: string): string {
  let out = "";
  let last = 0;
  let m: RegExpExecArray | null;
  INLINE.lastIndex = 0;
  while ((m = INLINE.exec(text))) {
    out += esc(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("`")) out += `<code>${esc(tok.slice(1, -1))}</code>`;
    else if (tok.startsWith("**")) out += `<strong>${esc(tok.slice(2, -2))}</strong>`;
    else if (tok.startsWith("*")) out += `<em>${esc(tok.slice(1, -1))}</em>`;
    else {
      const link = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok)!;
      out += `<a href="${esc(link[2])}">${esc(link[1])}</a>`;
    }
    last = m.index + tok.length;
  }
  return out + esc(text.slice(last));
}

function md(source: string): string {
  return parseMarkdown(source)
    .map((b) => {
      if (b.t === "code") return `<pre><code>${esc(b.lines.join("\n"))}</code></pre>`;
      if (b.t === "ul") return `<ul>${b.items.map((it) => `<li>${inline(it)}</li>`).join("")}</ul>`;
      if (b.t === "ol") return `<ol>${b.items.map((it) => `<li>${inline(it)}</li>`).join("")}</ol>`;
      return `<p>${inline(b.text)}</p>`;
    })
    .join("\n");
}

const CALLOUT_LABEL = { intuition: "Intuition", warning: "Watch out", complexity: "Complexity", note: "Note" };

function block(b: LessonBlock): string {
  switch (b.kind) {
    case "prose":
      return md(b.md);
    case "heading":
      return `<h2>${esc(b.text)}</h2>`;
    case "callout":
      return `<aside><strong>${CALLOUT_LABEL[b.tone]}.</strong>\n${md(b.md)}</aside>`;
    case "viz":
      return `<p><em>Interactive visualization${b.title ? `: ${esc(b.title)}` : ""} — step through it frame by frame on this page.</em></p>`;
    case "playground":
      return `<p><em>${esc(b.title ?? "Python playground")}:</em></p><pre><code>${esc(b.starter)}</code></pre>`;
    case "derivation":
      return (
        `<figure>${b.title ? `<figcaption>${esc(b.title)}</figcaption>` : ""}<ol>` +
        b.steps.map((s) => `<li><code>${esc(s.expr)}</code> — ${esc(s.note)}</li>`).join("") +
        `</ol><p><strong>Result: ${esc(b.result)}</strong></p></figure>`
      );
    case "problem": {
      const p = getProblem(b.ref);
      return p
        ? `<p>Practice: <a href="/problems/${p.id}">${esc(p.title)}</a> (${DIFFICULTY_LABEL[p.difficulty]}) — ${esc(p.summary)}</p>`
        : "";
    }
    case "divider":
      return "<hr />";
  }
}

const NAV = `<nav><a href="/">${SITE_NAME}</a> · <a href="/learn">Learn</a> · <a href="/visualizers">Visualizers</a> · <a href="/problems">Problems</a> · <a href="/playground">Playground</a></nav>`;

function chapterIndex(): string {
  return CHAPTERS.map(
    (c) =>
      `<section><h2>${esc(c.title)}</h2><p>${esc(c.blurb)}</p><ul>` +
      c.lessons
        .map((l) => `<li><a href="/learn/${c.id}/${l.id}">${esc(l.title)}</a> — ${esc(l.summary)}</li>`)
        .join("") +
      `</ul></section>`,
  ).join("\n");
}

function body(path: string): string {
  const parts = path.split("/").filter(Boolean);
  const m = metaFor(path);

  if (path === "/") {
    return (
      `<h1>${SITE_NAME}: learn data structures &amp; algorithms, visualized</h1><p>${esc(m.description)}</p>` +
      `<ul><li><strong>Read</strong> — <a href="/learn">${CHAPTERS.length} chapters</a> of lessons written like university notes, with complexity derivations and C++ examples.</li>` +
      `<li><strong>Watch</strong> — <a href="/visualizers">interactive visualizers</a> that step through every algorithm frame by frame.</li>` +
      `<li><strong>Play</strong> — a <a href="/playground">Python playground</a> that runs in your browser.</li>` +
      `<li><strong>Practice</strong> — <a href="/problems">${PROBLEMS.length} graded problems</a>, easy to hard, with hints and solutions.</li></ul>` +
      chapterIndex()
    );
  }

  if (path === "/learn") return `<h1>Algorithms handbook</h1><p>${esc(m.description)}</p>${chapterIndex()}`;

  if (parts[0] === "learn" && parts.length === 3) {
    const ref = getLesson(parts[1], parts[2]);
    if (ref) {
      const { chapter, lesson } = ref;
      const { prev, next } = adjacentLessons(chapter.id, lesson.id);
      const link = (r: typeof prev) => (r ? `<a href="/learn/${r.chapter.id}/${r.lesson.id}">${esc(r.lesson.title)}</a>` : "");
      return (
        `<p><a href="/learn">Learn</a> › ${esc(chapter.title)}</p><article><h1>${esc(lesson.title)}</h1>` +
        `<p><em>${esc(lesson.summary)} · ${lesson.estMinutes} min read</em></p>\n` +
        lesson.blocks.map(block).join("\n") +
        `</article><p>${prev ? `Previous: ${link(prev)}` : ""}${prev && next ? " · " : ""}${next ? `Next: ${link(next)}` : ""}</p>` +
        `<h2>More in ${esc(chapter.title)}</h2><ul>` +
        chapter.lessons.map((l) => `<li><a href="/learn/${chapter.id}/${l.id}">${esc(l.title)}</a></li>`).join("") +
        `</ul>`
      );
    }
  }

  if (path === "/problems") {
    return (
      `<h1>Algorithm practice problems</h1><p>${esc(m.description)}</p>` +
      problemTopics()
        .map(({ topic }) => {
          const ps = PROBLEMS.filter((p) => p.topic === topic).sort(
            (a, b) => DIFFICULTY_ORDER.indexOf(a.difficulty) - DIFFICULTY_ORDER.indexOf(b.difficulty),
          );
          return (
            `<h2>${esc(topicLabel(topic))}</h2><ul>` +
            ps.map((p) => `<li><a href="/problems/${p.id}">${esc(p.title)}</a> (${DIFFICULTY_LABEL[p.difficulty]}) — ${esc(p.summary)}</li>`).join("") +
            `</ul>`
          );
        })
        .join("\n")
    );
  }

  if (parts[0] === "problems" && parts.length === 2) {
    const p = getProblem(parts[1]);
    if (p) {
      const call = (args: unknown[]) => `${p.funcName}(${args.map((a) => JSON.stringify(a)).join(", ")})`;
      const related = PROBLEMS.filter((q) => q.topic === p.topic && q.id !== p.id);
      return (
        `<p><a href="/problems">Problems</a> › ${esc(topicLabel(p.topic))}</p><article><h1>${esc(p.title)}</h1>` +
        `<p><strong>Difficulty:</strong> ${DIFFICULTY_LABEL[p.difficulty]} · <strong>Topic:</strong> ${esc(topicLabel(p.topic))}</p>` +
        md(p.statement) +
        `<h2>Examples</h2>` +
        p.examples
          .map((e) => `<pre><code>${esc(`${call(e.input)}\n→ ${JSON.stringify(e.expected)}`)}</code></pre>${e.explain ? `<p>${inline(e.explain)}</p>` : ""}`)
          .join("") +
        (p.complexity ? `<p><strong>Target complexity:</strong> time ${esc(p.complexity.time)}, space ${esc(p.complexity.space)}</p>` : "") +
        `<p>Write your solution in Python and run it against hidden tests right on this page. Progressive hints and Python + C++ reference solutions are included.</p>` +
        (p.lesson ? `<p>Learn the idea first: <a href="${esc(p.lesson)}">the lesson for this problem</a>.</p>` : "") +
        `</article>` +
        (related.length
          ? `<h2>More ${esc(topicLabel(p.topic))} problems</h2><ul>${related.map((q) => `<li><a href="/problems/${q.id}">${esc(q.title)}</a> (${DIFFICULTY_LABEL[q.difficulty]})</li>`).join("")}</ul>`
          : "")
      );
    }
  }

  const vizList = () =>
    `<ul>${VISUALIZERS.map((v) => `<li><a href="${v.to ?? `/visualizers/${v.id}`}">${esc(v.title)}</a> — ${esc(v.blurb)}</li>`).join("")}</ul>`;

  if (path === "/visualizers") return `<h1>Algorithm visualizers</h1><p>${esc(m.description)}</p>${vizList()}`;

  if (parts[0] === "visualizers" && parts.length === 2) {
    const v = VIZ_BY_ID[parts[1]];
    if (v) {
      return (
        `<h1>${esc(v.title)} visualizer</h1><p>${esc(v.blurb)}</p>` +
        (v.complexity ? `<ul>${v.complexity.map((c) => `<li>${esc(c.label)}: <code>${esc(c.value)}</code></li>`).join("")}</ul>` : "") +
        (v.lesson ? `<p>Read the lesson: <a href="${esc(v.lesson)}">${esc(v.title)}</a>.</p>` : "") +
        `<h2>Other visualizers</h2>${vizList()}`
      );
    }
  }

  return `<h1>${esc(m.title.replace(/ \| .*$/, ""))}</h1><p>${esc(m.description)}</p>`;
}

const STYLE = `<style>.seo-static{max-width:46rem;margin:0 auto;padding:2.5rem 1.25rem;line-height:1.75;color:rgb(var(--muted));font-family:Inter,system-ui,sans-serif}.seo-static h1,.seo-static h2{color:rgb(var(--fg));font-weight:600;margin:1.5rem 0 .5rem}.seo-static h1{font-size:2rem}.seo-static h2{font-size:1.35rem}.seo-static p,.seo-static ul,.seo-static ol{margin:.75rem 0}.seo-static ul{list-style:disc;padding-left:1.25rem}.seo-static ol{list-style:decimal;padding-left:1.25rem}.seo-static a{color:rgb(var(--run))}.seo-static pre{background:rgb(var(--code));padding:1rem;border-radius:.75rem;overflow:auto;font-size:13px}.seo-static aside{border-left:3px solid rgb(var(--line));padding-left:1rem}</style>`;

export interface StaticPage {
  path: string;
  head: string;
  body: string;
}

export function staticPages(): StaticPage[] {
  return indexablePaths().map((path) => {
    const m = metaFor(path);
    const url = SITE_URL + m.path;
    const jsonLd = (m.jsonLd ?? [])
      .map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`)
      .join("\n    ");
    const head = [
      `<title>${esc(m.title)}</title>`,
      `<meta name="description" content="${esc(m.description)}" />`,
      `<meta name="robots" content="${m.noindex ? "noindex" : "index, follow"}" />`,
      `<link rel="canonical" href="${url}" />`,
      `<meta property="og:type" content="${path.split("/").length > 2 ? "article" : "website"}" />`,
      `<meta property="og:site_name" content="${SITE_NAME}" />`,
      `<meta property="og:title" content="${esc(m.title)}" />`,
      `<meta property="og:description" content="${esc(m.description)}" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta name="twitter:card" content="summary" />`,
      jsonLd,
      STYLE,
    ]
      .filter(Boolean)
      .join("\n    ");
    return { path, head, body: `<div class="seo-static">${NAV}\n<main>${body(path)}</main></div>` };
  });
}

export function sitemapXml(lastmod: string): string {
  const urls = indexablePaths()
    .map((p) => `  <url><loc>${SITE_URL}${p === "/" ? "/" : p}</loc><lastmod>${lastmod}</lastmod></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const AI_CRAWLERS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot",
];

export function robotsTxt(): string {
  const rules = "Allow: /\nDisallow: /notes\nDisallow: /search\n";
  return (
    `User-agent: *\n${rules}\n` +
    `# Answer engines and AI assistants are explicitly welcome.\n` +
    AI_CRAWLERS.map((b) => `User-agent: ${b}`).join("\n") +
    `\n${rules}\nSitemap: ${SITE_URL}/sitemap.xml\n`
  );
}

/** https://llmstxt.org — a curated map of the site for language models. */
export function llmsTxt(): string {
  const out: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${metaFor("/").description}`,
    "",
    `${SITE_NAME} is a free, local-first handbook by Mahir Shahriar. Every lesson pairs explanation (concept, invariant, complexity derivation, C++ examples) with an interactive frame-by-frame visualization, and every topic has an easy → medium → hard problem ladder graded in the browser.`,
    "",
    `- [Full handbook text](${SITE_URL}/llms-full.txt): every lesson as Markdown in one file`,
    "",
  ];
  for (const c of CHAPTERS) {
    out.push(`## ${c.title}`, "", c.blurb, "");
    for (const l of c.lessons) out.push(`- [${l.title}](${SITE_URL}/learn/${c.id}/${l.id}): ${l.summary}`);
    out.push("");
  }
  out.push("## Practice problems", "");
  for (const p of PROBLEMS)
    out.push(`- [${p.title}](${SITE_URL}/problems/${p.id}): ${DIFFICULTY_LABEL[p.difficulty]} ${topicLabel(p.topic)} — ${p.summary}`);
  out.push("", "## Visualizers", "");
  for (const v of VISUALIZERS) out.push(`- [${v.title}](${SITE_URL}${v.to ?? `/visualizers/${v.id}`}): ${v.blurb}`);
  out.push("", "## Optional", "", `- [Python playground](${SITE_URL}/playground): run Python 3 in the browser via Pyodide`, "");
  return out.join("\n");
}

function blockMd(b: LessonBlock, url: string): string {
  switch (b.kind) {
    case "prose":
      return b.md;
    case "heading":
      return `### ${b.text}`;
    case "callout":
      return `> **${CALLOUT_LABEL[b.tone]}.** ${b.md.replace(/\n/g, "\n> ")}`;
    case "viz":
      return `*[Interactive visualization${b.title ? `: ${b.title}` : ""}](${url})*`;
    case "playground":
      return "```python\n" + b.starter + "\n```";
    case "derivation":
      return (
        (b.title ? `**${b.title}**\n\n` : "") +
        b.steps.map((s, i) => `${i + 1}. \`${s.expr}\` — ${s.note}`).join("\n") +
        `\n\n**Result: ${b.result}**`
      );
    case "problem": {
      const p = getProblem(b.ref);
      return p ? `Practice: [${p.title}](${SITE_URL}/problems/${p.id}) (${DIFFICULTY_LABEL[p.difficulty]}) — ${p.summary}` : "";
    }
    case "divider":
      return "---";
  }
}

export function llmsFullTxt(): string {
  const out: string[] = [`# ${SITE_NAME} — full handbook`, "", `> ${metaFor("/").description}`, ""];
  for (const c of CHAPTERS) {
    out.push(`# ${c.title}`, "", c.blurb, "");
    for (const l of c.lessons) {
      const url = `${SITE_URL}/learn/${c.id}/${l.id}`;
      out.push(`## ${l.title}`, "", `Source: ${url}`, "", `*${l.summary}*`, "");
      for (const b of l.blocks) {
        const s = blockMd(b, url);
        if (s) out.push(s, "");
      }
    }
  }
  return out.join("\n");
}
