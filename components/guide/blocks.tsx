import type { Block } from "@/lib/guide";
import styles from "./guide.module.css";

/**
 * Server renderers for the guide's typed blocks. One component per block
 * kind; nothing here knows about the page shell, and no block re-wraps or
 * summarizes the source text it is given.
 */

function Para({ text }: { text: string }) {
  return <p className={styles.guidePara}>{text}</p>;
}

interface ListItemShape {
  text: string;
  children?: string[];
}

function ListBlock({ ordered, items }: { ordered?: boolean; items: ListItemShape[] }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`${styles.guideList}${ordered ? ` ${styles.guideListOrdered}` : ""}`}>
      {items.map((item, i) => (
        <li key={i}>
          {item.text}
          {item.children && (
            <Tag className={`${styles.guideList} ${styles.guideListNested}${ordered ? ` ${styles.guideListOrdered}` : ""}`}>
              {item.children.map((child, j) => (
                <li key={j}>{child}</li>
              ))}
            </Tag>
          )}
        </li>
      ))}
    </Tag>
  );
}

function TableBlock({ caption, headers, rows }: { caption?: string; headers: string[]; rows: string[][] }) {
  return (
    <figure className={styles.guideTableFigure}>
      {caption && <figcaption className={`mono ${styles.guideTableCaption}`}>{caption}</figcaption>}
      <div className={styles.guideTableWrap}>
        <table className={styles.guideTable}>
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th key={i} scope="col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) =>
                  j === 0 ? (
                    <th key={j} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={j}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

function Metrics({ items }: { items: { value: string; label: string; note?: string }[] }) {
  return (
    <div className={styles.guideMetrics}>
      {items.map((metric, i) => (
        <div className={styles.guideMetric} key={i}>
          <p className={`mono ${styles.guideMetricValue}`}>{metric.value}</p>
          <p className={styles.guideMetricLabel}>{metric.label}</p>
          {metric.note && <p className={styles.guideMetricNote}>{metric.note}</p>}
        </div>
      ))}
    </div>
  );
}

function Process({ title, steps }: { title?: string; steps: { name: string; description?: string }[] }) {
  return (
    <div className={styles.guideProcess}>
      {title && <p className={`mono ${styles.guideProcessTitle}`}>{title}</p>}
      <ol className={styles.guideProcessSteps}>
        {steps.map((step, i) => (
          <li className={styles.guideProcessStep} key={i}>
            <span className={`mono ${styles.guideProcessNo}`}>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <p className={styles.guideProcessName}>{step.name}</p>
              {step.description && <p className={styles.guideProcessDesc}>{step.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Timeline({
  phases,
}: {
  phases: { label: string; title: string; description?: string; bullets?: string[] }[];
}) {
  return (
    <div className={styles.guideTimeline}>
      <ol className={styles.guideTimelineRail}>
        {phases.map((phase, i) => (
          <li className={styles.guideTimelinePhase} key={i}>
            <p className={`mono ${styles.guideTimelineLabel}`}>{phase.label}</p>
            <p className={styles.guideTimelineTitle}>{phase.title}</p>
            {phase.description && <p className={styles.guideTimelineDesc}>{phase.description}</p>}
            {phase.bullets && (
              <ul className={`${styles.guideList} ${styles.guideTimelineBullets}`}>
                {phase.bullets.map((bullet, j) => (
                  <li key={j}>{bullet}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Callout({ variant, title, text }: { variant: string; title?: string; text: string }) {
  return (
    <aside className={`${styles.guideCallout} ${styles[`guideCallout_${variant}`] ?? ""}`}>
      {title && <p className={`mono ${styles.guideCalloutTitle}`}>{title}</p>}
      <p className={styles.guideCalloutText}>{text}</p>
    </aside>
  );
}

function Quote({ text }: { text: string }) {
  return (
    <blockquote className={styles.guideQuote}>
      {text.split("\n\n").map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </blockquote>
  );
}

function Mono({ text }: { text: string }) {
  return (
    <pre className={styles.guideMono}>
      <code>{text}</code>
    </pre>
  );
}

function Collapsible({ summary, blocks }: { summary: string; blocks: Block[] }) {
  return (
    <details className={styles.guideDetails}>
      <summary className={`mono ${styles.guideDetailsSummary}`}>{summary}</summary>
      <div className={styles.guideDetailsBody}>
        {blocks.map((block, i) => (
          <FragmentWrap key={i} block={block} />
        ))}
      </div>
    </details>
  );
}

function FragmentWrap({ block }: { block: Block }) {
  return <>{renderBlock(block)}</>;
}

export function renderBlock(block: Block, key?: string): React.ReactElement {
  if (key) return <FragmentWrap key={key} block={block} />;
  switch (block.type) {
    case "para":
      return <Para text={block.text} />;
    case "list":
      return <ListBlock ordered={block.ordered} items={block.items} />;
    case "table":
      return <TableBlock caption={block.caption} headers={block.headers} rows={block.rows} />;
    case "metrics":
      return <Metrics items={block.items} />;
    case "process":
      return <Process title={block.title} steps={block.steps} />;
    case "timeline":
      return <Timeline phases={block.phases} />;
    case "callout":
      return <Callout variant={block.variant} title={block.title} text={block.text} />;
    case "quote":
      return <Quote text={block.text} />;
    case "mono":
      return <Mono text={block.text} />;
    case "collapsible":
      return <Collapsible summary={block.summary} blocks={block.blocks} />;
  }
}
