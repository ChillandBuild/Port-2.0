import { NextRequest, NextResponse } from "next/server";

// Mock brain — answers ONLY from published content, no LLM key needed.
// Swap this fetch handler for Vercel AI SDK + OpenAI later; the widget stays identical.

type Cta = { label: string; href: string; solid?: boolean };

function replyFor(input: string): { text: string; chips?: string[]; ctas?: Cta[] } {
  const q = input.toLowerCase();

  // Hiring intent
  if (q.includes("hire") || q.includes("full-time") || q.includes("full time") || q.includes("open to") || q.includes("recruit")) {
    return {
      text:
        "Yes — open to full-time roles and fractional / contract engagements.\n\nCoimbatore, IN (GMT+5:30) — replies land across IST, GMT and PT hours. 7+ years across 24 markets (NA, EU, APAC, MENA). Market rate for a Pre-Sales / Lead Gen leadership role — no fixed number on a page, prefers a real conversation.\n\nBuilt and led research + outreach teams, not just IC work. Owns a number: pipeline, MQLs, meetings booked, CRM hygiene.",
      chips: ["Show work history", "What sectors?", "Résumé"],
      ctas: [
        { label: "View /hire", href: "/hire", solid: true },
        { label: "Résumé", href: "/assets/sampath-kumar-resume.pdf" },
        { label: "Message on LinkedIn", href: "https://www.linkedin.com/in/sampath-kumar-tn66sk9699" },
      ],
    };
  }

  // Pricing / USD 350 / schedule
  if (q.includes("350") || q.includes("cost") || q.includes("price") || q.includes("pricing") || q.includes("session") || q.includes("call")) {
    return {
      text:
        "First call is free — 30–45 minutes, strategy & pipeline deep-dive (IST hours, remote video). Second call is USD 350 for 1 hour — infrastructure, tool alignment, methodology.\n\nPayment link + IST slot selector appear on /schedule once payment setup is approved. Until then: LinkedIn or phone (+91 99949 69699).",
      chips: ["How to book?", "What's in the 350?", "Is first call really free?"],
      ctas: [
        { label: "Schedule → /schedule", href: "/schedule", solid: true },
        { label: "How to book", href: "/schedule" },
      ],
    };
  }

  // Performance model / engagement
  if (q.includes("performance") || q.includes("pay for results") || q.includes("engagement") || q.includes("retainer") || q.includes("tools first") || q.includes("work plan")) {
    return {
      text:
        "Tools first. Pay when leads land.\n\n01 — Pay for tools only (direct cost, no markup, no retainer yet).\n02 — Research & build: ICP, account research, prospect sourcing, cadence launched.\n03 — Leads flow → pay for results. Payment linked to conversion, not activity.",
      chips: ["Which tools?", "What's the research cycle?", "Estimate for me"],
      ctas: [{ label: "Work plan → /#work-plan", href: "/#work-plan", solid: true }],
    };
  }

  // Results / proof / numbers
  if (q.includes("result") || q.includes("proof") || q.includes("200m") || q.includes("35%") || q.includes("bounce") || q.includes("mql") || q.includes("meeting")) {
    return {
      text:
        "Some highlights:\n\n• +35% lead-to-meeting lift (thesis-matched messaging) — Finquest\n• 200M+ private companies mapped — Finquest M&A\n• 300+ enterprise MQLs / year — Ecosmob\n• 18–25 meetings / seat / month — The Sales Group (6 verticals)\n• <1.2% bounce ceiling — multi-stage verification\n• +30% deal velocity — Zinnov & Draup",
      chips: ["Work history", "Which sectors?", "How achieved?"],
      ctas: [
        { label: "Case studies (gated) → /case-studies", href: "/case-studies", solid: true },
        { label: "See proof rail", href: "/#track-record" },
      ],
    };
  }

  // Work history
  if (q.includes("work history") || q.includes("experience") || q.includes("finquest") || q.includes("ecosmob") || q.includes("uplers") || q.includes("alore") || q.includes("zinnov")) {
    return {
      text:
        "6 roles, most recent first:\n\n• Finquest (Senior Lead Gen Mgr) Jul 2024–Sep 2025, Bengaluru — M&A origination across NA/EU/APAC, 200M+ mapped, +35% lift.\n• The Sales Group Jan–Jun 2024, Toronto (remote) — fractional SDR leadership, 18–25 meetings/seat/mo.\n• Uplers & Mavlers May–Dec 2023 — cross-border outreach, bounce <1.5%.\n• Ecosmob Jun 2022–Apr 2023 — telecom SaaS, 300+ MQLs/yr.\n• Alore Apr 2021–May 2022 — research & QA.\n• Zinnov & Draup Jul 2020–Mar 2021 — first sales role, +30% velocity.",
      chips: ["Show proof", "Which sectors?", "Education?"],
      ctas: [{ label: "Full history → /#history", href: "/#history" }],
    };
  }

  // Process / how it works
  if (q.includes("process") || q.includes("pipeline") || q.includes("icp") || q.includes("outreach") || q.includes("cadence") || q.includes("method")) {
    return {
      text:
        "8 stages, in order (each depends on the last):\n\n01 Understand ICP → 02 Research → 03 Prospect (verify before any send) → 04 Outreach (cold email + LinkedIn, SPF/DKIM/DMARC monitored) → 05 Qualification (quality > count) → 06 Meeting (discovery + AE handoff) → 07 Pipeline (CRM + ROI) → 08 Growth (OKRs, training, process fixes).",
      chips: ["Which tools per stage?", "Show estimator", "Teardown example"],
      ctas: [{ label: "Lead gen → /lead-generation", href: "/lead-generation" }],
    };
  }

  // Tools / stack
  if (q.includes("tool") || q.includes("stack") || q.includes("sales nav") || q.includes("salesforce") || q.includes("apollo") || q.includes("clay")) {
    return {
      text:
        "Stack grouped by job:\n\n• Prospecting & intent: Sales Nav, Apollo, ZoomInfo, Crunchbase, Lusha, Cognism, Hunter, Lemlist\n• CRM & pipeline OS: Salesforce, HubSpot, Pipedrive, Zoho, Close\n• Automation & enrichment: n8n, agentic AI, Clay, Instantly.ai, Smartlead, PhantomBuster\n• Intelligence & pre-sales: Finquest AI, PitchBook, CB Insights, Gong.io, Draup AI, Chorus",
      chips: ["Estimate cost", "Process steps", "Work history"],
      ctas: [{ label: "Stack → /#range", href: "/#range" }],
    };
  }

  // Estimate intent
  if (q.includes("estimate") || q.includes("leads/mo") || q.includes("leads / mo") || q.match(/\d+\s*leads/)) {
    const volume = Number((q.match(/(\d+)\s*leads/) ?? [])[1] ?? 120);
    const sector = q.includes("service") ? "Service-based sector" : q.includes("mid-market") ? "Mid-market" : "B2B SaaS growth";
    const rate = sector === "B2B SaaS growth" ? 0.15 : sector === "Service-based sector" ? 0.12 : 0.14;
    const base = sector === "B2B SaaS growth" ? 450 : sector === "Service-based sector" ? 350 : 500;
    const cpl = sector === "B2B SaaS growth" ? 5 : sector === "Service-based sector" ? 4 : 6;
    const meetings = Math.round(volume * rate);
    const cost = base + volume * cpl;
    const mqlLabel = volume <= 30 ? "45–90 days to first MQL" : volume <= 70 ? "75–100 days" : volume <= 120 ? "90–120 days" : volume <= 180 ? "110–140 days" : volume <= 250 ? "130–160 days" : "150–180 days";
    return {
      text:
        `Model, not a quote — for ${volume} leads/mo in ${sector}:\n\n• ~${meetings} meetings/mo (${Math.round(rate * 100)}% rate)\n• $${cost}/mo tool spend ($${base} base + $${cpl}/lead)\n• ${mqlLabel}\n• Research cycle: 30 days (held constant)\n\nReal number comes from a scoping call.`,
      chips: ["Try 50/mo", "Try 200/mo", "Service sector"],
      ctas: [
        { label: "Open estimator → /#work-plan", href: "/#work-plan" },
        { label: "Schedule scoping call", href: "/schedule", solid: true },
      ],
    };
  }

  // Location / contact / timezone
  if (q.includes("where") || q.includes("based") || q.includes("coimbatore") || q.includes("phone") || q.includes("linkedin") || q.includes("ist") || q.includes("location") || q.includes("contact")) {
    return {
      text:
        "Based Coimbatore, Tamil Nadu, India (GMT+5:30) — +91 99949 69699. Works across IST, GMT and PT hours. Best contact: LinkedIn or phone. First call free (30–45 min) via /schedule once payment setup approved.",
      chips: ["Book a call", "Is he available now?", "Hiring?"],
      ctas: [
        { label: "LinkedIn", href: "https://www.linkedin.com/in/sampath-kumar-tn66sk9699", solid: true },
        { label: "Call +91 99949 69699", href: "tel:+919994969699" },
      ],
    };
  }

  // Sectors
  if (q.includes("sector") || q.includes("industry") || q.includes("vertical")) {
    return {
      text:
        "Core: B2B & B2C SaaS, service-based private markets, digital marketing & translation.\n\nAlso: staffing & recruiting, MedTech/pharma/healthcare, banking/finance/BPO, e-commerce/retail/aviation, EdTech, energy/utilities/engineering.",
      chips: ["Process", "Tool stack", "Results"],
      ctas: [{ label: "Sectors → /#range", href: "/#range" }],
    };
  }

  // Fallback — grounded refusal
  return {
    text:
      "I don't have that handy — try asking about hiring availability, the USD 350 session, the performance model, process (8 stages), results, or tools. Or reach him direct — he says hello first.",
    chips: ["Is Sampath open to full-time roles?", "What does the USD 350 cover?", "Show results"],
    ctas: [
      { label: "Ask on LinkedIn", href: "https://www.linkedin.com/in/sampath-kumar-tn66sk9699", solid: true },
      { label: "View /hire", href: "/hire" },
    ],
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const message = typeof body.message === "string" ? body.message : "";
  if (!message.trim()) return NextResponse.json({ text: "Say something and I'll help." });
  const data = replyFor(message);
  // Tiny artificial delay so the typing indicator reads
  await new Promise((r) => setTimeout(r, 280));
  return NextResponse.json(data);
}
