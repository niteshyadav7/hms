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
    toast.success("Welcome to Lumina Circle.");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#1b1c1c] text-white w-full font-body">

      {/* Top band — newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-[1340px] mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="max-w-xl">
            <p className="text-[#c9a227] text-[11px] font-semibold uppercase tracking-[0.3em] mb-4">
              Stay connected
            </p>
            <h2 className="text-2xl md:text-[2.2rem] font-display font-bold leading-[1.15] text-white mb-3">
              Receive invitations to private
              <br />
              events and seasonal offers.
            </h2>
            <p className="text-gray-500 text-xs leading-relaxed mb-8 max-w-md">
              Join our circle for early access to new suites, Michelin pop-ups, and overwater ceremony dates.
            </p>

            {subscribed ? (
              <p className="text-[#c9a227] text-xs font-semibold tracking-wide">
                Thank you — you&apos;re on the list.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-stretch gap-0 max-w-md">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 bg-transparent border-b border-white/30 px-0 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#c9a227] transition-colors rounded-none"
                />
                <button
                  type="submit"
                  className="text-[#c9a227] text-xs font-semibold uppercase tracking-[0.15em] bg-transparent border-b border-white/30 px-4 py-3 cursor-pointer hover:border-[#c9a227] transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Middle band — navigation columns */}
      <div className="border-b border-white/10">
        <div className="max-w-[1340px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8">

            {/* Col 1 */}
            <div>
              <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.25em] mb-5">
                The Resort
              </p>
              <ul className="space-y-3 list-none p-0 m-0">
                {["Rooms & Suites", "Amenities", "Dining", "Spa & Wellness"].map((item) => (
                  <li key={item}>
                    <Link
                      href={item === "Rooms & Suites" ? "/rooms" : `/#${item.toLowerCase().replace(/\s.*/, "")}`}
                      className="text-gray-300 hover:text-white text-xs no-underline transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 2 */}
            <div>
              <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.25em] mb-5">
                Celebrations
              </p>
              <ul className="space-y-3 list-none p-0 m-0">
                {["Weddings", "Private Events", "Corporate Retreats"].map((item) => (
                  <li key={item}>
                    <Link
                      href={item === "Weddings" ? "/#weddings" : "/events"}
                      className="text-gray-300 hover:text-white text-xs no-underline transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.25em] mb-5">
                Guest Services
              </p>
              <ul className="space-y-3 list-none p-0 m-0">
                {[
                  { label: "Book a Stay", href: "/booking/checkout" },
                  { label: "Guest Dashboard", href: "/guest/dashboard" },
                  { label: "AI Concierge", href: "/#" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-white text-xs no-underline transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.25em] mb-5">
                Management
              </p>
              <ul className="space-y-3 list-none p-0 m-0">
                {[
                  { label: "Admin Dashboard", href: "/admin/dashboard" },
                  { label: "Payments", href: "/admin/payments" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-white text-xs no-underline transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom band — brand + legal */}
      <div className="max-w-[1340px] mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

          {/* Left — brand mark */}
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2.5 no-underline">
              <img
                src="/logo.png"
                alt="Lumina Grand"
                className="w-7 h-7 rounded-full object-cover opacity-80"
              />
              <span className="text-white text-sm font-display font-bold tracking-tight">
                Lumina Grand
              </span>
            </Link>
            <p className="text-gray-600 text-[10px] leading-relaxed max-w-xs">
              Baa Atoll, UNESCO Biosphere Reserve, Maldives
              <br />
              Concierge · +960 664 8800
            </p>
          </div>

          {/* Right — legal + top */}
          <div className="flex items-center gap-6 text-[10px] text-gray-600">
            <span>© 2026 Lumina Grand Luxury Resorts</span>
            <Link href="/privacy-policy" className="hover:text-gray-300 no-underline transition-colors">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="hover:text-gray-300 no-underline transition-colors">
              Terms
            </Link>
            <button
              onClick={scrollToTop}
              className="text-gray-500 hover:text-white bg-transparent border border-white/10 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Back to top"
            >
              <span className="material-symbols-outlined text-sm">north</span>
            </button>
          </div>

        </div>
      </div>

    </footer>
  );
}
