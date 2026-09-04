import type { ReactElement } from "react";

/**
 * Inline SVG icon set for the chat dock's quick-contact row — filled
 * currentColor glyphs (brand marks are conventionally solid, not stroked)
 * so they inherit both themes. No icon dependency.
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
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}

export function IconWhatsApp({ className }: IconProps): ReactElement {
  return svg(
    <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.76.46 3.48 1.34 5L2 22l5.14-1.35a9.96 9.96 0 0 0 4.9 1.25h.01c5.52 0 10-4.48 10-10s-4.48-9.9-10.01-9.9Zm0 18.2h-.01a8.24 8.24 0 0 1-4.2-1.15l-.3-.18-3.05.8.82-2.98-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.29 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.04-.38-1.99-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.65.31-.23.24-.85.83-.85 2.03s.87 2.36.99 2.52c.12.17 1.71 2.6 4.14 3.65.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />,
    className,
  );
}

export function IconTelegram({ className }: IconProps): ReactElement {
  return svg(
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm4.94 6.86-1.65 7.78c-.12.56-.45.7-.91.43l-2.52-1.86-1.22 1.17c-.13.13-.25.25-.51.25l.18-2.57 4.68-4.23c.2-.18-.04-.28-.32-.1l-5.78 3.64-2.49-.78c-.54-.17-.55-.54.11-.8l9.73-3.75c.45-.17.85.11.7.82Z" />,
    className,
  );
}

export function IconVideo({ className }: IconProps): ReactElement {
  return svg(
    <path d="M4 6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-2.5l4.3 2.87a1 1 0 0 0 1.55-.83V8.46a1 1 0 0 0-1.55-.83L15 10.5V8a2 2 0 0 0-2-2H4Z" />,
    className,
  );
}
