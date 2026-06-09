import { useState } from "react";
import { Loader2, Play, RotateCcw, Terminal } from "lucide-react";
import { CodeEditor } from "@/components/CodeEditor";
import { usePyodide, type RunResult } from "@/lib/usePyodide";

export function PlaygroundBlock({ starter, title }: { starter: string; title?: string }) {
  const { status, run } = usePyodide();
  const [code, setCode] = useState(starter);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const busy = running || status === "loading";

  const onRun = async () => {
    setRunning(true);
    setResult(null);
    const next = await run(code);
    setResult(next);
    setRunning(false);
  };

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex flex-col gap-2 border-b border-line bg-elevated/35 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-run">
            Runnable playground
          </div>
          <div className="font-display text-lg font-semibold text-fg">
            {title ?? "Try the idea"}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setCode(starter);
              setResult(null);
            }}
            className="btn-icon h-9 w-9"
            title="Reset code"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button type="button" onClick={onRun} disabled={busy} className="btn-primary h-9 px-3">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
            Run
          </button>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.72fr)]">
        <CodeEditor value={code} onChange={setCode} className="h-72 rounded-none border-0 border-b lg:border-b-0 lg:border-r" />
        <div className="flex min-h-56 flex-col bg-elevated/20">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <Terminal className="h-4 w-4 text-subtle" />
            <span className="text-xs font-semibold uppercase tracking-wider text-subtle">Output</span>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-[13px] leading-relaxed">
            {result === null ? (
              <p className="font-sans text-sm text-subtle">
                {status === "loading" ? "Booting Python..." : "Run the snippet to see output here."}
              </p>
            ) : (
              <>
                {result.output && <pre className="whitespace-pre-wrap text-fg">{result.output}</pre>}
                {result.error && <pre className="mt-2 whitespace-pre-wrap text-swap">{result.error}</pre>}
                {result.ok && !result.output && (
                  <p className="font-sans text-sm text-subtle">Finished with no output.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
