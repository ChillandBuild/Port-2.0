"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { COURSE } from "@/lib/content/course";
import styles from "./CourseSales.module.css";

type Phase = "details" | "creating-order" | "checkout" | "verifying" | "success" | "pending" | "error";

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

/** Module-scoped so repeated checkouts don't re-inject the script tag. */
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
 * CourseUnlockForm's Phase-union pattern. Rendered always-expanded inside
 * the pricing card of the sales page; no collapsed "Pay Now" state.
 */
export function EnrollDialog({ priceLabel, fallbackHref, keyConfigured }: EnrollDialogProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("details");
  const [errorKind, setErrorKind] = useState<ErrorKind>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{ accessCode: string; expiresAt: string } | null>(null);
  const lastCheckoutResponse = useRef<RazorpayCheckoutResponse | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const headingId = useId();

  if (!keyConfigured) {
    return (
      <a className={styles.submit} href={fallbackHref} target="_blank" rel="noreferrer noopener">
        {COURSE.gate.payPrefix} — {priceLabel}
      </a>
    );
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
        description: "Lead Generation Strategy Course",
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
    router.refresh();
  }

  return (
    <div className={styles.enrollArea} aria-live="polite" aria-atomic="true">
      {phase === "details" && (
        <form className={styles.form} onSubmit={submitDetails}>
          <h3 className={styles.formHeading} id={headingId}>
            {COURSE.sales.formHeading}
          </h3>
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
          <h3 id={headingId}>{COURSE.gate.dialogSuccessHeading}</h3>
          <p>{COURSE.gate.dialogSuccessBody}</p>
          <p className={styles.dialogCode}>{result.accessCode}</p>
          <button type="button" className={styles.secondary} onClick={copyCode}>
            {copied ? COURSE.gate.dialogCopiedLabel : COURSE.gate.dialogCopyLabel}
          </button>
          <button type="button" className={styles.submit} onClick={continueToCourse}>
            {COURSE.gate.dialogContinueLabel}
          </button>
        </div>
      )}

      {phase === "pending" && (
        <div className={styles.dialogStatus}>
          <h3 id={headingId}>{COURSE.gate.dialogPendingHeading}</h3>
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
  );
}
