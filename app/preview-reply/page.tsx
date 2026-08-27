import { Reply } from "@/components/reply/Reply";

const PROBE = `
  requestAnimationFrame(() => setTimeout(() => {
    const rows = [...document.querySelectorAll('[class*=receipt] > div')];
    const rc = document.querySelector('[class*=receipt]').getBoundingClientRect();
    const out = rows.map(r => {
      const dt = r.querySelector('dt').getBoundingClientRect();
      const dd = r.querySelector('dd').getBoundingClientRect();
      return r.querySelector('dt').textContent
        + ' dt.x=' + dt.x.toFixed(1) + ' dd.x=' + dd.x.toFixed(1);
    }).join('\\n');
    const pre = document.createElement('pre');
    pre.id = 'probe';
    pre.style.cssText = 'position:fixed;top:0;left:0;z-index:9999;background:#fff;color:#000;font:14px monospace;padding:12px;white-space:pre';
    pre.textContent = 'vw=' + window.innerWidth + ' receipt.x=' + rc.x.toFixed(1) + ' receipt.w=' + rc.width.toFixed(1) + '\\n' + out;
    document.body.appendChild(pre);
  }, 800));
`;

export default function PreviewReplyPage() {
  return (
    <>
      <Reply />
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script dangerouslySetInnerHTML={{ __html: PROBE }} />
    </>
  );
}
