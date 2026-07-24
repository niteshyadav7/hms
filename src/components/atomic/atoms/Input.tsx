"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, icon, error, style, ...props }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", width: "100%" }}>
      {label && (
        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--color-grey-700)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          {icon}
          {label}
        </label>
      )}
      <input
        style={{
          width: "100%",
          padding: "0.6rem 0.85rem",
          borderRadius: "var(--border-radius-sm)",
          border: error ? "1px solid var(--color-red-700)" : "1px solid var(--color-grey-200)",
          backgroundColor: "var(--color-grey-0)",
          color: "var(--color-grey-800)",
          outline: "none",
          fontSize: "0.95rem",
          ...style,
        }}
        {...props}
      />
      {error && <span style={{ fontSize: "0.8rem", color: "var(--color-red-700)" }}>{error}</span>}
    </div>
  );
};
