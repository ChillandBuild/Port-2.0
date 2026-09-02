/**
 * Copy for the paid Lead Generation course (/course) and its enroll section
 * on /lead-generation. Lesson titles and summaries are NOT here — they come
 * from the markdown files in content/course/ via lib/course.ts, so the two
 * cannot drift. Server-only import: enrollHref reads an env var.
 */
export const COURSE = {
  eyebrow: "The course",
  title: "The Lead Generation Course.",
  lede: "The entire outbound system — ICP, sourcing, cadences, qualification, hand-off, and the numbers — in 30 lessons. One payment, 30 days of access, work through it at your own pace.",
  indexHeading: "What's inside.",
  indexBody: "Lessons in order. Each one builds on the last; start at the top.",
  durationNote: "30 days of access from payment.",

  gate: {
    lockedEyebrow: "Members only",
    lockedHeading: "The course is for enrolled buyers.",
    lockedBody:
      "Enroll to get instant access — or, if you have already paid, enter the access code from your email.",
    expiredEyebrow: "Access ended",
    expiredHeading: "Your 30-day access has expired.",
    expiredBody:
      "Your enrollment window has closed. Enroll again for a fresh 30 days — or reach out if you believe this is a mistake.",
    codeLabel: "Access code",
    codePlaceholder: "LG-XXXX-XXXX",
    submit: "Unlock the course",
    checking: "Checking…",
    invalidCode: "That code doesn't match an active enrollment. Check the email you received after payment.",
    error: "Something went wrong checking your code. Try again in a moment.",
    buyLabel: "Enroll now",
    buyNote: "You'll get your access code by email right after payment — come back here and enter it below to unlock.",
    expiryLabel: "Your access is valid until",
  },

  enroll: {
    eyebrow: "The course",
    heading: "Prefer to run it yourself?",
    body:
      "Everything in the pipeline above, taught step by step — the ICP method, the sourcing loop, cadence writing, qualification, and the hand-off. One payment, 30 days of access, all ~30 lessons.",
    priceLabel: "₹4,999", // TODO(client): set the real price before launch.
    durationLabel: "30 days of access",
    buyLabel: "Enroll now",
    memberLabel: "Already enrolled? Enter your code",
    outlineLabel: "The lesson list",
  },
} as const;

/**
 * Where "Enroll now" points: the Razorpay Payment Page (international
 * payments enabled in the Razorpay dashboard). Falls back to the schedule
 * page so a missing env var degrades to "enroll on a call" instead of a dead
 * button. Server-only — client components must receive it as a prop.
 */
export const COURSE_ENROLL_HREF =
  process.env.RAZORPAY_PAYMENT_PAGE_URL ?? "/schedule";
