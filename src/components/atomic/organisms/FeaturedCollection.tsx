"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ResidencesCard } from "../molecules/ResidencesCard";

export const FeaturedCollection: React.FC = () => {
  const residences = [
    {
      title: "Azure Ocean Residence",
      price: "From ₹1,200/night",
      imageUrl:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85",
      specs: [
        { icon: "square_foot", text: "850 sq ft" },
        { icon: "king_bed", text: "King Suite" },
      ],
    },
    {
      title: "The Lumina Penthouse",
      price: "From ₹2,450/night",
      imageUrl:
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85",
      specs: [
        { icon: "pool", text: "Private Pool" },
        { icon: "square_foot", text: "2,100 sq ft" },
      ],
    },
    {
      title: "Garden Sanctuary Suite",
      price: "From ₹890/night",
      imageUrl:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85",
      specs: [
        { icon: "garden", text: "Garden View" },
        { icon: "bathtub", text: "Spa Bath" },
      ],
    },
  ];

  return (
    <section style={{ padding: "4rem 1.5rem", maxWidth: "1280px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem" }}>
        <div>
          <span style={{ color: "var(--color-brand-primary)", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            The Collection
          </span>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", color: "#1d1b20", marginTop: "0.3rem" }}>
            Featured Sanctuaries
          </h2>
        </div>
        <Link
          href="/rooms"
          style={{
            color: "var(--color-brand-primary)",
            fontWeight: "600",
            fontSize: "0.95rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            textDecoration: "none",
          }}
        >
          View all residences <ArrowRight size={16} />
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {residences.map((r, idx) => (
          <ResidencesCard key={idx} title={r.title} price={r.price} imageUrl={r.imageUrl} specs={r.specs} />
        ))}
      </div>
    </section>
  );
};
