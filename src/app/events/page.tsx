"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function WeddingsAndEventsPage() {
  const [eventType, setEventType] = useState<"WEDDING" | "GALA" | "RETREAT">("WEDDING");
  const [guestCount, setGuestCount] = useState(60);
  const [nights, setNights] = useState(3);
  const [catering, setCatering] = useState<"PLATED" | "BUFFET" | "MICHELIN">("MICHELIN");
  const [includeHelicopter, setIncludeHelicopter] = useState(true);
  const [includeFireworks, setIncludeFireworks] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Live Instant Pricing Calculation
  const baseRate = eventType === "WEDDING" ? 450000 : eventType === "GALA" ? 350000 : 250000;
  const guestCost = guestCount * (catering === "MICHELIN" ? 8500 : catering === "PLATED" ? 6000 : 4500) * nights;
  const helicopterCost = includeHelicopter ? 120000 : 0;
  const fireworksCost = includeFireworks ? 85000 : 0;

  const totalQuote = baseRate + guestCost + helicopterCost + fireworksCost;

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Event Quotation Request Received! Our VIP Event Director will email you within 4 hours.`);
    setName("");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-[#fdf7ff] text-[#1d1b20]">
      {/* Hero Banner */}
      <section className="relative h-[480px] w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />

        <div className="relative z-20 text-center max-w-3xl mx-auto px-4 space-y-4 text-white">
          <span className="bg-[#ffdf93] text-[#594400] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-block shadow-md">
            Unforgettable Celebrations
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md">
            Destination Weddings & Private Events
          </h1>
          <p className="text-white/90 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed drop-shadow-sm">
            Host your dream island wedding, executive retreat, or private island gala at Lumina Grand Maldives.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Package Builder Form */}
          <div className="lg:col-span-7 bg-white border border-[#cbc4d2]/40 rounded-2xl p-6 md:p-8 aura-shadow space-y-6">
            <div>
              <span className="text-[#4f378a] font-bold text-xs tracking-wider uppercase block">Step 1</span>
              <h2 className="text-2xl font-bold text-[#1d1b20]">Customize Your Private Event</h2>
            </div>

            {/* Event Type Select */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1d1b20] uppercase tracking-wider">Event Experience</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "WEDDING", label: "Sunset Wedding", icon: "favorite" },
                  { id: "GALA", label: "Island Gala", icon: "celebration" },
                  { id: "RETREAT", label: "Corporate Retreat", icon: "corporate_fare" },
                ].map((type) => (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => setEventType(type.id as any)}
                    className={`p-3.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      eventType === type.id
                        ? "bg-[#4f378a] text-white border-[#4f378a] shadow-md"
                        : "bg-[#f8f2fa] text-[#494551] border-[#cbc4d2]/30 hover:bg-[#e6e0e9]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Guest Count Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[#1d1b20]">
                <span>Guest Capacity</span>
                <span className="text-[#4f378a] font-extrabold text-sm">{guestCount} Guests</span>
              </div>
              <input
                type="range"
                min={20}
                max={250}
                step={5}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full accent-[#4f378a] cursor-pointer h-2 bg-[#f8f2fa] rounded-lg"
              />
            </div>

            {/* Length of Stay */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[#1d1b20]">
                <span>Event Duration</span>
                <span className="text-[#4f378a] font-extrabold text-sm">{nights} Nights Stay</span>
              </div>
              <input
                type="range"
                min={1}
                max={7}
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                className="w-full accent-[#4f378a] cursor-pointer h-2 bg-[#f8f2fa] rounded-lg"
              />
            </div>

            {/* Culinary Catering Package */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1d1b20] uppercase tracking-wider">Catering & Beverage</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "MICHELIN", label: "Michelin Plated", sub: "₹8,500 / guest" },
                  { id: "PLATED", label: "5-Course Gourmet", sub: "₹6,000 / guest" },
                  { id: "BUFFET", label: "Seafood Buffet", sub: "₹4,500 / guest" },
                ].map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCatering(cat.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      catering === cat.id
                        ? "bg-[#6750a4] text-white border-[#6750a4] shadow-sm"
                        : "bg-[#f8f2fa] text-[#1d1b20] border-[#cbc4d2]/30 hover:bg-[#e6e0e9]"
                    }`}
                  >
                    <span className="block font-bold text-xs">{cat.label}</span>
                    <span className="text-[10px] opacity-80 mt-0.5 block">{cat.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add-on Experiences */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-[#1d1b20] uppercase tracking-wider">VIP Add-on Experiences</label>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#f8f2fa] border border-[#cbc4d2]/30 cursor-pointer">
                  <span className="text-xs font-semibold text-[#1d1b20]">VIP Helicopter Arrival Chauffeur (₹1,20,000)</span>
                  <input
                    type="checkbox"
                    checked={includeHelicopter}
                    onChange={(e) => setIncludeHelicopter(e.target.checked)}
                    className="w-4 h-4 accent-[#4f378a] cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#f8f2fa] border border-[#cbc4d2]/30 cursor-pointer">
                  <span className="text-xs font-semibold text-[#1d1b20]">Private Lagoon Fireworks Show (₹85,000)</span>
                  <input
                    type="checkbox"
                    checked={includeFireworks}
                    onChange={(e) => setIncludeFireworks(e.target.checked)}
                    className="w-4 h-4 accent-[#4f378a] cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Pricing Quote & Inquiry Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#4f378a] to-[#3d2a6c] text-white rounded-2xl p-6 md:p-8 aura-shadow space-y-6 sticky top-24">
            <div>
              <span className="text-[#e9ddff] font-bold text-xs uppercase tracking-wider block">Estimated Quote</span>
              <h3 className="text-3xl font-extrabold mt-1">₹{totalQuote.toLocaleString("en-IN")}</h3>
              <p className="text-xs text-[#e9ddff] mt-1 opacity-90">
                Includes private island venue access, accommodation, dining & taxes.
              </p>
            </div>

            <div className="space-y-2 border-t border-white/20 pt-4 text-xs">
              <div className="flex justify-between text-white/90">
                <span>Base Venue & Island License:</span>
                <span className="font-bold">₹{baseRate.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-white/90">
                <span>Catering ({guestCount} guests × {nights} nights):</span>
                <span className="font-bold">₹{guestCost.toLocaleString("en-IN")}</span>
              </div>
              {includeHelicopter && (
                <div className="flex justify-between text-white/90">
                  <span>VIP Helicopter Chauffeur:</span>
                  <span className="font-bold">₹1,20,000</span>
                </div>
              )}
              {includeFireworks && (
                <div className="flex justify-between text-white/90">
                  <span>Lagoon Fireworks Display:</span>
                  <span className="font-bold">₹85,000</span>
                </div>
              )}
            </div>

            {/* Inquiry Form */}
            <form onSubmit={handleSubmitInquiry} className="space-y-3 pt-2 border-t border-white/20">
              <h4 className="font-bold text-sm">Lock in Date & Request Official Prospectus</h4>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full bg-white/10 border border-white/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-white/10 border border-white/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="w-full bg-white text-[#4f378a] py-3 rounded-xl font-bold text-xs hover:bg-[#f8f2fa] transition-all cursor-pointer border-none shadow-lg active:scale-95"
              >
                Send Proposal Request
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
