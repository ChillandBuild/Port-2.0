/**
 * Copy for the admin console (/admin). Not public-facing — Sampath is the only
 * reader — so the tone is plainer than the marketing pages, but it still lives
 * here rather than inline in JSX, same as every other surface in this repo.
 */
export const ADMIN = {
  nav: {
    grants: "Access links",
    availability: "Availability",
    content: "Content",
    settings: "Settings",
  },

  settings: {
    eyebrow: "Site settings",
    heading: "What Sampath can change himself.",
    body: "Edits go live on the next page load — there's no draft or preview step, and no undo. Save one section at a time.",
    save: "Save",
    saving: "Saving…",
    saved: "Saved",
    saveError: "Couldn't save. Try again.",

    identityHeading: "Contact & identity",
    identityBody: "Shown in the header, the footer, the reply card, legal pages, the chatbot, and every email this site sends.",
    nameLabel: "Name",
    roleLabel: "Role",
    locationLabel: "Location",
    phoneLabel: "Phone (with any label, e.g. \"(WhatsApp)\")",
    phoneHrefLabel: "Phone link (tel:+countrycode number, no spaces)",
    telegramLabel: "Telegram link",
    emailLabel: "Email (leave blank to hide)",
    emailHrefLabel: "Email link (mailto:address)",
    linkedinLabel: "LinkedIn URL",
    resumeLabel: "Resume file path",
    taglineLabel: "Tagline",

    pricingHeading: "Prices",
    pricingBody: "Changing a number here updates the checkout, the confirmation emails, and the chatbot's answer — everywhere that price is quoted.",
    coursePriceUsdLabel: "Course price (USD)",
    coursePriceInrLabel: "Course price (INR)",
    scheduleUsdLabel: "Second call price (USD)",
    scheduleInrLabel: "Second call price (INR)",

    faqHeading: "Course FAQ",
    faqBody: "One question and answer per line pair, as JSON — add, remove or edit entries directly.",

    footerHeading: "Footer links",
    footerBody: "The footer's site and legal link columns, as JSON. The Contact column is generated automatically from Contact & identity above.",
    footerWordmarkLabel: "Wordmark",
    footerFineprintLabel: "Fine print",

    legalTermsHeading: "Terms of service",
    legalPrivacyHeading: "Privacy policy",
    legalRefundsHeading: "Refunds & cancellations",
    legalBody: "Title, eyebrow, last-updated line, and the section list as JSON.",
    docTitleLabel: "Title",
    docEyebrowLabel: "Eyebrow",
    docUpdatedLabel: "Last updated line",

    jsonInvalid: "That's not valid JSON — fix the syntax and try again.",
  },

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
