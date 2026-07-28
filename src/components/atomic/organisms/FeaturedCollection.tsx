"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ResidencesCard } from "../molecules/ResidencesCard";

export const FeaturedCollection: React.FC = () => {
  const residences = [
    {
      title: "Ethereal Sanctuary Residence",
      price: "From ₹1,200/night",
      imageUrl: "/images/ethereal_sanctuary_villa.png",
      specs: [
        { icon: "square_foot", text: "850 sq ft" },
        { icon: "king_bed", text: "King Suite" },
      ],
    },
    {
      title: "Epicurean Penthouse Suite",
      price: "From ₹2,450/night",
      imageUrl: "/images/ethereal_epicure_dining.png",
      specs: [
        { icon: "pool", text: "Private Pool" },
        { icon: "square_foot", text: "2,100 sq ft" },
      ],
    },
    {
      title: "Celestial Spa Sanctuary",
      price: "From ₹890/night",
      imageUrl: "/images/ethereal_spa_sanctuary.png",
      specs: [
        { icon: "garden", text: "Hydrotherapy" },
        { icon: "bathtub", text: "Spa Bath" },
      ],
    },
  ];

  return (
    <section style={{ padding: "4rem 1.5rem", maxWidth: "1280px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem" }}>
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#755b00]">
            The Collection
          </span>
          <h2 className="text-3xl font-black text-[#1b1c1c] mt-1">
            Featured{" "}
            <span className="bg-gradient-to-r from-[#755b00] via-[#c9a227] to-[#48645d] bg-clip-text text-transparent">
              Sanctuaries
            </span>
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
