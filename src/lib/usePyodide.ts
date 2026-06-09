import { useCallback, useRef, useState } from "react";

/**
 * Lazily loads Pyodide (CPython compiled to WebAssembly) from the jsDelivr CDN
 * and runs Python in the browser. Loaded once as a module-level singleton; the
 * ~10MB runtime downloads on the first run, then stays cached.
 *
 * Runs on the main thread for simplicity — fine for the short teaching snippets
 * here. A web worker is the upgrade path if long-running code becomes common.
 */

const PYODIDE_VERSION = "0.26.4";
const CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

type PyodideAny = {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
};

let pyodidePromise: Promise<PyodideAny> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Pyodide script"));
    document.head.appendChild(s);
  });
}

function getPyodide(): Promise<PyodideAny> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const w = window as unknown as { loadPyodide?: (o: object) => Promise<PyodideAny> };
      if (!w.loadPyodide) await loadScript(CDN + "pyodide.js");
      return w.loadPyodide!({ indexURL: CDN });
    })();
  }
  return pyodidePromise;
}

export type PyStatus = "idle" | "loading" | "ready" | "error";

export interface RunResult {
  ok: boolean;
  output: string;
  error?: string;
}

export function usePyodide() {
  const [status, setStatus] = useState<PyStatus>("idle");
  const py = useRef<PyodideAny | null>(null);

  const ensure = useCallback(async (): Promise<PyodideAny> => {
    if (py.current) return py.current;
    setStatus("loading");
    try {
      py.current = await getPyodide();
      setStatus("ready");
      return py.current;
    } catch (e) {
      setStatus("error");
      throw e;
    }
  }, []);

  const run = useCallback(
    async (code: string): Promise<RunResult> => {
      let pyo: PyodideAny;
      try {
        pyo = await ensure();
      } catch {
        return { ok: false, output: "", error: "Could not load the Python runtime (offline?)." };
      }
      let output = "";
      pyo.setStdout({ batched: (s) => (output += s) });
      pyo.setStderr({ batched: (s) => (output += s) });
      try {
        await pyo.runPythonAsync(code);
        return { ok: true, output };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { ok: false, output, error: message };
      }
    },
    [ensure],
  );

  return { status, ensure, run };
}
