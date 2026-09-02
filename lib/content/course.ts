/**
 * Copy for the paid Lead Generation course (/course) and its enroll section
 * on /lead-generation. Lesson titles and summaries are NOT here — they come
 * from the markdown files in content/course/ via lib/course.ts, so the two
 * cannot drift. Server-only import: enrollHref reads an env var.
 */
export const COURSE_PRICE_USD = 59;
export const COURSE_CURRENCY = "USD";

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
} as const;

/**
 * Fallback for the Pay Now button when RAZORPAY_KEY_ID isn't configured —
 * degrades to the hosted Payment Page if one is set, otherwise to "enroll on
 * a call" instead of a dead click. Server-only — client components must
 * receive it as a prop.
 */
export const COURSE_ENROLL_HREF =
  process.env.RAZORPAY_PAYMENT_PAGE_URL ?? "/schedule";
