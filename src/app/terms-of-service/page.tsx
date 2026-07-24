"use client";

import React from "react";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <main className="max-w-[1000px] mx-auto px-6 md:px-12 py-12 text-[#1d1b20]">
      {/* Return Link */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-[#494551] hover:text-[#4f378a] transition-colors group no-underline text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>Back to Home</span>
      </Link>

      {/* Header */}
      <div className="space-y-3 mb-10 pb-6 border-b border-[#cbc4d2]/40">
        <span className="text-[#4f378a] text-xs font-semibold tracking-widest uppercase block">
          TERMS & CONDITIONS
        </span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1d1b20]">
          Terms of Service
        </h1>
        <p className="text-sm text-[#494551]">
          Last Updated: July 2026 • Governs all reservations, guest stays, and facility usage
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-8 text-sm text-[#1d1b20] leading-relaxed">
        <section className="bg-white aura-shadow p-6 md:p-8 rounded-2xl border border-[#cbc4d2]/30 space-y-3">
          <h2 className="text-xl font-bold text-[#4f378a] flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">event_available</span>
            <span>1. Reservations & Check-in Policies</span>
          </h2>
          <p className="text-[#494551]">
            Standard check-in time commences at 3:00 PM local time, and check-out is required by 11:00 AM. Guests must present valid government-issued photo identification and a credit card upon arrival. Early check-in and late check-out options are subject to availability.
          </p>
        </section>

        <section className="bg-white aura-shadow p-6 md:p-8 rounded-2xl border border-[#cbc4d2]/30 space-y-3">
          <h2 className="text-xl font-bold text-[#4f378a] flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">cancel</span>
            <span>2. Cancellation & Refund Policy</span>
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-[#494551]">
            <li>Cancellations made 48 hours prior to check-in are eligible for a 100% full refund.</li>
            <li>Cancellations within 48 hours of check-in will be charged a 1-night room fee.</li>
            <li>No-shows will forfeit the full booking amount.</li>
          </ul>
        </section>

        <section className="bg-white aura-shadow p-6 md:p-8 rounded-2xl border border-[#cbc4d2]/30 space-y-3">
          <h2 className="text-xl font-bold text-[#4f378a] flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">gavel</span>
            <span>3. Guest Conduct & Property Care</span>
          </h2>
          <p className="text-[#494551]">
            Lumina Grand maintains a strict non-smoking policy across all enclosed suites and indoor facilities. Guests are responsible for any damages caused to room furnishings or resort amenities during their stay.
          </p>
        </section>

        <section className="bg-white aura-shadow p-6 md:p-8 rounded-2xl border border-[#cbc4d2]/30 space-y-3">
          <h2 className="text-xl font-bold text-[#4f378a] flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">support_agent</span>
            <span>4. Customer Support & Disputes</span>
          </h2>
          <p className="text-[#494551]">
            Any queries regarding these terms may be directed to our 24/7 concierge team at <span className="font-semibold text-[#4f378a]">concierge@luminagrand.com</span> or via the Guest Portal desk.
          </p>
        </section>
      </div>
    </main>
  );
}
