"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LiveWeatherWidget from "@/components/LiveWeatherWidget";
import { getTodayDateString } from "@/lib/utils/dates";

const HERO_SLIDES = [
  {
    url: "/images/ethereal_sanctuary_villa.png",
    title: "Ethereal Sanctuary Villa",
  },
  {
    url: "/images/ethereal_epicure_dining.png",
    title: "Epicurean Fine Dining",
  },
  {
    url: "/images/ethereal_spa_sanctuary.png",
    title: "Celestial Hydrotherapy Spa",
  },
  {
    url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=85",
    title: "Panoramic Glass Villa",
  },
];

export default function HeroSection() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [checkIn, setCheckIn] = useState(getTodayDateString(0));
  const [checkOut, setCheckOut] = useState(getTodayDateString(5));
  const [guests, setGuests] = useState("2 Adults, 1 Child");

  // Auto slide every 9 seconds (longer duration per slide)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (checkIn) query.set("checkIn", checkIn);
    if (checkOut) query.set("checkOut", checkOut);
    if (guests) query.set("guests", guests);
    router.push(`/rooms?${query.toString()}`);
  };

  return (
    <section className="relative h-[870px] w-full flex items-center justify-center px-4 md:px-12 overflow-hidden group">
      {/* Auto Carousel Slides */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-[2000ms] ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-105 z-0"
            }`}
            style={{ backgroundImage: `url('${slide.url}')` }}
          />
        ))}
        {/* Dark Gradient Scrim Overlay for Maximum Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70 z-20 pointer-events-none" />
      </div>

      {/* Manual Slide Navigation Arrows */}
      <button
        onClick={handlePrevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all cursor-pointer border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl"
        title="Previous Slide"
      >
        <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
      </button>

      <button
        onClick={handleNextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all cursor-pointer border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl"
        title="Next Slide"
      >
        <span className="material-symbols-outlined text-2xl">arrow_forward_ios</span>
      </button>

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-500 border-none cursor-pointer shadow-md ${
              index === currentSlide
                ? "w-8 bg-white"
                : "w-2.5 bg-white/50 hover:bg-white/90"
            }`}
            title={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-30 text-center max-w-4xl mx-auto space-y-6 w-full -mt-64">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] leading-tight tracking-tight">
          Ethereal Luxury, <br />
          Defined by Nature.
        </h1>
        <p className="text-white text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]">
          Experience the pinnacle of bespoke travel in our sanctuary of light and glass, nestled where the sky meets the sea.
        </p>

        {/* Live Weather & Tides Bar */}
        <div className="pt-2">
          <LiveWeatherWidget />
        </div>

        {/* Search Widget */}
        <form
          onSubmit={handleSearch}
          className="bg-white/95 backdrop-blur-2xl rounded-2xl p-5 md:p-6 mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-left border border-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.3)] w-full"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1d1b20] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#4f378a]">calendar_today</span> Check-in
            </label>
            <input
              className="w-full bg-[#f8f2fa] border border-[#cbc4d2] text-[#1d1b20] font-semibold rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#4f378a] focus:border-[#4f378a] transition-all outline-none"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1d1b20] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#4f378a]">calendar_month</span> Check-out
            </label>
            <input
              className="w-full bg-[#f8f2fa] border border-[#cbc4d2] text-[#1d1b20] font-semibold rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#4f378a] focus:border-[#4f378a] transition-all outline-none"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1d1b20] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#4f378a]">group</span> Guests
            </label>
            <select
              className="w-full bg-[#f8f2fa] border border-[#cbc4d2] text-[#1d1b20] font-semibold rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#4f378a] focus:border-[#4f378a] transition-all outline-none cursor-pointer"
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
            className="bg-[#4f378a] text-white h-[44px] rounded-xl font-bold text-sm hover:bg-[#3d2a6c] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer w-full"
          >
            <span className="material-symbols-outlined text-xl">search</span>
            Search Availability
          </button>
        </form>
      </div>
    </section>
  );
}
