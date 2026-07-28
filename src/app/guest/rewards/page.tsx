"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface RewardItem {
  id: string;
  title: string;
  category: "UPGRADE" | "SPA" | "DINING" | "EXPERIENCE";
  pointsRequired: number;
  description: string;
  image: string;
}

const REWARD_CATALOG: RewardItem[] = [
  {
    id: "r1",
    title: "Oceanfront Overwater Suite Upgrade",
    category: "UPGRADE",
    pointsRequired: 5000,
    description: "Upgrade your stay to a private overwater bungalow with infinity plunge pool.",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "r2",
    title: "Celestial Lunar Stone Spa Therapy",
    category: "SPA",
    pointsRequired: 3000,
    description: "90-minute holistic massage featuring warm lunar minerals & aromatherapy oils.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "r3",
    title: "Candlelight Beachfront Dinner for Two",
    category: "DINING",
    pointsRequired: 8000,
    description: "5-course Michelin-curated seafood dinner served under the Maldivian starlight.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "r4",
    title: "Private Helicopter Airport Chauffeur",
    category: "EXPERIENCE",
    pointsRequired: 12000,
    description: "Complimentary VIP Airbus helicopter arrival & departure transfer for 2 guests.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
  },
];

export default function RewardsMarketplacePage() {
  const [userPoints, setUserPoints] = useState(6500);
  const [currentTier, setCurrentTier] = useState<"SILVER" | "GOLD" | "PLATINUM" | "DIAMOND">("PLATINUM");

  const handleRedeem = (item: RewardItem) => {
    if (userPoints < item.pointsRequired) {
      toast.error(`Insufficient Lumina Points. You need ${item.pointsRequired - userPoints} more points.`);
      return;
    }

    setUserPoints((prev) => prev - item.pointsRequired);
    toast.success(`Reward Claimed! Voucher generated for ${item.title}.`);
  };

  return (
    <div className="min-h-screen bg-[#fdf7ff] text-[#1d1b20]">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#4f378a] to-[#3d2a6c] text-white py-12 px-4 md:px-12 shadow-lg">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="bg-[#ffdf93] text-[#594400] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-2">
              VIP Loyalty Club
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Lumina Rewards Marketplace</h1>
            <p className="text-xs md:text-sm text-[#e9ddff] mt-1">
              Redeem your accumulated stay points for luxury upgrades, spa sessions & private dining.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/30 p-5 rounded-2xl flex items-center gap-6 shadow-xl">
            <div>
              <span className="text-xs text-[#e9ddff] font-medium block">Available Balance</span>
              <span className="text-3xl font-extrabold text-[#ffdf93]">{userPoints.toLocaleString()} Pts</span>
            </div>
            <div className="h-10 w-[1px] bg-white/20" />
            <div>
              <span className="text-xs text-[#e9ddff] font-medium block">Member Tier</span>
              <span className="text-sm font-extrabold bg-[#e9ddff] text-[#4f378a] px-3 py-1 rounded-full inline-block mt-0.5">
                💎 {currentTier} VIP
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-12 space-y-12">
        {/* Tier Progress Gauge */}
        <div className="bg-white border border-[#cbc4d2]/40 rounded-2xl p-6 md:p-8 aura-shadow space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-[#1d1b20]">Your VIP Tier Status</h2>
              <p className="text-xs text-gray-500">Earn 3,500 more points to reach Diamond Executive Tier.</p>
            </div>
            <span className="text-xs font-bold text-[#4f378a] bg-[#f8f2fa] px-3 py-1.5 rounded-xl border border-[#cbc4d2]/30">
              Current: Platinum (Level 3 of 4)
            </span>
          </div>

          {/* Tier Tracker Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-[#f8f2fa] h-3 rounded-full overflow-hidden border border-[#cbc4d2]/30 p-0.5">
              <div className="bg-[#4f378a] h-full rounded-full transition-all duration-1000 w-[68%]" />
            </div>
            <div className="grid grid-cols-4 text-center text-xs font-bold pt-1">
              <span className="text-gray-400">Silver (0 pts)</span>
              <span className="text-gray-400">Gold (2,500 pts)</span>
              <span className="text-[#4f378a]">Platinum (5,000 pts) ★</span>
              <span className="text-gray-400">Diamond (10,000 pts)</span>
            </div>
          </div>
        </div>

        {/* Rewards Store Catalog */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[#4f378a] font-bold text-xs tracking-wider uppercase block">Redeem Instantly</span>
              <h2 className="text-2xl font-bold text-[#1d1b20]">Points Rewards Catalog</h2>
            </div>
            <Link
              href="/guest/dashboard"
              className="text-xs font-bold text-[#4f378a] hover:underline no-underline"
            >
              ← Back to Guest Dashboard
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REWARD_CATALOG.map((item) => {
              const canAfford = userPoints >= item.pointsRequired;
              return (
                <div
                  key={item.id}
                  className="bg-white border border-[#cbc4d2]/40 rounded-2xl p-5 aura-shadow flex flex-col md:flex-row gap-5 items-center hover:border-[#4f378a]/50 transition-all"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full md:w-36 h-36 rounded-xl object-cover flex-shrink-0 shadow-sm"
                  />

                  <div className="flex-1 space-y-2 text-left">
                    <span className="bg-[#f8f2fa] text-[#4f378a] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-base text-[#1d1b20] leading-snug">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#4f378a]">
                        {item.pointsRequired.toLocaleString()} Points
                      </span>
                      <button
                        onClick={() => handleRedeem(item)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none shadow-sm ${
                          canAfford
                            ? "bg-[#4f378a] text-white hover:bg-[#3d2a6c] active:scale-95"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {canAfford ? "Claim Voucher" : "Insufficient Points"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
