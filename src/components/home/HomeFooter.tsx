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

  return (
    <footer className="bg-[#0f0e11] text-white w-full relative overflow-hidden py-16 px-4 md:px-8 font-body">
      {/* Dynamic Modern Mesh Gradient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#755b00]/20 via-[#c9a227]/15 to-[#48645d]/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1340px] mx-auto relative z-10 space-y-12">
        
        {/* 🌟 1. FLOATING CURVED MODERN GLASS ISLAND */}
        <div className="bg-[#18161c]/90 border border-white/10 rounded-[40px] p-8 md:p-14 shadow-2xl backdrop-blur-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Big Statement Headline & Brand */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 bg-[#ffe08e]/10 text-[#ffe08e] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-[#ffe08e]/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Baa Atoll Sanctuary • Maldives 2026
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white font-display leading-tight">
              Ready for an extraordinary <br />
              <span className="bg-gradient-to-r from-[#ffe08e] via-[#c9a227] to-[#cae9e0] bg-clip-text text-transparent">
                overwater sanctuary experience?
              </span>
            </h2>

            <p className="text-xs md:text-sm text-gray-300 font-medium max-w-xl leading-relaxed">
              Explore 360° turquoise lagoons, 24/7 Lumina AI Butler service, and Michelin dining. Book your bespoke holiday today.
            </p>

            {/* Quick Action Pill Chips */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <Link
                href="/rooms"
                className="bg-gradient-to-r from-[#755b00] to-[#c9a227] hover:opacity-90 text-white px-5 py-2.5 rounded-full text-xs font-black shadow-md no-underline transition-all active:scale-95"
              >
                ✨ Book a Residence
              </Link>
              <Link
                href="/#dining"
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-xs font-bold no-underline transition-all border border-white/10"
              >
                🍸 Michelin Dining
              </Link>
              <Link
                href="/admin/dashboard"
                className="bg-white/10 hover:bg-white/20 text-amber-300 px-5 py-2.5 rounded-full text-xs font-bold no-underline transition-all border border-amber-300/30 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-xs">dashboard</span>
                Admin Center
              </Link>
            </div>
          </div>

          {/* Right Column: Modern Newsletter Capsule */}
          <div className="lg:col-span-5 bg-[#232029] p-7 rounded-[32px] border border-white/10 space-y-4 shadow-xl">
            <div>
              <h4 className="text-base font-extrabold text-white font-display">
                Subscribe to Lumina Circle
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Receive private seaplane charter offers & villa opening alerts.
              </p>
            </div>

            {subscribed ? (
              <div className="bg-[#755b00]/30 border border-[#ffe08e]/40 p-3.5 rounded-xl text-center text-xs font-bold text-[#ffe08e] flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">verified</span>
                Invitation Activated for {email}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-[#16141a] border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#ffe08e]"
                />
                <button
                  type="submit"
                  className="w-full bg-white hover:bg-gray-100 text-[#121115] py-3.5 rounded-xl text-xs font-black shadow-lg transition-all border-none cursor-pointer active:scale-95"
                >
                  Join Lumina Circle ➔
                </button>
              </form>
            )}
          </div>

        </div>

        {/* 🌟 2. MODERN GIANT TYPOGRAPHY BRAND WATERMARK */}
        <div className="relative py-4 text-center select-none overflow-hidden">
          <span className="text-6xl sm:text-8xl md:text-[140px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/15 via-white/5 to-transparent font-display block leading-none">
            LUMINA GRAND
          </span>
        </div>

        {/* 🌟 3. SLEEK MODERN NAVIGATION & SOCIAL ROW */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Lumina Grand Logo" className="w-8 h-8 rounded-full object-cover shadow-md" />
            <span className="font-extrabold text-white tracking-tight text-sm">
              Lumina Grand Luxury Resorts
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 font-semibold text-gray-300">
            <Link href="/rooms" className="hover:text-[#ffe08e] no-underline transition-colors">
              Residences
            </Link>
            <Link href="/#amenities" className="hover:text-[#ffe08e] no-underline transition-colors">
              Amenities
            </Link>
            <Link href="/admin/payments" className="hover:text-[#ffe08e] no-underline transition-colors text-amber-300">
              Financials
            </Link>
            <Link href="/privacy-policy" className="hover:text-[#ffe08e] no-underline transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-[#ffe08e] no-underline transition-colors">
              Terms of Service
            </Link>
          </div>

          <p className="m-0 text-gray-500 font-mono text-[11px]">
            © 2026 Lumina Grand. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
