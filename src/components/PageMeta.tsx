import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_URL, metaFor } from "@/lib/seo";

function setTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

const meta = (key: "name" | "property", name: string) => () => {
  const el = document.createElement("meta");
  el.setAttribute(key, name);
  return el;
};

/**
 * Keeps <title>, description, canonical and social tags in sync with the route
 * on client-side navigation. The first load already has them baked in by the
 * prerender; this covers every page after that (and Google's JS rendering).
 */
export function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const m = metaFor(pathname);
    const url = SITE_URL + m.path;
    document.title = m.title;
    setTag('meta[name="description"]', meta("name", "description"), "content", m.description);
    setTag('meta[name="robots"]', meta("name", "robots"), "content", m.noindex ? "noindex" : "index, follow");
    setTag('meta[property="og:title"]', meta("property", "og:title"), "content", m.title);
    setTag('meta[property="og:description"]', meta("property", "og:description"), "content", m.description);
    setTag('meta[property="og:url"]', meta("property", "og:url"), "content", url);
    setTag(
      'link[rel="canonical"]',
      () => Object.assign(document.createElement("link"), { rel: "canonical" }),
      "href",
      url,
    );
  }, [pathname]);

  return null;
}
