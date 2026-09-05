"use client";

import { useEffect, useRef, useState } from "react";
import { IDENTITY } from "@/lib/content";
import { IconTelegram, IconVideo, IconWhatsApp } from "./icons";
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
  const [footerInView, setFooterInView] = useState(false);
  // Starts cleared, not visible. Every load begins at the top of the page with
  // the hero up, so "cleared" is the correct first frame — and this renders on
  // the server, where the observer below has not run yet. Defaulting to false
  // put the dock on screen over the hero for the whole hydration window.
  const [heroActionsInView, setHeroActionsInView] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  // The dock floats exactly where the footer's contact lines and fine print sit,
  // so once the colophon scrolls into view the dock steps aside instead of
  // sitting on it. An open panel is a dialog and keeps its place.
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setFooterInView(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // The dock's fixed bottom-right slot also crowds the hero's Hire me / Work
  // with me / Skip to the numbers row on shorter viewports, so it steps aside
  // there too until the user scrolls past it. The hero block is pinned and
  // cross-fades in place (WorldStage.tsx drives its opacity/visibility every
  // frame during scroll), so its bounding rect never actually leaves the
  // viewport — an IntersectionObserver would see it as "in view" forever.
  // Reading the same visibility WorldStage writes onto the node is the only
  // signal that tracks its real on/off state.
  useEffect(() => {
    const heroBlock = document.querySelector<HTMLElement>("[data-hero-actions]");
    // No hero on this route (or no observer to watch it with): the default
    // above is a hero-specific one, so release it rather than leave the dock
    // hidden for good on a page that never had a hero to step aside for. Both
    // the first read and every observed change run through the same updater,
    // so there is one path that writes this state instead of two.
    const update = () =>
      setHeroActionsInView(heroBlock ? heroBlock.style.visibility !== "hidden" : false);
    update();
    if (!heroBlock || typeof MutationObserver === "undefined") return;
    const observer = new MutationObserver(update);
    observer.observe(heroBlock, { attributes: true, attributeFilter: ["style"] });
    return () => observer.disconnect();
  }, []);

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
    <div
      className={`${styles.dock} ${inline ? styles.dockInline : ""} ${(footerInView || heroActionsInView) && !open ? styles.dockClear : ""}`}
      aria-live="polite"
    >
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

      {!open && (
        <div className={styles.quickLinks}>
          <a
            className={`${styles.quickLink} ${styles.quickLinkWhatsapp}`}
            href={IDENTITY.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message on WhatsApp"
            title="Message on WhatsApp"
          >
            <IconWhatsApp />
          </a>
          <a
            className={`${styles.quickLink} ${styles.quickLinkTelegram}`}
            href={IDENTITY.telegram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message on Telegram"
            title="Message on Telegram"
          >
            <IconTelegram />
          </a>
          <button
            type="button"
            className={`${styles.quickLink} ${styles.quickLinkVideo}`}
            aria-label="Video — coming soon"
            title="Video — coming soon"
            aria-disabled="true"
          >
            <IconVideo />
            <span className={styles.soonBadge} aria-hidden="true">Soon</span>
          </button>
        </div>
      )}

      <button className={styles.bubble} onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="chat-panel">
        <span className={styles.bubbleDot} aria-hidden />
        <span className={styles.bubbleLabel}>{open ? "Close" : "Ask about Sampath"}</span>
      </button>
    </div>
  );
}
