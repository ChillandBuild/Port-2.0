"use client";

/**
 * Interactive estimator. Pick an infrastructure setup, a market focus, and a
 * monthly lead volume; the panel models steady-state booked meetings, the
 * 30–45 day research phase, the deliverability ramp (for new setups), and the
 * flat tool spend behind them. A month-by-month projection table shows how leads,
 * meetings, and costs evolve from research to steady state.
 */

import { useId, useMemo, useState } from "react";
import { ESTIMATOR, type EstimatorSetupKey, estimateOutcome } from "@/lib/content";
import styles from "./Estimator.module.css";

const { volume, sectors, setups } = ESTIMATOR;

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
  const [setupKey, setSetupKey] = useState<EstimatorSetupKey>(setups[0].key);
  const [sectorKey, setSectorKey] = useState(sectors[0].key);
  const [leads, setLeads] = useState(volume.default);
  const sliderId = useId();

  const outcome = useMemo(
    () => estimateOutcome(leads, sectorKey, setupKey),
    [leads, sectorKey, setupKey]
  );

  const results = useMemo(
    () => [
      { label: "Meetings & MQL leads at steady state", value: `~${outcome.meetings} a month` },
      { label: "Initial research cycle", value: ESTIMATOR.researchCycle },
      { label: "Timeline to steady state", value: outcome.rampLabel },
      { label: "Flat monthly tool stack cost", value: `$${outcome.toolsCost.toLocaleString()} / mo` },
    ],
    [outcome]
  );

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

      <div className={styles.panel} data-reveal>
        <div className={styles.controls}>
          <div className={styles.group}>
            <p className={`mono ${styles.label}`} id={`${sliderId}-setup`}>
              Domain &amp; inbox infrastructure
            </p>
            <div className={styles.sectors} role="group" aria-labelledby={`${sliderId}-setup`}>
              {setups.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className={styles.pill}
                  aria-pressed={s.key === setupKey}
                  onClick={() => setSetupKey(s.key)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.group}>
            <p className={`mono ${styles.label}`} id={`${sliderId}-sector`}>
              Target market focus
            </p>
            <div className={styles.sectors} role="group" aria-labelledby={`${sliderId}-sector`}>
              {sectors.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className={styles.pill}
                  aria-pressed={s.key === sectorKey}
                  onClick={() => setSectorKey(s.key)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.group}>
            <div className={styles.sliderHead}>
              <label className={`mono ${styles.label}`} htmlFor={sliderId}>
                Target lead &amp; prospect volume
              </label>
              <output className={`mono ${styles.badge}`} htmlFor={sliderId}>
                {leads.toLocaleString()} {volume.unit}
              </output>
            </div>
            <input
              id={sliderId}
              type="range"
              className={styles.slider}
              min={volume.min}
              max={volume.max}
              step={volume.step}
              value={leads}
              onChange={(e) => setLeads(Number(e.target.value))}
            />
          </div>

          <a className={styles.toolsLink} href={ESTIMATOR.toolsLink.href} data-magnet="0.3">
            {ESTIMATOR.toolsLink.label} <span className={styles.toolsArrow} aria-hidden="true">↓</span>
          </a>
        </div>

        <dl className={styles.results} aria-live="polite" data-tilt="5">
          {results.map((row) => (
            <div className={styles.result} key={row.label}>
              <dt className={`mono ${styles.resultLabel}`}>{row.label}</dt>
              <dd className={`tabular ${styles.resultValue}`}>{row.value}</dd>
            </div>
          ))}
          <p className={`mono ${styles.note}`}>{ESTIMATOR.note}</p>
          <p className={styles.freeCall}>
            {ESTIMATOR.freeCallNote.text}{" "}
            <a className={styles.freeCallLink} href={ESTIMATOR.freeCallNote.cta.href}>
              {ESTIMATOR.freeCallNote.cta.label}
            </a>
          </p>
        </dl>
      </div>

      {/* Month-by-month projection table */}
      <div className={styles.projectionWrap} data-reveal>
        <details className={styles.projectionDetails}>
          <summary className={`mono ${styles.projectionSummary}`}>Month-by-month projection</summary>
          <div className={styles.tableScroll}>
            <table className={styles.projectionTable} aria-live="polite">
              <thead>
                <tr>
                  <th className={`mono ${styles.th}`}>Month</th>
                  <th className={`mono ${styles.th}`}>Leads</th>
                  <th className={`mono ${styles.th}`}>Meetings</th>
                  <th className={`mono ${styles.th}`}>Tool cost</th>
                  <th className={`mono ${styles.th}`}>Cumulative cost</th>
                </tr>
              </thead>
              <tbody>
                {outcome.projection.map((row) => (
                  <tr
                    key={row.month}
                    className={
                      row.phase === "research"
                        ? styles.researchRow
                        : row.phase === "ramp"
                        ? styles.rampRow
                        : styles.steadyRow
                    }
                  >
                    <td className={`tabular ${styles.td}`}>
                      {row.month}
                      {row.phase === "research" && (
                        <span className={`mono ${styles.researchBadge}`}>research</span>
                      )}
                      {row.phase === "ramp" && (
                        <span className={`mono ${styles.rampBadge}`}>ramp</span>
                      )}
                    </td>
                    <td className={`tabular ${styles.td}`}>
                      {row.phase === "research" ? "—" : row.leads.toLocaleString()}
                    </td>
                    <td className={`tabular ${styles.td}`}>
                      {row.phase === "research" ? "—" : `~${row.meetings}`}
                    </td>
                    <td className={`tabular ${styles.td}`}>${row.toolCost.toLocaleString()}</td>
                    <td className={`tabular ${styles.td}`}>${row.cumulativeCost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        <details className={styles.explainerDetails}>
          <summary className={`mono ${styles.explainerSummary}`}>
            How the math works
          </summary>
          <div className={styles.explainerGrid}>
            <div className={styles.explainerCol}>
              <h4 className={`mono ${styles.explainerTitle}`}>Flat Tool Spend</h4>
              <p className={styles.explainerText}>
                Tool cost is a <strong>flat monthly subscription</strong> (${outcome.toolsCost}/mo for domains, inboxes, Sales Navigator, and sending infrastructure) with <strong>zero per-lead markups</strong>.
              </p>
            </div>
            <div className={styles.explainerCol}>
              <h4 className={`mono ${styles.explainerTitle}`}>Month 1 Research Phase</h4>
              <p className={styles.explainerText}>
                Every campaign dedicates the first <strong>30–45 days</strong> to deep market research, ICP mapping, account list validation, and copy calibration before active outreach begins.
              </p>
            </div>
            <div className={styles.explainerCol}>
              <h4 className={`mono ${styles.explainerTitle}`}>Ramp vs Steady State</h4>
              <p className={styles.explainerText}>
                <strong>Existing setups</strong> launch at 100% capacity in Month 2. <strong>New setups</strong> follow a gradual deliverability warmup curve across subsequent months to protect mailbox health and inbox placement.
              </p>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
