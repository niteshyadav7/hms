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
    toast.success("Welcome to Lumina Circle! You have received VIP invitation status.");
  };

  return (
    <footer className="bg-[#19181a] text-white w-full relative overflow-hidden border-t-2 border-[#755b00]/40 font-body">
      {/* Decorative Golden Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#755b00]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#48645d]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* 🌟 1. VIP CIRCLE NEWSLETTER & GAZETTE BANNER */}
      <div className="border-b border-white/10 bg-[#211f24]/80 backdrop-blur-md relative z-10">
        <div className="max-w-[1340px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#ffe08e] flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#ffe08e]">auto_awesome</span>
              Exclusive Guest Privilege
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white font-display">
              Join Lumina Circle & Concierge Gazette
            </h3>
            <p className="text-xs md:text-sm text-gray-300 font-medium max-w-xl leading-relaxed">
              Receive private invitations to seasonal overwater villa openings, Michelin culinary pop-ups, and private seaplane charter privileges.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="bg-[#755b00]/30 border border-[#ffe08e]/40 p-4 rounded-2xl text-center text-xs font-bold text-[#ffe08e] flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">verified</span>
                VIP Status Active. Invitation link delivered to {email}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your private email address..."
                  className="flex-1 bg-[#19181a] border border-[#755b00]/50 rounded-2xl px-5 py-3.5 text-xs text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#ffe08e]"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#755b00] via-[#c9a227] to-[#48645d] hover:from-[#584400] hover:to-[#304c46] text-white px-7 py-3.5 rounded-2xl text-xs font-black shadow-xl transition-all border-none cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  Join Lumina Circle ➔
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 🌟 2. MAIN 4-COLUMN ARCHITECTURAL NAVIGATION GRID */}
      <div className="max-w-[1340px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 relative z-10">
        
        {/* Column 1 (4 Cols): Lumina Grand Brand & Global Honors */}
        <div className="lg:col-span-4 space-y-6">
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <img
              src="/logo.png"
              alt="Lumina Grand Logo"
              className="w-11 h-11 object-cover rounded-full shadow-xl border-2 border-[#ffe08e]/40 transition-transform group-hover:scale-105"
            />
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-[#ffe08e] via-[#c9a227] to-[#cae9e0] bg-clip-text text-transparent tracking-tight font-display block leading-none">
                Lumina Grand
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 block mt-1">
                Luxury Resorts & Sanctuaries
              </span>
            </div>
          </Link>

          <p className="text-xs text-gray-300 leading-relaxed font-medium">
            Where architectural majesty meets 360° turquoise lagoon waters. Powered by 24/7 Lumina AI Butler Concierge and Michelin-starred epicurean dining.
          </p>

          <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <span className="material-symbols-outlined text-sm">phone_in_talk</span>
              <span>Global Concierge: +960 664-8800</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="material-symbols-outlined text-sm">mark_email_read</span>
              <span>concierge@luminagrand.com</span>
            </div>
          </div>

          {/* Award Badges */}
          <div className="flex items-center gap-3 pt-2">
            <div className="bg-white/5 border border-white/10 p-2 px-3 rounded-xl text-[10px] text-amber-300 font-bold flex items-center gap-1.5">
              <span>🏆 Forbes 5-Star 2026</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-2 px-3 rounded-xl text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
              <span>⭐ Michelin Key Resort</span>
            </div>
          </div>
        </div>

        {/* Column 2 (2 Cols): Sanctuaries & Residences */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#ffe08e] border-b border-[#ffe08e]/20 pb-2">
            The Sanctuaries
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-300 font-medium list-none p-0">
            <li>
              <Link href="/rooms" className="hover:text-[#ffe08e] transition-colors no-underline block">
                Overwater Sunset Villa
              </Link>
            </li>
            <li>
              <Link href="/rooms" className="hover:text-[#ffe08e] transition-colors no-underline block">
                Epicurean Penthouse Suite
              </Link>
            </li>
            <li>
              <Link href="/rooms" className="hover:text-[#ffe08e] transition-colors no-underline block">
                Celestial Spa Hydro-Pavilion
              </Link>
            </li>
            <li>
              <Link href="/rooms" className="hover:text-[#ffe08e] transition-colors no-underline block">
                Presidential Lagoon Sanctuary
              </Link>
            </li>
            <li>
              <Link href="/rooms" className="hover:text-[#ffe08e] transition-colors no-underline block">
                Private Island Reserve
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 (2 Cols): Curated Experiences */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#ffe08e] border-b border-[#ffe08e]/20 pb-2">
            Experiences
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-300 font-medium list-none p-0">
            <li>
              <Link href="/#dining" className="hover:text-[#ffe08e] transition-colors no-underline block">
                Aether Michelin Culinary
              </Link>
            </li>
            <li>
              <Link href="/#amenities" className="hover:text-[#ffe08e] transition-colors no-underline block">
                Somatic Spa & Lunar Rituals
              </Link>
            </li>
            <li>
              <Link href="/#amenities" className="hover:text-[#ffe08e] transition-colors no-underline block">
                Seaplane & Private Yacht
              </Link>
            </li>
            <li>
              <Link href="/#weddings" className="hover:text-[#ffe08e] transition-colors no-underline block">
                Overwater Wedding Galas
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4 (3 Cols): Operations & Admin Control */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#ffe08e] border-b border-[#ffe08e]/20 pb-2">
            Resort Operations
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-300 font-medium list-none p-0">
            <li>
              <Link href="/admin/dashboard" className="hover:text-[#ffe08e] transition-colors no-underline flex items-center gap-1.5 text-amber-300 font-bold">
                <span className="material-symbols-outlined text-xs">dashboard</span>
                Admin Live Dispatch Matrix
              </Link>
            </li>
            <li>
              <Link href="/admin/payments" className="hover:text-[#ffe08e] transition-colors no-underline flex items-center gap-1.5 text-amber-300 font-bold">
                <span className="material-symbols-outlined text-xs">payments</span>
                Payment & Revenue Control
              </Link>
            </li>
            <li>
              <Link href="/booking/checkout" className="hover:text-[#ffe08e] transition-colors no-underline block">
                Instant Reservation Checkout
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-[#ffe08e] transition-colors no-underline block">
                GST Tax Invoice Generator
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* 🌟 3. RESORT LOCATION & LIVE ENVIRONMENT BAR */}
      <div className="bg-[#121113] border-t border-b border-white/10 py-3 text-xs text-gray-400">
        <div className="max-w-[1340px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-[#ffe08e] font-bold">
              <span className="material-symbols-outlined text-xs">location_on</span>
              Baa Atoll, UNESCO Biosphere Reserve
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">04° 10&apos; N, 73° 30&apos; E</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>100% Renewable Solar Powered Resort • Zero Single-Use Plastics</span>
          </div>
        </div>
      </div>

      {/* 🌟 4. BOTTOM COPYRIGHT & SOCIAL LEGAL BAR */}
      <div className="max-w-[1340px] mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 relative z-10">
        <p className="m-0">
          © 2026 Lumina Grand Hotel & Resort Group. All rights reserved.
        </p>

        <div className="flex flex-wrap justify-center gap-6 font-medium text-gray-400">
          <Link href="/privacy-policy" className="hover:text-white no-underline transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-white no-underline transition-colors">
            Terms of Service
          </Link>
          <Link href="/sustainability" className="hover:text-white no-underline transition-colors">
            Sustainability Charter
          </Link>
          <Link href="/careers" className="hover:text-white no-underline transition-colors">
            Careers
          </Link>
        </div>
      </div>
    </footer>
  );
}
