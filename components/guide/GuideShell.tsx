"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { GuideNavChapter } from "@/lib/guide";
import {
  getCourseProgress,
  getCourseProgressServerSnapshot,
  markSectionVisited,
  subscribeCourseProgress,
} from "@/lib/frontend/course-progress";
import styles from "./guide.module.css";

export interface SearchEntry {
  id: string;
  title: string;
  chapter: string;
  text: string;
}

interface GuideShellProps {
  nav: GuideNavChapter[];
  searchIndex: SearchEntry[];
  meta: {
    title: string;
    subtitle: string;
    chapterCount: number;
    sectionCount: number;
    durationNote: string;
  };
  children: React.ReactNode;
}

interface SearchHit extends SearchEntry {
  snippetBefore: string;
  snippetMatch: string;
  snippetAfter: string;
}

function search(index: SearchEntry[], rawQuery: string): SearchHit[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];
  const terms = query.split(/\s+/);
  const hits: SearchHit[] = [];
  for (const entry of index) {
    const haystack = `${entry.title} ${entry.text}`.toLowerCase();
    if (!terms.every((term) => haystack.includes(term))) continue;
    const at = haystack.indexOf(terms[0]);
    const start = Math.max(0, at - 60);
    const end = Math.min(haystack.length, at + 90);
    hits.push({
      ...entry,
      snippetBefore: (start > 0 ? "…" : "") + entry.text.slice(start, at).slice(-60),
      snippetMatch: entry.text.slice(at, at + terms[0].length),
      snippetAfter: entry.text.slice(at + terms[0].length, end) + (end < haystack.length ? "…" : ""),
    });
    if (hits.length >= 8) break;
  }
  return hits;
}

/**
 * Client chrome for the guide: sticky sidebar nav with active-section
 * highlighting, document search, the mobile drawer, and back-to-top. The
 * section content itself is server-rendered and passed as children.
 */
export function GuideShell({ nav, searchIndex, meta, children }: GuideShellProps) {
  const [activeId, setActiveId] = useState(nav[0]?.groups[0]?.sections[0]?.id ?? "");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reading progress lives outside React (localStorage-backed module store,
  // same shape as theme.ts) so mirroring it in never needs a synchronous
  // setState-on-mount effect.
  const visited = useSyncExternalStore(subscribeCourseProgress, getCourseProgress, getCourseProgressServerSnapshot);

  // Scroll spy: whichever section crosses the upper-middle band is active,
  // and is marked read for good (progress only ever grows).
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-guide-section]"));
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setActiveId(entry.target.id);
          markSectionVisited(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Drawer + search keyboard behaviour: Esc closes; focus is managed.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      drawerRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    } else if (document.activeElement && drawerRef.current?.contains(document.activeElement)) {
      menuButtonRef.current?.focus();
    }
  }, [drawerOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const closeAndGo = useCallback(() => setDrawerOpen(false), []);

  const hits = useMemo(() => search(searchIndex, query), [searchIndex, query]);

  const progressPercent = meta.sectionCount > 0 ? Math.round((visited.size / meta.sectionCount) * 100) : 0;

  const progressBlock = (
    <div className={styles.progress}>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
      </div>
      <p className={`mono ${styles.progressLabel}`}>
        {visited.size} / {meta.sectionCount} sections read
      </p>
    </div>
  );

  const searchPanelFor = (idSuffix: string) => (
    <div className={styles.search}>
      <label className={`mono ${styles.searchLabel}`} htmlFor={`guide-search-${idSuffix}`}>
        Search the course
      </label>
      <input
        ref={idSuffix === "sidebar" ? searchInputRef : undefined}
        className={styles.searchInput}
        id={`guide-search-${idSuffix}`}
        type="search"
        placeholder="e.g. bounce, Maildoso, meetings…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        autoComplete="off"
      />
      {query.trim() && (
        <ul className={styles.searchResults}>
          {hits.length === 0 && <li className={styles.searchEmpty}>No matches in the course.</li>}
          {hits.map((hit) => (
            <li key={hit.id}>
              <a className={styles.searchHit} href={`#${hit.id}`} onClick={() => setSearchOpen(false)}>
                <span className={`mono ${styles.searchHitChapter}`}>{hit.chapter}</span>
                <span className={styles.searchHitTitle}>{hit.title}</span>
                <span className={styles.searchHitSnippet}>
                  {hit.snippetBefore}
                  <mark>{hit.snippetMatch}</mark>
                  {hit.snippetAfter}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const navTree = (
    <nav className={styles.nav} aria-label="Course sections">
      {nav.map((chapter) => (
        <div key={chapter.id} className={styles.navChapter}>
          <a className={styles.navChapterLink} href={`#${chapter.id}`}>
            <span className={`mono ${styles.navChapterNo}`}>{chapter.number}</span>
            {chapter.title}
          </a>
          {chapter.groups.map((group, gi) => (
            <div key={gi} className={styles.navGroup}>
              {group.label && <p className={`mono ${styles.navGroupLabel}`}>{group.label}</p>}
              <ul className={styles.navList}>
                {group.sections.map((section) => {
                  const isVisited = visited.has(section.id);
                  return (
                    <li key={section.id}>
                      <a
                        className={`${styles.navLink}${activeId === section.id ? ` ${styles.navLinkActive}` : ""}`}
                        href={`#${section.id}`}
                        aria-current={activeId === section.id ? "true" : undefined}
                        aria-label={isVisited ? `${section.title} (read)` : undefined}
                        onClick={closeAndGo}
                      >
                        {isVisited && (
                          <span className={styles.navCheck} aria-hidden="true">
                            ✓
                          </span>
                        )}
                        {section.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </nav>
  );

  return (
    <div className={styles.shell}>
      {/* Mobile top bar */}
      <div className={styles.mobileBar}>
        <button
          ref={menuButtonRef}
          className={styles.mobileButton}
          type="button"
          aria-expanded={drawerOpen}
          aria-controls="guide-drawer"
          onClick={() => setDrawerOpen((open) => !open)}
        >
          <span aria-hidden="true">☰</span> Contents
        </button>
        <span className={`mono ${styles.mobileTitle}`}>{meta.title}</span>
        <button
          className={styles.mobileButton}
          type="button"
          aria-expanded={searchOpen}
          onClick={() => setSearchOpen((open) => !open)}
        >
          Search
        </button>
        <div className={styles.mobileBarFill} style={{ width: `${progressPercent}%` }} aria-hidden="true" />
      </div>

      {searchOpen && <div className={styles.mobileSearch}>{searchPanelFor("mobilebar")}</div>}

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className={styles.drawerScrim} onClick={() => setDrawerOpen(false)}>
          <div
            ref={drawerRef}
            id="guide-drawer"
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-label="Course contents"
            onClick={(event) => event.stopPropagation()}
          >
            {progressBlock}
            {searchPanelFor("drawer")}
            {navTree}
          </div>
        </div>
      )}

      <div className={styles.frame}>
        {/* Desktop sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSticky}>
            <p className={`mono ${styles.sidebarKicker}`}>{meta.durationNote}</p>
            {progressBlock}
            <button
              className={styles.searchToggle}
              type="button"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((open) => !open)}
            >
              Search <span className={styles.searchHint} aria-hidden="true">⌕</span>
            </button>
            {searchOpen && searchPanelFor("sidebar")}
            {navTree}
          </div>
        </aside>

        {/* Document */}
        <div className={styles.document}>
          <header className={styles.hero}>
            <h1 className={styles.heroTitle}>{meta.title}</h1>
            <p className={styles.heroSubtitle}>{meta.subtitle}</p>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>{meta.chapterCount}</span>
                <span className={`mono ${styles.heroStatLabel}`}>Chapters</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>{meta.sectionCount}</span>
                <span className={`mono ${styles.heroStatLabel}`}>Sections</span>
              </div>
              <p className={`mono ${styles.heroStatNote}`}>{meta.durationNote}</p>
            </div>
          </header>
          {children}
        </div>
      </div>

      {/* Back-to-top is provided globally by the site chrome (BackToTop). */}
    </div>
  );
}
