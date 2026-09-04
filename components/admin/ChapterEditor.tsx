"use client";

/**
 * One course chapter, editable. Chapter and section metadata (title, source,
 * group) get plain inputs — the "friendly UI" half of the hybrid; each
 * section's actual blocks (any mix of the 13 block types in lib/guide/types)
 * are one JSON textarea — the "escape hatch" half. Splitting further, into a
 * bespoke form per block type, would mean 13 different editors for content
 * that mostly gets touched a few times a year; a JSON array anyone can
 * copy-paste and tweak covers every type today and any type added later.
 *
 * Section ids double as reading-history keys (course_access.sections_seen)
 * and DOM anchors — renaming one orphans a recipient's stored progress, so
 * the id field carries a visible warning rather than being hidden.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { GuideChapter, GuideSection, Block } from "@/lib/guide";
import { saveKey, TextField, JsonField, SaveRow, type SaveStatus } from "./form-kit";
import styles from "./Admin.module.css";

interface EditableSection {
  key: string; // React key only, stable across reorders — not sent to the server
  id: string;
  title: string;
  group: string;
  blocksText: string;
}

function toEditable(section: GuideSection, key: string): EditableSection {
  return {
    key,
    id: section.id,
    title: section.title,
    group: section.group ?? "",
    blocksText: JSON.stringify(section.blocks, null, 2),
  };
}

let nextKey = 0;

export function ChapterEditor({ chapterKey, initial }: { chapterKey: string; initial: GuideChapter }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [source, setSource] = useState(initial.source);
  const [introText, setIntroText] = useState(() => JSON.stringify(initial.intro ?? [], null, 2));
  const [sections, setSections] = useState<EditableSection[]>(() =>
    initial.sections.map((section) => toEditable(section, `s${nextKey++}`)),
  );
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | undefined>(undefined);

  function updateSection(key: string, patch: Partial<EditableSection>) {
    setSections((current) => current.map((s) => (s.key === key ? { ...s, ...patch } : s)));
  }

  function removeSection(key: string) {
    setSections((current) => current.filter((s) => s.key !== key));
  }

  function addSection() {
    setSections((current) => [
      ...current,
      { key: `s${nextKey++}`, id: "", title: "", group: "", blocksText: "[]" },
    ]);
  }

  function moveSection(key: string, direction: -1 | 1) {
    setSections((current) => {
      const index = current.findIndex((s) => s.key === key);
      const target = index + direction;
      if (index === -1 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    let intro: Block[];
    try {
      intro = JSON.parse(introText);
    } catch {
      setStatus("error");
      setError("Intro blocks aren't valid JSON.");
      return;
    }

    const parsedSections: GuideSection[] = [];
    for (const section of sections) {
      if (!section.id.trim() || !section.title.trim()) {
        setStatus("error");
        setError(`Every section needs an id and a title (check "${section.title || section.id || "an untitled section"}").`);
        return;
      }
      let blocks: Block[];
      try {
        blocks = JSON.parse(section.blocksText);
      } catch {
        setStatus("error");
        setError(`Section "${section.title}" has invalid JSON in its blocks.`);
        return;
      }
      parsedSections.push({
        id: section.id.trim(),
        title: section.title.trim(),
        ...(section.group.trim() ? { group: section.group.trim() } : {}),
        blocks,
      });
    }

    const chapter: GuideChapter = {
      id: initial.id,
      number: initial.number,
      title,
      source,
      ...(intro.length > 0 ? { intro } : {}),
      sections: parsedSections,
    };

    setStatus("saving");
    const ok = await saveKey(chapterKey, chapter);
    setStatus(ok ? "saved" : "error");
    setError(ok ? undefined : "Couldn't save. Try again.");
    if (ok) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>
        Chapter {initial.number} — {initial.title}
      </h2>
      <div className={styles.settingsGrid}>
        <TextField label="Title" value={title} onChange={setTitle} />
        <TextField label="Source" value={source} onChange={setSource} />
      </div>
      <JsonField label="Intro blocks (JSON array, or [] for none)" text={introText} onChange={setIntroText} rows={4} />

      <div className={styles.chapterSections}>
        {sections.map((section, i) => (
          <div className={styles.chapterSection} key={section.key}>
            <div className={styles.settingsGrid}>
              <TextField
                label="Section id (⚠ renaming loses reading history for this id)"
                value={section.id}
                onChange={(v) => updateSection(section.key, { id: v })}
              />
              <TextField
                label="Section title"
                value={section.title}
                onChange={(v) => updateSection(section.key, { title: v })}
              />
              <TextField
                label="Group (optional)"
                value={section.group}
                onChange={(v) => updateSection(section.key, { group: v })}
              />
            </div>
            <JsonField
              label="Blocks (JSON array)"
              text={section.blocksText}
              onChange={(v) => updateSection(section.key, { blocksText: v })}
              rows={12}
            />
            <div className={styles.settingsSaveRow}>
              <button type="button" className={styles.ghost} onClick={() => moveSection(section.key, -1)} disabled={i === 0}>
                Move up
              </button>
              <button
                type="button"
                className={styles.ghost}
                onClick={() => moveSection(section.key, 1)}
                disabled={i === sections.length - 1}
              >
                Move down
              </button>
              <button type="button" className={`${styles.ghost} ${styles.danger}`} onClick={() => removeSection(section.key)}>
                Remove section
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.settingsSaveRow}>
        <button type="button" className={styles.ghost} onClick={addSection}>
          Add section
        </button>
      </div>

      <SaveRow status={status} error={error} />
    </form>
  );
}
