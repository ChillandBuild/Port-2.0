import type { Metadata } from "next";

export const metadata: Metadata = { title: "Chat demo — Port 2.0" };

export default function ChatDemoPage() {
  return (
    <main style={{ minHeight: "100dvh", background: "var(--surface-page)", color: "var(--on-page)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px 96px" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--on-page-soft)", margin: 0 }}>Demo · Re: hello bot</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 0.95, margin: "10px 0 12px" }}>
          Talk to the site. <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 300 }}>hello.</span>
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.6, color: "var(--on-page-soft)", maxWidth: 560 }}>
          This is a live, clickable demo — no API key, no LLM cost. Answers come only from <code>lib/content.ts</code> + <code>SITE-CONTENT.md</code>. Try the 3 scenarios below, then type anything.
        </p>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", marginTop: 20 }}>
          {[
            { k: "01", t: "Recruiter", d: "“Is he open to full-time?” → hiring card + resume CTA" },
            { k: "02", t: "Founder", d: "“20 meetings/mo for SaaS?” → live estimate from ESTIMATOR" },
            { k: "03", t: "Skeptic", d: "“Prove the 200M+” → grounded ledger with employer sources" },
          ].map((s) => (
            <div key={s.k} style={{ border: "1px solid var(--rule)", borderRadius: 14, padding: "14px 14px", background: "var(--surface-chrome)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--on-page-soft)" }}>{s.k} · {s.t}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.5, marginTop: 6 }}>{s.d}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, border: "1px dashed var(--rule)", borderRadius: 14, padding: "14px", background: "var(--surface-page-alt)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--on-page-soft)" }}>How to test</div>
          <ol style={{ fontFamily: "var(--font-body)", fontSize: 13.5, lineHeight: 1.6, margin: "6px 0 0 18px", color: "var(--on-page)" }}>
            <li>Click <strong>Re: hello — ask me anything</strong> at the bottom-right.</li>
            <li>Tap a chip or type e.g. <em>“What does the USD 350 cover?”</em> or <em>“Estimate 200 leads/mo”</em>.</li>
            <li>Check the CTAs — they route to <code>/hire</code>, <code>/schedule</code>, <code>/case-studies</code> etc.</li>
            <li>Try an out-of-scope question like <em>“Do you do crypto?”</em> — it refuses to guess.</li>
          </ol>
        </div>

        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--on-page-soft)", marginTop: 14 }}>
          Widget code: <code>components/chat/ChatWidget.tsx</code> · Brain: <code>app/api/chat/route.ts</code> (mock, swap for Vercel AI SDK later) · Prompts from <code>lib/content.ts:1</code>
        </p>
      </div>
    </main>
  );
}
