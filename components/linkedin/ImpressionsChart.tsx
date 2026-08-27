import { LINKEDIN } from "@/lib/content";
import styles from "./ImpressionsChart.module.css";

const WIDTH = 640;
const HEIGHT = 220;
const PAD_X = 8;
const PAD_TOP = 24;
const PAD_BOTTOM = 8;

const { values, months, marker } = LINKEDIN.chart;
const max = Math.max(...values);

const points = values.map((value, index) => {
  const x = PAD_X + (index * (WIDTH - PAD_X * 2)) / (values.length - 1);
  const y = PAD_TOP + (1 - value / max) * (HEIGHT - PAD_TOP - PAD_BOTTOM);
  return { x, y };
});

const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
const area = `${line} L${points[points.length - 1].x.toFixed(1)},${HEIGHT} L${points[0].x.toFixed(1)},${HEIGHT} Z`;
const markerPoint = points[marker.index];

export function ImpressionsChart() {
  return (
    <figure className={styles.figure}>
      <figcaption className={styles.caption}>
        <span className={styles.title}>{LINKEDIN.chart.title}</span>
        <span className={`mono ${styles.subtitle}`}>{LINKEDIN.chart.subtitle}</span>
      </figcaption>

      <div className={styles.plot}>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`${LINKEDIN.chart.subtitle}. Rising from April to a December peak, with ${marker.label} reached in November.`}
          className={styles.svg}
        >
          <defs>
            <linearGradient id="impressions-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={ratio}
              x1={PAD_X}
              x2={WIDTH - PAD_X}
              y1={PAD_TOP + ratio * (HEIGHT - PAD_TOP - PAD_BOTTOM)}
              y2={PAD_TOP + ratio * (HEIGHT - PAD_TOP - PAD_BOTTOM)}
              className={styles.grid}
            />
          ))}

          <path d={area} fill="url(#impressions-fill)" />
          <path d={line} className={styles.line} />
          <circle cx={markerPoint.x} cy={markerPoint.y} r="4" className={styles.dot} />
        </svg>

        <span
          className={`mono ${styles.marker}`}
          style={{ left: `${(markerPoint.x / WIDTH) * 100}%`, top: `${(markerPoint.y / HEIGHT) * 100}%` }}
          aria-hidden="true"
        >
          {marker.label} ↗
        </span>
      </div>

      <div className={styles.axis}>
        {months.map((month) => (
          <span className="mono" key={month}>
            {month}
          </span>
        ))}
      </div>

      <p className={`mono ${styles.note}`}>
        <span className={styles.swatch} aria-hidden="true" />
        <span>{LINKEDIN.chart.legend}</span>
        <span className={styles.caveat}>{LINKEDIN.chart.caption}</span>
      </p>
    </figure>
  );
}
