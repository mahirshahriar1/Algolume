import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Play, Loader2, RotateCcw, CheckCircle2, XCircle, Lightbulb,
  Eye, BookOpen, Send, Trophy,
} from "lucide-react";
import { CodeEditor } from "@/components/CodeEditor";
import { CopyButton } from "@/components/CopyButton";
import { MarkdownLite } from "@/components/lesson/MarkdownLite";
import { usePyodide } from "@/lib/usePyodide";
import { getProblem, DIFFICULTY_LABEL, topicLabel } from "@/lib/problems";
import type { Difficulty, Problem } from "@/lib/problems";
import { runProblem, type ProblemRunResult } from "@/lib/problems/runner";
import { markSolved, useSolved } from "@/lib/problems/solved";
import { cn } from "@/lib/cn";

const DIFF_STYLE: Record<Difficulty, string> = {
  easy: "text-run bg-run/10 ring-run/30",
  medium: "text-pivot bg-pivot/10 ring-pivot/30",
  hard: "text-swap bg-swap/10 ring-swap/30",
};

type SolutionLanguage = "python" | "cpp";

/** Render a JS value the way Python's repr() would, so examples read naturally. */
function pyRepr(v: unknown): string {
  if (v === null) return "None";
  if (typeof v === "boolean") return v ? "True" : "False";
  if (typeof v === "string") return `'${v}'`;
  if (Array.isArray(v)) return `[${v.map(pyRepr).join(", ")}]`;
  return String(v);
}

function callString(funcName: string, input: unknown[]): string {
  return `${funcName}(${input.map(pyRepr).join(", ")})`;
}

export function ProblemPage() {
  const { id = "" } = useParams();
  const problem = getProblem(id);
  const solved = useSolved();
  const { status, run } = usePyodide();

  const [solutionLanguage, setSolutionLanguage] = useState<SolutionLanguage>("python");
  const [code, setCode] = useState(problem?.starter ?? "");
  const [result, setResult] = useState<ProblemRunResult | null>(null);
  const [ranMode, setRanMode] = useState<"examples" | "all">("examples");
  const [running, setRunning] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const exampleCount = problem?.examples.length ?? 0;

  useEffect(() => {
    setSolutionLanguage("python");
    setCode(problem?.starter ?? "");
    setResult(null);
    setHintsShown(0);
    setShowSolution(false);
  }, [problem?.id, problem?.starter]);

  const onRun = async (which: "examples" | "all") => {
    if (!problem) return;
    setRunning(true);
    setResult(null);
    setRanMode(which);
    const r = await runProblem(run, problem, code, which);
    setResult(r);
    setRunning(false);
    if (which === "all" && r.ok) markSolved(problem.id);
  };

  const reset = () => {
    if (!problem) return;
    setCode(problem.starter);
    setResult(null);
  };

  const busy = running || status === "loading";

  if (!problem) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <p className="text-muted">That problem doesn't exist.</p>
        <Link to="/problems" className="mt-4 inline-block text-run underline">Back to problems</Link>
      </div>
    );
  }

  const isDone = solved.has(problem.id);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
      <div className="mb-5 flex items-center justify-between">
        <Link to="/problems" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
          <ArrowLeft className="h-4 w-4" /> All problems
        </Link>
        <CopyButton text={typeof window !== "undefined" ? window.location.href : ""} label="Copy link" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ---- Statement column ------------------------------------------ */}
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">{problem.title}</h1>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1", DIFF_STYLE[problem.difficulty])}>
              {DIFFICULTY_LABEL[problem.difficulty]}
            </span>
            {isDone && (
              <span className="inline-flex items-center gap-1 rounded-full bg-run/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-run ring-1 ring-run/30">
                <Trophy className="h-3 w-3" /> Solved
              </span>
            )}
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-md bg-elevated px-2 py-1 font-medium text-subtle">{topicLabel(problem.topic)}</span>
            {problem.complexity && (
              <span className="rounded-md bg-elevated px-2 py-1 font-mono text-subtle">
                target {problem.complexity.time} · {problem.complexity.space}
              </span>
            )}
            {problem.lesson && (
              <Link to={problem.lesson} className="inline-flex items-center gap-1 rounded-md bg-elevated px-2 py-1 font-medium text-run hover:bg-run/10">
                <BookOpen className="h-3 w-3" /> Learn the idea
              </Link>
            )}
          </div>

          <div className="text-[15px]">
            <MarkdownLite md={problem.statement} />
          </div>

          {/* Examples */}
          <h2 className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">Examples</h2>
          <div className="space-y-2">
            {problem.examples.map((ex, i) => (
              <div key={i} className="rounded-xl border border-line bg-surface p-3 font-mono text-[13px]">
                <div className="text-muted">
                  <span className="text-subtle">Input </span>{callString(problem.funcName, ex.input)}
                </div>
                <div className="text-fg">
                  <span className="text-subtle">Output </span>{pyRepr(ex.expected)}
                </div>
                {ex.explain && <div className="mt-1 font-sans text-xs text-subtle">{ex.explain}</div>}
              </div>
            ))}
          </div>

          {/* Hints */}
          <h2 className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">Hints</h2>
          <div className="space-y-2">
            {problem.hints.slice(0, hintsShown).map((h, i) => (
              <div key={i} className="flex gap-2.5 rounded-xl border border-pivot/30 bg-pivot/5 p-3 text-sm text-muted">
                <Lightbulb className="h-4 w-4 shrink-0 text-pivot" />
                <span>{h}</span>
              </div>
            ))}
            {hintsShown < problem.hints.length && (
              <button
                onClick={() => setHintsShown((n) => n + 1)}
                className="btn-ghost text-sm"
              >
                <Lightbulb className="h-4 w-4" />
                {hintsShown === 0 ? "Show a hint" : "Next hint"} ({hintsShown}/{problem.hints.length})
              </button>
            )}
          </div>

          {/* Solution */}
          <h2 className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">Reference solution</h2>
          {showSolution ? (
            <div className="overflow-hidden rounded-xl border border-line bg-code">
              <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
                <LanguagePill
                  active={solutionLanguage === "python"}
                  onClick={() => setSolutionLanguage("python")}
                >
                  Python
                </LanguagePill>
                <LanguagePill
                  active={solutionLanguage === "cpp"}
                  onClick={() => setSolutionLanguage("cpp")}
                >
                  C++
                </LanguagePill>
                <CopyButton
                  className="ml-auto"
                  text={solutionLanguage === "python" ? problem.solution : problem.cppSolution ?? ""}
                />
              </div>
              <pre className="overflow-auto p-4 font-mono text-[13px] leading-relaxed text-fg">
                <code>{solutionLanguage === "python" ? problem.solution : problem.cppSolution ?? "// C++ solution not added yet."}</code>
              </pre>
            </div>
          ) : (
            <button onClick={() => setShowSolution(true)} className="btn-ghost text-sm">
              <Eye className="h-4 w-4" /> Reveal solution
            </button>
          )}
        </div>

        {/* ---- Workspace column ------------------------------------------ */}
        <div className="min-w-0">
          <div className="lg:sticky lg:top-20 space-y-3">
            <CodeEditor value={code} onChange={setCode} className="h-[340px]" />

            <div className="flex flex-wrap gap-2">
              <button onClick={() => onRun("examples")} disabled={busy} className="btn-ghost flex-1">
                {busy && ranMode === "examples" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Run examples
              </button>
              <button onClick={() => onRun("all")} disabled={busy} className="btn-primary flex-1">
                {busy && ranMode === "all" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit
              </button>
              <button onClick={reset} disabled={busy} className="btn-icon" title="Reset to starter">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {status === "loading" && (
              <p className="text-center text-xs text-subtle">Booting Python… (first run downloads it once)</p>
            )}

            {result && <Results problem={problem} result={result} which={ranMode} exampleCount={exampleCount} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function LanguagePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
        active ? "bg-run/15 text-fg ring-1 ring-run/40" : "text-muted hover:bg-elevated",
      )}
    >
      {children}
    </button>
  );
}

function Results({
  result, which, exampleCount, problem,
}: {
  result: ProblemRunResult;
  which: "examples" | "all";
  exampleCount: number;
  problem: Problem;
}) {
  if (result.fatal) {
    return (
      <div className="rounded-xl border border-swap/40 bg-swap/5 p-4">
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-swap">
          <XCircle className="h-4 w-4" /> Couldn't run
        </div>
        <pre className="whitespace-pre-wrap font-mono text-xs text-muted">{result.fatal}</pre>
      </div>
    );
  }

  const allPassed = result.ok;
  const banner = which === "all"
    ? allPassed
      ? "All tests passed — solved!"
      : `${result.passed} of ${result.total} tests passed`
    : `${result.passed} of ${result.total} examples passed`;

  return (
    <div className="space-y-2">
      <div className={cn(
        "flex items-center gap-2 rounded-xl border p-3 text-sm font-semibold",
        allPassed ? "border-run/40 bg-run/5 text-run" : "border-swap/40 bg-swap/5 text-swap",
      )}>
        {allPassed ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
        {banner}
      </div>

      <div className="space-y-1.5">
        {result.cases.map((c, i) => {
          const isExample = i < exampleCount;
          const source = isExample ? problem.examples[i] : undefined;
          return (
            <div
              key={i}
              className={cn(
                "rounded-lg border p-2.5 font-mono text-xs",
                c.ok ? "border-line bg-surface" : "border-swap/40 bg-swap/5",
              )}
            >
              <div className="flex items-center gap-2">
                {c.ok ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-run" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 shrink-0 text-swap" />
                )}
                <span className="font-sans font-medium text-fg">
                  {isExample ? `Example ${i + 1}` : `Hidden test ${i - exampleCount + 1}`}
                </span>
              </div>
              {source && (
                <div className="mt-1 pl-6 text-muted">
                  <div><span className="text-subtle">in  </span>{callString(problem.funcName, source.input)}</div>
                  <div><span className="text-subtle">want</span> {pyRepr(source.expected)}</div>
                </div>
              )}
              {!c.ok && (
                <div className="mt-1 pl-6 text-swap">
                  {c.error ? `raised ${c.error}` : <><span className="text-subtle">got </span>{c.got}</>}
                </div>
              )}
              {c.stdout && c.stdout.trim() && (
                <div className="mt-1 whitespace-pre-wrap pl-6 text-subtle">stdout: {c.stdout.trim()}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
