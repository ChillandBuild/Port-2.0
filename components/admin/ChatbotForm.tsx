"use client";

/**
 * /admin/chatbot — the whole answer set as one JSON document, edited through
 * plain fields. Still one save (one content key: chatbot_answers) because
 * matching order matters — answers are tried top to bottom, first keyword
 * match wins — so the list needs to stay one reorderable array, not split
 * into separate cards. Keywords/chips are comma-separated text instead of a
 * JSON array; CTAs get their own small repeating rows.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChatbotContent, ChatbotAnswer, ChatbotCta } from "@/lib/backend/site-content-loaders";
import { saveKey, TextField, TextAreaField, SaveRow, type SaveStatus } from "./form-kit";
import styles from "./Admin.module.css";

const TOKEN_HINT =
  "Available tokens in text/chips/button links: {{phone}}, {{phoneHref}}, {{linkedin}}, {{telegram}}, {{resume}}, {{secondCallPrice}}, {{secondCallPriceUsd}}. " +
  'One intent — "estimate my pipeline" — runs real math instead of stored text and isn\'t listed here.';

interface EditableCta {
  key: string;
  label: string;
  href: string;
  solid: boolean;
}

interface EditableAnswer {
  key: string;
  id: string;
  keywordsText: string;
  text: string;
  chipsText: string;
  ctas: EditableCta[];
}

let nextKey = 0;

function splitList(text: string): string[] {
  return text
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function toEditableAnswer(answer: ChatbotAnswer): EditableAnswer {
  return {
    key: `a${nextKey++}`,
    id: answer.id,
    keywordsText: answer.keywords.join(", "),
    text: answer.text,
    chipsText: (answer.chips ?? []).join(", "),
    ctas: (answer.ctas ?? []).map((cta) => ({ key: `c${nextKey++}`, label: cta.label, href: cta.href, solid: cta.solid ?? false })),
  };
}

function toChatbotAnswer(answer: EditableAnswer): ChatbotAnswer {
  const chips = splitList(answer.chipsText);
  const ctas: ChatbotCta[] = answer.ctas
    .filter((cta) => cta.label.trim() && cta.href.trim())
    .map((cta) => ({ label: cta.label.trim(), href: cta.href.trim(), ...(cta.solid ? { solid: true } : {}) }));
  return {
    id: answer.id.trim(),
    keywords: splitList(answer.keywordsText),
    text: answer.text,
    ...(chips.length > 0 ? { chips } : {}),
    ...(ctas.length > 0 ? { ctas } : {}),
  };
}

function AnswerEditor({
  answer,
  onChange,
  showKeywords = true,
}: {
  answer: EditableAnswer;
  onChange: (next: EditableAnswer) => void;
  showKeywords?: boolean;
}) {
  function updateCta(ctaKey: string, patch: Partial<EditableCta>) {
    onChange({ ...answer, ctas: answer.ctas.map((cta) => (cta.key === ctaKey ? { ...cta, ...patch } : cta)) });
  }
  function removeCta(ctaKey: string) {
    onChange({ ...answer, ctas: answer.ctas.filter((cta) => cta.key !== ctaKey) });
  }
  function addCta() {
    onChange({ ...answer, ctas: [...answer.ctas, { key: `c${nextKey++}`, label: "", href: "", solid: false }] });
  }

  return (
    <>
      <div className={styles.settingsGrid}>
        <TextField label="Id (internal label, not shown to visitors)" value={answer.id} onChange={(v) => onChange({ ...answer, id: v })} />
        {showKeywords && (
          <TextField
            label="Keywords (comma-separated, matched as substrings)"
            value={answer.keywordsText}
            onChange={(v) => onChange({ ...answer, keywordsText: v })}
          />
        )}
      </div>
      <TextAreaField label="Answer text" value={answer.text} rows={5} onChange={(v) => onChange({ ...answer, text: v })} />
      <TextField
        label="Quick-reply chips (comma-separated, optional)"
        value={answer.chipsText}
        onChange={(v) => onChange({ ...answer, chipsText: v })}
      />

      {answer.ctas.length > 0 && (
        <div className={styles.chapterSections}>
          {answer.ctas.map((cta) => (
            <div className={styles.chapterSection} key={cta.key}>
              <div className={styles.settingsGrid}>
                <TextField label="Button label" value={cta.label} onChange={(v) => updateCta(cta.key, { label: v })} />
                <TextField label="Button link (URL or {{token}})" value={cta.href} onChange={(v) => updateCta(cta.key, { href: v })} />
              </div>
              <div className={styles.settingsSaveRow}>
                <label className={styles.label}>
                  <input type="checkbox" checked={cta.solid} onChange={(event) => updateCta(cta.key, { solid: event.target.checked })} />{" "}
                  Solid (primary) button
                </label>
                <button type="button" className={`${styles.ghost} ${styles.danger}`} onClick={() => removeCta(cta.key)}>
                  Remove button
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className={styles.settingsSaveRow}>
        <button type="button" className={styles.ghost} onClick={addCta}>
          Add button
        </button>
      </div>
    </>
  );
}

export function ChatbotForm({ initial }: { initial: ChatbotContent }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<EditableAnswer[]>(() => initial.answers.map(toEditableAnswer));
  const [fallback, setFallback] = useState<EditableAnswer>(() => toEditableAnswer(initial.fallback));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | undefined>(undefined);

  function updateAnswer(key: string, next: EditableAnswer) {
    setAnswers((current) => current.map((a) => (a.key === key ? next : a)));
  }

  function removeAnswer(key: string) {
    setAnswers((current) => current.filter((a) => a.key !== key));
  }

  function addAnswer() {
    setAnswers((current) => [...current, { key: `a${nextKey++}`, id: "", keywordsText: "", text: "", chipsText: "", ctas: [] }]);
  }

  function moveAnswer(key: string, direction: -1 | 1) {
    setAnswers((current) => {
      const index = current.findIndex((a) => a.key === key);
      const target = index + direction;
      if (index === -1 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    for (const answer of answers) {
      if (!answer.id.trim() || !splitList(answer.keywordsText).length) {
        setStatus("error");
        setError(`Every answer needs an id and at least one keyword (check "${answer.id || "an untitled answer"}").`);
        return;
      }
    }
    const content: ChatbotContent = {
      answers: answers.map(toChatbotAnswer),
      fallback: toChatbotAnswer(fallback),
    };
    setStatus("saving");
    const ok = await saveKey("chatbot_answers", content);
    setStatus(ok ? "saved" : "error");
    setError(ok ? undefined : "Couldn't save. Try again.");
    if (ok) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>Chatbot answers</h2>
      <p className={styles.hint}>
        Tried top to bottom — the first answer whose keywords match wins. Reorder with Move up/down. {TOKEN_HINT}
      </p>

      <div className={styles.chapterSections}>
        {answers.map((answer, i) => (
          <div className={styles.chapterSection} key={answer.key}>
            <AnswerEditor answer={answer} onChange={(next) => updateAnswer(answer.key, next)} />
            <div className={styles.settingsSaveRow}>
              <button type="button" className={styles.ghost} onClick={() => moveAnswer(answer.key, -1)} disabled={i === 0}>
                Move up
              </button>
              <button
                type="button"
                className={styles.ghost}
                onClick={() => moveAnswer(answer.key, 1)}
                disabled={i === answers.length - 1}
              >
                Move down
              </button>
              <button type="button" className={`${styles.ghost} ${styles.danger}`} onClick={() => removeAnswer(answer.key)}>
                Remove answer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.settingsSaveRow}>
        <button type="button" className={styles.ghost} onClick={addAnswer}>
          Add answer
        </button>
      </div>

      <div className={styles.chapterSections}>
        <div className={styles.chapterSection}>
          <p className={`mono ${styles.eyebrow}`}>Fallback — answers when nothing above matches</p>
          <AnswerEditor answer={fallback} onChange={setFallback} showKeywords={false} />
        </div>
      </div>

      <SaveRow status={status} error={error} />
    </form>
  );
}
