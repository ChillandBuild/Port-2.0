"use client";

/**
 * /admin/settings — one card per site_content key. Scalar fields (identity,
 * prices) get plain inputs; repeating/nested shapes (FAQ, footer links,
 * legal sections) get a JSON textarea — the same "friendly UI + JSON escape
 * hatch" split the course lesson editor will use, applied here to whatever
 * content is naturally a list of records rather than a handful of fields.
 *
 * Every section saves independently: one POST to /api/admin/settings per
 * card, not one big form:the blast radius of a mistake stays inside the
 * section being edited.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN } from "@/lib/content/admin";
import type { LegalDoc } from "@/lib/content";
import type {
  IdentityContent,
  CoursePricing,
  SchedulePricing,
  FaqItem,
  FooterContent,
  LegalKey,
} from "@/lib/backend/site-content-loaders";
import styles from "./Admin.module.css";

type SaveStatus = "idle" | "saving" | "saved" | "error";

async function saveKey(key: string, value: unknown): Promise<boolean> {
  try {
    const response = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    const payload = (await response.json()) as { success: boolean };
    return payload.success;
  } catch {
    return false;
  }
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className={styles.settingsField}>
      <span className={styles.label}>{label}</span>
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className={styles.settingsField}>
      <span className={styles.label}>{label}</span>
      <input
        className={styles.input}
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function SaveRow({ status, error }: { status: SaveStatus; error?: string }) {
  return (
    <div className={styles.settingsSaveRow}>
      <button className={styles.submit} type="submit" disabled={status === "saving"}>
        {status === "saving" && <span className={styles.spinner} aria-hidden="true" />}
        {status === "saving" ? ADMIN.settings.saving : ADMIN.settings.save}
      </button>
      {status === "saved" && <span className={styles.savedNote}>{ADMIN.settings.saved}</span>}
      {status === "error" && (
        <span className={styles.error}>{error ?? ADMIN.settings.saveError}</span>
      )}
    </div>
  );
}

/** A JSON textarea that only overwrites its own field once the parse succeeds — an invalid edit stays visible with an error instead of silently reverting. */
function JsonField({ label, text, onChange }: { label: string; text: string; onChange: (text: string) => void }) {
  return (
    <label className={styles.settingsField}>
      <span className={styles.label}>{label}</span>
      <textarea
        className={styles.textarea}
        rows={10}
        value={text}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
      />
    </label>
  );
}

function IdentitySection({ initial }: { initial: IdentityContent }) {
  const router = useRouter();
  const [form, setForm] = useState<IdentityContent>(initial);
  const [status, setStatus] = useState<SaveStatus>("idle");

  function set<K extends keyof IdentityContent>(key: K, value: IdentityContent[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    const ok = await saveKey("identity", form);
    setStatus(ok ? "saved" : "error");
    if (ok) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>{ADMIN.settings.identityHeading}</h2>
      <p className={styles.hint}>{ADMIN.settings.identityBody}</p>
      <div className={styles.settingsGrid}>
        <TextField label={ADMIN.settings.nameLabel} value={form.name} onChange={(v) => set("name", v)} />
        <TextField label={ADMIN.settings.roleLabel} value={form.role} onChange={(v) => set("role", v)} />
        <TextField label={ADMIN.settings.locationLabel} value={form.location} onChange={(v) => set("location", v)} />
        <TextField label={ADMIN.settings.phoneLabel} value={form.phone} onChange={(v) => set("phone", v)} />
        <TextField label={ADMIN.settings.phoneHrefLabel} value={form.phoneHref} onChange={(v) => set("phoneHref", v)} />
        <TextField label={ADMIN.settings.telegramLabel} value={form.telegram} onChange={(v) => set("telegram", v)} />
        <TextField label={ADMIN.settings.emailLabel} value={form.email} onChange={(v) => set("email", v)} />
        <TextField label={ADMIN.settings.emailHrefLabel} value={form.emailHref} onChange={(v) => set("emailHref", v)} />
        <TextField label={ADMIN.settings.linkedinLabel} value={form.linkedin} onChange={(v) => set("linkedin", v)} />
        <TextField label={ADMIN.settings.resumeLabel} value={form.resume} onChange={(v) => set("resume", v)} />
        <TextField label={ADMIN.settings.taglineLabel} value={form.tagline} onChange={(v) => set("tagline", v)} />
      </div>
      <SaveRow status={status} />
    </form>
  );
}

function PricingSection({
  initialCourse,
  initialSchedule,
}: {
  initialCourse: CoursePricing;
  initialSchedule: SchedulePricing;
}) {
  const router = useRouter();
  const [course, setCourse] = useState<CoursePricing>(initialCourse);
  const [schedule, setSchedule] = useState<SchedulePricing>(initialSchedule);
  const [status, setStatus] = useState<SaveStatus>("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    const [ok1, ok2] = await Promise.all([
      saveKey("course_pricing", course),
      saveKey("schedule_pricing", schedule),
    ]);
    setStatus(ok1 && ok2 ? "saved" : "error");
    if (ok1 && ok2) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>{ADMIN.settings.pricingHeading}</h2>
      <p className={styles.hint}>{ADMIN.settings.pricingBody}</p>
      <div className={styles.settingsGrid}>
        <NumberField
          label={ADMIN.settings.coursePriceUsdLabel}
          value={course.priceUsd}
          onChange={(v) => setCourse((c) => ({ ...c, priceUsd: v }))}
        />
        <NumberField
          label={ADMIN.settings.coursePriceInrLabel}
          value={course.priceInr}
          onChange={(v) => setCourse((c) => ({ ...c, priceInr: v }))}
        />
        <NumberField
          label={ADMIN.settings.scheduleUsdLabel}
          value={schedule.secondCallPriceUsd}
          onChange={(v) => setSchedule((s) => ({ ...s, secondCallPriceUsd: v }))}
        />
        <NumberField
          label={ADMIN.settings.scheduleInrLabel}
          value={schedule.secondCallPriceInr}
          onChange={(v) => setSchedule((s) => ({ ...s, secondCallPriceInr: v }))}
        />
      </div>
      <SaveRow status={status} />
    </form>
  );
}

function FaqSection({ initial }: { initial: FaqItem[] }) {
  const router = useRouter();
  const [text, setText] = useState(() => JSON.stringify(initial, null, 2));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | undefined>(undefined);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setStatus("error");
      setError(ADMIN.settings.jsonInvalid);
      return;
    }
    setStatus("saving");
    const ok = await saveKey("course_faq", parsed);
    setStatus(ok ? "saved" : "error");
    setError(undefined);
    if (ok) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>{ADMIN.settings.faqHeading}</h2>
      <p className={styles.hint}>{ADMIN.settings.faqBody}</p>
      <JsonField label="FAQ (JSON array of { q, a })" text={text} onChange={setText} />
      <SaveRow status={status} error={error} />
    </form>
  );
}

function FooterSection({ initial }: { initial: FooterContent }) {
  const router = useRouter();
  const [wordmark, setWordmark] = useState(initial.wordmark);
  const [fineprint, setFineprint] = useState(initial.fineprint);
  const [groupsText, setGroupsText] = useState(() => JSON.stringify(initial.groups, null, 2));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | undefined>(undefined);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    let groups: unknown;
    try {
      groups = JSON.parse(groupsText);
    } catch {
      setStatus("error");
      setError(ADMIN.settings.jsonInvalid);
      return;
    }
    setStatus("saving");
    const ok = await saveKey("footer", { wordmark, fineprint, backToTop: initial.backToTop, groups });
    setStatus(ok ? "saved" : "error");
    setError(undefined);
    if (ok) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>{ADMIN.settings.footerHeading}</h2>
      <p className={styles.hint}>{ADMIN.settings.footerBody}</p>
      <div className={styles.settingsGrid}>
        <TextField label={ADMIN.settings.footerWordmarkLabel} value={wordmark} onChange={setWordmark} />
        <TextField label={ADMIN.settings.footerFineprintLabel} value={fineprint} onChange={setFineprint} />
      </div>
      <JsonField label="Groups (JSON array of { title, links: [{ label, href }] })" text={groupsText} onChange={setGroupsText} />
      <SaveRow status={status} error={error} />
    </form>
  );
}

function LegalSection({ heading, legalKey, initial }: { heading: string; legalKey: LegalKey; initial: LegalDoc }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [eyebrow, setEyebrow] = useState(initial.eyebrow);
  const [updated, setUpdated] = useState(initial.updated);
  const [sectionsText, setSectionsText] = useState(() => JSON.stringify(initial.sections, null, 2));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | undefined>(undefined);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    let sections: unknown;
    try {
      sections = JSON.parse(sectionsText);
    } catch {
      setStatus("error");
      setError(ADMIN.settings.jsonInvalid);
      return;
    }
    setStatus("saving");
    const ok = await saveKey(legalKey, { title, eyebrow, updated, sections });
    setStatus(ok ? "saved" : "error");
    setError(undefined);
    if (ok) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>{heading}</h2>
      <p className={styles.hint}>{ADMIN.settings.legalBody}</p>
      <div className={styles.settingsGrid}>
        <TextField label={ADMIN.settings.docTitleLabel} value={title} onChange={setTitle} />
        <TextField label={ADMIN.settings.docEyebrowLabel} value={eyebrow} onChange={setEyebrow} />
        <TextField label={ADMIN.settings.docUpdatedLabel} value={updated} onChange={setUpdated} />
      </div>
      <JsonField label="Sections (JSON array of { heading, body: string[] })" text={sectionsText} onChange={setSectionsText} />
      <SaveRow status={status} error={error} />
    </form>
  );
}

export interface SettingsFormProps {
  identity: IdentityContent;
  coursePricing: CoursePricing;
  schedulePricing: SchedulePricing;
  courseFaq: FaqItem[];
  footer: FooterContent;
  legalTerms: LegalDoc;
  legalPrivacy: LegalDoc;
  legalRefunds: LegalDoc;
}

export function SettingsForm(props: SettingsFormProps) {
  return (
    <div className={styles.settingsSections}>
      <IdentitySection initial={props.identity} />
      <PricingSection initialCourse={props.coursePricing} initialSchedule={props.schedulePricing} />
      <FaqSection initial={props.courseFaq} />
      <FooterSection initial={props.footer} />
      <LegalSection heading={ADMIN.settings.legalTermsHeading} legalKey="legal_terms" initial={props.legalTerms} />
      <LegalSection heading={ADMIN.settings.legalPrivacyHeading} legalKey="legal_privacy" initial={props.legalPrivacy} />
      <LegalSection heading={ADMIN.settings.legalRefundsHeading} legalKey="legal_refunds" initial={props.legalRefunds} />
    </div>
  );
}
