"use client";

import React from "react";
import Link from "next/link";

export default function WeddingsSection() {
  return (
    <section id="weddings" className="py-24 bg-[#fcf9f8] dark:bg-[#121115] w-full scroll-mt-20 text-[#1b1c1c] dark:text-white relative overflow-hidden font-body">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#ffe08e]/20 dark:bg-[#755b00]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#cae9e0]/20 dark:bg-[#48645d]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1340px] mx-auto px-4 md:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#d1c5af]/40 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#ffe08e]/30 dark:bg-[#755b00]/30 text-[#755b00] dark:text-[#ffe08e] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-[#c9a227]/40">
              <span className="material-symbols-outlined text-sm">favorite</span>
              <span>Overwater Weddings & Galas</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#1b1c1c] dark:text-white leading-tight font-display">
              Unforgettable Celebrations in <br />
              <span className="bg-gradient-to-r from-[#755b00] via-[#c9a227] to-[#48645d] bg-clip-text text-transparent">
                Turquoise Waters
              </span>
            </h2>
            <p className="text-sm md:text-base text-[#4d4635] dark:text-gray-300 font-medium leading-relaxed">
              Say your vows where the ocean meets the sky. From intimate overwater sunset ceremonies to grand Michelin gala receptions, Lumina Grand crafts bespoke luxury celebrations.
            </p>
          </div>

          <Link
            href="/events"
            className="bg-gradient-to-r from-[#755b00] via-[#c9a227] to-[#48645d] hover:from-[#584400] text-white px-7 py-3.5 rounded-full text-xs font-black shadow-lg transition-all no-underline inline-flex items-center gap-2 active:scale-95 flex-shrink-0"
          >
            <span>Explore Event Packages</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Showcase Grid Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Sunset Lagoon Vows */}
          <div className="group bg-white dark:bg-[#1e1c22] rounded-[32px] overflow-hidden border border-[#d1c5af]/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85"
                alt="Sunset Overwater Wedding"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase border border-white/20">
                Glass Pavilion Ceremony
              </span>
            </div>

            <div className="p-7 space-y-4">
              <h3 className="text-xl font-black text-[#1b1c1c] dark:text-white font-display">
                Sunset Lagoon Vows
              </h3>
              <p className="text-xs text-[#4d4635] dark:text-gray-300 leading-relaxed font-medium">
                Exchange vows on a glass altar floating over the coral lagoon, complete with acoustic string music, floral styling, and sunset champagne.
              </p>
              <div className="pt-2 border-t border-[#d1c5af]/30 flex justify-between items-center text-xs font-bold text-[#755b00] dark:text-[#ffe08e]">
                <span>Up to 80 Guests</span>
                <span>Bespoke Concierge</span>
              </div>
            </div>
          </div>

          {/* Card 2: Michelin Gala Banquets */}
          <div className="group bg-white dark:bg-[#1e1c22] rounded-[32px] overflow-hidden border border-[#d1c5af]/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=85"
                alt="Michelin Gala Dinner"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase border border-white/20">
                Michelin Dining Banquet
              </span>
            </div>

            <div className="p-7 space-y-4">
              <h3 className="text-xl font-black text-[#1b1c1c] dark:text-white font-display">
                Epicurean Gala Receptions
              </h3>
              <p className="text-xs text-[#4d4635] dark:text-gray-300 leading-relaxed font-medium">
                Indulge your wedding party with a 7-course tasting menu paired with rare vintages, served under starry skies at Aether Ocean Pavilion.
              </p>
              <div className="pt-2 border-t border-[#d1c5af]/30 flex justify-between items-center text-xs font-bold text-[#755b00] dark:text-[#ffe08e]">
                <span>Sommelier Pairings</span>
                <span>Custom Cake Artistry</span>
              </div>
            </div>
          </div>

          {/* Card 3: Full Island Takeover */}
          <div className="group bg-white dark:bg-[#1e1c22] rounded-[32px] overflow-hidden border border-[#d1c5af]/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85"
                alt="Private Island Sanctuary"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase border border-white/20">
                Exclusive Island Takeover
              </span>
            </div>

            <div className="p-7 space-y-4">
              <h3 className="text-xl font-black text-[#1b1c1c] dark:text-white font-display">
                Private Sanctuary Reserve
              </h3>
              <p className="text-xs text-[#4d4635] dark:text-gray-300 leading-relaxed font-medium">
                Reserve the entire resort for your wedding weekend. All 50 overwater villas, private yacht transfers, and AI butler concierge reserved exclusively for your guests.
              </p>
              <div className="pt-2 border-t border-[#d1c5af]/30 flex justify-between items-center text-xs font-bold text-[#755b00] dark:text-[#ffe08e]">
                <span>50 Villa Suite Reserve</span>
                <span>24/7 Butler Team</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
