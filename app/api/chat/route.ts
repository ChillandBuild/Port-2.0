import { NextRequest, NextResponse } from "next/server";
import { ESTIMATOR, estimateOutcome } from "@/lib/content";
import { getIdentity, getSchedulePricing, getChatbotContent, type ChatbotAnswer } from "@/lib/backend/site-content-loaders";
import { interpolate } from "@/lib/backend/template";

// Mock brain — answers ONLY from published content, no LLM key needed.
// Swap this fetch handler for Vercel AI SDK + OpenAI later; the widget stays identical.

type Cta = { label: string; href: string; solid?: boolean };
type Reply = { text: string; chips?: string[]; ctas?: Cta[] };

function renderAnswer(answer: ChatbotAnswer, tokens: Record<string, string>): Reply {
  return {
    text: interpolate(answer.text, tokens),
    chips: answer.chips?.map((chip) => interpolate(chip, tokens)),
    ctas: answer.ctas?.map((cta) => ({
      label: interpolate(cta.label, tokens),
      href: interpolate(cta.href, tokens),
      solid: cta.solid,
    })),
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const message = typeof body.message === "string" ? body.message : "";
  if (!message.trim()) return NextResponse.json({ text: "Say something and I'll help." });

  const q = message.toLowerCase();
  const [identity, pricing, chatbot] = await Promise.all([getIdentity(), getSchedulePricing(), getChatbotContent()]);
  const tokens: Record<string, string> = {
    phone: identity.phone,
    phoneHref: identity.phoneHref,
    linkedin: identity.linkedin,
    telegram: identity.telegram,
    resume: identity.resume,
    secondCallPrice: `USD ${pricing.secondCallPriceUsd}`,
    secondCallPriceUsd: String(pricing.secondCallPriceUsd),
  };

  let data: Reply;

  // The one intent that runs real computation (estimateOutcome on numbers
  // parsed from the message) rather than returning stored text — checked
  // before the data-driven answers below so its keywords can't be shadowed
  // by an admin-edited answer that happens to share a trigger word.
  if (q.includes("estimate") || q.includes("leads/mo") || q.includes("leads / mo") || q.match(/\d+\s*leads/)) {
    const raw = Number((q.match(/(\d+)\s*leads/) ?? [])[1] ?? ESTIMATOR.volume.default);
    const volume = Math.min(ESTIMATOR.volume.max, Math.max(ESTIMATOR.volume.min, raw));
    const sectorKey = q.includes("service") ? "services" : q.includes("mid-market") ? "midmarket" : "saas";
    const isExisting = q.includes("existing") || q.includes("mature") || q.includes("already");
    const setupKey = isExisting ? "existing" : "new";
    const { sector, setup, meetings, toolsCost, rampLabel } = estimateOutcome(volume, sectorKey, setupKey);
    data = {
      text:
        `Model, not a quote — for ${volume} leads/mo in ${sector.label} (${setup.label}):\n\n• ~${meetings} meetings/mo at steady state (${Math.round(sector.meetingRate * 100)}% rate)\n• Timeline: ${rampLabel}\n• Flat tool stack: $${toolsCost.toLocaleString()}/mo\n• Research cycle: ${ESTIMATOR.researchCycle}\n\nReal number comes from a scoping call.`,
      chips: ["Try 50/mo", "Try 200/mo", "Service sector"],
      ctas: [
        { label: "Open estimator → /schedule#estimator", href: "/schedule#estimator" },
        { label: "Schedule scoping call", href: "/schedule", solid: true },
      ],
    };
  } else {
    const match = chatbot.answers.find((answer) => answer.keywords.some((keyword) => q.includes(keyword)));
    data = renderAnswer(match ?? chatbot.fallback, tokens);
  }

  // Tiny artificial delay so the typing indicator reads
  await new Promise((r) => setTimeout(r, 280));
  return NextResponse.json(data);
}
