/**
 * Copy for the paid Lead Generation course (/course) and its enroll section
 * on /lead-generation. Lesson titles and summaries are NOT here — they come
 * from the markdown files in content/course/ via lib/course.ts, so the two
 * cannot drift. Server-only import: enrollHref reads an env var.
 */
/**
 * TODO(client): confirm the real price before launch. A ₹10 test transaction
 * will temporarily override this value during end-to-end verification —
 * that's an operational step (edit this constant, test, revert), never a
 * code branch; don't hardcode a test price anywhere.
 */
export const COURSE_PRICE_INR = 10; // TEMP: test-transaction price, revert to 4999 before launch.

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
    expiredHeading: "Your 30-day access has expired.",
    expiredBody:
      "Your enrollment window has closed. Enroll again for a fresh 30 days — or reach out if you believe this is a mistake.",
    codeLabel: "Access code",
    codePlaceholder: "LG-XXXX-XXXX",
    submit: "Unlock the course",
    checking: "Checking…",
    opening: "Opening the course…",
    invalidCode: "That code doesn't match an active enrollment. Check the email you received after payment.",
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

  enroll: {
    eyebrow: "The course",
    heading: "Prefer to run it yourself?",
    body:
      "Everything in the system above, taught step by step — the ICP method, the research loop, campaign sequencing, LinkedIn outreach, tracking, and the metrics. One payment, 30 days of access, all 40 lessons.",
    priceLabel: "₹4,999", // TODO(client): set the real price before launch.
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
