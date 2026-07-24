"use client";

import React from "react";
import Link from "next/link";
import { Maximize2, Bed, Waves, Trees, Bath } from "lucide-react";

interface ResidencesCardProps {
  id?: string;
  title: string;
  price: string;
  imageUrl: string;
  specs: {
    icon: string;
    text: string;
  }[];
}

export const ResidencesCard: React.FC<ResidencesCardProps> = ({
  id,
  title,
  price,
  imageUrl,
  specs,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "square_foot":
        return <Maximize2 size={14} />;
      case "king_bed":
        return <Bed size={14} />;
      case "pool":
        return <Waves size={14} />;
      case "garden":
        return <Trees size={14} />;
      case "bathtub":
        return <Bath size={14} />;
      default:
        return <Maximize2 size={14} />;
    }
  };

  return (
    <Link
      href={id ? `/rooms/${id}` : "/rooms"}
      style={{
        position: "relative",
        aspectRatio: "4/5",
        borderRadius: "var(--border-radius-md)",
        overflow: "hidden",
        boxShadow: "0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06)",
        border: "1px solid rgba(203, 196, 210, 0.4)",
        display: "block",
        textDecoration: "none",
        color: "#ffffff",
      }}
      className="group"
    >
      {/* Background Image with Zoom Effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('${imageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "transform 0.5s ease",
        }}
        className="group-hover:scale-110"
      />

      {/* Luxury Gradient Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
        }}
      >
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: "700",
            color: "#e9ddff",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {price}
        </span>
        <h3 style={{ fontSize: "1.4rem", fontWeight: "700", lineHeight: 1.2 }}>{title}</h3>

        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", fontSize: "0.85rem", opacity: 0.9 }}>
          {specs.map((s, idx) => (
            <span key={idx} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              {getIcon(s.icon)} {s.text}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};
