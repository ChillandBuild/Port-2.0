"use client";

/**
 * /admin/settings — one card per site_content key, real fields throughout.
 * Scalar fields (identity, prices) get plain inputs; repeating shapes (FAQ,
 * footer link groups, legal sections) get add/remove/reorder list editors —
 * the same pattern used on /admin/content and /admin/chatbot.
 *
 * Every section saves independently: one POST to /api/admin/settings per
 * card, not one big form — the blast radius of a mistake stays inside the
 * section being edited.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN } from "@/lib/content/admin";
import type { LegalDoc, LegalSection as LegalSectionEntry } from "@/lib/content";
import type {
  IdentityContent,
  CoursePricing,
  SchedulePricing,
  FaqItem,
  FooterContent,
  FooterGroup,
  FooterLink,
  LegalKey,
} from "@/lib/backend/site-content-loaders";
import { saveKey, TextField, TextAreaField, NumberField, SaveRow, useEditableList, ListItemActions, type SaveStatus } from "./form-kit";
import styles from "./Admin.module.css";

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
  const list = useEditableList<FaqItem>(initial);
  const [status, setStatus] = useState<SaveStatus>("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    const ok = await saveKey("course_faq", list.items.map((i) => i.value));
    setStatus(ok ? "saved" : "error");
    if (ok) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>{ADMIN.settings.faqHeading}</h2>
      <p className={styles.hint}>{ADMIN.settings.faqBody}</p>
      <div className={styles.chapterSections}>
        {list.items.map((item, i) => (
          <div className={styles.chapterSection} key={item.key}>
            <TextField label="Question" value={item.value.q} onChange={(v) => list.update(item.key, { ...item.value, q: v })} />
            <TextAreaField label="Answer" value={item.value.a} onChange={(v) => list.update(item.key, { ...item.value, a: v })} rows={3} />
            <ListItemActions
              onMoveUp={i > 0 ? () => list.move(item.key, -1) : undefined}
              onMoveDown={i < list.items.length - 1 ? () => list.move(item.key, 1) : undefined}
              onRemove={() => list.remove(item.key)}
            />
          </div>
        ))}
      </div>
      <div className={styles.settingsSaveRow}>
        <button type="button" className={styles.ghost} onClick={() => list.add({ q: "", a: "" })}>
          Add question
        </button>
      </div>
      <SaveRow status={status} />
    </form>
  );
}

function FooterGroupEditor({ group, onChange }: { group: FooterGroup; onChange: (next: FooterGroup) => void }) {
  function updateLink(i: number, patch: Partial<FooterLink>) {
    onChange({ ...group, links: group.links.map((l, li) => (li === i ? { ...l, ...patch } : l)) });
  }
  function removeLink(i: number) {
    onChange({ ...group, links: group.links.filter((_, li) => li !== i) });
  }
  function addLink() {
    onChange({ ...group, links: [...group.links, { label: "", href: "" }] });
  }

  return (
    <>
      <TextField label="Group title" value={group.title} onChange={(v) => onChange({ ...group, title: v })} />
      <p className={styles.label}>Links</p>
      {group.links.map((link, i) => (
        <div className={styles.settingsGrid} key={i}>
          <TextField label="Label" value={link.label} onChange={(v) => updateLink(i, { label: v })} />
          <TextField label="Href" value={link.href} onChange={(v) => updateLink(i, { href: v })} />
          <button type="button" className={`${styles.ghost} ${styles.danger}`} onClick={() => removeLink(i)}>
            Remove link
          </button>
        </div>
      ))}
      <div className={styles.settingsSaveRow}>
        <button type="button" className={styles.ghost} onClick={addLink}>
          Add link
        </button>
      </div>
    </>
  );
}

function FooterSection({ initial }: { initial: FooterContent }) {
  const router = useRouter();
  const [wordmark, setWordmark] = useState(initial.wordmark);
  const [fineprint, setFineprint] = useState(initial.fineprint);
  const groups = useEditableList<FooterGroup>(initial.groups);
  const [status, setStatus] = useState<SaveStatus>("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    const ok = await saveKey("footer", {
      wordmark,
      fineprint,
      backToTop: initial.backToTop,
      groups: groups.items.map((i) => i.value),
    });
    setStatus(ok ? "saved" : "error");
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
      <p className={styles.label}>Link groups (the Contact column is generated automatically)</p>
      <div className={styles.chapterSections}>
        {groups.items.map((item, i) => (
          <div className={styles.chapterSection} key={item.key}>
            <FooterGroupEditor group={item.value} onChange={(next) => groups.update(item.key, next)} />
            <ListItemActions
              onMoveUp={i > 0 ? () => groups.move(item.key, -1) : undefined}
              onMoveDown={i < groups.items.length - 1 ? () => groups.move(item.key, 1) : undefined}
              onRemove={() => groups.remove(item.key)}
              removeLabel="Remove group"
            />
          </div>
        ))}
      </div>
      <div className={styles.settingsSaveRow}>
        <button type="button" className={styles.ghost} onClick={() => groups.add({ title: "", links: [] })}>
          Add group
        </button>
      </div>
      <SaveRow status={status} />
    </form>
  );
}

function LegalSectionEditor({
  section,
  onChange,
}: {
  section: LegalSectionEntry;
  onChange: (next: LegalSectionEntry) => void;
}) {
  return (
    <>
      <TextField label="Heading" value={section.heading} onChange={(v) => onChange({ ...section, heading: v })} />
      <p className={styles.label}>Body paragraphs</p>
      {section.body.map((line, i) => (
        <div className={styles.settingsGrid} key={i}>
          <TextAreaField
            label={`Paragraph ${i + 1}`}
            value={line}
            onChange={(v) => onChange({ ...section, body: section.body.map((p, pi) => (pi === i ? v : p)) })}
            rows={2}
          />
          <button
            type="button"
            className={`${styles.ghost} ${styles.danger}`}
            onClick={() => onChange({ ...section, body: section.body.filter((_, pi) => pi !== i) })}
          >
            Remove paragraph
          </button>
        </div>
      ))}
      <div className={styles.settingsSaveRow}>
        <button type="button" className={styles.ghost} onClick={() => onChange({ ...section, body: [...section.body, ""] })}>
          Add paragraph
        </button>
      </div>
    </>
  );
}

function LegalSection({ heading, legalKey, initial }: { heading: string; legalKey: LegalKey; initial: LegalDoc }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [eyebrow, setEyebrow] = useState(initial.eyebrow);
  const [updated, setUpdated] = useState(initial.updated);
  const sections = useEditableList<LegalSectionEntry>(initial.sections);
  const [status, setStatus] = useState<SaveStatus>("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    const ok = await saveKey(legalKey, { title, eyebrow, updated, sections: sections.items.map((i) => i.value) });
    setStatus(ok ? "saved" : "error");
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
      <div className={styles.chapterSections}>
        {sections.items.map((item, i) => (
          <div className={styles.chapterSection} key={item.key}>
            <LegalSectionEditor section={item.value} onChange={(next) => sections.update(item.key, next)} />
            <ListItemActions
              onMoveUp={i > 0 ? () => sections.move(item.key, -1) : undefined}
              onMoveDown={i < sections.items.length - 1 ? () => sections.move(item.key, 1) : undefined}
              onRemove={() => sections.remove(item.key)}
              removeLabel="Remove section"
            />
          </div>
        ))}
      </div>
      <div className={styles.settingsSaveRow}>
        <button type="button" className={styles.ghost} onClick={() => sections.add({ heading: "", body: [] })}>
          Add section
        </button>
      </div>
      <SaveRow status={status} />
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
