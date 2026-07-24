"use client";

import React from "react";

export type BadgeVariant = "green" | "yellow" | "blue" | "red" | "grey";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ variant = "grey", children, style }) => {
  const getBadgeColors = () => {
    switch (variant) {
      case "green":
        return { bg: "var(--color-green-100)", color: "var(--color-green-700)" };
      case "yellow":
        return { bg: "var(--color-yellow-100)", color: "var(--color-yellow-700)" };
      case "blue":
        return { bg: "var(--color-blue-100)", color: "var(--color-blue-700)" };
      case "red":
        return { bg: "var(--color-red-100)", color: "var(--color-red-700)" };
      case "grey":
      default:
        return { bg: "var(--color-grey-100)", color: "var(--color-grey-700)" };
    }
  };

  const colors = getBadgeColors();

  return (
    <span
      style={{
        padding: "0.25rem 0.65rem",
        borderRadius: "var(--border-radius-full)",
        fontSize: "0.8rem",
        fontWeight: "600",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        backgroundColor: colors.bg,
        color: colors.color,
        letterSpacing: "0.02em",
        ...style,
      }}
    >
      {children}
    </span>
  );
};
