"use client";

/**
 * Interactive estimator. Pick a market focus and a monthly lead volume; the
 * panel models steady-state booked meetings, the ramp to reach that rate, and
 * the tool spend behind it. A month-by-month projection table below shows
 * how leads, meetings, and costs evolve during the ramp and into steady state.
 * Every output is a pure function of the two inputs and the panel labels
 * itself as an estimate.
 */

import { useId, useMemo, useState } from "react";
import { ESTIMATOR, estimateOutcome } from "@/lib/content";
import styles from "./Estimator.module.css";

const { volume, sectors } = ESTIMATOR;

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
  const [sectorKey, setSectorKey] = useState(sectors[0].key);
  const [leads, setLeads] = useState(volume.default);
  const sliderId = useId();

  const outcome = useMemo(() => estimateOutcome(leads, sectorKey), [leads, sectorKey]);

  const results = useMemo(() => [
    { label: "Meetings & MQL leads at steady state", value: `~${outcome.meetings} a month` },
    { label: "Research cycle", value: ESTIMATOR.researchCycle },
    { label: "Ramp to first MQL / steady state", value: outcome.rampLabel },
    { label: "Estimated tools cost stack", value: `$${outcome.toolsCost.toLocaleString()} / mo` },
  ], [outcome]);

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
        <h3 className={`mono ${styles.projectionHeading}`}>Month-by-month projection</h3>
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
                  className={row.isRamp ? styles.rampRow : styles.steadyRow}
                >
                  <td className={`tabular ${styles.td}`}>
                    {row.month}
                    {row.isRamp && <span className={`mono ${styles.rampBadge}`}>ramp</span>}
                  </td>
                  <td className={`tabular ${styles.td}`}>{row.leads.toLocaleString()}</td>
                  <td className={`tabular ${styles.td}`}>~{row.meetings}</td>
                  <td className={`tabular ${styles.td}`}>${row.toolCost.toLocaleString()}</td>
                  <td className={`tabular ${styles.td}`}>${row.cumulativeCost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
