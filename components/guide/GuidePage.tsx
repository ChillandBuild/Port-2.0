import { COURSE } from "@/lib/content/course";
import { GUIDE_DOCUMENT, buildGuideNav, sectionText, type GuideNavChapter } from "@/lib/guide";
import { chapterIcon } from "./icons";
import { GuideShell } from "./GuideShell";
import { renderBlock } from "./blocks";
import styles from "./guide.module.css";

export interface SearchEntry {
  id: string;
  title: string;
  chapter: string;
  text: string;
}

/**
 * The unlocked course: the full document as a documentation experience —
 * sticky chapter nav, search, timeline, tables, metric cards. All content
 * comes from the typed transcription in lib/guide; this component only
 * decides layout.
 */
export function GuidePage() {
  const nav: GuideNavChapter[] = buildGuideNav(GUIDE_DOCUMENT.chapters);
  const searchIndex: SearchEntry[] = GUIDE_DOCUMENT.chapters.flatMap((chapter) =>
    chapter.sections.map((section) => ({
      id: section.id,
      title: section.title,
      chapter: chapter.title,
      text: sectionText(section),
    })),
  );
  const sectionCount = GUIDE_DOCUMENT.chapters.reduce((n, c) => n + c.sections.length, 0);

  return (
    <GuideShell
      nav={nav}
      searchIndex={searchIndex}
      meta={{
        title: GUIDE_DOCUMENT.title,
        subtitle: GUIDE_DOCUMENT.subtitle,
        chapterCount: GUIDE_DOCUMENT.chapters.length,
        sectionCount,
        durationNote: COURSE.durationNote,
      }}
    >
      {GUIDE_DOCUMENT.chapters.map((chapter) => (
        <section key={chapter.id} id={chapter.id} className={styles.chapter} data-guide-chapter>
          <header className={styles.chapterHeader}>
            <p className={`mono ${styles.chapterNo}`}>
              {chapterIcon(chapter.id, styles.chapterIcon)} Chapter {chapter.number}
            </p>
            <h2 className={styles.chapterTitle}>{chapter.title}</h2>
            <p className={`mono ${styles.chapterSource}`}>{chapter.source}</p>
            {chapter.intro?.map((block, i) => (
              <div key={i} className={styles.chapterIntro}>
                {renderBlock(block, `intro-${i}`)}
              </div>
            ))}
          </header>
          {chapter.sections.map((section) => (
            <article key={section.id} id={section.id} className={styles.section} data-guide-section>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              {section.blocks.map((block, i) => renderBlock(block, `b-${i}`))}
            </article>
          ))}
        </section>
      ))}
    </GuideShell>
  );
}
