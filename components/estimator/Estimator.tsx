"use client";

/**
 * Interactive estimator. Pick a market focus and a monthly lead volume; the
 * panel models booked meetings, the time to a first MQL, and the tool spend
 * behind it. Every output is a pure function of the two inputs — the same model
 * the earlier site shipped — and the panel labels itself as an estimate.
 */

import { useId, useMemo, useState } from "react";
import { ESTIMATOR } from "@/lib/content";
import styles from "./Estimator.module.css";

const { volume, sectors, mqlTiers } = ESTIMATOR;

function mqlTimeline(leads: number): string {
  return (mqlTiers.find((tier) => leads <= tier.upTo) ?? mqlTiers[mqlTiers.length - 1]).label;
}

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

  const sector = sectors.find((s) => s.key === sectorKey) ?? sectors[0];

  const results = useMemo(() => {
    const meetings = Math.max(1, Math.round(leads * sector.meetingRate));
    const toolsCost = sector.baseToolCost + leads * sector.costPerLead;
    return [
      { label: "Estimated meetings & MQL leads", value: `~${meetings} a month` },
      { label: "Research cycle", value: ESTIMATOR.researchCycle },
      { label: "Time to first MQL lead", value: mqlTimeline(leads) },
      { label: "Estimated tools cost stack", value: `$${toolsCost.toLocaleString()} / mo` },
    ];
  }, [leads, sector]);

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
        </dl>
      </div>
    </section>
  );
}
