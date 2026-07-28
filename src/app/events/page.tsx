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
    <div className="min-h-screen bg-[#fcf9f8] dark:bg-[#121115] text-[#1b1c1c] dark:text-white font-body transition-colors">
      {/* Hero Banner */}
      <section className="relative h-[480px] w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10" />

        <div className="relative z-20 text-center max-w-3xl mx-auto px-4 space-y-4 text-white">
          <span className="bg-[#ffe08e]/30 text-[#ffe08e] px-4.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest inline-block border border-[#c9a227]/50 shadow-md">
            Unforgettable Overwater Celebrations
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md font-display leading-tight">
            Destination Weddings & Private Events
          </h1>
          <p className="text-white/90 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed drop-shadow-sm">
            Host your dream island wedding, executive retreat, or private island gala at Lumina Grand Maldives.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-[1340px] mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Package Builder Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1e1c22] border border-[#d1c5af]/50 rounded-[32px] p-6 md:p-10 shadow-xl space-y-7">
            <div>
              <span className="text-[#755b00] dark:text-[#ffe08e] font-black text-xs tracking-widest uppercase block">
                STEP 1
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-[#1b1c1c] dark:text-white font-display mt-0.5">
                Customize Your Private Event
              </h2>
            </div>

            {/* Event Type Select */}
            <div className="space-y-2.5">
              <label className="block text-xs font-extrabold text-[#1b1c1c] dark:text-white uppercase tracking-wider">
                Event Experience
              </label>
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
                    className={`p-4 rounded-2xl text-xs font-black flex flex-col items-center gap-2 transition-all cursor-pointer border ${
                      eventType === type.id
                        ? "bg-gradient-to-r from-[#755b00] to-[#c9a227] text-white border-none shadow-md scale-102"
                        : "bg-[#f6f3f2] dark:bg-[#28252e] text-[#4d4635] dark:text-gray-300 border-[#d1c5af]/40 hover:bg-[#eae7e7]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Guest Count Slider */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-extrabold text-[#1b1c1c] dark:text-white">
                <span>Guest Capacity</span>
                <span className="text-[#755b00] dark:text-[#ffe08e] font-black text-sm">{guestCount} Guests</span>
              </div>
              <input
                type="range"
                min={20}
                max={250}
                step={5}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full accent-[#755b00] cursor-pointer h-2.5 bg-[#f6f3f2] rounded-lg"
              />
            </div>

            {/* Length of Stay */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-extrabold text-[#1b1c1c] dark:text-white">
                <span>Event Duration</span>
                <span className="text-[#755b00] dark:text-[#ffe08e] font-black text-sm">{nights} Nights Stay</span>
              </div>
              <input
                type="range"
                min={1}
                max={7}
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                className="w-full accent-[#755b00] cursor-pointer h-2.5 bg-[#f6f3f2] rounded-lg"
              />
            </div>

            {/* Culinary Catering Package */}
            <div className="space-y-2.5">
              <label className="block text-xs font-extrabold text-[#1b1c1c] dark:text-white uppercase tracking-wider">
                Catering & Beverage
              </label>
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
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      catering === cat.id
                        ? "bg-gradient-to-r from-[#755b00] to-[#48645d] text-white border-none shadow-md"
                        : "bg-[#f6f3f2] dark:bg-[#28252e] text-[#1b1c1c] dark:text-gray-300 border-[#d1c5af]/40 hover:bg-[#eae7e7]"
                    }`}
                  >
                    <span className="block font-black text-xs">{cat.label}</span>
                    <span className="text-[10px] opacity-80 mt-0.5 block font-semibold">{cat.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add-on Experiences */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-extrabold text-[#1b1c1c] dark:text-white uppercase tracking-wider">
                VIP Add-on Experiences
              </label>
              <div className="space-y-2.5">
                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f6f3f2] dark:bg-[#28252e] border border-[#d1c5af]/40 cursor-pointer">
                  <span className="text-xs font-bold text-[#1b1c1c] dark:text-white">VIP Helicopter Arrival Chauffeur (₹1,20,000)</span>
                  <input
                    type="checkbox"
                    checked={includeHelicopter}
                    onChange={(e) => setIncludeHelicopter(e.target.checked)}
                    className="w-4 h-4 accent-[#755b00] cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f6f3f2] dark:bg-[#28252e] border border-[#d1c5af]/40 cursor-pointer">
                  <span className="text-xs font-bold text-[#1b1c1c] dark:text-white">Private Lagoon Fireworks Show (₹85,000)</span>
                  <input
                    type="checkbox"
                    checked={includeFireworks}
                    onChange={(e) => setIncludeFireworks(e.target.checked)}
                    className="w-4 h-4 accent-[#755b00] cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Pricing Quote & Inquiry Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1e1c22] via-[#232029] to-[#121115] text-white rounded-[32px] p-8 border border-[#c9a227]/40 shadow-2xl space-y-6 sticky top-24">
            <div>
              <span className="text-[#ffe08e] font-black text-xs uppercase tracking-widest block">
                Estimated Event Quote
              </span>
              <h3 className="text-4xl font-black bg-gradient-to-r from-[#ffe08e] via-[#c9a227] to-[#cae9e0] bg-clip-text text-transparent mt-1 font-display">
                ₹{totalQuote.toLocaleString("en-IN")}
              </h3>
              <p className="text-xs text-gray-300 mt-1 font-medium leading-relaxed">
                Includes private island venue access, accommodation, dining & taxes.
              </p>
            </div>

            <div className="space-y-2.5 border-t border-white/10 pt-4 text-xs font-medium">
              <div className="flex justify-between text-gray-300">
                <span>Base Venue & Island License:</span>
                <span className="font-bold text-white">₹{baseRate.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Catering ({guestCount} guests × {nights} nights):</span>
                <span className="font-bold text-white">₹{guestCost.toLocaleString("en-IN")}</span>
              </div>
              {includeHelicopter && (
                <div className="flex justify-between text-gray-300">
                  <span>VIP Helicopter Chauffeur:</span>
                  <span className="font-bold text-white">₹1,20,000</span>
                </div>
              )}
              {includeFireworks && (
                <div className="flex justify-between text-gray-300">
                  <span>Lagoon Fireworks Display:</span>
                  <span className="font-bold text-white">₹85,000</span>
                </div>
              )}
            </div>

            {/* Inquiry Form */}
            <form onSubmit={handleSubmitInquiry} className="space-y-3.5 pt-3 border-t border-white/10">
              <h4 className="font-extrabold text-sm font-display text-white">
                Lock in Date & Request Official Prospectus
              </h4>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#ffe08e]"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#ffe08e]"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#755b00] via-[#c9a227] to-[#48645d] hover:from-[#584400] text-white py-4 rounded-xl font-black text-xs shadow-xl transition-all cursor-pointer border-none active:scale-95"
              >
                Send Proposal Request ➔
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
