"use client";

import React from "react";
import { Card } from "../atoms/Card";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accentBg?: string;
  accentColor?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  accentBg = "var(--color-brand-50)",
  accentColor = "var(--color-brand-600)",
}) => {
  return (
    <Card style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
      <div
        style={{
          backgroundColor: accentBg,
          color: accentColor,
          padding: "0.85rem",
          borderRadius: "var(--border-radius-sm)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div>
        <span style={{ fontSize: "0.85rem", color: "var(--color-grey-500)", fontWeight: "500", display: "block" }}>
          {title}
        </span>
        <strong style={{ fontSize: "1.65rem", fontWeight: "700", color: "var(--color-grey-800)" }}>
          {value}
        </strong>
      </div>
    </Card>
  );
};
