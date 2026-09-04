"use client";

/**
 * The page's actual ask. State and validation are deliberately plain: one
 * useState per field, inline regex, no form library.
 *
 * Two branches from here, chosen by the call-type toggle:
 *   "first"  → posts to the shared /api/submissions endpoint (unchanged),
 *              free, notifies Sampath by email.
 *   "second" → real Razorpay payment for the $350 setup call. Mirrors
 *              EnrollDialog's order → Checkout.js → verify flow exactly,
 *              sharing lib/frontend/razorpay-checkout.ts's script loader.
 */

import { useId, useRef, useState } from "react";
import { SCHEDULE } from "@/lib/content";
import { loadCheckoutScript, type RazorpayCheckoutResponse } from "@/lib/frontend/razorpay-checkout";
import { ScheduleCalendar, type PickedSlot } from "./ScheduleCalendar";
import styles from "./ScheduleForm.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CallType = "first" | "second";
type Currency = "USD" | "INR";
type Status = "idle" | "submitting" | "success" | "error" | "slot-taken";
type PayPhase = "idle" | "creating-order" | "checkout" | "verifying" | "success" | "pending" | "error";
type PayErrorKind = "order" | "unverified" | "verify-network" | null;

const PAY_ERROR_COPY: Record<Exclude<PayErrorKind, null>, string> = {
  order: SCHEDULE.form.payDialogErrorOrder,
  unverified: SCHEDULE.form.payDialogErrorUnverified,
  "verify-network": SCHEDULE.form.payDialogErrorVerifyNetwork,
};

interface ScheduleFormProps {
  keyConfigured: boolean;
  secondCallPriceUsd: number;
  secondCallPriceInr: number;
}

export function ScheduleForm({ keyConfigured, secondCallPriceUsd, secondCallPriceInr }: ScheduleFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [callType, setCallType] = useState<CallType>("first");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [slot, setSlot] = useState<PickedSlot | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [payPhase, setPayPhase] = useState<PayPhase>("idle");
  const [payErrorKind, setPayErrorKind] = useState<PayErrorKind>(null);
  const lastCheckoutResponse = useRef<RazorpayCheckoutResponse | null>(null);
  const formId = useId();

  function validate(): boolean {
    if (name.trim().length < 1) {
      setFieldError(SCHEDULE.form.nameInvalid);
      return false;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setFieldError(SCHEDULE.form.emailInvalid);
      return false;
    }
    if (phone.replace(/\D/g, "").length < 7) {
      setFieldError(SCHEDULE.form.phoneInvalid);
      return false;
    }
    setFieldError(null);
    return true;
  }

  const submitFreeCall = async () => {
    setStatus("submitting");
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "schedule-call",
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          callType: "first",
          // Omitted rather than sent empty: the column is nullable and the
          // route trims to null anyway, but an absent key keeps the payload
          // honest about what was actually filled in.
          ...(company.trim() ? { companyName: company.trim() } : {}),
          ...(purpose.trim() ? { purpose: purpose.trim() } : {}),
          // The label rides along for the email notification; date/time are
          // what the route claims atomically against availability_slots.
          ...(slot ? { slot: slot.label, slotDate: slot.date, slotTime: slot.time } : {}),
        }),
      });
      if (response.status === 409) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        if (payload?.error === "slot-taken") {
          setSlot(null);
          setStatus("slot-taken");
          return;
        }
      }
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  async function verifyPayment(response: RazorpayCheckoutResponse) {
    setPayPhase("verifying");
    try {
      const verifyResponse = await fetch("/api/schedule/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...response,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          companyName: company.trim(),
          purpose: purpose.trim(),
          slot: slot?.label ?? "",
          slotDate: slot?.date ?? "",
          slotTime: slot?.time ?? "",
          currency,
        }),
      });
      const payload = (await verifyResponse.json()) as { success: boolean; error?: string };
      if (payload.success) {
        setPayPhase("success");
        return;
      }
      if (payload.error === "grant-pending") {
        setPayPhase("pending");
        return;
      }
      setPayPhase("error");
      setPayErrorKind("unverified");
    } catch {
      setPayPhase("error");
      setPayErrorKind("verify-network");
    }
  }

  const submitPaidCall = async () => {
    setPayPhase("creating-order");
    setPayErrorKind(null);
    try {
      const [orderResponse] = await Promise.all([
        fetch("/api/schedule/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currency }),
        }),
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
      setPayPhase("checkout");
      const checkout = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "Sampath Kumar",
        description: "Setup call — infrastructure, tool estimation, methodology, process flow",
        prefill: { name: name.trim(), email: email.trim(), contact: phone.trim() },
        handler: (response) => {
          lastCheckoutResponse.current = response;
          void verifyPayment(response);
        },
        modal: {
          ondismiss: () => setPayPhase("idle"),
        },
      });
      checkout.open();
    } catch {
      setPayPhase("error");
      setPayErrorKind("order");
    }
  };

  function retryPayment() {
    if (payErrorKind === "verify-network" && lastCheckoutResponse.current) {
      void verifyPayment(lastCheckoutResponse.current);
      return;
    }
    setPayPhase("idle");
    setPayErrorKind(null);
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    if (callType === "first") {
      void submitFreeCall();
    } else {
      void submitPaidCall();
    }
  };

  const paying = payPhase !== "idle" && payPhase !== "error";

  return (
    <section className={styles.section} aria-labelledby="schedule-form-heading" id="book">
      <div className={styles.head} data-reveal data-reveal-children>
        <p className={`mono ${styles.eyebrow}`}>{SCHEDULE.form.eyebrow}</p>
        <h2 className={styles.heading} id="schedule-form-heading">
          {SCHEDULE.form.heading}
        </h2>
        <p className={styles.body}>{SCHEDULE.form.body}</p>
      </div>

      {status === "success" ? (
        <p className={styles.success} role="status">
          {SCHEDULE.form.success}
        </p>
      ) : payPhase === "success" ? (
        <div className={styles.success} role="status">
          <h3>{SCHEDULE.form.payDialogSuccessHeading}</h3>
          <p>{SCHEDULE.form.payDialogSuccessBody}</p>
        </div>
      ) : payPhase === "pending" ? (
        <div className={styles.success} role="status">
          <h3>{SCHEDULE.form.payDialogPendingHeading}</h3>
          <p>{SCHEDULE.form.payDialogPendingBody}</p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={submit} noValidate>
          <ScheduleCalendar selected={slot} onSelect={setSlot} />
          <div className={styles.fields}>
            <label className={styles.field}>
              <span className={`mono ${styles.label}`}>{SCHEDULE.form.nameLabel}</span>
              <input
                className={styles.input}
                type="text"
                name="name"
                id={`${formId}-name`}
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={SCHEDULE.form.namePlaceholder}
                aria-invalid={fieldError === SCHEDULE.form.nameInvalid}
                disabled={paying}
              />
            </label>
            <label className={styles.field}>
              <span className={`mono ${styles.label}`}>{SCHEDULE.form.emailLabel}</span>
              <input
                className={styles.input}
                type="email"
                name="email"
                id={`${formId}-email`}
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={SCHEDULE.form.emailPlaceholder}
                aria-invalid={fieldError === SCHEDULE.form.emailInvalid}
                disabled={paying}
              />
            </label>
            <label className={styles.field}>
              <span className={`mono ${styles.label}`}>{SCHEDULE.form.companyLabel}</span>
              <input
                className={styles.input}
                type="text"
                name="company"
                id={`${formId}-company`}
                autoComplete="organization"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder={SCHEDULE.form.companyPlaceholder}
                disabled={paying}
              />
            </label>
            <label className={styles.field}>
              <span className={`mono ${styles.label}`}>{SCHEDULE.form.phoneLabel}</span>
              <input
                className={styles.input}
                type="tel"
                name="phone"
                id={`${formId}-phone`}
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder={SCHEDULE.form.phonePlaceholder}
                aria-invalid={fieldError === SCHEDULE.form.phoneInvalid}
                disabled={paying}
              />
            </label>
            <label className={styles.field}>
              <span className={`mono ${styles.label}`}>{SCHEDULE.form.purposeLabel}</span>
              <input
                className={styles.input}
                type="text"
                name="purpose"
                id={`${formId}-purpose`}
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
                placeholder={SCHEDULE.form.purposePlaceholder}
                disabled={paying}
              />
            </label>
            <div className={styles.field}>
              <span className={`mono ${styles.label}`}>{SCHEDULE.form.callTypeLabel}</span>
              <div className={styles.toggle} role="radiogroup" aria-label={SCHEDULE.form.callTypeLabel}>
                <button
                  type="button"
                  className={styles.toggleOption}
                  data-active={callType === "first"}
                  role="radio"
                  aria-checked={callType === "first"}
                  onClick={() => setCallType("first")}
                  disabled={paying}
                >
                  {SCHEDULE.form.callTypeFirstLabel}
                </button>
                <button
                  type="button"
                  className={styles.toggleOption}
                  data-active={callType === "second"}
                  role="radio"
                  aria-checked={callType === "second"}
                  onClick={() => setCallType("second")}
                  disabled={paying}
                >
                  {`Second call — $${secondCallPriceUsd}`}
                </button>
              </div>
            </div>
            {callType === "second" && (
              <div className={`${styles.field} ${styles.fieldFullWidth}`}>
                <span className={`mono ${styles.label}`}>{SCHEDULE.form.currencyLabel}</span>
                <div className={styles.toggle} role="radiogroup" aria-label={SCHEDULE.form.currencyLabel}>
                  <button
                    type="button"
                    className={styles.toggleOption}
                    data-active={currency === "USD"}
                    role="radio"
                    aria-checked={currency === "USD"}
                    onClick={() => setCurrency("USD")}
                    disabled={paying}
                  >
                    {`USD — $${secondCallPriceUsd}`}
                  </button>
                  <button
                    type="button"
                    className={styles.toggleOption}
                    data-active={currency === "INR"}
                    role="radio"
                    aria-checked={currency === "INR"}
                    onClick={() => setCurrency("INR")}
                    disabled={paying}
                  >
                    {`INR — ₹${secondCallPriceInr.toLocaleString("en-IN")}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {fieldError ? (
            <p className={styles.error} role="alert">
              {fieldError}
            </p>
          ) : null}
          {status === "error" ? (
            <p className={styles.error} role="alert">
              {SCHEDULE.form.error}
            </p>
          ) : null}
          {status === "slot-taken" ? (
            <p className={styles.error} role="alert">
              {SCHEDULE.form.slotTaken}
            </p>
          ) : null}
          {payPhase === "error" && payErrorKind ? (
            <p className={styles.error} role="alert">
              {PAY_ERROR_COPY[payErrorKind]}
            </p>
          ) : null}

          {payPhase === "error" ? (
            payErrorKind !== "unverified" ? (
              <button type="button" className={styles.submit} onClick={retryPayment}>
                {SCHEDULE.form.payDialogRetry}
              </button>
            ) : null
          ) : callType === "second" && !keyConfigured ? (
            <a className={styles.submit} href={SCHEDULE.fallback.primaryCta.href} target="_blank" rel="noreferrer noopener">
              {`Pay $${secondCallPriceUsd} & book the second call`}
            </a>
          ) : (
            <button className={styles.submit} type="submit" disabled={status === "submitting" || paying}>
              {status === "submitting" || payPhase === "creating-order" || payPhase === "checkout"
                ? SCHEDULE.form.sending
                : payPhase === "verifying"
                  ? SCHEDULE.form.payDialogVerifying
                  : callType === "first"
                    ? SCHEDULE.form.submit
                    : currency === "INR"
                      ? `Pay ₹${secondCallPriceInr.toLocaleString("en-IN")} & book the second call`
                      : `Pay $${secondCallPriceUsd} & book the second call`}
            </button>
          )}
          <p className={styles.note}>{SCHEDULE.form.note}</p>
        </form>
      )}
    </section>
  );
}
