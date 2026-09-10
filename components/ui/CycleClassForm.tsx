"use client";

import { useState } from "react";
import { submitCycleClassInquiry } from "@/app/(main)/rides/cycle-classes/actions";
import styles from "@/components/ui/BookingForm.module.css";

export default function CycleClassForm() {
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setSuccess(null);
    setError(null);

    const res = await submitCycleClassInquiry(formData);

    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setSuccess(res.success);
      (document.getElementById("cycle-class-form") as HTMLFormElement)?.reset();
    }

    setPending(false);
  }

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.title}>Inquire About Cycle Classes</h3>

      {success && (
        <div
          style={{
            color: "#4dff4d",
            background: "rgba(77,255,77,0.1)",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            fontSize: "0.9rem",
          }}
        >
          {success}
        </div>
      )}
      {error && (
        <div
          style={{
            color: "#ff4d4d",
            background: "rgba(255,77,77,0.1)",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}

      <form id="cycle-class-form" action={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="phone" className={styles.label}>
            WhatsApp no <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className={styles.input}
            placeholder="+91 081234 56789"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="area" className={styles.label}>
            Area (Locality)
          </label>
          <input type="text" id="area" name="area" className={styles.input} />
        </div>

        <div className={styles.field}>
          <label htmlFor="height" className={styles.label}>
            Height
          </label>
          <input
            type="text"
            id="height"
            name="height"
            className={styles.input}
          />
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={pending}
          style={{
            opacity: pending ? 0.7 : 1,
            cursor: pending ? "not-allowed" : "pointer",
          }}
        >
          {pending ? "Submitting..." : "Submit Inquiry"}
        </button>
      </form>
    </div>
  );
}
