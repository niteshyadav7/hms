"use client";

import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
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
          LEGAL & PRIVACY
        </span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1d1b20]">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#494551]">
          Last Updated: July 2026 • Effective Date: January 2026
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-8 text-sm text-[#1d1b20] leading-relaxed">
        <section className="bg-white aura-shadow p-6 md:p-8 rounded-2xl border border-[#cbc4d2]/30 space-y-3">
          <h2 className="text-xl font-bold text-[#4f378a] flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">shield</span>
            <span>1. Information We Collect</span>
          </h2>
          <p className="text-[#494551]">
            At Lumina Grand Resort, we collect personal information necessary to deliver exceptional luxury hospitality services. This includes your name, contact details, payment information, booking preferences, and special requirements provided during reservation or check-in.
          </p>
        </section>

        <section className="bg-white aura-shadow p-6 md:p-8 rounded-2xl border border-[#cbc4d2]/30 space-y-3">
          <h2 className="text-xl font-bold text-[#4f378a] flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">database</span>
            <span>2. How We Use Your Information</span>
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-[#494551]">
            <li>Processing room reservations, luxury transfers, and concierge requests.</li>
            <li>Personalizing your guest experience and fulfilling dietary or room preferences.</li>
            <li>Sending booking confirmations, digital key updates, and post-stay surveys.</li>
            <li>Ensuring high-level security and safety across resort premises.</li>
          </ul>
        </section>

        <section className="bg-white aura-shadow p-6 md:p-8 rounded-2xl border border-[#cbc4d2]/30 space-y-3">
          <h2 className="text-xl font-bold text-[#4f378a] flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">lock</span>
            <span>3. Data Security & Storage</span>
          </h2>
          <p className="text-[#494551]">
            We employ bank-grade 256-bit SSL encryption and strict data protection protocols. Your personal financial information is processed through PCI-DSS compliant secure gateways and is never stored in plain text on our servers.
          </p>
        </section>

        <section className="bg-white aura-shadow p-6 md:p-8 rounded-2xl border border-[#cbc4d2]/30 space-y-3">
          <h2 className="text-xl font-bold text-[#4f378a] flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">contact_support</span>
            <span>4. Guest Privacy Rights & Inquiries</span>
          </h2>
          <p className="text-[#494551]">
            You hold full rights to request access, correction, or deletion of your personal data at any time. For privacy inquiries or data requests, please contact our Data Protection Officer at <span className="font-semibold text-[#4f378a]">privacy@luminagrand.com</span>.
          </p>
        </section>
      </div>
    </main>
  );
}
