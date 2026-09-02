/**
 * The access states /course can render. Lives in its own module so the
 * sales page, the access check in app/course/page.tsx and the backend all
 * share one union without importing component files.
 */
export type CourseGateState = "locked" | "expired" | "revoked";
