"use client";

import React from "react";

export const CuratedExperiences: React.FC = () => {
  return (
    <section style={{ backgroundColor: "#f8f2fa", padding: "4.5rem 1.5rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem", maxWidth: "650px", marginLeft: "auto", marginRight: "auto" }}>
          <h2 style={{ fontSize: "2.1rem", fontWeight: "700", color: "#1d1b20", marginBottom: "0.6rem" }}>
            Curated Experiences
          </h2>
          <p style={{ color: "#494551", fontSize: "1rem", lineHeight: "1.6" }}>
            Beyond accommodation, we offer a world of refined leisure and sensory delight designed to rejuvenate the soul.
          </p>
        </div>

        {/* Bento Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(2, 280px)",
            gap: "1.5rem",
          }}
          className="bento-grid-responsive"
        >
          {/* Box 1: Spa (Tall - 2 Cols x 2 Rows) */}
          <div
            style={{
              gridColumn: "span 2",
              gridRow: "span 2",
              position: "relative",
              borderRadius: "var(--border-radius-md)",
              overflow: "hidden",
              boxShadow: "0px 0.6rem 2.4rem rgba(0,0,0,0.06)",
            }}
            className="group"
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.7s ease",
              }}
              className="group-hover:scale-105"
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "2rem", color: "#ffffff" }}>
              <h4 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "0.5rem" }}>The Celestial Spa</h4>
              <p style={{ fontSize: "0.95rem", opacity: 0.9, lineHeight: 1.5 }}>
                Bespoke holistic treatments inspired by lunar cycles and ancient wellness traditions.
              </p>
            </div>
          </div>

          {/* Box 2: Fine Dining (Wide - 2 Cols x 1 Row) */}
          <div
            style={{
              gridColumn: "span 2",
              gridRow: "span 1",
              position: "relative",
              borderRadius: "var(--border-radius-md)",
              overflow: "hidden",
              boxShadow: "0px 0.6rem 2.4rem rgba(0,0,0,0.06)",
            }}
            className="group"
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.7s ease",
              }}
              className="group-hover:scale-105"
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.75rem", color: "#ffffff" }}>
              <h4 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "0.3rem" }}>Aether Gastronomy</h4>
              <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                A Michelin-starred journey through local seasonal flavors and innovative techniques.
              </p>
            </div>
          </div>

          {/* Box 3: Infinity Pool (Small - 1 Col x 1 Row) */}
          <div
            style={{
              gridColumn: "span 1",
              gridRow: "span 1",
              position: "relative",
              borderRadius: "var(--border-radius-md)",
              overflow: "hidden",
              boxShadow: "0px 0.6rem 2.4rem rgba(0,0,0,0.06)",
            }}
            className="group"
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.7s ease",
              }}
              className="group-hover:scale-105"
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1))" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.25rem", color: "#ffffff" }}>
              <h4 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Infinity Pool</h4>
            </div>
          </div>

          {/* Box 4: Fitness Gym (Small - 1 Col x 1 Row) */}
          <div
            style={{
              gridColumn: "span 1",
              gridRow: "span 1",
              position: "relative",
              borderRadius: "var(--border-radius-md)",
              overflow: "hidden",
              boxShadow: "0px 0.6rem 2.4rem rgba(0,0,0,0.06)",
            }}
            className="group"
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.7s ease",
              }}
              className="group-hover:scale-105"
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1))" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.25rem", color: "#ffffff" }}>
              <h4 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Lumina Gym</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
