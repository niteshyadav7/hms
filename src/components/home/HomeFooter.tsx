"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function HomeFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    toast.success("Welcome to Lumina Circle! VIP invitation activated.");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#f6f2ee] dark:bg-[#121115] text-[#1b1c1c] dark:text-white w-full border-t border-[#d1c5af]/50 pt-16 pb-12 font-body transition-colors">
      <div className="max-w-[1340px] mx-auto px-4 md:px-8 space-y-16">
        
        {/* 🌟 1. ELEGANT OPEN HERO SECTION (NO DARK BOXES) */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-[#d1c5af]/40 pb-12">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-widest text-[#755b00] dark:text-[#ffe08e] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              Ethereal Sanctuary & Concierge
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#1b1c1c] dark:text-white font-display leading-tight">
              Crafting memories in <br />
              <span className="bg-gradient-to-r from-[#755b00] via-[#c9a227] to-[#48645d] bg-clip-text text-transparent">
                unparalleled luxury.
              </span>
            </h2>
            <p className="text-sm text-[#4d4635] dark:text-gray-300 font-medium leading-relaxed">
              Experience the pinnacle of bespoke travel in our sanctuary of light and glass, powered by 24/7 Lumina AI Butler Concierge.
            </p>
          </div>

          {/* Newsletter Input Capsule */}
          <div className="w-full lg:w-auto min-w-[320px] max-w-md">
            {subscribed ? (
              <div className="bg-[#ffe08e]/40 border border-[#c9a227]/50 p-4 rounded-2xl text-center text-xs font-black text-[#755b00] flex items-center justify-center gap-2 shadow-xs">
                <span className="material-symbols-outlined text-sm">verified</span>
                VIP Status Activated for {email}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 bg-white dark:bg-[#1e1c22] border border-[#d1c5af]/60 rounded-full px-5 py-3 text-xs font-medium text-[#1b1c1c] dark:text-white outline-none focus:ring-2 focus:ring-[#755b00] shadow-xs"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#755b00] to-[#48645d] hover:from-[#584400] text-white px-6 py-3 rounded-full text-xs font-black shadow-md transition-all border-none cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  Join ➔
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 🌟 2. CLEAN 4-COLUMN LINKS & BRAND IDENTIFIER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Info (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3 no-underline group">
              <img
                src="/logo.png"
                alt="Lumina Grand Logo"
                className="w-10 h-10 object-cover rounded-full shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="text-2xl font-black bg-gradient-to-r from-[#755b00] to-[#48645d] bg-clip-text text-transparent tracking-tight font-display">
                Lumina Grand
              </span>
            </Link>
            <p className="text-xs text-[#7f7663] dark:text-gray-400 font-medium leading-relaxed max-w-sm">
              Baa Atoll, UNESCO Biosphere Reserve, Maldives • 24/7 Global Concierge Hotline: +960 664-8800
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] font-bold text-[#755b00] dark:text-[#ffe08e]">
              <span>🏆 Forbes 5-Star Hotel 2026</span>
              <span>•</span>
              <span>⭐ Michelin Key Resort</span>
            </div>
          </div>

          {/* Column 2: Residences (2 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#755b00] dark:text-[#ffe08e]">
              The Sanctuaries
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-[#4d4635] dark:text-gray-300 list-none p-0">
              <li>
                <Link href="/rooms" className="hover:text-[#755b00] transition-colors no-underline block">
                  Overwater Sunset Villa
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="hover:text-[#755b00] transition-colors no-underline block">
                  Epicurean Penthouse Suite
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="hover:text-[#755b00] transition-colors no-underline block">
                  Celestial Spa Hydro-Pavilion
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Experiences (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#755b00] dark:text-[#ffe08e]">
              Experiences
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-[#4d4635] dark:text-gray-300 list-none p-0">
              <li>
                <Link href="/#dining" className="hover:text-[#755b00] transition-colors no-underline block">
                  Aether Michelin Dining
                </Link>
              </li>
              <li>
                <Link href="/#amenities" className="hover:text-[#755b00] transition-colors no-underline block">
                  Somatic Spa Rituals
                </Link>
              </li>
              <li>
                <Link href="/#weddings" className="hover:text-[#755b00] transition-colors no-underline block">
                  Overwater Wedding Galas
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resort Admin (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#755b00] dark:text-[#ffe08e]">
              Operations & Admin
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-[#4d4635] dark:text-gray-300 list-none p-0">
              <li>
                <Link href="/admin/dashboard" className="hover:text-[#755b00] transition-colors no-underline flex items-center gap-1.5 text-[#755b00] dark:text-[#ffe08e] font-extrabold">
                  <span className="material-symbols-outlined text-xs">dashboard</span>
                  Admin Live Dispatch Matrix
                </Link>
              </li>
              <li>
                <Link href="/admin/payments" className="hover:text-[#755b00] transition-colors no-underline flex items-center gap-1.5 text-[#755b00] dark:text-[#ffe08e] font-extrabold">
                  <span className="material-symbols-outlined text-xs">payments</span>
                  Financial Control Center
                </Link>
              </li>
              <li>
                <Link href="/booking/checkout" className="hover:text-[#755b00] transition-colors no-underline block">
                  Instant Reservation Checkout
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* 🌟 3. BOTTOM BAR WITH BACK TO TOP BUTTON */}
        <div className="pt-8 border-t border-[#d1c5af]/40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#7f7663] dark:text-gray-400 font-medium">
          <p className="m-0">
            © 2026 Lumina Grand Luxury Resorts. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-[#755b00] no-underline transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-[#755b00] no-underline transition-colors">
              Terms of Service
            </Link>

            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="bg-white dark:bg-[#1e1c22] hover:bg-[#ffe08e]/50 text-[#1b1c1c] dark:text-white p-2.5 px-4 rounded-full border border-[#d1c5af]/50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <span>Top</span>
              <span className="material-symbols-outlined text-sm">arrow_upward</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
