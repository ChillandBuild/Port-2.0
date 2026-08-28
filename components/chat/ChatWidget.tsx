"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ChatWidget.module.css";

type Role = "user" | "bot";
type Msg = { id: string; role: Role; text: string; chips?: string[]; ctas?: { label: string; href: string; solid?: boolean }[] };

const STARTERS = [
  "Is Sampath open to full-time roles?",
  "What does the USD 350 session cover?",
  "How does the performance model work?",
  "Show me his results",
];

const GREETING: Msg = {
  id: "greet",
  role: "bot",
  text: "Hi — ask me anything about Sampath: hiring, services, pricing, process, or past results. I'll point you to the right page.",
  chips: STARTERS,
};

function uid() { return Math.random().toString(36).slice(2, 9); }

export function ChatWidget({ inline }: { inline?: boolean } = {}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const userMsg: Msg = { id: uid(), role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })) }),
      });
      const data = (await res.json()) as { text: string; chips?: string[]; ctas?: Msg["ctas"] };
      setMessages((m) => [...m, { id: uid(), role: "bot", text: data.text, chips: data.chips, ctas: data.ctas }]);
    } catch {
      setMessages((m) => [...m, { id: uid(), role: "bot", text: "Something broke on this end. Try LinkedIn instead — link below.", ctas: [{ label: "Connect on LinkedIn", href: "https://www.linkedin.com/in/sampath-kumar-tn66sk9699", solid: true }] }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`${styles.dock} ${inline ? styles.dockInline : ""}`} aria-live="polite">
      {open && (
        <div className={styles.panel} role="dialog" aria-label="Hello bot chat">
          <div className={styles.head}>
            <div className={styles.headLeft}>
              <span className={styles.eyebrow}>Ask about Sampath</span>
              <span className={styles.title}>Every deal begins with hello.</span>
              <span className={styles.statusRow}><span className={styles.bubbleDot} /> Online · replies in seconds</span>
            </div>
            <button className={styles.close} onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </div>

          <div className={styles.messages} ref={listRef}>
            {messages.map((m) => (
              <div key={m.id} className={`${styles.msg} ${m.role === "user" ? styles.user : styles.bot}`}>
                {m.role === "bot" && <div className={styles.meta}>Sampath</div>}
                {m.text.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                {m.chips && m.chips.length > 0 && (
                  <div className={styles.chips}>
                    {m.chips.map((c) => (
                      <button key={c} className={styles.chip} onClick={() => send(c)}>{c}</button>
                    ))}
                  </div>
                )}
                {m.ctas && m.ctas.length > 0 && (
                  <div className={styles.ctaRow}>
                    {m.ctas.map((c) => (
                      <a key={c.label} href={c.href} className={`${styles.cta} ${c.solid ? styles.ctaSolid : ""}`}>{c.label}</a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {busy && (
              <div className={`${styles.msg} ${styles.bot}`}>
                <span className={styles.typing}><span /><span /><span /></span>
              </div>
            )}
          </div>

          <div className={styles.quickRow}>
            <button className={styles.quick} onClick={() => send("What does it cost?")}>Cost</button>
            <button className={styles.quick} onClick={() => send("Show me his work history")}>Work history</button>
            <button className={styles.quick} onClick={() => send("Estimate 100 leads/mo for SaaS")}>Estimate 100/mo</button>
            <button className={styles.quick} onClick={() => send("Where is he based?")}>Location</button>
          </div>

          <form
            className={styles.composer}
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about hiring, pricing, process..."
              aria-label="Ask the bot"
            />
            <button className={styles.send} disabled={!input.trim() || busy} aria-label="Send">↑</button>
          </form>
        </div>
      )}

      <button className={styles.bubble} onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="chat-panel">
        <span className={styles.bubbleDot} aria-hidden />
        {open ? "Close" : "Ask about Sampath"}
      </button>
    </div>
  );
}
