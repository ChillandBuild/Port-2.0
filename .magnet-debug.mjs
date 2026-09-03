import { chromium } from "playwright-core";

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.locator("#contact").scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);

const a = await page.locator("#contact a[href*='linkedin']").boundingBox();
const l = await page.locator("#contact a[href='/schedule']").boundingBox();
const seamX = (a.x + a.width + l.x) / 2;
const seamY = a.y + a.height / 2;
await page.mouse.move(seamX, seamY, { steps: 20 });

for (let i = 0; i < 8; i++) {
  await page.waitForTimeout(300);
  const s = await page.evaluate(() => {
    const els = [...document.querySelectorAll("#contact a")].filter((el) => el.dataset.magnet);
    const [A, B] = els;
    const ta = new DOMMatrixReadOnly(getComputedStyle(A).transform);
    const tb = new DOMMatrixReadOnly(getComputedStyle(B).transform);
    return {
      sameParent: A.parentElement === B.parentElement,
      A: +ta.m41.toFixed(2),
      B: +tb.m41.toFixed(2),
      gap: (B.getBoundingClientRect().left - A.getBoundingClientRect().right).toFixed(2),
    };
  });
  console.log(i, JSON.stringify(s));
}
await browser.close();
