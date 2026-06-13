import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scroll to the top whenever the route (pathname) changes — React Router keeps
 * the previous scroll position by default. Watches pathname only, so in-page
 * hash anchors and query-param changes (e.g. problem filters) don't jump.
 */
export function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
