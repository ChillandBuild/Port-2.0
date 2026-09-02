"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { ADMIN } from "@/lib/content/admin";
import {
  DEFAULT_PRESET_ID,
  DEFAULT_REDEEM_BY_DAYS,
  DURATION_PRESETS,
  type DurationUnit,
} from "@/lib/course-duration";
import styles from "./Admin.module.css";

type Status = "idle" | "submitting";

interface Created {
  url: string;
  label: string;
  emailed: boolean;
}

/**
 * The console's primary action, kept deliberately to three controls.
 *
 * The moment of use is mid-interview — "I'll send it now" — so anything past
 * company name, duration, and one button lives behind a disclosure. Everything
 * optional is genuinely optional: a link needs no email address at all.
 */
export function QuickGrant() {
  const router = useRouter();
  const labelId = useId();
  const emailId = useId();
  const amountId = useId();
  const redeemId = useId();

  const [label, setLabel] = useState("");
  const [presetId, setPresetId] = useState<string>(DEFAULT_PRESET_ID);
  const [custom, setCustom] = useState(false);
  const [amount, setAmount] = useState("4");
  const [unit, setUnit] = useState<DurationUnit>("hours");
  const [email, setEmail] = useState("");
  const [redeemByDays, setRedeemByDays] = useState(String(DEFAULT_REDEEM_BY_DAYS));

  const [status, setStatus] = useState<Status>("idle");
  const [created, setCreated] = useState<Created | null>(null);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status !== "idle" || !label.trim()) return;
    setStatus("submitting");
    setFailed(false);
    setCopied(false);
    try {
      const response = await fetch("/api/admin/grants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Only ever a preset id or an amount+unit — the server derives the
        // seconds. A raw second count from here would be unbounded.
        body: JSON.stringify({
          label: label.trim(),
          email: email.trim() || undefined,
          redeemByDays: Number(redeemByDays) || undefined,
          ...(custom ? { amount: Number(amount), unit } : { preset: presetId }),
        }),
      });
      const payload = (await response.json()) as {
        success: boolean;
        grant?: { url: string; label: string | null };
        emailed?: boolean;
      };
      if (payload.success && payload.grant) {
        setCreated({
          url: payload.grant.url,
          label: payload.grant.label ?? label.trim(),
          emailed: Boolean(payload.emailed),
        });
        setLabel("");
        setEmail("");
        router.refresh();
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    }
    setStatus("idle");
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard blocked (insecure context, or permission denied). The input
      // below still holds the link, selected, so it can be copied by hand.
      setCopied(false);
    }
  }

  return (
    <section className={styles.quick} aria-labelledby="quick-grant-title">
      <h2 className={styles.quickHeading} id="quick-grant-title">
        {ADMIN.grants.heading}
      </h2>

      <form className={styles.quickForm} onSubmit={submit} noValidate>
        <div className={styles.quickRow}>
          <div className={styles.quickField}>
            <label className={styles.label} htmlFor={labelId}>
              {ADMIN.grants.labelLabel}
            </label>
            <input
              className={styles.input}
              id={labelId}
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder={ADMIN.grants.labelPlaceholder}
              disabled={status !== "idle"}
              autoComplete="off"
              required
            />
          </div>

          <div className={styles.quickField}>
            <span className={styles.label}>{ADMIN.grants.durationLabel}</span>
            <div className={styles.presets} role="group" aria-label={ADMIN.grants.durationLabel}>
              {DURATION_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={
                    !custom && presetId === preset.id
                      ? `${styles.preset} ${styles.presetActive}`
                      : styles.preset
                  }
                  aria-pressed={!custom && presetId === preset.id}
                  onClick={() => {
                    setCustom(false);
                    setPresetId(preset.id);
                  }}
                  disabled={status !== "idle"}
                >
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                className={custom ? `${styles.preset} ${styles.presetActive}` : styles.preset}
                aria-pressed={custom}
                onClick={() => setCustom(true)}
                disabled={status !== "idle"}
              >
                Custom
              </button>
            </div>
          </div>
        </div>

        {custom && (
          <div className={styles.customRow}>
            <div className={styles.quickField}>
              <label className={styles.label} htmlFor={amountId}>
                {ADMIN.grants.customAmountLabel}
              </label>
              <input
                className={styles.input}
                id={amountId}
                type="number"
                min={1}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                disabled={status !== "idle"}
              />
            </div>
            <div className={styles.quickField}>
              <label className={styles.label} htmlFor={`${amountId}-unit`}>
                {ADMIN.grants.customUnitLabel}
              </label>
              <select
                className={styles.select}
                id={`${amountId}-unit`}
                value={unit}
                onChange={(event) => setUnit(event.target.value as DurationUnit)}
                disabled={status !== "idle"}
              >
                <option value="hours">hours</option>
                <option value="days">days</option>
              </select>
            </div>
          </div>
        )}

        <details className={styles.more}>
          <summary className={styles.moreSummary}>{ADMIN.grants.moreOptions}</summary>
          <div className={styles.moreBody}>
            <label className={styles.label} htmlFor={emailId}>
              {ADMIN.grants.emailLabel}
            </label>
            <input
              className={styles.input}
              id={emailId}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={status !== "idle"}
              autoComplete="off"
            />
            <p className={styles.hint}>{ADMIN.grants.emailHint}</p>

            <label className={styles.label} htmlFor={redeemId}>
              {ADMIN.grants.redeemByLabel}
            </label>
            <input
              className={styles.input}
              id={redeemId}
              type="number"
              min={1}
              max={365}
              value={redeemByDays}
              onChange={(event) => setRedeemByDays(event.target.value)}
              disabled={status !== "idle"}
            />
          </div>
        </details>

        <button
          className={styles.submit}
          type="submit"
          disabled={status !== "idle" || !label.trim()}
        >
          {status === "submitting" && <span className={styles.spinner} aria-hidden="true" />}
          {status === "submitting" ? ADMIN.grants.creating : ADMIN.grants.create}
        </button>

        {failed && (
          <p className={styles.error} role="alert">
            {ADMIN.grants.createError}
          </p>
        )}
      </form>

      {created && (
        <div className={styles.created} role="status" aria-live="polite">
          <p className={`mono ${styles.createdLabel}`}>{created.label}</p>
          <div className={styles.createdRow}>
            <input
              className={styles.linkInput}
              readOnly
              value={created.url}
              onFocus={(event) => event.currentTarget.select()}
            />
            <button
              className={styles.copy}
              type="button"
              onClick={() => copy(created.url)}
            >
              {copied ? ADMIN.grants.copied : ADMIN.grants.copyLink}
            </button>
          </div>
          {created.emailed && <p className={styles.hint}>Emailed too.</p>}
        </div>
      )}
    </section>
  );
}
