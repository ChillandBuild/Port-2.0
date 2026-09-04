"use client";

/**
 * /admin/chatbot — the whole answer set as one JSON document. It's one
 * content key (chatbot_answers) because the matching order matters: answers
 * are tried top to bottom, first keyword match wins, so splitting them into
 * separate cards would make reordering impossible without cutting and
 * pasting JSON between cards anyway.
 */

import type { ChatbotContent } from "@/lib/backend/site-content-loaders";
import { JsonCard } from "./form-kit";
import styles from "./Admin.module.css";

export function ChatbotForm({ initial }: { initial: ChatbotContent }) {
  return (
    <div className={styles.settingsSections}>
      <JsonCard
        heading="Chatbot answers"
        body={
          'The site chatbot. "answers" is tried in order — the first entry whose "keywords" array contains a substring of the visitor\'s message wins; "fallback" answers when nothing matches. ' +
          "Available tokens in text/chips/cta hrefs: {{phone}}, {{phoneHref}}, {{linkedin}}, {{telegram}}, {{resume}}, {{secondCallPrice}}, {{secondCallPriceUsd}}. " +
          "One intent — \"estimate my pipeline\" — runs real math instead of stored text and isn't listed here."
        }
        jsonLabel="Chatbot (JSON)"
        initial={initial}
        contentKey="chatbot_answers"
        rows={28}
      />
    </div>
  );
}
