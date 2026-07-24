"use client";

import React from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function PressKitPage() {
  const mediaDownloads = [
    {
      title: "High-Res Photography Pack (ZIP)",
      size: "142 MB",
      format: "RAW / JPG",
      icon: "photo_library",
    },
    {
      title: "Vector Logos & Brand Guidelines (PDF)",
      size: "18 MB",
      format: "SVG / EPS / PDF",
      icon: "palette",
    },
    {
      title: "Resort Fact Sheet 2026 (PDF)",
      size: "4.2 MB",
      format: "PDF",
      icon: "description",
    },
  ];

  const handleDownloadAsset = (title: string) => {
    toast.success(`Downloading ${title}...`);
  };

  return (
    <main className="max-w-[1100px] mx-auto px-6 md:px-12 py-12 text-[#1d1b20]">
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
          MEDIA & PRESS ROOM
        </span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1d1b20]">
          Press & Brand Assets
        </h1>
        <p className="text-sm text-[#494551] max-w-2xl">
          Access high-resolution resort photography, official brand assets, executive bios, and recent press releases for media publications.
        </p>
      </div>

      {/* Downloadable Assets */}
      <div className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-[#1d1b20]">Media Downloads</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mediaDownloads.map((asset, idx) => (
            <div
              key={idx}
              className="bg-white aura-shadow p-6 rounded-2xl border border-[#cbc4d2]/30 flex flex-col justify-between h-48 hover:border-[#4f378a]/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#e9ddff] text-[#4f378a] flex items-center justify-center">
                  <span className="material-symbols-outlined">{asset.icon}</span>
                </div>
                <span className="text-[10px] font-bold text-[#494551] bg-[#f8f2fa] px-2.5 py-1 rounded-full border border-[#cbc4d2]/30">
                  {asset.size}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#1d1b20] mb-1">{asset.title}</h3>
                <span className="text-[10px] text-gray-500 font-semibold">{asset.format}</span>
              </div>

              <button
                onClick={() => handleDownloadAsset(asset.title)}
                className="w-full bg-[#f8f2fa] hover:bg-[#4f378a] hover:text-white text-[#4f378a] py-2 rounded-xl text-xs font-bold transition-all border border-[#cbc4d2]/40 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Download Pack</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Media Inquiries Contact */}
      <div className="bg-[#4f378a] text-white p-8 rounded-2xl aura-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <span className="text-[#e9ddff] text-xs font-semibold tracking-wider uppercase block">
            PRESS RELATIONS CONTACT
          </span>
          <h3 className="text-xl font-bold">Have a press or interview request?</h3>
          <p className="text-xs text-white/80 max-w-md">
            Our global public relations team is available for media inquiries, executive interview requests, and feature coverage.
          </p>
        </div>

        <a
          href="mailto:press@luminagrand.com"
          className="bg-white text-[#4f378a] hover:bg-[#e9ddff] px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all no-underline whitespace-nowrap"
        >
          Contact PR Team
        </a>
      </div>
    </main>
  );
}
