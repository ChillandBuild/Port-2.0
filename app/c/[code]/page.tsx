import type { Metadata } from "next";
import Link from "next/link";
import { AccessHandoff } from "@/components/course/AccessHandoff";
import { resolveCourseAccess } from "@/lib/backend/course-access";
import { COURSE } from "@/lib/content/course";
import { formatDuration } from "@/lib/course-duration";
import styles from "@/components/course/AccessHandoff.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your access — Sampath Kumar",
  // A live access link must never end up in an index or a crawler's cache.
  robots: { index: false, follow: false },
};

/**
 * The access handoff page. Sampath copies /c/<code> and pastes it wherever the
 * conversation is happening — a Zoom chat, LinkedIn, WhatsApp, an email.
 *
 * This page RESOLVES the code but deliberately does not redeem it and does not
 * start the clock. Both of those happen on the recipient's click, because
 * anything that happens on a plain GET also happens to every link scanner and
 * preview bot that touches the URL first. Do not "simplify" this into a
 * redirect: the symptom of that regression is windows quietly expiring before
 * anyone reads them, which looks like a clock bug and is not.
 */
export default async function AccessLinkPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  let live = false;
  let label: string | null = null;
  let windowLabel: string | null = null;
  try {
    const status = await resolveCourseAccess(decodeURIComponent(code));
    // "pending" is an unopened grant; "valid" is one already running, so a
    // recipient who reopens the link mid-window still gets back in.
    live = status.state === "pending" || status.state === "valid";
    if (live && status.state !== "none") {
      label = status.access.label;
      windowLabel = formatDuration(status.access.accessSeconds);
    }
  } catch (error) {
    // Fail closed, same posture as the course gate itself.
    console.error("access link lookup failed", error);
  }

  if (!live) {
    return (
      <main className={styles.page} id="main">
        <section className={styles.card} aria-labelledby="handoff-title">
          <p className={`mono ${styles.eyebrow}`}>{COURSE.handoff.eyebrow}</p>
          <h1 className={styles.heading} id="handoff-title">
            {COURSE.handoff.deadHeading}
          </h1>
          <p className={styles.body}>{COURSE.handoff.deadBody}</p>
          <Link className={styles.deadLink} href="/">
            {COURSE.handoff.deadLink}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page} id="main">
      <section className={styles.card} aria-labelledby="handoff-title">
        <p className={`mono ${styles.eyebrow}`}>{COURSE.handoff.eyebrow}</p>
        <h1 className={styles.heading} id="handoff-title">
          {COURSE.handoff.heading}
        </h1>
        <p className={styles.body}>{COURSE.handoff.body}</p>

        <dl className={styles.meta}>
          {label && (
            <div className={styles.metaRow}>
              <dt className={`mono ${styles.metaLabel}`}>{COURSE.handoff.forLabel}</dt>
              <dd className={styles.metaValue}>{label}</dd>
            </div>
          )}
          {windowLabel && (
            <div className={styles.metaRow}>
              <dt className={`mono ${styles.metaLabel}`}>{COURSE.handoff.windowLabel}</dt>
              <dd className={styles.metaValue}>{windowLabel}</dd>
            </div>
          )}
        </dl>

        <AccessHandoff code={decodeURIComponent(code)} />
        <p className={styles.trackedNote}>{COURSE.handoff.trackedNote}</p>
      </section>
    </main>
  );
}
