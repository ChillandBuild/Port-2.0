import { NextRequest, NextResponse } from "next/server";
import { ESTIMATOR, estimateOutcome, formatBand, formatRateBand } from "@/lib/content";
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

  // The one intent that runs real computation (estimateOutcome on the
  // infrastructure and market named in the message) rather than returning
  // stored text — checked before the data-driven answers below so its keywords
  // can't be shadowed by an admin-edited answer sharing a trigger word.
  if (
    q.includes("estimate") ||
    q.includes("meetings") ||
    q.includes("how many leads") ||
    q.includes("capacity") ||
    q.match(/\d+\s*leads/)
  ) {
    const isMature =
      q.includes("mature") || q.includes("existing") || q.includes("already") || q.includes("warmed");
    const infraKey = isMature ? "mature" : "new";
    const marketKey = q.includes("saas") ? "saas" : "product";
    const { infra, market, email, linkedin, combined, cost } = estimateOutcome(infraKey, marketKey);
    data = {
      text:
        `Model, not a quote — ${infra.label}, ${market.label}:\n\n` +
        `• Email: ${email.inboxes} inboxes × ${formatBand(email.perInboxPerDay)}/day × ${email.workingDays} days = ~${email.perMonth.toLocaleString()} emails/mo at ${formatRateBand(email.mqlRate)} → ${formatBand(email.meetings)} meetings\n` +
        `• LinkedIn: ${linkedin.connections} connections → ~${linkedin.accepted} accepted → ~${linkedin.replies} replies at ${formatRateBand(linkedin.mqlRate, 1)} → ${formatBand(linkedin.meetings)} meetings\n` +
        `• Combined: ${formatBand(combined)} meetings/mo (target ${formatBand(market.target)})\n` +
        `• Tool stack: $${cost.usdMonthly.min.toLocaleString()}–${cost.usdMonthly.max.toLocaleString()}/mo plus ₹${cost.inrMonthly.min.toLocaleString("en-IN")} Sales Navigator\n` +
        `• ${infra.warmup ? `Warm-up ${infra.warmup.label}` : "No warm-up"} · research cycle ${ESTIMATOR.researchCycle}\n\n` +
        `Real number comes from a scoping call.`,
      chips: ["Mature infrastructure", "SaaS market", "Tool stack cost"],
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
