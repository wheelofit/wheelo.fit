"use client";

import React, { useState, useTransition } from "react";
import { deleteAdmin, editAdmin } from "./actions";

type Admin = {
  id: string;
  username: string;
  role: string;
  createdAt: Date;
};

export default function AdminListItem({
  admin,
  currentUsername,
}: {
  admin: Admin;
  currentUsername: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isCurrentUser = admin.username === currentUsername;

  async function handleDelete() {
    if (confirm(`Are you sure you want to delete ${admin.username}?`)) {
      startTransition(async () => {
        const res = await deleteAdmin(admin.id);
        if (res.error) {
          setError(res.error);
        }
      });
    }
  }

  async function handleEditSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await editAdmin(admin.id, formData);
      if (res.error) {
        setError(res.error);
      } else {
        setIsEditing(false);
      }
    });
  }

  if (isEditing) {
    return (
      <li
        style={{
          padding: "1rem",
          background: "#222",
          borderRadius: "6px",
          border: "1px solid #444",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <form
          action={handleEditSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {error && (
            <div style={{ color: "#ff4d4d", fontSize: "0.8rem" }}>{error}</div>
          )}

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "150px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#aaa",
                  marginBottom: "0.3rem",
                }}
              >
                Username
              </label>
              <input
                name="username"
                defaultValue={admin.username}
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #555",
                  background: "#111",
                  color: "#fff",
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: "150px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#aaa",
                  marginBottom: "0.3rem",
                }}
              >
                Role
              </label>
              <select
                name="role"
                defaultValue={admin.role}
                disabled={isCurrentUser}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #555",
                  background: "#111",
                  color: "#fff",
                }}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="SUPERADMIN">SUPERADMIN</option>
              </select>
              {isCurrentUser && (
                <input type="hidden" name="role" value={admin.role} />
              )}
            </div>

            <div style={{ flex: 1, minWidth: "150px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#aaa",
                  marginBottom: "0.3rem",
                }}
              >
                New Password (Optional)
              </label>
              <input
                type="password"
                name="password"
                placeholder="Leave blank to keep"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #555",
                  background: "#111",
                  color: "#fff",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setError(null);
              }}
              disabled={isPending}
              style={{
                padding: "0.4rem 0.8rem",
                background: "transparent",
                color: "#ccc",
                border: "1px solid #555",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{
                padding: "0.4rem 0.8rem",
                background: "#1eb53a",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li
      style={{
        padding: "1rem",
        background: "#222",
        borderRadius: "6px",
        border: "1px solid #444",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <div>
        <strong>{admin.username}</strong>
        {isCurrentUser && (
          <span
            style={{ marginLeft: "0.5rem", fontSize: "0.7rem", color: "#888" }}
          >
            (You)
          </span>
        )}
        <div style={{ fontSize: "0.8rem", color: "#888", marginTop: "0.3rem" }}>
          Created:{" "}
          {new Date(admin.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
        {error && (
          <div
            style={{
              color: "#ff4d4d",
              fontSize: "0.8rem",
              marginTop: "0.3rem",
            }}
          >
            {error}
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span
          style={{
            padding: "0.3rem 0.6rem",
            borderRadius: "4px",
            fontSize: "0.7rem",
            fontWeight: "bold",
            background:
              admin.role === "SUPERADMIN"
                ? "rgba(255, 215, 0, 0.2)"
                : "rgba(50, 150, 255, 0.2)",
            color: admin.role === "SUPERADMIN" ? "#ffd700" : "#80c0ff",
          }}
        >
          {admin.role}
        </span>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setIsEditing(true)}
            disabled={isPending}
            style={{
              padding: "0.3rem 0.6rem",
              background: "#444",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            Edit
          </button>
          {!isCurrentUser && (
            <button
              onClick={handleDelete}
              disabled={isPending}
              style={{
                padding: "0.3rem 0.6rem",
                background: "#ff4d4d",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              {isPending ? "..." : "Delete"}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
