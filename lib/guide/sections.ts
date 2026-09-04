import { getGuideDocument } from "@/lib/backend/site-content-loaders";

/**
 * Flat view of the document's sections, computed live from the (now
 * admin-editable) chapters instead of once at module load — the ids this
 * validates against can change the moment Sampath edits a chapter.
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

export async function getGuideSections(): Promise<SectionRef[]> {
  const document = await getGuideDocument();
  return document.chapters.flatMap((chapter) =>
    chapter.sections.map((section) => ({
      id: section.id,
      title: section.title,
      chapterId: chapter.id,
      chapterNumber: chapter.number,
      chapterTitle: chapter.title,
    })),
  );
}

export async function getGuideSectionIdSet(): Promise<ReadonlySet<string>> {
  const sections = await getGuideSections();
  return new Set(sections.map((section) => section.id));
}

export async function getGuideSectionCount(): Promise<number> {
  const sections = await getGuideSections();
  return sections.length;
}

export async function isKnownSectionId(id: unknown): Promise<boolean> {
  if (typeof id !== "string") return false;
  const ids = await getGuideSectionIdSet();
  return ids.has(id);
}
