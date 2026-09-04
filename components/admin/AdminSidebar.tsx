"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN } from "@/lib/content/admin";
import styles from "./Admin.module.css";

const NAV_ITEMS = [
  { href: "/admin", label: ADMIN.nav.grants },
  { href: "/admin/availability", label: ADMIN.nav.availability },
  { href: "/admin/content", label: ADMIN.nav.content },
  { href: "/admin/course", label: ADMIN.nav.course },
  { href: "/admin/chatbot", label: ADMIN.nav.chatbot },
  { href: "/admin/emails", label: ADMIN.nav.emails },
  { href: "/admin/settings", label: ADMIN.nav.settings },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

const SIGN_OUT_FORM = (
  <form action="/api/admin/logout" method="post">
    <button className={styles.signOut} type="submit">
      {ADMIN.nav.signOut}
    </button>
  </form>
);

/**
 * Client chrome only — carries no admin data, just static nav labels and the
 * current path. requireAdmin() still runs per-page (see app/admin/layout.tsx);
 * this component must never import admin-auth or any data loader.
 */
export function AdminSidebar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
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

  // Chrome only — signed-out visitors on /admin/login get no sidebar, no
  // drawer, and no sign-out control.
  if (pathname === "/admin/login") return null;

  const activeLabel = NAV_ITEMS.find((item) => isActive(pathname, item.href))?.label ?? ADMIN.nav.menu;

  const navList = (onNavigate?: () => void) => (
    <ul className={styles.navList}>
      {NAV_ITEMS.map((item) => (
        <li key={item.href}>
          <Link
            className={`${styles.navLink}${isActive(pathname, item.href) ? ` ${styles.navLinkActive}` : ""}`}
            href={item.href}
            aria-current={isActive(pathname, item.href) ? "page" : undefined}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className={styles.mobileBar}>
        <button
          ref={menuButtonRef}
          className={styles.mobileButton}
          type="button"
          aria-expanded={drawerOpen}
          aria-controls="admin-drawer"
          onClick={() => setDrawerOpen((open) => !open)}
        >
          <span aria-hidden="true">☰</span> {activeLabel}
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className={styles.drawerScrim} onClick={() => setDrawerOpen(false)}>
          <div
            ref={drawerRef}
            id="admin-drawer"
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-label="Admin sections"
            onClick={(event) => event.stopPropagation()}
          >
            {navList(() => setDrawerOpen(false))}
            <div className={styles.navFooter}>{SIGN_OUT_FORM}</div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={styles.sidebar} aria-label="Admin sections">
        <div className={styles.sidebarSticky}>
          {navList()}
          <div className={styles.navFooter}>{SIGN_OUT_FORM}</div>
        </div>
      </aside>
    </>
  );
}
