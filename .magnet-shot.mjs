import { chromium } from "playwright-core";

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.locator("#contact").scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);

const a = await page.locator("#contact a[href*='linkedin']").boundingBox();
const l = await page.locator("#contact a[href='/schedule']").boundingBox();
console.log("gap px:", l.x - (a.x + a.width));

const seamX = (a.x + a.width + l.x) / 2;
const seamY = a.y + a.height / 2;
await page.mouse.move(seamX - 200, seamY);
await page.mouse.move(seamX, seamY, { steps: 20 });
await page.waitForTimeout(1200);
await page.screenshot({ path: "/tmp/magnet-seam.png", clip: { x: a.x - 120, y: a.y - 60, width: l.x + l.width - a.x + 240, height: a.height + 120 } });

const midX = a.x + a.width / 2;
await page.mouse.move(midX, seamY, { steps: 20 });
await page.waitForTimeout(1200);
await page.screenshot({ path: "/tmp/magnet-left.png", clip: { x: a.x - 120, y: a.y - 60, width: l.x + l.width - a.x + 240, height: a.height + 120 } });

const ra = await page.locator("#contact a[href*='linkedin']").boundingBox();
const rl = await page.locator("#contact a[href='/schedule']").boundingBox();
console.log("gap while over left button:", rl.x - (ra.x + ra.width));

await browser.close();
console.log("done");
