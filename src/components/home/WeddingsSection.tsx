"use client";

import React from "react";
import Link from "next/link";

const experiences = [
  {
    tag: "01",
    title: "Sunset Lagoon Vows",
    desc: "Exchange vows on a glass altar floating over the coral lagoon — acoustic strings, couture floral arches, and champagne at golden hour.",
    detail1: "Up to 80 Guests",
    detail2: "Bespoke Concierge",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
  },
  {
    tag: "02",
    title: "Epicurean Gala Receptions",
    desc: "A 7-course Michelin tasting menu paired with rare vintages, served under starlit skies at Aether Ocean Pavilion.",
    detail1: "Sommelier Pairings",
    detail2: "Custom Cake Artistry",
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=85",
  },
  {
    tag: "03",
    title: "Private Island Reserve",
    desc: "The entire resort — all 50 overwater villas, private yacht transfers, and a dedicated AI butler team — reserved exclusively for your celebration.",
    detail1: "50 Villa Suites",
    detail2: "24/7 Butler Team",
    img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85",
  },
];

export default function WeddingsSection() {
  return (
    <section
      id="weddings"
      className="py-28 bg-[#fcf9f8] dark:bg-[#121115] w-full scroll-mt-20 text-[#1b1c1c] dark:text-white relative overflow-hidden font-body"
    >
      <div className="max-w-[1340px] mx-auto px-4 md:px-8 relative z-10">

        {/* Editorial Header */}
        <div className="mb-20 max-w-2xl">
          <p className="text-[#755b00] dark:text-[#ffe08e] text-xs font-bold uppercase tracking-[0.25em] mb-4">
            Weddings &amp; Private Events
          </p>
          <h2 className="text-4xl md:text-[3.4rem] font-display font-bold leading-[1.1] text-[#1b1c1c] dark:text-white mb-5">
            Celebrations that live
            <br />
            in memory forever.
          </h2>
          <p className="text-[#6b6154] dark:text-gray-400 text-sm md:text-[15px] leading-relaxed max-w-lg">
            Where the Indian Ocean becomes your ceremony backdrop and Michelin-starred dining becomes your reception.
          </p>
        </div>

        {/* Staggered Editorial Cards */}
        <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-12 md:gap-5 md:items-start">

          {/* Card 1 — tall left */}
          <div className="md:col-span-5 group cursor-pointer">
            <div className="relative overflow-hidden rounded-2xl aspect-[3/4]">
              <img
                src={experiences[0].img}
                alt={experiences[0].title}
                className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="text-[#ffe08e] text-[11px] font-bold tracking-[0.2em] uppercase block mb-2">
                  {experiences[0].tag} — Ceremony
                </span>
                <h3 className="text-white text-2xl md:text-3xl font-display font-bold leading-tight mb-2">
                  {experiences[0].title}
                </h3>
                <p className="text-white/70 text-xs leading-relaxed max-w-sm mb-4 hidden md:block">
                  {experiences[0].desc}
                </p>
                <div className="flex gap-4 text-[10px] text-white/50 font-bold uppercase tracking-wider">
                  <span>{experiences[0].detail1}</span>
                  <span className="text-[#c9a227]">·</span>
                  <span>{experiences[0].detail2}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — two stacked cards */}
          <div className="md:col-span-7 flex flex-col gap-5">

            {/* Card 2 — wide landscape */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl aspect-[16/9]">
                <img
                  src={experiences[1].img}
                  alt={experiences[1].title}
                  className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="text-[#ffe08e] text-[11px] font-bold tracking-[0.2em] uppercase block mb-2">
                    {experiences[1].tag} — Reception
                  </span>
                  <h3 className="text-white text-xl md:text-2xl font-display font-bold leading-tight mb-1.5">
                    {experiences[1].title}
                  </h3>
                  <p className="text-white/70 text-xs leading-relaxed max-w-md hidden md:block mb-3">
                    {experiences[1].desc}
                  </p>
                  <div className="flex gap-4 text-[10px] text-white/50 font-bold uppercase tracking-wider">
                    <span>{experiences[1].detail1}</span>
                    <span className="text-[#c9a227]">·</span>
                    <span>{experiences[1].detail2}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 — editorial text + image split */}
            <div className="group cursor-pointer grid grid-cols-1 md:grid-cols-2 gap-0 bg-[#1b1c1c] dark:bg-[#1e1c22] rounded-2xl overflow-hidden">
              <div className="p-6 md:p-8 flex flex-col justify-between order-2 md:order-1">
                <div>
                  <span className="text-[#c9a227] text-[11px] font-bold tracking-[0.2em] uppercase block mb-3">
                    {experiences[2].tag} — Exclusive
                  </span>
                  <h3 className="text-white text-xl md:text-2xl font-display font-bold leading-tight mb-3">
                    {experiences[2].title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-6">
                    {experiences[2].desc}
                  </p>
                </div>
                <div className="flex gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  <span>{experiences[2].detail1}</span>
                  <span className="text-[#c9a227]">·</span>
                  <span>{experiences[2].detail2}</span>
                </div>
              </div>
              <div className="relative overflow-hidden aspect-square md:aspect-auto order-1 md:order-2">
                <img
                  src={experiences[2].img}
                  alt={experiences[2].title}
                  className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Bottom CTA — minimal editorial */}
        <div className="mt-14 pt-8 border-t border-[#d1c5af]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <p className="text-[#6b6154] dark:text-gray-400 text-xs md:text-sm max-w-md leading-relaxed">
            Every celebration is individually designed by our dedicated event architect.
            No templates, no packages — only yours.
          </p>
          <Link
            href="/events"
            className="group/btn inline-flex items-center gap-3 text-[#755b00] dark:text-[#ffe08e] text-xs font-bold uppercase tracking-[0.15em] no-underline hover:gap-4 transition-all duration-300"
          >
            <span>Plan Your Celebration</span>
            <span className="w-8 h-[1px] bg-[#c9a227] inline-block transition-all duration-300 group-hover/btn:w-12" />
            <span className="material-symbols-outlined text-sm">east</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
