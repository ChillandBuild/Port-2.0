import type { Block, DiagramTone } from "@/lib/guide";
import { withToolHighlights } from "./inline";
import styles from "./guide.module.css";

/**
 * Server renderers for the guide's typed blocks. One component per block
 * kind; nothing here knows about the page shell, and no block re-wraps or
 * summarizes the source text it is given.
 */

function toneClass(tone?: DiagramTone): string {
  return tone ? ` ${styles[`guideTone_${tone}`] ?? ""}` : "";
}

function Para({ text }: { text: string }) {
  return <p className={styles.guidePara}>{withToolHighlights(text)}</p>;
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
          {withToolHighlights(item.text)}
          {item.children && (
            <Tag className={`${styles.guideList} ${styles.guideListNested}${ordered ? ` ${styles.guideListOrdered}` : ""}`}>
              {item.children.map((child, j) => (
                <li key={j}>{withToolHighlights(child)}</li>
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
                      {withToolHighlights(cell)}
                    </th>
                  ) : (
                    <td key={j}>{withToolHighlights(cell)}</td>
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

/** Percent fill for a metric's donut ring — exact or midpoint of a range
 *  ("54%" → 54, "60–80%" → 70). Returns null for non-percentage values. */
function percentFill(value: string): number | null {
  const single = /^(\d+(?:\.\d+)?)\s*%$/.exec(value);
  if (single) return Number(single[1]);
  const range = /^(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)\s*%$/.exec(value);
  if (range) return (Number(range[1]) + Number(range[2])) / 2;
  return null;
}

function Metrics({ items }: { items: { value: string; label: string; note?: string }[] }) {
  return (
    <div className={styles.guideMetrics}>
      {items.map((metric, i) => {
        const fill = percentFill(metric.value);
        return (
          <div className={styles.guideMetric} key={i}>
            <p
              className={`mono ${styles.guideMetricValue}${fill !== null ? ` ${styles.guideMetricRing}` : ""}`}
              style={fill !== null ? ({ "--pct": `${Math.min(100, Math.max(0, fill))}%` } as React.CSSProperties) : undefined}
            >
              {metric.value}
            </p>
            <p className={styles.guideMetricLabel}>{metric.label}</p>
            {metric.note && <p className={styles.guideMetricNote}>{metric.note}</p>}
          </div>
        );
      })}
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
              <p className={styles.guideProcessName}>{withToolHighlights(step.name)}</p>
              {step.description && <p className={styles.guideProcessDesc}>{withToolHighlights(step.description)}</p>}
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
                  <li key={j}>{withToolHighlights(bullet)}</li>
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
      <p className={styles.guideCalloutText}>{withToolHighlights(text)}</p>
    </aside>
  );
}

function Quote({ text }: { text: string }) {
  return (
    <blockquote className={styles.guideQuote}>
      {text.split("\n\n").map((para, i) => (
        <p key={i}>{withToolHighlights(para)}</p>
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

function Flow({ title, steps }: { title?: string; steps: { label: string; note?: string; tone?: DiagramTone }[] }) {
  return (
    <div className={styles.guideFlow}>
      {title && <p className={`mono ${styles.guideFlowTitle}`}>{title}</p>}
      <ol className={styles.guideFlowRail}>
        {steps.map((step, i) => (
          <li key={i} className={`${styles.guideFlowStep}${toneClass(step.tone)}`}>
            <p className={styles.guideFlowLabel}>{withToolHighlights(step.label)}</p>
            {step.note && <p className={styles.guideFlowNote}>{withToolHighlights(step.note)}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Tree({ root, branches }: { root: string; branches: { label: string; outcome: string; tone: DiagramTone }[] }) {
  return (
    <div className={styles.guideTree}>
      <p className={`mono ${styles.guideTreeRoot}`}>{withToolHighlights(root)}</p>
      <ul className={styles.guideTreeBranches}>
        {branches.map((branch, i) => (
          <li key={i} className={`${styles.guideTreeBranch}${toneClass(branch.tone)}`}>
            <p className={`mono ${styles.guideTreeLabel}`}>{branch.label}</p>
            <p className={styles.guideTreeOutcome}>{withToolHighlights(branch.outcome)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Bars({ title, items }: { title?: string; items: { label: string; value: number; display: string }[] }) {
  const max = Math.max(...items.map((item) => item.value));
  return (
    <figure className={styles.guideBars}>
      {title && <figcaption className={`mono ${styles.guideBarsTitle}`}>{title}</figcaption>}
      <ul className={styles.guideBarsList}>
        {items.map((item, i) => (
          <li key={i} className={styles.guideBarsRow}>
            <span className={styles.guideBarsLabel}>{withToolHighlights(item.label)}</span>
            <span className={styles.guideBarsTrack}>
              <span
                className={styles.guideBarsFill}
                style={{ width: `${Math.max(4, (item.value / max) * 100)}%` }}
              />
            </span>
            <span className={`mono ${styles.guideBarsValue}`}>{item.display}</span>
          </li>
        ))}
      </ul>
    </figure>
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
    case "flow":
      return <Flow title={block.title} steps={block.steps} />;
    case "tree":
      return <Tree root={block.root} branches={block.branches} />;
    case "bars":
      return <Bars title={block.title} items={block.items} />;
    case "collapsible":
      return <Collapsible summary={block.summary} blocks={block.blocks} />;
  }
}
