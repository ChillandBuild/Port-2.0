/**
 * Copy for the paid Lead Generation course (/course) and its enroll section
 * on /lead-generation. Lesson titles and summaries are NOT here — they come
 * from the markdown files in content/course/ via lib/course.ts, so the two
 * cannot drift. Server-only import: enrollHref reads an env var.
 */
export const COURSE_PRICE_USD = 59;
export const COURSE_CURRENCY = "USD";
/** INR alternative for buyers paying from India — a round price point, not a live conversion. */
export const COURSE_PRICE_INR = 4999;

export const COURSE = {
  eyebrow: "The course",
  title: "The Lead Generation Strategy Course.",
  lede: "The entire outbound system — ICP, research, infrastructure, campaigns, tracking, and the numbers — in 40 lessons. One payment, 30 days of access, work through it at your own pace.",
  indexHeading: "What's inside.",
  indexBody: "Lessons in order. Each one builds on the last; start at the top.",
  durationNote: "30 days of access from payment.",

  gate: {
    lockedEyebrow: "Members only",
    lockedHeading: "Everything you need to build outbound that works.",
    lockedBody:
      "The entire pipeline — ICP, research, infrastructure, campaigns, tracking — in 40 lessons. One payment, work through it at your own pace.",
    expiredEyebrow: "Access ended",
    expiredHeading: "Your access window has closed.",
    expiredBody:
      "This access window has ended. Enroll for a fresh 30 days below — or, if you were given a time-limited link, ask whoever sent it for a new one.",
    revokedEyebrow: "Access ended",
    revokedHeading: "This access was ended by the organiser.",
    revokedBody:
      "Whoever arranged this access has closed it. Contact them if you think that's a mistake — or enroll below for your own copy.",
    codeLabel: "Access code",
    codePlaceholder: "LG-XXXX-XXXX",
    submit: "Unlock the course",
    checking: "Checking…",
    opening: "Opening the course…",
    invalidCode: "That code doesn't match an active enrollment. Check the email you received after payment.",
    revokedCode: "That access was ended by whoever arranged it. Ask them for a new link.",
    error: "Something went wrong checking your code. Try again in a moment.",
    buyLabel: "Enroll now",
    buyNote: "You'll get your access code by email right after payment — come back here and enter it below to unlock.",
    expiryLabel: "Your access is valid until",

    whatsInsideHeading: "What you get",
    whatsInsideItems: [
      "Define your ICP without guessing",
      "Build a sourcing loop that doesn't dry up",
      "Write cadences that get replies",
      "Qualify before you waste a call",
      "Hand off deals cleanly to close",
    ],
    statLessonsLabel: "Lessons",
    statLessons: 40,
    statDaysLabel: "Days access",
    statDays: 30,

    payPrefix: "Pay Now",
    payNote: "You'll get instant access — your code also arrives by email.",
    unlockToggleLabel: "Already enrolled? Enter your access code",

    dialogHeading: "Enroll in the course",
    dialogNameLabel: "Name",
    dialogEmailLabel: "Email",
    dialogPhoneLabel: "Phone",
    dialogCurrencyLabel: "Currency",
    dialogSubmit: "Continue to payment",
    dialogCreatingOrder: "Preparing payment…",
    dialogVerifying: "Confirming your payment…",
    dialogSuccessHeading: "You're in.",
    dialogSuccessBody: "Your access code (also emailed to you):",
    dialogPendingHeading: "Payment received.",
    dialogPendingBody: "Your payment went through — your access code is on its way by email.",
    dialogErrorOrder: "Couldn't start the payment. Try again.",
    dialogErrorUnverified: "We couldn't confirm your payment — check your email or contact support.",
    dialogErrorVerifyNetwork: "Couldn't confirm the payment just now. Try again.",
    dialogRetry: "Try again",
    dialogContinueLabel: "Continue to the course",
    dialogCopyLabel: "Copy code",
    dialogCopiedLabel: "Copied",
    dialogClose: "Close",
  },

  /**
   * The /c/<code> handoff page — the first thing a hiring company sees. It
   * exists so opening the link and starting the clock are two separate acts:
   * corporate mail scanners follow links, so a redirect here would spend the
   * window before a person ever saw it.
   */
  handoff: {
    eyebrow: "Sampath Kumar",
    heading: "The lead generation system, in full.",
    body:
      "ICP, research, infrastructure, campaigns, LinkedIn, tracking and the numbers — the whole thing I run, written out in 40 sections.",
    forLabel: "Prepared for",
    windowLabel: "Your access",
    startsNote: "Your time starts when you open it — not now. Take a moment.",
    open: "Open the course",
    opening: "Opening…",
    error: "Couldn't open it just now. Try again in a moment.",
    trackedNote:
      "Opens are logged so Sampath knows when to follow up.",

    deadHeading: "This link is no longer active.",
    deadBody:
      "It may have already been used up, or been withdrawn. Ask whoever sent it for a fresh one.",
    deadLink: "See the rest of the site",
  },

  enroll: {
    eyebrow: "The course",
    heading: "Prefer to run it yourself?",
    body:
      "Everything in the system above, taught step by step — the ICP method, the research loop, campaign sequencing, LinkedIn outreach, tracking, and the metrics. One payment, 30 days of access, all 40 lessons.",
    priceLabel: "$59",
    durationLabel: "30 days of access",
    buyLabel: "Enroll now",
    memberLabel: "Already enrolled? Enter your code",
    outlineLabel: "The lesson list",
  },

  /**
   * The /course sales page (all states render it; only the hero copy
   * differs). Curriculum section content is generated from GUIDE_DOCUMENT,
   * not stored here.
   */
  sales: {
    hero: {
      lockedEyebrow: "The Lead Generation Strategy Course",
      lockedHeading: "Run outbound like a system, not a guess.",
      lockedBody:
        "The exact 90-day multi-channel playbook I run for real campaigns — ICP, research, infrastructure, sequencing, LinkedIn, tracking and the numbers — in 40 lessons you can work through in an afternoon and execute the next morning.",
      expiredEyebrow: "Access ended",
      expiredHeading: "Your 30-day window has closed.",
      expiredBody:
        "The full course is one payment away again. Enroll below for a fresh 30 days — everything you finished is right where you left it in the new window.",
      revokedEyebrow: "Access ended",
      revokedHeading: "This access was ended by the organiser.",
      revokedBody:
        "Whoever arranged this access has closed it. Contact them if you think that's a mistake — or enroll below for your own copy.",
    },
    priceAnchor: "$59 · one-time payment",
    heroCta: "Enroll now — $59",
    heroCtaNote: "Secure payment via Razorpay",
    ctaHref: "#enroll",

    outcomesEyebrow: "What you get",
    outcomesHeading: "Every piece of the outbound engine, taught.",
    outcomes: [
      "Define your ICP without guessing",
      "Build a sourcing loop that doesn't dry up",
      "Write sequences that get replies",
      "Run LinkedIn outreach that doesn't get blocked",
      "Qualify before you waste a call",
      "Read the numbers that decide whether to scale",
    ],
    outcomesNote: "40 lessons · 9 chapters · worksheets, benchmarks and tool pricing included.",

    curriculumEyebrow: "The curriculum",
    curriculumHeading: "Nine chapters. Forty lessons. In order.",
    curriculumBody: "Each chapter builds on the last — start at the top, or jump to the piece you need today.",
    curriculumMeta: (n: number) => `${n} lesson${n === 1 ? "" : "s"}`,

    instructorEyebrow: "Your instructor",
    instructorHeading: "Built by someone who runs this for a living.",
    instructorBody: [
      "I'm Sampath Kumar. For 7+ years I've built and run outbound lead generation and pre-sales systems across IT, SaaS, Pharma, Edutech and Fintech — the ICP research, the infrastructure, the sequences, and the CRM reporting that proves it worked.",
      "This course is that system written out the way I actually run it: real tool pricing, real benchmark numbers, and the decision trees I use when replies come in. Nothing theoretical.",
    ],
    instructorCta: "Connect on LinkedIn",

    pricingEyebrow: "Enroll",
    pricingHeading: "One payment. Thirty days. The whole system.",
    includesLabel: "What's included",
    includes: [
      "All 40 lessons across 9 chapters",
      "The 7-touch sequence framework",
      "Tool stack with real 2026 pricing",
      "Reply-handling decision trees",
      "MQL benchmarks by infrastructure size",
      "Access code delivered by email instantly",
    ],
    guaranteeBadge: "7-day money-back guarantee",
    guaranteeNote: "If it's not for you, request a full refund within 7 days of enrollment — see the refund policy below.",
    secureNote: "Payments secured by Razorpay · UPI, cards & netbanking",
    formHeading: "Enroll in the course",
    unlockHeading: "Already enrolled?",
    unlockBody: "Enter the access code from your email to unlock the course on this device.",

    faqEyebrow: "Questions",
    faqHeading: "Before you enroll.",
    faq: [
      {
        q: "Who is this course for?",
        a: "Founders, SDRs/BDRs, freelance lead generators and marketing teams who need to run outbound themselves. If you've never sent a cold email, start at Chapter 1 — if you have, the benchmark tables and decision trees alone are worth the price.",
      },
      {
        q: "What format is the course in?",
        a: "Written lessons — 40 of them across 9 chapters, with tables, flow diagrams and benchmarks throughout. It reads like documentation, not video, so you can skim, search and come back to exactly the piece you need.",
      },
      {
        q: "Do I need to buy the tools you list?",
        a: "The course includes real pricing for every tool so you can budget before you spend. Nothing is purchased through this site; several chapters have free-tier paths to start with.",
      },
      {
        q: "How long do I have access?",
        a: "30 days from payment, on any device — you unlock with the access code emailed to you right after checkout.",
      },
      {
        q: "How does the 7-day refund work?",
        a: "Request a refund within 7 days of enrollment through the contact method on the refund policy page, quoting your payment reference. Approved refunds go back to your original payment method.",
      },
      {
        q: "I paid but haven't received my access code.",
        a: "Check spam first. If it's not there within a few minutes, the checkout success screen also shows the code — and you can reach out on LinkedIn with your payment reference.",
      },
      {
        q: "Is the LinkedIn automation part compliant?",
        a: "The course teaches the methods as they're actually run, including where the risk sits — and the organic, no-automation track alongside it. Read Chapter 5 before automating anything.",
      },
    ],

    trustLinks: [
      { label: "Refund policy", href: "/refunds" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
    backLabel: "Back to the site",
  },
} as const;

/**
 * Fallback for the Pay Now button when RAZORPAY_KEY_ID isn't configured —
 * degrades to the hosted Payment Page if one is set, otherwise to "enroll on
 * a call" instead of a dead click. Server-only — client components must
 * receive it as a prop.
 */
export const COURSE_ENROLL_HREF =
  process.env.RAZORPAY_PAYMENT_PAGE_URL ?? "/schedule";
