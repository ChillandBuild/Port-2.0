/**
 * Copy for the admin console (/admin). Not public-facing — Sampath is the only
 * reader — so the tone is plainer than the marketing pages, but it still lives
 * here rather than inline in JSX, same as every other surface in this repo.
 */
export const ADMIN = {
  login: {
    eyebrow: "Admin",
    heading: "Sign in",
    body: "Access-link console for the Lead Generation course.",
    emailLabel: "Email",
    passwordLabel: "Password",
    submit: "Sign in",
    submitting: "Signing in…",
    invalid: "That email and password don't match an account.",
    notAllowed: "That account isn't allowed to use this console.",
    error: "Something went wrong signing in. Try again in a moment.",
  },

  grants: {
    eyebrow: "Access links",
    heading: "Give someone the course for a few hours.",

    labelLabel: "Company or person",
    labelPlaceholder: "e.g. Zoho — hiring panel",
    durationLabel: "Access for",
    create: "Create link",
    creating: "Creating…",

    moreOptions: "More options",
    emailLabel: "Email it to them (optional)",
    emailHint: "Leave blank if you're pasting the link into a chat.",
    redeemByLabel: "Link expires unopened after",
    redeemByUnit: "days",
    customAmountLabel: "Amount",
    customUnitLabel: "Unit",

    copyLink: "Copy link",
    copied: "Copied",
    createError: "Couldn't create the link. Try again.",

    emptyHeading: "No access links yet.",
    emptyBody: "Create one above, then paste it wherever you're talking to them.",

    statusNotOpened: "Not opened yet",
    statusOpened: "Opened",
    statusExpired: "Expired",
    statusRevoked: "Revoked",
    statusLapsed: "Expired unopened",

    sectionsRead: "sections read",
    addTime: "Add time",
    revoke: "Revoke",
    restore: "Restore",
    restoreNote: "The original expiry still applies — use Add time to make up for it.",
    revokeConfirm: "End this access now?",
    actionError: "That didn't go through. Try again.",
  },
} as const;
