"use client";

import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: "#e6e0e9", borderTop: "1px solid #cbc4d2", color: "#1d1b20" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "3rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div>
          <span style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--color-brand-primary)", display: "block" }}>
            Lumina Grand
          </span>
          <p style={{ fontSize: "0.95rem", color: "#494551", marginTop: "0.4rem" }}>
            Where unparalleled luxury meets the serenity of the natural world.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.75rem", fontSize: "0.9rem", fontWeight: "500" }}>
          <Link href="#" style={{ color: "#494551", textDecoration: "underline" }}>Privacy Policy</Link>
          <Link href="#" style={{ color: "#494551", textDecoration: "underline" }}>Terms of Service</Link>
          <Link href="#" style={{ color: "#494551", textDecoration: "underline" }}>Sustainability</Link>
          <Link href="#" style={{ color: "#494551", textDecoration: "underline" }}>Careers</Link>
          <Link href="#" style={{ color: "#494551", textDecoration: "underline" }}>Press Kit</Link>
        </div>

        <p style={{ fontSize: "0.85rem", color: "#7a7582" }}>
          © 2026 Lumina Grand Luxury Resorts. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
