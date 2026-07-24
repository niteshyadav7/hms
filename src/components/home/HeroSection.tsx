"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("2024-11-20");
  const [checkOut, setCheckOut] = useState("2024-11-25");
  const [guests, setGuests] = useState("2 Adults, 1 Child");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (checkIn) query.set("checkIn", checkIn);
    if (checkOut) query.set("checkOut", checkOut);
    if (guests) query.set("guests", guests);
    router.push(`/rooms?${query.toString()}`);
  };

  return (
    <section className="relative h-[870px] w-full flex items-center justify-center px-4 md:px-12 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCC9Fw2uDb5cELlAcXsTRK9KDP8JlUt_7Qhgp9MsJjeRBYp7Cor7Ct6miOpc06Cap_rqSiPx_EbEbmLakv8THJoVn_W_lybRCu7WcXjSh573LJH2ueq2T2sEkmR2_tuxg-P-WbATOxECic-g3mN3V89fKRUAw3Asx5YZCLCl2AO3rSMKEhGxXYGQtC2A4OPNTgTzY27lGW9dE1xxLeiIr-8PviWVQqq-5GFROpBnAYpPJEboM2l492YBfNu61sSqfJ-L6sPprA3dzN5')",
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8 w-full -mt-64">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg leading-tight tracking-tight">
          Ethereal Luxury, <br />
          Defined by Nature.
        </h1>
        <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md font-light leading-relaxed">
          Experience the pinnacle of bespoke travel in our sanctuary of light and glass, nestled where the sky meets the sea.
        </p>

        {/* Search Widget */}
        <form
          onSubmit={handleSearch}
          className="glass-panel aura-shadow rounded-xl p-4 md:p-6 mt-12 grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-left border border-white/20 w-full"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#494551] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span> Check-in
            </label>
            <input
              className="w-full bg-transparent border border-[#cbc4d2] rounded-lg p-2.5 text-base focus:ring-2 focus:ring-[#4f378a] focus:border-[#4f378a] transition-all outline-none"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#494551] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span> Check-out
            </label>
            <input
              className="w-full bg-transparent border border-[#cbc4d2] rounded-lg p-2.5 text-base focus:ring-2 focus:ring-[#4f378a] focus:border-[#4f378a] transition-all outline-none"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#494551] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">group</span> Guests
            </label>
            <select
              className="w-full bg-transparent border border-[#cbc4d2] rounded-lg p-2.5 text-base focus:ring-2 focus:ring-[#4f378a] focus:border-[#4f378a] transition-all outline-none"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            >
              <option value="2 Adults, 1 Child">2 Adults, 1 Child</option>
              <option value="2 Adults">2 Adults</option>
              <option value="4 Adults">4 Adults</option>
              <option value="1 Adult">1 Adult</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-[#4f378a] text-white h-[46px] rounded-lg font-medium text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer w-full"
          >
            <span className="material-symbols-outlined">search</span>
            Search Availability
          </button>
        </form>
      </div>
    </section>
  );
}
