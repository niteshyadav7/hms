"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ResidencesCard } from "../molecules/ResidencesCard";

export const FeaturedCollection: React.FC = () => {
  const residences = [
    {
      title: "Azure Ocean Residence",
      price: "From $1,200/night",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB1oDXNIAsPdpWEWOYiPyUgeIdkfURwx1x1SYsc0tQQRBZpF0mShEXHNxw3kMYP-G_5wE5ZUM-oRUWQnt3xCYEB6MIsNQO_gP71YgwspcGZNitjFYVgiF6iXBri-C2DrzsDegHeKWGYMiMXfeGEMBH28Iwbed-bWmcUwOkrJIq72cChAwMTJ9YDB26C48GOBHYweQSww0tcHduUI2_uJDjyGeeuwF3XssUsvIYoSDoCuNi2bCcsjGxz40w8zi_wG33jLY3Xe5XjHfmE",
      specs: [
        { icon: "square_foot", text: "850 sq ft" },
        { icon: "king_bed", text: "King Suite" },
      ],
    },
    {
      title: "The Lumina Penthouse",
      price: "From $2,450/night",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAmvdmFWMpilKJ1HucUCfi8vWxTE9pJtQwqo-Zc86d0vVEYGtd6n_rhZqHvqGGDY6Aq66xxCvU7_h7PC8X51HFd4pa9NWRWWEwm_vcRweffxIx5VHLvucSeUhNHLjKp-xFxAjgWHZneOeLUlFbI_-eEDZlSIbLSscR0pzW3uE7Yyf1a3ZMxyxgiIljxM8jYsYji1YTbKSGfldChlTNK0EuNugSoOW_ra6QKq5YiqiZtznZn45a5drU9HjnAEf03EMpJF-LN-hnfNDiw",
      specs: [
        { icon: "pool", text: "Private Pool" },
        { icon: "square_foot", text: "2,100 sq ft" },
      ],
    },
    {
      title: "Garden Sanctuary Suite",
      price: "From $890/night",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuALrcEBfi2BzNNiBNwufkLe3HQZg02U_BMd1pWZRUDHhaXr4pJaT9cDWs8ggpgvKRzUXGSGczwR4_UPxdu9jCq1okbErq_Y7RwIH333HKCuk_ysp2YdpouycztN_tMzoPSn5FQHBqBtEonEiriMxj52PdpPXHvCXyxBuje4QpJPORpQRu9eUrhAf1lI2tzylFwSisZ2r9-D8nYlOpzHgu9Kob3WyvlshEvL4OgQLhgY5FXEUVvAShLIX9K0s8mVkSG78RhTTKR58BrT",
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
