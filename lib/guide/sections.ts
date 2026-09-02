import { GUIDE_DOCUMENT } from "./index";

/**
 * Flat view of the document's sections, derived once at module load.
 *
 * Two callers need this and neither should walk the chapter tree itself:
 *   - /api/course/progress, to reject section ids it does not recognise. That
 *     endpoint is reachable by anyone holding a live access code, so without
 *     an allowlist it would be an arbitrary write into a jsonb column.
 *   - the admin console, to render "31 / 40 sections" and group a recipient's
 *     reading by chapter.
 *
 * These ids double as the DOM anchors in GuidePage and as the keys stored in
 * course_access.sections_seen. Renaming one therefore orphans stored reading
 * history — treat them as a stable interface, not as internal labels.
 */

export interface SectionRef {
  id: string;
  title: string;
  chapterId: string;
  chapterNumber: string;
  chapterTitle: string;
}

export const GUIDE_SECTIONS: readonly SectionRef[] = GUIDE_DOCUMENT.chapters.flatMap((chapter) =>
  chapter.sections.map((section) => ({
    id: section.id,
    title: section.title,
    chapterId: chapter.id,
    chapterNumber: chapter.number,
    chapterTitle: chapter.title,
  })),
);

export const GUIDE_SECTION_IDS: ReadonlySet<string> = new Set(
  GUIDE_SECTIONS.map((section) => section.id),
);

export const GUIDE_SECTION_COUNT = GUIDE_SECTIONS.length;

export function isKnownSectionId(id: unknown): id is string {
  return typeof id === "string" && GUIDE_SECTION_IDS.has(id);
}
