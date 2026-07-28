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
    toast.success("Welcome to the Lumina Circle.");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full font-body overflow-hidden">

      {/* ═══════════════════════════════════════════
          SECTION 1: Cinematic CTA with background image
          ═══════════════════════════════════════════ */}
      <div className="relative h-[480px] md:h-[520px] flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <p className="text-[#c9a227] text-[10px] font-semibold uppercase tracking-[0.4em] mb-6">
            Begin your journey
          </p>
          <h2 className="text-white text-3xl md:text-5xl font-display font-bold leading-[1.1] mb-6">
            Your sanctuary awaits.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-md mx-auto">
            Let our team design a stay that is entirely, unmistakably yours.
          </p>

          {subscribed ? (
            <p className="text-[#c9a227] text-xs font-semibold tracking-widest uppercase">
              You&apos;re on the list — welcome.
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex items-center justify-center gap-0 max-w-sm mx-auto border-b border-white/25"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 bg-transparent text-white text-sm placeholder-white/30 py-3 px-0 outline-none border-none font-body"
              />
              <button
                type="submit"
                className="text-[#c9a227] text-[11px] font-semibold uppercase tracking-[0.2em] bg-transparent border-none py-3 px-2 cursor-pointer hover:text-white transition-colors whitespace-nowrap"
              >
                Join →
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 2: Dark navigation band
          ═══════════════════════════════════════════ */}
      <div className="bg-[#111111]">
        <div className="max-w-[1340px] mx-auto px-4 md:px-8 py-16">

          {/* Brand wordmark — large and centered */}
          <div className="text-center mb-14">
            <Link href="/" className="no-underline inline-flex flex-col items-center gap-3">
              <img
                src="/logo.png"
                alt="Lumina Grand"
                className="w-12 h-12 rounded-full object-cover opacity-70"
              />
              <span className="text-white/80 text-2xl md:text-3xl font-display font-bold tracking-wide">
                LUMINA GRAND
              </span>
            </Link>
            <p className="text-gray-600 text-[11px] mt-3 tracking-[0.15em] uppercase">
              Baa Atoll · Maldives · UNESCO Biosphere
            </p>
          </div>

          {/* Navigation — single centered row */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-14">
            {[
              { label: "Rooms & Suites", href: "/rooms" },
              { label: "Dining", href: "/#dining" },
              { label: "Spa", href: "/#amenities" },
              { label: "Weddings", href: "/#weddings" },
              { label: "Events", href: "/events" },
              { label: "Reserve", href: "/booking/checkout" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-500 hover:text-white text-xs tracking-[0.1em] uppercase no-underline transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="w-12 h-px bg-[#c9a227]/40 mx-auto mb-14" />

          {/* Contact details — minimal centered */}
          <div className="text-center space-y-2 mb-14">
            <p className="text-gray-500 text-xs tracking-wide">
              +960 664 8800
            </p>
            <p className="text-gray-600 text-[11px] tracking-wide">
              reservations@luminagrand.mv
            </p>
          </div>

          {/* Social row */}
          <div className="flex justify-center gap-6 mb-14">
            {["Instagram", "Facebook", "Pinterest", "LinkedIn"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-gray-600 hover:text-[#c9a227] text-[10px] uppercase tracking-[0.2em] no-underline transition-colors duration-300"
              >
                {social}
              </a>
            ))}
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 3: Slim bottom bar
          ═══════════════════════════════════════════ */}
      <div className="bg-[#0a0a0a]">
        <div className="max-w-[1340px] mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-700 text-[10px] tracking-wide">
            © 2026 Lumina Grand Luxury Resorts. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-[10px] text-gray-700">
            <Link href="/privacy-policy" className="hover:text-gray-400 no-underline transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-gray-400 no-underline transition-colors">
              Terms of Service
            </Link>
            <button
              onClick={scrollToTop}
              className="text-gray-600 hover:text-white bg-transparent border border-white/10 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Back to top"
            >
              <span className="material-symbols-outlined text-xs">north</span>
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
}
