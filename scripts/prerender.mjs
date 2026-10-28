// Post-build prerender: writes a static HTML file per route (real title, meta,
// JSON-LD and readable content inside #root) plus sitemap.xml, robots.txt,
// llms.txt and llms-full.txt into dist/. React replaces the static content on
// mount, so users get the app; crawlers that don't run JS get real pages.
// Vercel serves these files before the SPA rewrite in vercel.json kicks in.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createServer } from "vite";

const DIST = "dist";

// Load the TS content through Vite so the @/ alias and TSX just work.
const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
let seo;
try {
  seo = await vite.ssrLoadModule("/src/lib/seoStatic.ts");
} finally {
  await vite.close();
}

const template = await readFile(join(DIST, "index.html"), "utf8");
const headRe = /\s*<title>[\s\S]*?<\/title>\s*<meta name="description"[^>]*>/;
if (!headRe.test(template) || !template.includes('<div id="root"></div>')) {
  throw new Error("prerender: index.html no longer has the expected <title>/description/#root markers");
}

const pages = seo.staticPages();
for (const page of pages) {
  const html = template
    .replace(headRe, `\n    ${page.head}`)
    .replace('<div id="root"></div>', `<div id="root">${page.body}</div>`);
  const file = page.path === "/" ? join(DIST, "index.html") : join(DIST, page.path, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

await writeFile(join(DIST, "sitemap.xml"), seo.sitemapXml(new Date().toISOString().slice(0, 10)));
await writeFile(join(DIST, "robots.txt"), seo.robotsTxt());
await writeFile(join(DIST, "llms.txt"), seo.llmsTxt());
await writeFile(join(DIST, "llms-full.txt"), seo.llmsFullTxt());

console.log(`prerender: ${pages.length} pages + sitemap.xml, robots.txt, llms.txt, llms-full.txt`);
