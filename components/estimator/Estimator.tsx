"use client";

/**
 * Outbound capacity estimator. Two infrastructure types sit side by side —
 * Type 1 starts cold, Type 2 starts warmed — because the whole point of the
 * model is the contrast between them. Each column runs the same two channels
 * (email and LinkedIn) down to a meeting count, and the two counts add up.
 *
 * The market toggle moves the commercial target only; volumes and conversion
 * rates are identical across markets. The owned-asset checklist applies to the
 * mature column alone — a new company has nothing to already own.
 */

import { useId, useMemo, useState } from "react";
import {
  ESTIMATOR,
  type Band,
  type MarketKey,
  type OwnedAssetKey,
  estimateOutcome,
  formatBand,
  formatRateBand,
} from "@/lib/content";
import styles from "./Estimator.module.css";

const { markets, infra, costs, campaign } = ESTIMATOR;

/** Checklist labels for the mature column. Order follows the cost table. */
const OWNABLE: { key: OwnedAssetKey; label: string }[] = costs.map((line) => ({
  key: line.key,
  label: line.item.split(" / ")[0],
}));

const usd = (n: number) => `$${n.toLocaleString()}`;
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const money = (band: Band, currency: "usd" | "inr") => {
  const fmt = currency === "usd" ? usd : inr;
  return band.min === band.max ? fmt(band.min) : `${fmt(band.min)}–${fmt(band.max)}`;
};
const pct = (n: number) => `${Math.round(n * 100)}%`;

interface EstimatorProps {
  /** Lets the schedule page re-pitch the same model against booking, rather
   *  than duplicating the whole calculator. Defaults to the homepage copy. */
  eyebrow?: string;
  heading?: string;
  body?: string;
}

export function Estimator({
  eyebrow = ESTIMATOR.eyebrow,
  heading = ESTIMATOR.heading,
  body = ESTIMATOR.body,
}: EstimatorProps = {}) {
  const [marketKey, setMarketKey] = useState<MarketKey>(markets[0].key);
  const [owned, setOwned] = useState<OwnedAssetKey[]>([]);
  const groupId = useId();

  const columns = useMemo(
    () => infra.map((profile) => estimateOutcome(profile.key, marketKey, owned)),
    [marketKey, owned]
  );

  const toggleOwned = (key: OwnedAssetKey) =>
    setOwned((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  return (
    <section
      className={`spot ${styles.estimator}`}
      id="estimator"
      data-spot
      aria-labelledby="estimator-heading"
    >
      <div className={styles.head} data-reveal data-reveal-children>
        <p className={`mono ${styles.eyebrow}`}>{eyebrow}</p>
        <h2 className={styles.heading} id="estimator-heading">
          {heading}
        </h2>
        <p className={styles.standfirst}>{body}</p>
      </div>

      <div className={styles.marketBar} data-reveal>
        <p className={`mono ${styles.label}`} id={`${groupId}-market`}>
          Market you sell into
        </p>
        <div className={styles.pills} role="group" aria-labelledby={`${groupId}-market`}>
          {markets.map((m) => (
            <button
              key={m.key}
              type="button"
              className={styles.pill}
              aria-pressed={m.key === marketKey}
              onClick={() => setMarketKey(m.key)}
            >
              {m.label}
              <span className={styles.pillTag}>{m.tag}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.compare} data-reveal>
        {columns.map((c) => (
          <article
            key={c.infra.key}
            className={styles.column}
            data-warm={c.infra.warmup ? "cold" : "warm"}
            aria-label={c.infra.label}
          >
            <header className={styles.columnHead}>
              <h3 className={styles.columnTitle}>{c.infra.label}</h3>
              <p className={`mono ${styles.columnTag}`}>{c.infra.tag}</p>
              <p className={styles.columnBody}>{c.infra.description}</p>
            </header>

            <div className={styles.channel}>
              <h4 className={`mono ${styles.channelTitle}`}>Email channel</h4>
              <dl className={styles.funnel}>
                <Row label="Domain" value={c.infra.email.domains} />
                <Row label="Inboxes" value={`${c.email.inboxes}`} />
                <Row label="Emails / inbox / day" value={formatBand(c.email.perInboxPerDay)} />
                <Row
                  label="Emails / day"
                  value={formatBand(c.email.perDay)}
                  calc={`${c.email.inboxes} × ${formatBand(c.email.perInboxPerDay)}`}
                />
                <Row label="Working days" value={`${c.email.workingDays}`} />
                <Row
                  label="Emails / month"
                  value={`~${c.email.perMonth.toLocaleString()}`}
                  calc={formatBand(c.email.perMonthRaw)}
                />
                <Row label="MQL conversion" value={formatRateBand(c.email.mqlRate)} />
              </dl>
              <p className={styles.channelOut}>
                <span className={`tabular ${styles.channelOutValue}`}>
                  {formatBand(c.email.meetings)}
                </span>
                <span className={`mono ${styles.channelOutLabel}`}>meetings / month</span>
              </p>
            </div>

            <div className={styles.channel}>
              <h4 className={`mono ${styles.channelTitle}`}>LinkedIn channel</h4>
              <dl className={styles.funnel}>
                <Row label="Account" value={c.infra.linkedin.accounts} />
                <Row label="Connections / month" value={c.linkedin.connections.toLocaleString()} />
                <Row
                  label={`Accepted (${pct(c.linkedin.acceptanceRate)})`}
                  value={`~${c.linkedin.accepted}`}
                />
                <Row
                  label={`Replies (${pct(c.linkedin.replyRate)})`}
                  value={`~${c.linkedin.replies}`}
                />
                <Row
                  label="MQL conversion"
                  value={formatRateBand(c.linkedin.mqlRate, 1)}
                  calc="of repliers"
                />
              </dl>
              <p className={styles.channelOut}>
                <span className={`tabular ${styles.channelOutValue}`}>
                  {formatBand(c.linkedin.meetings)}
                </span>
                <span className={`mono ${styles.channelOutLabel}`}>meetings / month</span>
              </p>
            </div>

            <footer className={styles.combined}>
              <p className={`mono ${styles.combinedLabel}`}>Combined projection</p>
              <p className={`tabular ${styles.combinedValue}`}>{formatBand(c.combined)}</p>
              <p className={`mono ${styles.combinedUnit}`}>meetings / month</p>
              <p className={`mono ${styles.verdict}`} data-met={c.meetsTarget}>
                {c.meetsTarget ? "Clears" : "Below"} the {formatBand(c.market.target)} / month{" "}
                {c.market.label} target
              </p>
              <p className={`mono ${styles.warmupNote}`}>
                {c.infra.warmup
                  ? `Warm-up ${c.infra.warmup.label} before this rate is reached`
                  : "No warm-up — sending starts at full rate"}
              </p>
            </footer>
          </article>
        ))}
      </div>

      <div className={styles.timeline} data-reveal aria-label="Campaign timeline">
        <div className={styles.stage} data-stage="warmup">
          <p className={`mono ${styles.stageLabel}`}>Warm-up</p>
          <p className={styles.stageValue}>30–45 days</p>
          <p className={styles.stageNote}>Type 1 only. Mature infrastructure skips it.</p>
        </div>
        <span className={styles.stageArrow} aria-hidden="true">→</span>
        <div className={styles.stage} data-stage="campaign">
          <p className={`mono ${styles.stageLabel}`}>Campaign</p>
          <p className={styles.stageValue}>{campaign.duration}</p>
          <p className={styles.stageNote}>
            {campaign.cadence}, {campaign.followUps} strategic follow-ups.
          </p>
        </div>
        <span className={styles.stageArrow} aria-hidden="true">→</span>
        <div className={styles.stage} data-stage="steady">
          <p className={`mono ${styles.stageLabel}`}>Steady state</p>
          <p className={styles.stageValue}>Full rate</p>
          <p className={styles.stageNote}>Meeting counts above hold from here.</p>
        </div>
      </div>

      <div className={styles.costBlock} data-reveal>
        <div className={styles.costHead}>
          <h3 className={styles.costTitle}>Monthly tool stack</h3>
          <p className={styles.costBody}>
            Mid-tier plans at working volume, not entry tiers. Already own a line? Tick it — it
            drops out of the Type 2 total.
          </p>
        </div>

        <fieldset className={styles.checklist}>
          <legend className={`mono ${styles.label}`}>Already in place (Type 2)</legend>
          {OWNABLE.map((asset) => (
            <label key={asset.key} className={styles.check}>
              <input
                type="checkbox"
                checked={owned.includes(asset.key)}
                onChange={() => toggleOwned(asset.key)}
              />
              <span>{asset.label}</span>
            </label>
          ))}
        </fieldset>

        <div className={styles.tableScroll}>
          <table className={styles.costTable}>
            <thead>
              <tr>
                <th className={`mono ${styles.th}`}>Tool</th>
                <th className={`mono ${styles.th}`}>Monthly</th>
                <th className={`mono ${styles.th}`}>Yearly</th>
                <th className={`mono ${styles.th}`}>Type 2 net</th>
              </tr>
            </thead>
            <tbody>
              {columns[1].cost.lines.map((line) => (
                <tr key={line.key} className={line.included ? undefined : styles.droppedRow}>
                  <td className={styles.td}>
                    <span className={styles.costItem}>{line.item}</span>
                    <span className={`mono ${styles.costCategory}`}>{line.category}</span>
                  </td>
                  <td className={`tabular ${styles.td}`}>{money(line.monthly, line.currency)}</td>
                  <td className={`tabular ${styles.td}`}>
                    {money({ min: line.monthly.min * 12, max: line.monthly.max * 12 }, line.currency)}
                  </td>
                  <td className={`tabular ${styles.td}`}>
                    {line.included ? money(line.monthly, line.currency) : "0 — owned"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th className={styles.tf} scope="row">
                  USD total
                </th>
                <td className={`tabular ${styles.tf}`}>{money(columns[0].cost.usdMonthly, "usd")}</td>
                <td className={`tabular ${styles.tf}`}>{money(columns[0].cost.usdYearly, "usd")}</td>
                <td className={`tabular ${styles.tf}`}>{money(columns[1].cost.usdMonthly, "usd")}</td>
              </tr>
              <tr>
                <th className={styles.tf} scope="row">
                  INR total
                </th>
                <td className={`tabular ${styles.tf}`}>{money(columns[0].cost.inrMonthly, "inr")}</td>
                <td className={`tabular ${styles.tf}`}>{money(columns[0].cost.inrYearly, "inr")}</td>
                <td className={`tabular ${styles.tf}`}>{money(columns[1].cost.inrMonthly, "inr")}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <a className={styles.toolsLink} href={ESTIMATOR.toolsLink.href} data-magnet="0.3">
          {ESTIMATOR.toolsLink.label}{" "}
          <span className={styles.toolsArrow} aria-hidden="true">
            ↓
          </span>
        </a>
      </div>

      <div className={styles.foot} data-reveal>
        <p className={styles.note}>{ESTIMATOR.note}</p>
        <p className={styles.freeCall}>
          {ESTIMATOR.freeCallNote.text}{" "}
          <a className={styles.freeCallLink} href={ESTIMATOR.freeCallNote.cta.href}>
            {ESTIMATOR.freeCallNote.cta.label}
          </a>
        </p>
      </div>
    </section>
  );
}

/** One funnel line: label, value, and the arithmetic behind it when it helps. */
function Row({ label, value, calc }: { label: string; value: string; calc?: string }) {
  return (
    <div className={styles.row}>
      <dt className={styles.rowLabel}>
        {label}
        {calc && <span className={`mono ${styles.rowCalc}`}>{calc}</span>}
      </dt>
      <dd className={`tabular ${styles.rowValue}`}>{value}</dd>
    </div>
  );
}
