import { useState } from "react";
import { Play, Loader2, Terminal, Code2, RotateCcw } from "lucide-react";
import { CodeEditor } from "@/components/CodeEditor";
import { usePyodide, type RunResult } from "@/lib/usePyodide";
import { cn } from "@/lib/cn";

const EXAMPLES: { name: string; code: string }[] = [
  {
    name: "Bubble sort",
    code: `def bubble_sort(a):
    a = a[:]
    n = len(a)
    for i in range(n):
        swapped = False
        for j in range(n - i - 1):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        if not swapped:
            break
    return a

data = [5, 2, 8, 1, 9, 3, 7, 4]
print("input: ", data)
print("sorted:", bubble_sort(data))
`,
  },
  {
    name: "Binary search",
    code: `def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    steps = 0
    while lo <= hi:
        steps += 1
        mid = (lo + hi) // 2
        if a[mid] == target:
            return mid, steps
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1, steps

a = list(range(0, 100, 2))   # even numbers 0..98
idx, steps = binary_search(a, 42)
print(f"found 42 at index {idx} in {steps} steps")
print(f"(linear search would take up to {len(a)} steps)")
`,
  },
  {
    name: "Fibonacci",
    code: `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

for i in range(10):
    print(i, "->", fib(i))
`,
  },
];

export function PlaygroundPage() {
  const { status, run } = usePyodide();
  const [code, setCode] = useState(EXAMPLES[0].code);
  const [active, setActive] = useState(0);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);

  const loadExample = (i: number) => {
    setActive(i);
    setCode(EXAMPLES[i].code);
    setResult(null);
  };

  const onRun = async () => {
    setRunning(true);
    setResult(null);
    const r = await run(code);
    setResult(r);
    setRunning(false);
  };

  const busy = running || status === "loading";

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
      <div className="mb-6">
        <p className="eyebrow mb-3 inline-flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-run" />
          Playground
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Run real Python, right here.
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          This is genuine CPython compiled to WebAssembly through Pyodide. It runs
          entirely in your browser. Edit the code and hit run.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-subtle">Examples:</span>
        {EXAMPLES.map((ex, i) => (
          <button
            key={ex.name}
            onClick={() => loadExample(i)}
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer",
              i === active
                ? "bg-run/15 text-fg ring-1 ring-run/40"
                : "bg-elevated text-muted hover:bg-line/60",
            )}
          >
            {ex.name}
          </button>
        ))}
        <button
          onClick={() => loadExample(active)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-line bg-elevated px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:bg-line/60 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <CodeEditor value={code} onChange={setCode} className="h-[420px]" />
          <button onClick={onRun} disabled={busy} className="btn-primary w-full">
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4 fill-current" />
            )}
            {status === "loading"
              ? "Booting Python... (first run downloads it once)"
              : running
                ? "Running..."
                : "Run"}
          </button>
        </div>

        <div className="panel flex h-[420px] flex-col lg:h-auto">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <Terminal className="h-4 w-4 text-subtle" />
            <span className="text-xs font-semibold uppercase tracking-wider text-subtle">
              Output
            </span>
          </div>
          <div className="min-h-[360px] flex-1 overflow-auto p-4 font-mono text-[13px] leading-relaxed">
            {result === null ? (
              <p className="text-subtle">
                {status === "loading"
                  ? "Downloading the Python runtime..."
                  : "Press Run to execute your code."}
              </p>
            ) : (
              <>
                {result.output && (
                  <pre className="whitespace-pre-wrap text-fg">{result.output}</pre>
                )}
                {result.error && (
                  <pre className="mt-2 whitespace-pre-wrap text-swap">{result.error}</pre>
                )}
                {result.ok && !result.output && (
                  <p className="text-subtle">-- finished with no output --</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-subtle">
        Powered by Pyodide. Everything runs locally; nothing is sent anywhere.
      </p>
    </div>
  );
}
