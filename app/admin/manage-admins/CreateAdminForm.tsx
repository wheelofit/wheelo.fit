"use client";

import { useState } from "react";
import { createAdmin } from "./actions";

export default function CreateAdminForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setSuccess(null);

    const res = await createAdmin(formData);

    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setSuccess(res.success);
      (
        document.getElementById("create-admin-form") as HTMLFormElement
      )?.reset();
    }

    setPending(false);
  }

  return (
    <form
      id="create-admin-form"
      action={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      {error && (
        <div
          style={{
            color: "#ff4d4d",
            background: "rgba(255,77,77,0.1)",
            padding: "0.8rem",
            borderRadius: "6px",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            color: "#4dff4d",
            background: "rgba(77,255,77,0.1)",
            padding: "0.8rem",
            borderRadius: "6px",
            fontSize: "0.9rem",
          }}
        >
          {success}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label htmlFor="username" style={{ fontSize: "0.9rem", color: "#ccc" }}>
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          required
          style={{
            padding: "0.8rem",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#222",
            color: "#fff",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label htmlFor="password" style={{ fontSize: "0.9rem", color: "#ccc" }}>
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          minLength={6}
          style={{
            padding: "0.8rem",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#222",
            color: "#fff",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        style={{
          marginTop: "1rem",
          padding: "1rem",
          background: "#fff",
          color: "#000",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: pending ? "not-allowed" : "pointer",
          opacity: pending ? 0.7 : 1,
        }}
      >
        {pending ? "Creating..." : "Create Admin"}
      </button>
    </form>
  );
}
