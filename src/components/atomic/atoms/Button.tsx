"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "glass" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  className = "",
  style,
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "outline":
        return {
          backgroundColor: "transparent",
          color: "var(--color-brand-primary)",
          border: "1px solid var(--color-brand-primary)",
        };
      case "glass":
        return {
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          color: "var(--color-grey-800)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(12px)",
        };
      case "danger":
        return {
          backgroundColor: "var(--color-red-700)",
          color: "#ffffff",
          border: "none",
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          color: "var(--color-grey-700)",
          border: "none",
        };
      case "primary":
      default:
        return {
          backgroundColor: "var(--color-brand-primary)",
          color: "#ffffff",
          border: "none",
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return { padding: "0.4rem 0.85rem", fontSize: "0.85rem" };
      case "lg":
        return { padding: "0.75rem 1.75rem", fontSize: "1.05rem" };
      case "md":
      default:
        return { padding: "0.6rem 1.25rem", fontSize: "0.925rem" };
    }
  };

  return (
    <button
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        borderRadius: "var(--border-radius-sm)",
        fontWeight: "600",
        width: fullWidth ? "100%" : "auto",
        opacity: disabled ? 0.6 : 1,
        transition: "all 0.2s ease",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: variant === "primary" ? "0 4px 20px rgba(79, 55, 138, 0.25)" : "none",
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
