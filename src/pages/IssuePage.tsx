import { useState } from "react";
import { Bug, Lightbulb, FileWarning, MessageSquare, Send, Loader2, CheckCircle2, Mail } from "lucide-react";
import { cn } from "@/lib/cn";

const TO_EMAIL = "03mahirshahriar@gmail.com";
// Optional: a Web3Forms access key (https://web3forms.com — free, tied to the
// recipient email) sends the message straight to the inbox with no mail client.
// Without it, we fall back to a prefilled mailto: link.
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

type Kind = "bug" | "idea" | "content" | "other";
const KINDS: { id: Kind; label: string; icon: typeof Bug }[] = [
  { id: "bug", label: "Bug", icon: Bug },
  { id: "idea", label: "Idea / request", icon: Lightbulb },
  { id: "content", label: "Content error", icon: FileWarning },
  { id: "other", label: "Other", icon: MessageSquare },
];

export function IssuePage() {
  const [kind, setKind] = useState<Kind>("bug");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const kindLabel = KINDS.find((k) => k.id === kind)!.label;
  const fullSubject = `[Algolume · ${kindLabel}] ${subject || "(no subject)"}`;

  const openMailto = () => {
    const body = `${message}\n\n---\nType: ${kindLabel}\nFrom: ${email || "(not provided)"}\nPage: ${typeof navigator !== "undefined" ? navigator.userAgent : ""}`;
    window.location.href = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Preferred: Web3Forms sends the email in the background.
    if (WEB3FORMS_KEY) {
      setStatus("sending");
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: fullSubject,
            from_name: "Algolume feedback",
            email: email || undefined,
            message: `${message}\n\nType: ${kindLabel}\nReply-to: ${email || "(not provided)"}`,
          }),
        });
        if (!res.ok) throw new Error("send failed");
        setStatus("sent");
        setSubject("");
        setMessage("");
        return;
      } catch {
        setStatus("error");
        return;
      }
    }

    // Fallback: open the user's mail client prefilled to the maintainer.
    openMailto();
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <span className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-run/15 text-run">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Thanks for the report!</h1>
        <p className="mt-3 text-muted">
          {WEB3FORMS_KEY
            ? "Your message is on its way. I appreciate you taking the time."
            : "Your email app should have opened with the message ready — just hit send."}
        </p>
        <button onClick={() => setStatus("idle")} className="btn-ghost mt-6">
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-12 sm:px-6">
      <p className="eyebrow mb-3 inline-flex items-center gap-2">
        <Mail className="h-3.5 w-3.5 text-run" />
        Feedback
      </p>
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Submit an issue</h1>
      <p className="mt-3 text-muted">
        Found a bug, a wrong answer, or have an idea? Tell me — it goes straight to the maintainer.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-subtle">Type</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {KINDS.map((k) => (
              <button
                type="button"
                key={k.id}
                onClick={() => setKind(k.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition-colors",
                  kind === k.id ? "border-run/50 bg-run/10 text-run" : "border-line bg-surface text-muted hover:bg-elevated",
                )}
              >
                <k.icon className="h-4 w-4" />
                {k.label}
              </button>
            ))}
          </div>
        </div>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-subtle">Subject</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Short summary"
            className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-fg placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-subtle">Details</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={6}
            placeholder="What happened, where, and what you expected. For content errors, include the lesson or problem name."
            className="w-full resize-y rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-subtle">
            Your email <span className="font-normal normal-case text-subtle">(optional, so I can reply)</span>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-fg placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
          />
        </label>

        {status === "error" && (
          <p className="rounded-lg border border-swap/40 bg-swap/5 px-3 py-2 text-sm text-swap">
            Couldn't send automatically.{" "}
            <button type="button" onClick={openMailto} className="underline">
              Open your email app instead
            </button>
            .
          </p>
        )}

        <button type="submit" disabled={status === "sending" || !message.trim()} className="btn-primary w-full">
          {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send
        </button>
        <p className="text-center text-xs text-subtle">
          Goes to <span className="font-mono">{TO_EMAIL}</span>.
        </p>
      </form>
    </div>
  );
}
