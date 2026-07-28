"use client";

import React from "react";

export default function BentoGridSection() {
  return (
    <section id="amenities" className="py-16 bg-[#f8f2fa] w-full scroll-mt-20">
      <div className="px-4 md:px-12 max-w-[1280px] mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-[#1b1c1c]">
            Curated Experiences &{" "}
            <span className="bg-gradient-to-r from-[#755b00] via-[#c9a227] to-[#48645d] bg-clip-text text-transparent">
              Amenities
            </span>
          </h2>
          <p className="text-[#4d4635] text-base leading-relaxed">
            Beyond accommodation, we offer a world of refined leisure, gourmet dining, and sensory delight designed to rejuvenate the soul.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          {/* Large Box: Spa */}
          <div className="md:col-span-2 md:row-span-2 group relative rounded-xl overflow-hidden aura-shadow min-h-[340px]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85')",
              }}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <h4 className="text-2xl md:text-3xl font-bold mb-2">The Celestial Spa</h4>
              <p className="text-sm md:text-base opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 max-w-md">
                Bespoke holistic treatments inspired by lunar cycles and ancient wellness traditions.
              </p>
            </div>
          </div>

          {/* Medium Box: Fine Dining (id="dining") */}
          <div id="dining" className="md:col-span-2 group relative rounded-xl overflow-hidden aura-shadow min-h-[260px] scroll-mt-24">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85')",
              }}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <h4 className="text-xl md:text-2xl font-bold mb-2">Aether Gastronomy (Fine Dining)</h4>
              <p className="text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                A Michelin-starred journey through local seasonal flavors and innovative techniques.
              </p>
            </div>
          </div>

          {/* Small Box: Infinity Pool */}
          <div className="group relative rounded-xl overflow-hidden aura-shadow min-h-[220px]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85')",
              }}
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <h4 className="text-lg md:text-xl font-bold">Infinity Pool</h4>
            </div>
          </div>

          {/* Small Box: Fitness Gym */}
          <div className="group relative rounded-xl overflow-hidden aura-shadow min-h-[220px]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85')",
              }}
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <h4 className="text-lg md:text-xl font-bold">Lumina Gym</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
