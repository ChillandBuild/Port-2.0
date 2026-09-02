import type { ReactElement } from "react";

/**
 * Hand-drawn inline SVG icon set for the guide's nine chapters — monochrome
 * strokes on currentColor so they inherit both themes. No icon dependency;
 * each glyph is a 24×24 viewBox with 1.75px round-capped strokes matching
 * the site's mono/editorial rails.
 */

interface IconProps {
  className?: string;
}

function svg(path: ReactElement, className?: string): ReactElement {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}

/** Ch01 — The System: connected six-step loop. */
export function IconSystem({ className }: IconProps): ReactElement {
  return svg(
    <>
      <circle cx="5" cy="6" r="2.2" />
      <circle cx="19" cy="6" r="2.2" />
      <circle cx="19" cy="18" r="2.2" />
      <circle cx="5" cy="18" r="2.2" />
      <path d="M7.2 6h9.6M19 8.2v7.6M16.8 18H7.2M5 15.8V8.2" />
      <path d="M12 3.4l1.8 2.6-1.8 2.6" opacity="0" />
    </>,
    className,
  );
}

/** Ch02 — ICP & Research: crosshair target. */
export function IconTarget({ className }: IconProps): ReactElement {
  return svg(
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" />
    </>,
    className,
  );
}

/** Ch03 — Tools & Infrastructure: layered stack + bolt. */
export function IconStack({ className }: IconProps): ReactElement {
  return svg(
    <>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 12.5l9 5 9-5" />
      <path d="M3 17l9 5 9-5" opacity="0.45" />
    </>,
    className,
  );
}

/** Ch04 — Campaigns & Sequences: paper plane. */
export function IconSend({ className }: IconProps): ReactElement {
  return svg(
    <>
      <path d="M21 3L10.5 13.5" />
      <path d="M21 3l-6.8 18-3.7-7.5L3 9.8 21 3z" />
    </>,
    className,
  );
}

/** Ch05 — LinkedIn Outreach: network of people. */
export function IconNetwork({ className }: IconProps): ReactElement {
  return svg(
    <>
      <circle cx="12" cy="5.5" r="2.5" />
      <circle cx="5" cy="18" r="2.5" />
      <circle cx="19" cy="18" r="2.5" />
      <path d="M10.2 7.4L6.3 15.8M13.8 7.4l3.9 8.4M7.5 18h9" />
    </>,
    className,
  );
}

/** Ch06 — Tracking & Hygiene: filter funnel. */
export function IconFunnel({ className }: IconProps): ReactElement {
  return svg(
    <>
      <path d="M3.5 4.5h17l-6.5 8v6.5l-4 2.5v-9l-6.5-8z" />
      <path d="M9 9.5h6" opacity="0.5" />
    </>,
    className,
  );
}

/** Ch07 — Replies → Meetings: inbound reply arrows. */
export function IconReply({ className }: IconProps): ReactElement {
  return svg(
    <>
      <path d="M9 14L4 9l5-5" />
      <path d="M4 9h9a7 7 0 017 7v3" />
    </>,
    className,
  );
}

/** Ch08 — Metrics & Reporting: ascending bars. */
export function IconChart({ className }: IconProps): ReactElement {
  return svg(
    <>
      <path d="M4 20V4" opacity="0" />
      <path d="M4 20h16" />
      <path d="M7.5 20v-6M12 20V9.5M16.5 20V5.5" />
      <path d="M4.5 12.5L9.5 8l3.5 3 6-6" opacity="0.5" />
    </>,
    className,
  );
}

/** Ch09 — Support & Working Together: handshake. */
export function IconHandshake({ className }: IconProps): ReactElement {
  return svg(
    <>
      <path d="M2.5 7.5L7 6l5 4.5L17 6l4.5 1.5" />
      <path d="M7 6l-4.5 5L8 16.5l4-3.5 4 3.5L21.5 11 17 6" />
      <path d="M12 10.5l-3.5 4" opacity="0.5" />
    </>,
    className,
  );
}

/** Icon per chapter id; falls back to the system glyph. */
const CHAPTER_ICONS: Record<string, (props: IconProps) => ReactElement> = {
  system: IconSystem,
  "icp-research": IconTarget,
  "tools-infrastructure": IconStack,
  campaigns: IconSend,
  linkedin: IconNetwork,
  "tracking-hygiene": IconFunnel,
  "replies-meetings": IconReply,
  "metrics-targets": IconChart,
  support: IconHandshake,
};

export function chapterIcon(chapterId: string, className?: string): ReactElement {
  const Icon = CHAPTER_ICONS[chapterId] ?? IconSystem;
  return <Icon className={className} />;
}
