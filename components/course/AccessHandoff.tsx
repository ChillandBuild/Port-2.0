"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { COURSE } from "@/lib/content/course";
import styles from "./AccessHandoff.module.css";

type Status = "idle" | "opening" | "error";

/**
 * The button that actually starts someone's access window.
 *
 * It is a POST, not a link, and that is the whole point of this component.
 * Corporate mail security (Defender Safe Links, Proofpoint) and chat preview
 * bots issue GET requests for every URL they see, following redirects. If
 * opening the course were a GET, a four-hour window could be spent by a
 * scanner minutes after the message was sent and hours before the recipient
 * read it. Scanners do not click buttons and do not POST.
 *
 * The route handler sets the access cookie; the clock itself starts when
 * /course renders.
 */
export function AccessHandoff({ code }: { code: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");

  async function open() {
    if (status === "opening") return;
    setStatus("opening");
    try {
      const response = await fetch("/api/course/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // start: true is what actually begins the window. A POST is the only
        // signal a scanner or a prefetch cannot fake.
        body: JSON.stringify({ code, start: true }),
      });
      const payload = (await response.json()) as { success: boolean };
      if (payload.success) {
        router.push("/course");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={styles.action}>
      <button
        className={styles.open}
        type="button"
        onClick={open}
        disabled={status === "opening"}
      >
        {status === "opening" && <span className={styles.spinner} aria-hidden="true" />}
        {status === "opening" ? COURSE.handoff.opening : COURSE.handoff.open}
      </button>
      <p className={styles.startsNote}>{COURSE.handoff.startsNote}</p>
      {status === "error" && (
        <p className={styles.error} role="alert">
          {COURSE.handoff.error}
        </p>
      )}
    </div>
  );
}
