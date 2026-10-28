// Supabase keep-alive + health alert. Run by .github/workflows/supabase-keepalive.yml.
//
// Free-tier Supabase projects pause after ~7 days without activity. This makes a
// tiny real query (PostgREST -> Postgres) so the project always looks active. If
// the database can't be reached after a few retries, it emails the maintainer via
// the same Web3Forms inbox the "Submit an issue" form uses, then exits non-zero
// so the workflow run is marked failed (GitHub also emails on failed runs).
//
// Env: SUPABASE_URL, SUPABASE_ANON_KEY, WEB3FORMS_KEY (optional but recommended).

const { SUPABASE_URL, SUPABASE_ANON_KEY, WEB3FORMS_KEY } = process.env;
const ATTEMPTS = 3;
const RETRY_DELAY_MS = 20_000;
const TIMEOUT_MS = 15_000;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY.");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ping() {
  // RLS hides every row from the anon role, so this returns [] — but it still
  // executes a query against the database, which is what counts as activity.
  const url = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/user_state?select=user_id&limit=1`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    const body = (await res.text()).slice(0, 500);
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${body}`);
  }
  return res.status;
}

async function alert(errors) {
  if (!WEB3FORMS_KEY) {
    console.error("WEB3FORMS_KEY not set — cannot send alert email.");
    return false;
  }
  const runUrl = process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : "(local run)";
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: "[Algolume · Alert] Supabase database unreachable",
      from_name: "Algolume keep-alive",
      message:
        `The scheduled keep-alive could not reach the Supabase database after ${ATTEMPTS} attempts.\n\n` +
        `Project: ${SUPABASE_URL}\nTime: ${new Date().toISOString()}\nRun: ${runUrl}\n\n` +
        `Errors:\n${errors.map((e, i) => `  ${i + 1}. ${e}`).join("\n")}\n\n` +
        `If the project was paused, restore it from the Supabase dashboard.`,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    console.error(`Alert email failed: HTTP ${res.status}`, data);
    return false;
  }
  console.log("Alert email sent.");
  return true;
}

const errors = [];
for (let i = 1; i <= ATTEMPTS; i++) {
  try {
    const status = await ping();
    console.log(`Supabase OK (HTTP ${status}) on attempt ${i}.`);
    process.exit(0);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(msg);
    console.error(`Attempt ${i}/${ATTEMPTS} failed: ${msg}`);
    if (i < ATTEMPTS) await sleep(RETRY_DELAY_MS);
  }
}

await alert(errors);
process.exit(1);
