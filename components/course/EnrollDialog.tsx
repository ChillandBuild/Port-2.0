"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { COURSE } from "@/lib/content/course";
import styles from "./CourseGate.module.css";

type Phase =
  | "closed"
  | "details"
  | "creating-order"
  | "checkout"
  | "verifying"
  | "success"
  | "pending"
  | "error";

type ErrorKind = "order" | "unverified" | "verify-network" | null;

interface RazorpayCheckoutResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayCheckoutOptions {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
  handler: (response: RazorpayCheckoutResponse) => void;
  modal: { ondismiss: () => void };
}

interface RazorpayCheckoutInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckoutInstance;
  }
}

/** Module-scoped so repeated dialog opens don't re-inject the script tag. */
let checkoutScriptPromise: Promise<void> | null = null;

function loadCheckoutScript(): Promise<void> {
  if (checkoutScriptPromise) return checkoutScriptPromise;
  checkoutScriptPromise = new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Checkout script failed to load."));
    document.body.appendChild(script);
  });
  return checkoutScriptPromise;
}

const ERROR_COPY: Record<Exclude<ErrorKind, null>, string> = {
  order: COURSE.gate.dialogErrorOrder,
  unverified: COURSE.gate.dialogErrorUnverified,
  "verify-network": COURSE.gate.dialogErrorVerifyNetwork,
};

interface EnrollDialogProps {
  priceLabel: string;
  fallbackHref: string;
  keyConfigured: boolean;
}

/**
 * The whole on-site payment flow — details form, Checkout.js, verify, code
 * reveal — in one self-contained client component, mirroring
 * CourseUnlockForm's Phase-union pattern. Embedded in the server-rendered
 * CourseGate, which stays a server component.
 */
export function EnrollDialog({ priceLabel, fallbackHref, keyConfigured }: EnrollDialogProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("closed");
  const [errorKind, setErrorKind] = useState<ErrorKind>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{ accessCode: string; expiresAt: string } | null>(null);
  const lastCheckoutResponse = useRef<RazorpayCheckoutResponse | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const headingId = useId();

  const isOpen = phase !== "closed";
  const canClose = phase === "details" || phase === "error" || phase === "success" || phase === "pending";
  const showOverlay = isOpen && phase !== "checkout";

  useEffect(() => {
    if (phase === "details") nameInputRef.current?.focus();
  }, [phase]);

  // Focus trap + Escape-to-close while open; focus returns to the trigger on close.
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusable = () =>
      dialogRef.current?.querySelectorAll<HTMLElement>(
        "button:not(:disabled), input:not(:disabled), a[href]",
      ) ?? [];

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (canClose) close();
        return;
      }
      if (event.key !== "Tab") return;
      const items = Array.from(focusable());
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function close() {
    setPhase("closed");
    setErrorKind(null);
  }

  async function submitDetails(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase !== "details") return;
    setPhase("creating-order");
    setErrorKind(null);
    try {
      const [orderResponse] = await Promise.all([
        fetch("/api/course/order", { method: "POST" }),
        loadCheckoutScript(),
      ]);
      const order = (await orderResponse.json()) as {
        success: boolean;
        orderId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
      };
      if (!order.success || !order.orderId || !order.keyId || !order.amount || !order.currency || !window.Razorpay) {
        throw new Error("order failed");
      }
      setPhase("checkout");
      const checkout = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "Sampath Kumar",
        description: "Lead Generation Course",
        prefill: { name, email, contact: phone },
        handler: (response) => {
          lastCheckoutResponse.current = response;
          void verify(response);
        },
        modal: {
          ondismiss: () => setPhase("details"),
        },
      });
      checkout.open();
    } catch {
      setPhase("error");
      setErrorKind("order");
    }
  }

  async function verify(response: RazorpayCheckoutResponse) {
    setPhase("verifying");
    try {
      const verifyResponse = await fetch("/api/course/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...response, name, email, phone }),
      });
      const payload = (await verifyResponse.json()) as {
        success: boolean;
        error?: string;
        accessCode?: string;
        expiresAt?: string;
      };
      if (payload.success && payload.accessCode && payload.expiresAt) {
        setResult({ accessCode: payload.accessCode, expiresAt: payload.expiresAt });
        setPhase("success");
        return;
      }
      if (payload.error === "grant-pending") {
        setPhase("pending");
        return;
      }
      setPhase("error");
      setErrorKind("unverified");
    } catch {
      setPhase("error");
      setErrorKind("verify-network");
    }
  }

  function retry() {
    if (errorKind === "verify-network" && lastCheckoutResponse.current) {
      void verify(lastCheckoutResponse.current);
      return;
    }
    setPhase("details");
    setErrorKind(null);
  }

  async function copyCode() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.accessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied — the code is still visible to select and copy.
    }
  }

  function continueToCourse() {
    close();
    router.refresh();
  }

  if (!keyConfigured) {
    return (
      <a className={styles.buy} href={fallbackHref} target="_blank" rel="noreferrer noopener">
        {COURSE.gate.payPrefix} — {priceLabel}
      </a>
    );
  }

  return (
    <>
      <button ref={triggerRef} type="button" className={styles.buy} onClick={() => setPhase("details")}>
        {COURSE.gate.payPrefix} — {priceLabel}
      </button>

      {showOverlay && (
        <div
          className={styles.dialogOverlay}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && canClose) close();
          }}
        >
          <div ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby={headingId}>
            {canClose && (
              <button type="button" className={styles.dialogCloseButton} onClick={close} aria-label={COURSE.gate.dialogClose}>
                ×
              </button>
            )}

            {phase === "details" && (
              <form className={styles.form} onSubmit={submitDetails}>
                <h2 className={styles.dialogHeading} id={headingId}>
                  {COURSE.gate.dialogHeading}
                </h2>
                <label className={styles.label} htmlFor="enroll-name">
                  {COURSE.gate.dialogNameLabel}
                </label>
                <input
                  ref={nameInputRef}
                  className={styles.input}
                  id="enroll-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
                <label className={styles.label} htmlFor="enroll-email">
                  {COURSE.gate.dialogEmailLabel}
                </label>
                <input
                  className={styles.input}
                  id="enroll-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <label className={styles.label} htmlFor="enroll-phone">
                  {COURSE.gate.dialogPhoneLabel}
                </label>
                <input
                  className={styles.input}
                  id="enroll-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
                <button className={styles.submit} type="submit">
                  {COURSE.gate.dialogSubmit} — {priceLabel}
                </button>
              </form>
            )}

            {(phase === "creating-order" || phase === "verifying") && (
              <div className={styles.dialogStatus}>
                <span className={styles.spinner} aria-hidden="true" />
                <p id={headingId}>
                  {phase === "creating-order" ? COURSE.gate.dialogCreatingOrder : COURSE.gate.dialogVerifying}
                </p>
              </div>
            )}

            {phase === "success" && result && (
              <div className={styles.dialogSuccess}>
                <h2 id={headingId}>{COURSE.gate.dialogSuccessHeading}</h2>
                <p>{COURSE.gate.dialogSuccessBody}</p>
                <p className={styles.dialogCode}>{result.accessCode}</p>
                <button type="button" className={styles.submit} onClick={copyCode}>
                  {copied ? COURSE.gate.dialogCopiedLabel : COURSE.gate.dialogCopyLabel}
                </button>
                <button type="button" className={styles.buy} onClick={continueToCourse}>
                  {COURSE.gate.dialogContinueLabel}
                </button>
              </div>
            )}

            {phase === "pending" && (
              <div className={styles.dialogStatus}>
                <h2 id={headingId}>{COURSE.gate.dialogPendingHeading}</h2>
                <p>{COURSE.gate.dialogPendingBody}</p>
              </div>
            )}

            {phase === "error" && errorKind && (
              <div className={styles.dialogStatus}>
                <p className={styles.error} role="alert" id={headingId}>
                  {ERROR_COPY[errorKind]}
                </p>
                {errorKind !== "unverified" && (
                  <button type="button" className={styles.submit} onClick={retry}>
                    {COURSE.gate.dialogRetry}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
