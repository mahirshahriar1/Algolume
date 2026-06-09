import type { CompareMode, Problem, TestCase } from "./types";
import type { RunResult } from "@/lib/usePyodide";

/**
 * Grades a solution by running the user's Python against a problem's cases in
 * Pyodide. We build a self-contained harness that:
 *   1. runs the user code (defining their entry function),
 *   2. looks the function up in globals(),
 *   3. calls it on each case (stdout per call is captured so prints don't
 *      corrupt our output),
 *   4. compares the result with the requested CompareMode,
 *   5. prints a single sentinel-prefixed JSON line we parse back out.
 *
 * Cases are passed as base64-encoded JSON so arbitrary strings/quotes in the
 * test data can never break the embedded Python literal.
 */

const SENTINEL = "___ALGOLUME_RESULTS___";

export interface CaseResult {
  ok: boolean;
  /** `repr()` of the returned value (shown to help debugging). */
  got?: string;
  /** Exception type + message if the call raised. */
  error?: string;
  /** Captured stdout from the user's function (truncated). */
  stdout?: string;
}

export interface ProblemRunResult {
  /** True only when every graded case passed. */
  ok: boolean;
  /** Set when the harness couldn't even start (missing function, syntax error). */
  fatal?: string;
  cases: CaseResult[];
  passed: number;
  total: number;
}

interface WireCase {
  input: unknown[];
  expected: unknown;
  mode: CompareMode;
}

function toBase64(s: string): string {
  // btoa needs Latin-1; round-trip through UTF-8 so unicode survives.
  return btoa(unescape(encodeURIComponent(s)));
}

function buildHarness(funcName: string, cases: WireCase[]): string {
  const payload = toBase64(JSON.stringify(cases));
  return `
import json as __json, base64 as __b64, io as __io, math as __math
from contextlib import redirect_stdout as __redir

__cases = __json.loads(__b64.b64decode("${payload}").decode("utf-8"))
__fn = globals().get(${JSON.stringify(funcName)})

def __cmp(got, exp, mode):
    try:
        if mode == "unordered":
            return sorted(got) == sorted(exp)
        if mode == "set":
            return set(got) == set(exp)
        if mode == "approx":
            return abs(float(got) - float(exp)) < 1e-6
        return got == exp
    except Exception:
        return got == exp

if not callable(__fn):
    print(${JSON.stringify(SENTINEL)} + __json.dumps({"fatal": "Define a function named '" + ${JSON.stringify(funcName)} + "'."}))
else:
    __results = []
    for __c in __cases:
        __buf = __io.StringIO()
        try:
            with __redir(__buf):
                __got = __fn(*__c["input"])
            __ok = bool(__cmp(__got, __c["expected"], __c.get("mode", "exact")))
            __out = __buf.getvalue()
            __results.append({"ok": __ok, "got": repr(__got), "stdout": __out[:400]})
        except Exception as __e:
            __results.append({"ok": False, "error": type(__e).__name__ + ": " + str(__e)})
    print(${JSON.stringify(SENTINEL)} + __json.dumps({"results": __results}))
`;
}

function parseOutput(raw: string): { results?: CaseResult[]; fatal?: string } | null {
  const at = raw.lastIndexOf(SENTINEL);
  if (at === -1) return null;
  const jsonStr = raw.slice(at + SENTINEL.length).trim();
  try {
    const parsed = JSON.parse(jsonStr) as { results?: CaseResult[]; fatal?: string };
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Run a problem's cases. `which` selects example-only (the "Run" button) or the
 * full graded set (the "Submit" button — examples first, then hidden tests).
 */
export async function runProblem(
  run: (code: string) => Promise<RunResult>,
  problem: Problem,
  userCode: string,
  which: "examples" | "all",
): Promise<ProblemRunResult> {
  const mode = problem.compare ?? "exact";
  const sourceCases: TestCase[] =
    which === "examples" ? problem.examples : [...problem.examples, ...problem.tests];
  const wire: WireCase[] = sourceCases.map((c) => ({ input: c.input, expected: c.expected, mode }));

  const harness = `${userCode}\n${buildHarness(problem.funcName, wire)}`;
  const res = await run(harness);
  const parsed = parseOutput(res.output);

  // No sentinel → the user's code (or harness) blew up before grading.
  if (!parsed) {
    return {
      ok: false,
      fatal: res.error || "Your code raised an error before any test ran. Check for syntax errors.",
      cases: [],
      passed: 0,
      total: wire.length,
    };
  }
  if (parsed.fatal) {
    return { ok: false, fatal: parsed.fatal, cases: [], passed: 0, total: wire.length };
  }

  const cases = parsed.results ?? [];
  const passed = cases.filter((c) => c.ok).length;
  return { ok: passed === cases.length && cases.length > 0, cases, passed, total: cases.length };
}

/** Index in the combined run where hidden (graded-only) cases begin. */
export function hiddenStart(problem: Problem): number {
  return problem.examples.length;
}
