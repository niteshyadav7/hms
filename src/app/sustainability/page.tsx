"use client";

import React from "react";
import Link from "next/link";

export default function SustainabilityPage() {
  const initiatives = [
    {
      icon: "solar_power",
      title: "100% Solar & Renewable Energy",
      desc: "Our entire resort grounds, private villas, and spa facilities are powered by on-site solar arrays and certified green energy grids.",
    },
    {
      icon: "delete_sweep",
      title: "Zero Single-Use Plastics",
      desc: "We eliminated single-use plastic bottles, straws, and packaging across all dining venues, substituting glass and biodegradable bamboo.",
    },
    {
      icon: "restaurant",
      title: "Farm-to-Table Culinary Arts",
      desc: "85% of ingredients served at our fine dining venues are harvested daily from our organic estate gardens or sourced from local sustainable farms.",
    },
    {
      icon: "water_drop",
      title: "Advanced Water Recycling",
      desc: "Rainwater harvesting and closed-loop greywater purification systems supply our botanical gardens and infinity pools zero-waste filtration.",
    },
  ];

  return (
    <main className="max-w-[1100px] mx-auto px-6 md:px-12 py-12 text-[#1d1b20]">
      {/* Return Link */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-[#494551] hover:text-[#4f378a] transition-colors group no-underline text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>Back to Home</span>
      </Link>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-12 h-[320px] flex items-center px-8 md:px-12">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1600&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative z-10 max-w-xl text-white space-y-3">
          <span className="bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block">
            ECO-LUXURY INITIATIVE
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight drop-shadow-md">
            Harmonious Luxury & Sustainability
          </h1>
          <p className="text-sm text-white/90 font-light leading-relaxed">
            Redefining ultra-luxury hospitality through zero-carbon practices, marine conservation, and regenerative estate design.
          </p>
        </div>
      </div>

      {/* Grid of Initiatives */}
      <div className="space-y-4 mb-12">
        <h2 className="text-2xl font-bold text-[#1d1b20]">Our Core Eco Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {initiatives.map((item, idx) => (
            <div
              key={idx}
              className="bg-white aura-shadow p-6 rounded-2xl border border-[#cbc4d2]/30 space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-[#1d1b20]">{item.title}</h3>
              </div>
              <p className="text-xs text-[#494551] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Certification Badges */}
      <div className="bg-[#f8f2fa] aura-shadow p-8 rounded-2xl border border-[#cbc4d2]/40 text-center space-y-4">
        <h3 className="text-xl font-bold text-[#4f378a]">Recognized Global Impact</h3>
        <p className="text-xs text-[#494551] max-w-xl mx-auto">
          Proudly certified by the Global Sustainable Tourism Council (GSTC) and holder of the LEED Platinum Green Building Standard.
        </p>
      </div>
    </main>
  );
}
