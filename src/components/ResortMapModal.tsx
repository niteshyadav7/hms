"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Spot {
  id: string;
  name: string;
  category: "SUITE" | "DINING" | "SPA" | "HELIPAD";
  x: string; // percentage left
  y: string; // percentage top
  description: string;
  image: string;
  price?: string;
  actionUrl?: string;
}

const MAP_SPOTS: Spot[] = [
  {
    id: "s1",
    name: "Overwater Villa Pier & Sanctuaries",
    category: "SUITE",
    x: "28%",
    y: "35%",
    description: "Exclusive overwater bungalows featuring private glass floor viewports & infinity dip pools.",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80",
    price: "From ₹65,000 / night",
    actionUrl: "/rooms",
  },
  {
    id: "s2",
    name: "Celestial Spa & Hydrotherapy Lagoon",
    category: "SPA",
    x: "65%",
    y: "28%",
    description: "Holistic wellness center surrounded by tranquil turquoise waters offering lunar stone massages.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
    price: "Treatments from ₹2,100",
  },
  {
    id: "s3",
    name: "Aether Fine Dining & Sunset Pavilion",
    category: "DINING",
    x: "48%",
    y: "62%",
    description: "Michelin-starred open-air oceanfront dining specializing in fresh seafood & wine pairings.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80",
    price: "Dinner Reservations Open",
  },
  {
    id: "s4",
    name: "Private Island Helipad & Chauffeur Dock",
    category: "HELIPAD",
    x: "82%",
    y: "75%",
    description: "24/7 VIP VIP airport transfers via Airbus luxury helicopter or private yacht vessel.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    price: "Transfers Available 24/7",
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ResortMapModal({ isOpen, onClose }: Props) {
  const [activeSpot, setActiveSpot] = useState<Spot>(MAP_SPOTS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#cbc4d2]/40 rounded-2xl max-w-4xl w-full h-[85vh] max-h-[720px] flex flex-col aura-shadow overflow-hidden relative">
        {/* Header */}
        <div className="bg-[#4f378a] text-white p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl">map</span>
            <div>
              <h2 className="text-lg font-bold leading-none">Interactive Resort Island Map</h2>
              <p className="text-xs text-[#e9ddff] mt-1 font-medium">Click hotspots to explore Lumina Grand Island</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all border-none bg-transparent cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Interactive Map Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Map Area */}
          <div className="flex-1 relative bg-[#0f2c42] overflow-hidden min-h-[300px]">
            {/* Background Aerial Island Map Image */}
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85"
              alt="Lumina Grand Island Map"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

            {/* Hotspot Markers */}
            {MAP_SPOTS.map((spot) => (
              <button
                key={spot.id}
                onClick={() => setActiveSpot(spot)}
                style={{ left: spot.x, top: spot.y }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full border-2 transition-all cursor-pointer shadow-xl flex items-center justify-center group ${
                  activeSpot.id === spot.id
                    ? "bg-[#4f378a] border-white text-white scale-125 z-30"
                    : "bg-white/90 border-[#4f378a] text-[#4f378a] hover:scale-110 z-20"
                }`}
                title={spot.name}
              >
                <span className="material-symbols-outlined text-base">
                  {spot.category === "SUITE"
                    ? "bed"
                    : spot.category === "SPA"
                    ? "spa"
                    : spot.category === "DINING"
                    ? "restaurant"
                    : "flight_takeoff"}
                </span>
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 whitespace-nowrap bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {spot.name}
                </span>
              </button>
            ))}
          </div>

          {/* Active Spot Details Sidebar */}
          <div className="w-full md:w-80 bg-white border-l border-[#cbc4d2]/30 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <span className="bg-[#e9ddff] text-[#4f378a] px-3 py-1 rounded-full text-xs font-bold inline-block uppercase tracking-wider">
                {activeSpot.category} Location
              </span>
              <h3 className="font-extrabold text-lg text-[#1d1b20] leading-snug">{activeSpot.name}</h3>

              <img
                src={activeSpot.image}
                alt={activeSpot.name}
                className="w-full h-40 object-cover rounded-xl shadow-sm border border-[#cbc4d2]/20"
              />

              <p className="text-xs text-gray-600 leading-relaxed">{activeSpot.description}</p>

              {activeSpot.price && (
                <div className="p-3 bg-[#f8f2fa] rounded-xl border border-[#cbc4d2]/30">
                  <span className="text-[11px] text-gray-500 font-medium block">Rate / Status</span>
                  <span className="text-sm font-bold text-[#4f378a]">{activeSpot.price}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#cbc4d2]/20">
              {activeSpot.actionUrl ? (
                <Link
                  href={activeSpot.actionUrl}
                  onClick={onClose}
                  className="w-full bg-[#4f378a] hover:bg-[#3d2a6c] text-white py-2.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 no-underline"
                >
                  Explore Suites in this Zone
                </Link>
              ) : (
                <button
                  onClick={() => {
                    toast.success(`Inquiry sent for ${activeSpot.name}`);
                    onClose();
                  }}
                  className="w-full bg-[#4f378a] hover:bg-[#3d2a6c] text-white py-2.5 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer border-none"
                >
                  Reserve Experience
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResortMapModal;
