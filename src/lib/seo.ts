import { CHAPTERS, LESSON_COUNT, getLesson } from "@/content";
import { DIFFICULTY_LABEL, PROBLEMS, PROBLEM_COUNT, getProblem, topicLabel } from "@/lib/problems";
import { VISUALIZERS, VIZ_BY_ID } from "@/pages/visualizers/registry";

/**
 * Per-route search/answer-engine metadata. One source of truth for both the
 * live app (components/PageMeta sets <title>/description on navigation) and the
 * build-time prerender (lib/seoStatic + scripts/prerender.mjs), which bakes it
 * into static HTML so crawlers that don't run JS still see real pages.
 */

export const SITE_URL = "https://algolume.vercel.app";
export const SITE_NAME = "Algolume";
export const AUTHOR = {
  "@type": "Person",
  name: "Mahir Shahriar",
  url: "https://www.linkedin.com/in/mahir-shahriar-tamim/",
};

export interface PageMeta {
  title: string;
  description: string;
  /** Canonical path (no origin). */
  path: string;
  /** Keep out of search results (user-specific or missing pages). */
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
}

const HOME_DESCRIPTION =
  "Free interactive handbook for data structures and algorithms: read university-style lessons, watch step-by-step visualizations, run Python in the browser, and solve graded practice problems. No signup.";

/** Search snippets read best between ~70 and ~160 characters. */
function describe(text: string, suffix: string): string {
  const full = `${text.trim().replace(/\s+/g, " ")} ${suffix}`;
  return full.length <= 160 ? full : `${full.slice(0, 157).replace(/\s+\S*$/, "")}…`;
}

function breadcrumbs(items: [string, string][]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: SITE_URL + path,
    })),
  };
}

export function metaFor(pathname: string): PageMeta {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : "/";
  const parts = path.split("/").filter(Boolean);

  if (path === "/") {
    return {
      title: `${SITE_NAME} — Learn Data Structures & Algorithms, Visualized`,
      description: HOME_DESCRIPTION,
      path,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description: HOME_DESCRIPTION,
          author: AUTHOR,
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        },
      ],
    };
  }

  if (path === "/learn") {
    return {
      title: `Algorithms Handbook — ${CHAPTERS.length} Chapters, ${LESSON_COUNT} Lessons | ${SITE_NAME}`,
      description: describe(
        `A free, structured course on data structures and algorithms: ${CHAPTERS.slice(0, 6).map((c) => c.title).join(", ")} and more.`,
        "Each lesson has a live visualization.",
      ),
      path,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Course",
          name: "Data Structures & Algorithms Handbook",
          description: HOME_DESCRIPTION,
          url: SITE_URL + path,
          provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          author: AUTHOR,
          isAccessibleForFree: true,
          inLanguage: "en",
          hasPart: CHAPTERS.map((c) => ({ "@type": "Course", name: c.title, description: c.blurb })),
        },
      ],
    };
  }

  if (parts[0] === "learn" && parts.length === 3) {
    const ref = getLesson(parts[1], parts[2]);
    if (ref) {
      const { chapter, lesson } = ref;
      return {
        title: `${lesson.title} — ${chapter.title} | ${SITE_NAME}`,
        description: describe(lesson.summary, "Interactive lesson with visualization and complexity analysis."),
        path,
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: lesson.title,
            headline: `${lesson.title} — ${chapter.title}`,
            description: lesson.summary,
            url: SITE_URL + path,
            learningResourceType: "Lesson",
            timeRequired: `PT${lesson.estMinutes}M`,
            teaches: lesson.title,
            about: chapter.title,
            isPartOf: { "@type": "Course", name: chapter.title, url: `${SITE_URL}/learn` },
            author: AUTHOR,
            isAccessibleForFree: true,
            inLanguage: "en",
          },
          breadcrumbs([["Learn", "/learn"], [chapter.title, "/learn"], [lesson.title, path]]),
        ],
      };
    }
  }

  if (path === "/problems") {
    return {
      title: `${PROBLEM_COUNT} Algorithm Practice Problems (Easy → Hard) | ${SITE_NAME}`,
      description: describe(
        `Laddered easy, medium and hard coding problems for every algorithms topic, graded in your browser against hidden tests.`,
        "Hints and Python + C++ solutions.",
      ),
      path,
    };
  }

  if (parts[0] === "problems" && parts.length === 2) {
    const p = getProblem(parts[1]);
    if (p) {
      return {
        title: `${p.title} — ${DIFFICULTY_LABEL[p.difficulty]} ${topicLabel(p.topic)} Problem | ${SITE_NAME}`,
        description: describe(p.summary, "Solve it in Python in your browser, with hints and a C++ reference solution."),
        path,
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: p.title,
            description: p.summary,
            url: SITE_URL + path,
            learningResourceType: "Practice problem",
            educationalLevel: DIFFICULTY_LABEL[p.difficulty],
            about: topicLabel(p.topic),
            keywords: p.tags?.join(", "),
            author: AUTHOR,
            isAccessibleForFree: true,
            inLanguage: "en",
          },
          breadcrumbs([["Problems", "/problems"], [p.title, path]]),
        ],
      };
    }
  }

  if (path === "/visualizers") {
    return {
      title: `${VISUALIZERS.length}+ Interactive Algorithm Visualizers | ${SITE_NAME}`,
      description: describe(
        "Step through sorting, searching, trees, heaps, hashing, graphs, dynamic programming and more, frame by frame.",
        "Free, in the browser.",
      ),
      path,
    };
  }

  if (parts[0] === "visualizers" && parts.length === 2) {
    const v = VIZ_BY_ID[parts[1]];
    if (v) {
      return {
        title: `${v.title} Visualizer — Step-by-Step Animation | ${SITE_NAME}`,
        description: describe(v.blurb, "Interactive and free."),
        path,
      };
    }
  }

  const fixed: Record<string, Omit<PageMeta, "path">> = {
    "/sorting": {
      title: `Sorting Algorithm Visualizer — Bubble, Insertion, Merge, Quick, Heap | ${SITE_NAME}`,
      description: describe(
        "Watch sorting algorithms run side by side with live comparison and swap counters, highlighted code, and a scrubbable timeline.",
        "",
      ),
    },
    "/pathfinding": {
      title: `Pathfinding Visualizer — BFS, DFS, Dijkstra, A* | ${SITE_NAME}`,
      description: describe(
        "Draw walls on a grid and watch BFS, DFS, Dijkstra and A* search for the shortest path, step by step.",
        "",
      ),
    },
    "/playground": {
      title: `Online Python Playground (runs in your browser) | ${SITE_NAME}`,
      description: "Write and run real Python 3 in the browser with Pyodide — no install, no account, nothing leaves your machine.",
    },
    "/issue": {
      title: `Report an issue | ${SITE_NAME}`,
      description: "Report a bug, a content error, or suggest a feature for Algolume.",
    },
    "/search": { title: `Search | ${SITE_NAME}`, description: HOME_DESCRIPTION, noindex: true },
    "/notes": { title: `My notes | ${SITE_NAME}`, description: HOME_DESCRIPTION, noindex: true },
  };
  if (fixed[path]) return { ...fixed[path], path };

  return { title: `Page not found | ${SITE_NAME}`, description: HOME_DESCRIPTION, path, noindex: true };
}

/** Every indexable route, for the prerender and sitemap. */
export function indexablePaths(): string[] {
  return [
    "/",
    "/learn",
    ...CHAPTERS.flatMap((c) => c.lessons.map((l) => `/learn/${c.id}/${l.id}`)),
    "/problems",
    ...PROBLEMS.map((p) => `/problems/${p.id}`),
    "/visualizers",
    ...VISUALIZERS.filter((v) => !v.to).map((v) => `/visualizers/${v.id}`),
    "/sorting",
    "/pathfinding",
    "/playground",
    "/issue",
  ];
}
