"use client";

import React from "react";
import Link from "next/link";

export default function FeaturedSection() {
  const residences = [
    {
      title: "Azure Ocean Residence",
      price: "From ₹1,200/night",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85",
      specs: [
        { icon: "square_foot", text: "850 sq ft" },
        { icon: "king_bed", text: "King Suite" },
      ],
    },
    {
      title: "The Lumina Penthouse",
      price: "From ₹2,450/night",
      image:
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85",
      specs: [
        { icon: "pool", text: "Private Pool" },
        { icon: "home_work", text: "2,100 sq ft" },
      ],
    },
    {
      title: "Garden Sanctuary Suite",
      price: "From ₹890/night",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85",
      specs: [
        { icon: "nature_people", text: "Garden View" },
        { icon: "bathtub", text: "Spa Bath" },
      ],
    },
  ];

  return (
    <section className="py-16 px-4 md:px-12 max-w-[1280px] mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div className="space-y-2">
          <span className="text-[#755b00] text-xs font-black tracking-widest uppercase block">
            THE COLLECTION
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#1b1c1c]">
            Featured{" "}
            <span className="bg-gradient-to-r from-[#755b00] via-[#c9a227] to-[#48645d] bg-clip-text text-transparent">
              Sanctuaries
            </span>
          </h2>
        </div>
        <Link href="/rooms" className="text-[#755b00] font-extrabold text-sm flex items-center gap-2 hover:underline">
          View all residences <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {residences.map((item, idx) => (
          <Link
            key={idx}
            href="/rooms"
            className="group relative aspect-[4/5] rounded-xl overflow-hidden aura-shadow border border-[#cbc4d2]/30 hover:-translate-y-1 transition-transform duration-300 block text-white"
          >
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${item.image}')` }}
            />
            <div className="absolute inset-0 luxury-gradient-overlay" />
            <div className="absolute bottom-0 inset-x-0 p-6 space-y-2">
              <span className="text-[#e9ddff] text-xs font-semibold">{item.price}</span>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <div className="flex items-center gap-4 text-xs text-white/80 pt-1">
                {item.specs.map((s, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">{s.icon}</span> {s.text}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
