"use client";

/**
 * /admin/content — marketing content that isn't pricing/contact/legal: the
 * homepage's hero stat line, pipeline stages, sectors, proof-ledger rows,
 * about copy, work history, tool stack, LinkedIn posts, and case studies.
 * Every card is a real form — add/remove/reorder for the list, plain fields
 * for each entry. The one exception is each item's rarely-touched cosmetic
 * counter config (HeroStat.count, LedgerRow.count/countRange, Post.image) —
 * those stay a small optional JSON field rather than a bespoke number-input
 * subform, the same "friendly UI + JSON escape hatch for the odd corner"
 * split used on the course chapter editor.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HeroContent, HeroStat, AboutContent, AboutFact } from "@/lib/backend/site-content-loaders";
import type { Stage, Sector, LedgerRow, Role, ToolGroup, ToolItem, Post, CaseStudy } from "@/lib/content";
import { saveKey, TextField, TextAreaField, JsonField, SaveRow, useEditableList, ListItemActions, type SaveStatus } from "./form-kit";
import styles from "./Admin.module.css";

/** Parses an optional-JSON side field. Blank text means "omit this key." */
function parseOptionalJson<T>(text: string, label: string): { value?: T; error?: string } {
  if (!text.trim()) return { value: undefined };
  try {
    return { value: JSON.parse(text) as T };
  } catch {
    return { error: `${label} isn't valid JSON.` };
  }
}

/* ----------------------------- Hero ----------------------------- */

interface EditableStat {
  value: string;
  label: string;
  countText: string;
}

function toEditableStat(stat: HeroStat): EditableStat {
  return { value: stat.value, label: stat.label, countText: stat.count ? JSON.stringify(stat.count) : "" };
}

function HeroSection({ initial }: { initial: HeroContent }) {
  const router = useRouter();
  const [lede, setLede] = useState(initial.lede);
  const stats = useEditableList<EditableStat>(initial.stats.map(toEditableStat));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | undefined>(undefined);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const parsedStats: HeroStat[] = [];
    for (const { value } of stats.items) {
      const count = parseOptionalJson<HeroStat["count"]>(value.countText, `"${value.label || value.value}" count`);
      if (count.error) {
        setStatus("error");
        setError(count.error);
        return;
      }
      parsedStats.push({ value: value.value, label: value.label, ...(count.value ? { count: count.value } : {}) });
    }
    setStatus("saving");
    const ok = await saveKey("hero", { lede, stats: parsedStats });
    setStatus(ok ? "saved" : "error");
    setError(undefined);
    if (ok) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>Hero stats</h2>
      <p className={styles.hint}>The lede paragraph and the three stat counters at the top of the world/hero section.</p>
      <TextAreaField label="Lede" value={lede} onChange={setLede} rows={3} />

      <div className={styles.chapterSections}>
        {stats.items.map((item, i) => (
          <div className={styles.chapterSection} key={item.key}>
            <div className={styles.settingsGrid}>
              <TextField label="Value" value={item.value.value} onChange={(v) => stats.update(item.key, { ...item.value, value: v })} />
              <TextField label="Label" value={item.value.label} onChange={(v) => stats.update(item.key, { ...item.value, label: v })} />
            </div>
            <JsonField
              label="Count animation (JSON, optional — {to, prefix?, suffix?, decimals?})"
              text={item.value.countText}
              onChange={(v) => stats.update(item.key, { ...item.value, countText: v })}
              rows={2}
            />
            <ListItemActions
              onMoveUp={i > 0 ? () => stats.move(item.key, -1) : undefined}
              onMoveDown={i < stats.items.length - 1 ? () => stats.move(item.key, 1) : undefined}
              onRemove={() => stats.remove(item.key)}
            />
          </div>
        ))}
      </div>
      <div className={styles.settingsSaveRow}>
        <button type="button" className={styles.ghost} onClick={() => stats.add({ value: "", label: "", countText: "" })}>
          Add stat
        </button>
      </div>
      <SaveRow status={status} error={error} />
    </form>
  );
}

/* ----------------------------- Pipeline ----------------------------- */

function PipelineSection({ initial }: { initial: Stage[] }) {
  const router = useRouter();
  const list = useEditableList<Stage>(initial);
  const [status, setStatus] = useState<SaveStatus>("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    const ok = await saveKey("pipeline", list.items.map((i) => i.value));
    setStatus(ok ? "saved" : "error");
    if (ok) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>Pipeline stages</h2>
      <p className={styles.hint}>The 8-stage process shown on the homepage and /lead-generation. Order here is display order.</p>
      <div className={styles.chapterSections}>
        {list.items.map((item, i) => (
          <div className={styles.chapterSection} key={item.key}>
            <div className={styles.settingsGrid}>
              <TextField label="No." value={item.value.no} onChange={(v) => list.update(item.key, { ...item.value, no: v })} />
              <TextField label="Name" value={item.value.name} onChange={(v) => list.update(item.key, { ...item.value, name: v })} />
            </div>
            <TextAreaField
              label="Description"
              value={item.value.description}
              onChange={(v) => list.update(item.key, { ...item.value, description: v })}
              rows={2}
            />
            <ListItemActions
              onMoveUp={i > 0 ? () => list.move(item.key, -1) : undefined}
              onMoveDown={i < list.items.length - 1 ? () => list.move(item.key, 1) : undefined}
              onRemove={() => list.remove(item.key)}
            />
          </div>
        ))}
      </div>
      <div className={styles.settingsSaveRow}>
        <button type="button" className={styles.ghost} onClick={() => list.add({ no: "", name: "", description: "" })}>
          Add stage
        </button>
      </div>
      <SaveRow status={status} />
    </form>
  );
}

/* ----------------------------- Sectors ----------------------------- */

function SectorsSection({ initial }: { initial: Sector[] }) {
  const router = useRouter();
  const list = useEditableList<Sector>(initial);
  const [status, setStatus] = useState<SaveStatus>("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    const ok = await saveKey("sectors", list.items.map((i) => i.value));
    setStatus(ok ? "saved" : "error");
    if (ok) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>Sectors</h2>
      <p className={styles.hint}>The industry/vertical list. Check &ldquo;Core&rdquo; for the ones that lead with the accent treatment.</p>
      <div className={styles.chapterSections}>
        {list.items.map((item, i) => (
          <div className={styles.chapterSection} key={item.key}>
            <div className={styles.settingsGrid}>
              <TextField label="Tag" value={item.value.tag} onChange={(v) => list.update(item.key, { ...item.value, tag: v })} />
              <TextField label="Title" value={item.value.title} onChange={(v) => list.update(item.key, { ...item.value, title: v })} />
            </div>
            <TextAreaField
              label="Description"
              value={item.value.description}
              onChange={(v) => list.update(item.key, { ...item.value, description: v })}
              rows={2}
            />
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={item.value.core ?? false}
                onChange={(event) => list.update(item.key, { ...item.value, core: event.target.checked })}
              />{" "}
              Core (accent treatment)
            </label>
            <ListItemActions
              onMoveUp={i > 0 ? () => list.move(item.key, -1) : undefined}
              onMoveDown={i < list.items.length - 1 ? () => list.move(item.key, 1) : undefined}
              onRemove={() => list.remove(item.key)}
            />
          </div>
        ))}
      </div>
      <div className={styles.settingsSaveRow}>
        <button type="button" className={styles.ghost} onClick={() => list.add({ tag: "", title: "", description: "" })}>
          Add sector
        </button>
      </div>
      <SaveRow status={status} />
    </form>
  );
}

/* ----------------------------- Ledger ----------------------------- */

interface EditableLedgerRow {
  value: string;
  suffix: string;
  label: string;
  source: string;
  countText: string;
  countRangeText: string;
}

function toEditableLedgerRow(row: LedgerRow): EditableLedgerRow {
  return {
    value: row.value,
    suffix: row.suffix ?? "",
    label: row.label,
    source: row.source,
    countText: row.count ? JSON.stringify(row.count) : "",
    countRangeText: row.countRange ? JSON.stringify(row.countRange) : "",
  };
}

function LedgerSection({ initial }: { initial: LedgerRow[] }) {
  const router = useRouter();
  const list = useEditableList<EditableLedgerRow>(initial.map(toEditableLedgerRow));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | undefined>(undefined);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const rows: LedgerRow[] = [];
    for (const { value } of list.items) {
      const count = parseOptionalJson<LedgerRow["count"]>(value.countText, `"${value.label}" count`);
      const countRange = parseOptionalJson<LedgerRow["countRange"]>(value.countRangeText, `"${value.label}" countRange`);
      if (count.error || countRange.error) {
        setStatus("error");
        setError(count.error ?? countRange.error);
        return;
      }
      rows.push({
        value: value.value,
        ...(value.suffix ? { suffix: value.suffix } : {}),
        label: value.label,
        source: value.source,
        ...(count.value ? { count: count.value } : {}),
        ...(countRange.value ? { countRange: countRange.value } : {}),
      });
    }
    setStatus("saving");
    const ok = await saveKey("ledger", rows);
    setStatus(ok ? "saved" : "error");
    setError(undefined);
    if (ok) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>Proof ledger</h2>
      <p className={styles.hint}>The results rail — one row per proof point.</p>
      <div className={styles.chapterSections}>
        {list.items.map((item, i) => (
          <div className={styles.chapterSection} key={item.key}>
            <div className={styles.settingsGrid}>
              <TextField label="Value" value={item.value.value} onChange={(v) => list.update(item.key, { ...item.value, value: v })} />
              <TextField label="Suffix (optional)" value={item.value.suffix} onChange={(v) => list.update(item.key, { ...item.value, suffix: v })} />
              <TextField label="Label" value={item.value.label} onChange={(v) => list.update(item.key, { ...item.value, label: v })} />
              <TextField label="Source" value={item.value.source} onChange={(v) => list.update(item.key, { ...item.value, source: v })} />
            </div>
            <JsonField
              label="Count animation (JSON, optional — {to, prefix?, suffix?, decimals?})"
              text={item.value.countText}
              onChange={(v) => list.update(item.key, { ...item.value, countText: v })}
              rows={2}
            />
            <JsonField
              label="Count range animation (JSON, optional — {from, to, prefix?, suffix?})"
              text={item.value.countRangeText}
              onChange={(v) => list.update(item.key, { ...item.value, countRangeText: v })}
              rows={2}
            />
            <ListItemActions
              onMoveUp={i > 0 ? () => list.move(item.key, -1) : undefined}
              onMoveDown={i < list.items.length - 1 ? () => list.move(item.key, 1) : undefined}
              onRemove={() => list.remove(item.key)}
            />
          </div>
        ))}
      </div>
      <div className={styles.settingsSaveRow}>
        <button
          type="button"
          className={styles.ghost}
          onClick={() => list.add({ value: "", suffix: "", label: "", source: "", countText: "", countRangeText: "" })}
        >
          Add row
        </button>
      </div>
      <SaveRow status={status} error={error} />
    </form>
  );
}

/* ----------------------------- About ----------------------------- */

function AboutSection({ initial }: { initial: AboutContent }) {
  const router = useRouter();
  const [eyebrow, setEyebrow] = useState(initial.eyebrow);
  const [heading, setHeading] = useState(initial.heading);
  const [stamp, setStamp] = useState(initial.stamp);
  const [asked, setAsked] = useState(initial.exchange.asked);
  const [answered, setAnswered] = useState(initial.exchange.answered);
  const body = useEditableList<string>(initial.body);
  const facts = useEditableList<AboutFact>(initial.facts);
  const [status, setStatus] = useState<SaveStatus>("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    const ok = await saveKey("about", {
      eyebrow,
      heading,
      body: body.items.map((i) => i.value),
      stamp,
      exchange: { asked, answered },
      facts: facts.items.map((i) => i.value),
    });
    setStatus(ok ? "saved" : "error");
    if (ok) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>About</h2>
      <p className={styles.hint}>The positioning section: heading, body paragraphs, the pull-quote exchange, and the fact list.</p>
      <div className={styles.settingsGrid}>
        <TextField label="Eyebrow" value={eyebrow} onChange={setEyebrow} />
        <TextField label="Heading" value={heading} onChange={setHeading} />
        <TextField label="Stamp" value={stamp} onChange={setStamp} />
      </div>

      <p className={styles.label}>Body paragraphs</p>
      <div className={styles.chapterSections}>
        {body.items.map((item, i) => (
          <div className={styles.chapterSection} key={item.key}>
            <TextAreaField label={`Paragraph ${i + 1}`} value={item.value} onChange={(v) => body.update(item.key, v)} rows={3} />
            <ListItemActions
              onMoveUp={i > 0 ? () => body.move(item.key, -1) : undefined}
              onMoveDown={i < body.items.length - 1 ? () => body.move(item.key, 1) : undefined}
              onRemove={() => body.remove(item.key)}
            />
          </div>
        ))}
      </div>
      <div className={styles.settingsSaveRow}>
        <button type="button" className={styles.ghost} onClick={() => body.add("")}>
          Add paragraph
        </button>
      </div>

      <div className={styles.settingsGrid}>
        <TextAreaField label="Pull-quote — asked" value={asked} onChange={setAsked} rows={2} />
        <TextAreaField label="Pull-quote — answered" value={answered} onChange={setAnswered} rows={2} />
      </div>

      <p className={styles.label}>Facts (education/background)</p>
      <div className={styles.chapterSections}>
        {facts.items.map((item, i) => (
          <div className={styles.chapterSection} key={item.key}>
            <div className={styles.settingsGrid}>
              <TextField label="Label" value={item.value.label} onChange={(v) => facts.update(item.key, { ...item.value, label: v })} />
              <TextField label="Degree" value={item.value.degree} onChange={(v) => facts.update(item.key, { ...item.value, degree: v })} />
              <TextField label="School" value={item.value.school} onChange={(v) => facts.update(item.key, { ...item.value, school: v })} />
            </div>
            <ListItemActions
              onMoveUp={i > 0 ? () => facts.move(item.key, -1) : undefined}
              onMoveDown={i < facts.items.length - 1 ? () => facts.move(item.key, 1) : undefined}
              onRemove={() => facts.remove(item.key)}
            />
          </div>
        ))}
      </div>
      <div className={styles.settingsSaveRow}>
        <button type="button" className={styles.ghost} onClick={() => facts.add({ label: "", degree: "", school: "" })}>
          Add fact
        </button>
      </div>

      <SaveRow status={status} />
    </form>
  );
}

/* ----------------------------- Roles ----------------------------- */

function RoleEditor({
  role,
  onChange,
}: {
  role: Role;
  onChange: (next: Role) => void;
}) {
  return (
    <>
      <div className={styles.settingsGrid}>
        <TextField label="Company" value={role.company} onChange={(v) => onChange({ ...role, company: v })} />
        <TextField label="Title" value={role.title} onChange={(v) => onChange({ ...role, title: v })} />
        <TextField label="Dates" value={role.dates} onChange={(v) => onChange({ ...role, dates: v })} />
        <TextField label="Place" value={role.place} onChange={(v) => onChange({ ...role, place: v })} />
      </div>
      <p className={styles.label}>Summary bullets</p>
      {role.summary.map((line, i) => (
        <div className={styles.settingsGrid} key={i}>
          <TextField
            label={`Bullet ${i + 1}`}
            value={line}
            onChange={(v) => onChange({ ...role, summary: role.summary.map((s, si) => (si === i ? v : s)) })}
          />
          <button
            type="button"
            className={`${styles.ghost} ${styles.danger}`}
            onClick={() => onChange({ ...role, summary: role.summary.filter((_, si) => si !== i) })}
          >
            Remove bullet
          </button>
        </div>
      ))}
      <div className={styles.settingsSaveRow}>
        <button type="button" className={styles.ghost} onClick={() => onChange({ ...role, summary: [...role.summary, ""] })}>
          Add bullet
        </button>
      </div>
      <TextAreaField label="Result" value={role.result} onChange={(v) => onChange({ ...role, result: v })} rows={2} />
    </>
  );
}

function RolesSection({ initial }: { initial: Role[] }) {
  const router = useRouter();
  const list = useEditableList<Role>(initial);
  const [status, setStatus] = useState<SaveStatus>("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    const ok = await saveKey("roles", list.items.map((i) => i.value));
    setStatus(ok ? "saved" : "error");
    if (ok) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>Work history</h2>
      <p className={styles.hint}>One entry per role, most recent first.</p>
      <div className={styles.chapterSections}>
        {list.items.map((item, i) => (
          <div className={styles.chapterSection} key={item.key}>
            <RoleEditor role={item.value} onChange={(next) => list.update(item.key, next)} />
            <ListItemActions
              onMoveUp={i > 0 ? () => list.move(item.key, -1) : undefined}
              onMoveDown={i < list.items.length - 1 ? () => list.move(item.key, 1) : undefined}
              onRemove={() => list.remove(item.key)}
              removeLabel="Remove role"
            />
          </div>
        ))}
      </div>
      <div className={styles.settingsSaveRow}>
        <button
          type="button"
          className={styles.ghost}
          onClick={() => list.add({ company: "", title: "", dates: "", place: "", summary: [], result: "" })}
        >
          Add role
        </button>
      </div>
      <SaveRow status={status} />
    </form>
  );
}

/* ----------------------------- Tool groups ----------------------------- */

function ToolGroupEditor({ group, onChange }: { group: ToolGroup; onChange: (next: ToolGroup) => void }) {
  function updateTool(i: number, patch: Partial<ToolItem>) {
    onChange({ ...group, tools: group.tools.map((t, ti) => (ti === i ? { ...t, ...patch } : t)) });
  }
  function removeTool(i: number) {
    onChange({ ...group, tools: group.tools.filter((_, ti) => ti !== i) });
  }
  function addTool() {
    onChange({ ...group, tools: [...group.tools, { name: "", url: "" }] });
  }

  return (
    <>
      <div className={styles.settingsGrid}>
        <TextField label="Group name" value={group.name} onChange={(v) => onChange({ ...group, name: v })} />
      </div>
      <TextAreaField label="Description" value={group.description} onChange={(v) => onChange({ ...group, description: v })} rows={2} />
      <p className={styles.label}>Tools</p>
      {group.tools.map((tool, i) => (
        <div className={styles.settingsGrid} key={i}>
          <TextField label="Name" value={tool.name} onChange={(v) => updateTool(i, { name: v })} />
          <TextField label="URL" value={tool.url} onChange={(v) => updateTool(i, { url: v })} />
          <button type="button" className={`${styles.ghost} ${styles.danger}`} onClick={() => removeTool(i)}>
            Remove tool
          </button>
        </div>
      ))}
      <div className={styles.settingsSaveRow}>
        <button type="button" className={styles.ghost} onClick={addTool}>
          Add tool
        </button>
      </div>
    </>
  );
}

function ToolGroupsSection({ initial }: { initial: ToolGroup[] }) {
  const router = useRouter();
  const list = useEditableList<ToolGroup>(initial);
  const [status, setStatus] = useState<SaveStatus>("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    const ok = await saveKey("tool_groups", list.items.map((i) => i.value));
    setStatus(ok ? "saved" : "error");
    if (ok) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>Tool stack</h2>
      <p className={styles.hint}>Grouped tool list shown under /#range.</p>
      <div className={styles.chapterSections}>
        {list.items.map((item, i) => (
          <div className={styles.chapterSection} key={item.key}>
            <ToolGroupEditor group={item.value} onChange={(next) => list.update(item.key, next)} />
            <ListItemActions
              onMoveUp={i > 0 ? () => list.move(item.key, -1) : undefined}
              onMoveDown={i < list.items.length - 1 ? () => list.move(item.key, 1) : undefined}
              onRemove={() => list.remove(item.key)}
              removeLabel="Remove group"
            />
          </div>
        ))}
      </div>
      <div className={styles.settingsSaveRow}>
        <button type="button" className={styles.ghost} onClick={() => list.add({ name: "", description: "", tools: [] })}>
          Add group
        </button>
      </div>
      <SaveRow status={status} />
    </form>
  );
}

/* ----------------------------- Posts ----------------------------- */

interface EditablePost {
  topic: string;
  title: string;
  summary: string;
  url: string;
  imageText: string;
}

function toEditablePost(post: Post): EditablePost {
  return { topic: post.topic, title: post.title, summary: post.summary, url: post.url, imageText: post.image ? JSON.stringify(post.image) : "" };
}

function PostsSection({ initial }: { initial: Post[] }) {
  const router = useRouter();
  const list = useEditableList<EditablePost>(initial.map(toEditablePost));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | undefined>(undefined);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const posts: Post[] = [];
    for (const { value } of list.items) {
      const image = parseOptionalJson<Post["image"]>(value.imageText, `"${value.title}" image`);
      if (image.error) {
        setStatus("error");
        setError(image.error);
        return;
      }
      posts.push({
        topic: value.topic,
        title: value.title,
        summary: value.summary,
        url: value.url,
        ...(image.value ? { image: image.value } : {}),
      });
    }
    setStatus("saving");
    const ok = await saveKey("posts", posts);
    setStatus(ok ? "saved" : "error");
    setError(undefined);
    if (ok) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>LinkedIn posts</h2>
      <p className={styles.hint}>The featured-posts rail. Image is optional — carousel/document posts have none.</p>
      <div className={styles.chapterSections}>
        {list.items.map((item, i) => (
          <div className={styles.chapterSection} key={item.key}>
            <div className={styles.settingsGrid}>
              <TextField label="Topic" value={item.value.topic} onChange={(v) => list.update(item.key, { ...item.value, topic: v })} />
              <TextField label="Title" value={item.value.title} onChange={(v) => list.update(item.key, { ...item.value, title: v })} />
              <TextField label="URL" value={item.value.url} onChange={(v) => list.update(item.key, { ...item.value, url: v })} />
            </div>
            <TextAreaField label="Summary" value={item.value.summary} onChange={(v) => list.update(item.key, { ...item.value, summary: v })} rows={2} />
            <JsonField
              label="Image (JSON, optional — {src, width, height})"
              text={item.value.imageText}
              onChange={(v) => list.update(item.key, { ...item.value, imageText: v })}
              rows={2}
            />
            <ListItemActions
              onMoveUp={i > 0 ? () => list.move(item.key, -1) : undefined}
              onMoveDown={i < list.items.length - 1 ? () => list.move(item.key, 1) : undefined}
              onRemove={() => list.remove(item.key)}
            />
          </div>
        ))}
      </div>
      <div className={styles.settingsSaveRow}>
        <button
          type="button"
          className={styles.ghost}
          onClick={() => list.add({ topic: "", title: "", summary: "", url: "", imageText: "" })}
        >
          Add post
        </button>
      </div>
      <SaveRow status={status} error={error} />
    </form>
  );
}

/* ----------------------------- Case studies ----------------------------- */

function CaseStudiesSection({ initial }: { initial: CaseStudy[] }) {
  const router = useRouter();
  const list = useEditableList<CaseStudy>(initial);
  const [status, setStatus] = useState<SaveStatus>("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    const ok = await saveKey("case_studies", list.items.map((i) => i.value));
    setStatus(ok ? "saved" : "error");
    if (ok) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>Case studies</h2>
      <p className={styles.hint}>The gated case-study entries.</p>
      <div className={styles.chapterSections}>
        {list.items.map((item, i) => (
          <div className={styles.chapterSection} key={item.key}>
            <TextField label="Company" value={item.value.company} onChange={(v) => list.update(item.key, { ...item.value, company: v })} />
            <TextAreaField
              label="What happened"
              value={item.value.whatHappened}
              onChange={(v) => list.update(item.key, { ...item.value, whatHappened: v })}
              rows={3}
            />
            <TextAreaField
              label="What was done"
              value={item.value.whatWasDone}
              onChange={(v) => list.update(item.key, { ...item.value, whatWasDone: v })}
              rows={3}
            />
            <TextAreaField
              label="Problem"
              value={item.value.problem}
              onChange={(v) => list.update(item.key, { ...item.value, problem: v })}
              rows={3}
            />
            <TextAreaField
              label="Resolution"
              value={item.value.resolution}
              onChange={(v) => list.update(item.key, { ...item.value, resolution: v })}
              rows={3}
            />
            <ListItemActions
              onMoveUp={i > 0 ? () => list.move(item.key, -1) : undefined}
              onMoveDown={i < list.items.length - 1 ? () => list.move(item.key, 1) : undefined}
              onRemove={() => list.remove(item.key)}
            />
          </div>
        ))}
      </div>
      <div className={styles.settingsSaveRow}>
        <button
          type="button"
          className={styles.ghost}
          onClick={() => list.add({ company: "", whatHappened: "", whatWasDone: "", problem: "", resolution: "" })}
        >
          Add case study
        </button>
      </div>
      <SaveRow status={status} />
    </form>
  );
}

/* ----------------------------- Root ----------------------------- */

export interface ContentFormProps {
  hero: HeroContent;
  pipeline: Stage[];
  sectors: Sector[];
  ledger: LedgerRow[];
  about: AboutContent;
  roles: Role[];
  toolGroups: ToolGroup[];
  posts: Post[];
  caseStudies: CaseStudy[];
}

export function ContentForm(props: ContentFormProps) {
  return (
    <div className={styles.settingsSections}>
      <HeroSection initial={props.hero} />
      <PipelineSection initial={props.pipeline} />
      <SectorsSection initial={props.sectors} />
      <LedgerSection initial={props.ledger} />
      <AboutSection initial={props.about} />
      <RolesSection initial={props.roles} />
      <ToolGroupsSection initial={props.toolGroups} />
      <PostsSection initial={props.posts} />
      <CaseStudiesSection initial={props.caseStudies} />
    </div>
  );
}
