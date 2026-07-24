"use client";

import React from "react";
import Link from "next/link";

export default function HomeFooter() {
  return (
    <footer className="bg-[#e6e0e9] border-t border-[#cbc4d2] text-[#1d1b20] w-full">
      <div className="w-full py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-6 max-w-[1280px] mx-auto">
        <div className="space-y-2 text-center md:text-left">
          <Link href="/" className="flex items-center gap-2.5 justify-center md:justify-start no-underline">
            <img src="/logo.png" alt="Lumina Grand Logo" className="w-9 h-9 object-cover rounded-full shadow-md" />
            <span className="text-2xl font-extrabold text-[#4f378a] tracking-tight block">
              LR
            </span>
          </Link>
          <p className="text-sm text-gray-700 max-w-xs">
            Where unparalleled luxury meets the serenity of the natural world.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/privacy-policy" className="hover:text-[#4f378a] hover:underline no-underline transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-[#4f378a] hover:underline no-underline transition-colors">
            Terms of Service
          </Link>
          <Link href="/sustainability" className="hover:text-[#4f378a] hover:underline no-underline transition-colors">
            Sustainability
          </Link>
          <Link href="/careers" className="hover:text-[#4f378a] hover:underline no-underline transition-colors">
            Careers
          </Link>
          <Link href="/press-kit" className="hover:text-[#4f378a] hover:underline no-underline transition-colors">
            Press Kit
          </Link>
        </div>

        <p className="text-xs text-gray-600">
          © 2026 Lumina Grand Luxury Resorts. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
