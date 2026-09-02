"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ADMIN } from "@/lib/content/admin";
import { formatDuration, formatMoment } from "@/lib/course-duration";
import type { GrantRow as Grant } from "@/lib/backend/course-grants";
import { GUIDE_SECTION_COUNT } from "@/lib/guide/sections";
import styles from "./Admin.module.css";

type State = "not-opened" | "live" | "expired" | "lapsed" | "revoked";

/**
 * Mirrors resolveCourseAccess's precedence exactly. If these two ever disagree
 * the console will confidently describe a state the recipient is not in.
 */
function stateOf(grant: Grant): State {
  if (grant.revokedAt) return "revoked";
  if (!grant.startedAt) {
    return grant.redeemBy && new Date(grant.redeemBy).getTime() <= Date.now()
      ? "lapsed"
      : "not-opened";
  }
  return grant.expiresAt && new Date(grant.expiresAt).getTime() <= Date.now()
    ? "expired"
    : "live";
}

const STATE_COPY: Record<State, string> = {
  "not-opened": ADMIN.grants.statusNotOpened,
  live: ADMIN.grants.statusOpened,
  expired: ADMIN.grants.statusExpired,
  lapsed: ADMIN.grants.statusLapsed,
  revoked: ADMIN.grants.statusRevoked,
};

export function GrantRow({ grant, url }: { grant: Grant; url: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  const state = stateOf(grant);
  const readCount = Object.keys(grant.sectionsSeen).length;

  async function act(payload: Record<string, unknown>) {
    if (busy) return;
    setBusy(true);
    setFailed(false);
    try {
      const response = await fetch(`/api/admin/grants/${grant.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { success: boolean };
      if (result.success) router.refresh();
      else setFailed(true);
    } catch {
      setFailed(true);
    }
    setBusy(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <li className={styles.grant} data-state={state}>
      <div className={styles.grantHead}>
        <div>
          <p className={styles.grantLabel}>
            {grant.label ?? grant.email ?? grant.accessCode}
          </p>
          <p className={`mono ${styles.grantCode}`}>{grant.accessCode}</p>
        </div>
        <span className={styles.badge} data-state={state}>
          {STATE_COPY[state]}
        </span>
      </div>

      <dl className={styles.grantMeta}>
        {/* A window that has not begun has no date to show — only a length. */}
        <div className={styles.grantMetaRow}>
          <dt className={`mono ${styles.grantMetaLabel}`}>Window</dt>
          <dd className={styles.grantMetaValue}>
            {state === "not-opened" || state === "lapsed"
              ? `${formatDuration(grant.accessSeconds)} total`
              : grant.expiresAt
                ? `${formatDuration(grant.accessSeconds)} · ${
                    state === "live" ? "until" : "ended"
                  } ${formatMoment(grant.expiresAt)}`
                : formatDuration(grant.accessSeconds)}
          </dd>
        </div>

        {grant.startedAt && (
          <div className={styles.grantMetaRow}>
            <dt className={`mono ${styles.grantMetaLabel}`}>Opened</dt>
            <dd className={styles.grantMetaValue}>{formatMoment(grant.startedAt)}</dd>
          </div>
        )}

        <div className={styles.grantMetaRow}>
          <dt className={`mono ${styles.grantMetaLabel}`}>Read</dt>
          <dd className={`tabular ${styles.grantMetaValue}`}>
            {readCount} / {GUIDE_SECTION_COUNT} {ADMIN.grants.sectionsRead}
          </dd>
        </div>

        {grant.email && (
          <div className={styles.grantMetaRow}>
            <dt className={`mono ${styles.grantMetaLabel}`}>Email</dt>
            <dd className={styles.grantMetaValue}>{grant.email}</dd>
          </div>
        )}
      </dl>

      <div className={styles.grantActions}>
        <button className={styles.ghost} type="button" onClick={copy} disabled={busy}>
          {copied ? ADMIN.grants.copied : ADMIN.grants.copyLink}
        </button>

        {state !== "revoked" && (
          <button
            className={styles.ghost}
            type="button"
            onClick={() => act({ action: "extend", preset: "4h" })}
            disabled={busy}
          >
            +4h
          </button>
        )}

        {state === "revoked" ? (
          <button
            className={styles.ghost}
            type="button"
            onClick={() => act({ action: "restore" })}
            disabled={busy}
          >
            {ADMIN.grants.restore}
          </button>
        ) : (
          <button
            className={`${styles.ghost} ${styles.danger}`}
            type="button"
            onClick={() => {
              if (window.confirm(ADMIN.grants.revokeConfirm)) act({ action: "revoke" });
            }}
            disabled={busy}
          >
            {ADMIN.grants.revoke}
          </button>
        )}
      </div>

      {state === "revoked" && <p className={styles.hint}>{ADMIN.grants.restoreNote}</p>}
      {failed && (
        <p className={styles.error} role="alert">
          {ADMIN.grants.actionError}
        </p>
      )}
    </li>
  );
}
