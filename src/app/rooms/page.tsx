"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface Room {
  id: string;
  roomNumber: string;
  status: string;
  isAvailable: boolean;
  roomType: {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    capacity: number;
    amenities: string[];
    images: string[];
  };
}

function RoomCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCheckIn = searchParams.get("checkIn") || "2024-10-24";
  const initialCheckOut = searchParams.get("checkOut") || "2024-10-30";
  const initialGuests = searchParams.get("guests") || "2";

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [maxPrice, setMaxPrice] = useState(2500);

  const fetchRooms = () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (checkIn) query.set("checkIn", checkIn);
    if (checkOut) query.set("checkOut", checkOut);

    fetch(`/api/rooms?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setRooms(data.data);
        } else {
          // Fallback dataset matching code.html
          setRooms([
            {
              id: "r1",
              roomNumber: "401",
              status: "AVAILABLE",
              isAvailable: true,
              roomType: {
                id: "rt1",
                name: "Oceanic Premier Suite",
                description: "Ocean view suite with king bed and private terrace.",
                basePrice: 850,
                capacity: 2,
                amenities: ["850 sq ft", "King Size", "Ocean View"],
                images: [
                  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85",
                ],
              },
            },
            {
              id: "r2",
              roomNumber: "502",
              status: "AVAILABLE",
              isAvailable: true,
              roomType: {
                id: "rt2",
                name: "Skyline Penthouse",
                description: "Top floor penthouse with panoramic city & sea view.",
                basePrice: 1450,
                capacity: 4,
                amenities: ["1,200 sq ft", "Private Balcony"],
                images: [
                  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85",
                ],
              },
            },
            {
              id: "r3",
              roomNumber: "105",
              status: "AVAILABLE",
              isAvailable: true,
              roomType: {
                id: "rt3",
                name: "Garden Zen Villa",
                description: "Private villa surrounded by lush tropical gardens.",
                basePrice: 2100,
                capacity: 4,
                amenities: ["Private Pool", "Tropical Garden"],
                images: [
                  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85",
                ],
              },
            },
            {
              id: "r4",
              roomNumber: "302",
              status: "AVAILABLE",
              isAvailable: true,
              roomType: {
                id: "rt4",
                name: "Executive Business Suite",
                description: "Dedicated workspace with high-speed fiber internet.",
                basePrice: 600,
                capacity: 2,
                amenities: ["Workspace", "Hi-Speed WiFi"],
                images: [
                  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=85",
                ],
              },
            },
          ]);
        }
      })
      .catch(() => {
        setRooms([
          {
            id: "r1",
            roomNumber: "401",
            status: "AVAILABLE",
            isAvailable: true,
            roomType: {
              id: "rt1",
              name: "Oceanic Premier Suite",
              description: "Ocean view suite with king bed.",
              basePrice: 850,
              capacity: 2,
              amenities: ["850 sq ft", "King Size"],
              images: [
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85",
              ],
            },
          },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleBookRoom = (roomId: string) => {
    router.push(
      `/booking/checkout?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${initialGuests}`
    );
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesPrice = r.roomType.basePrice <= maxPrice;
    if (selectedCategory === "ALL") return matchesPrice;
    return (
      matchesPrice &&
      r.roomType.name.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  });

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-10 text-[#1d1b20]">
      {/* Animated Hero Header */}
      <section className="relative rounded-2xl overflow-hidden mb-10 h-[340px] flex items-center px-8 md:px-12">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-2xl text-white space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-md">
            Find Your Sanctuary
          </h1>
          <p className="text-base md:text-lg text-white/90 font-light leading-relaxed drop-shadow-sm">
            Experience the pinnacle of luxury with our curated selection of rooms and suites designed for the modern elite traveler.
          </p>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <section className="sticky top-20 z-40 mb-10">
        <div className="glass-panel aura-shadow rounded-xl border border-white/60 p-4 md:p-6 flex flex-col lg:flex-row items-center gap-6 bg-white/80 backdrop-blur-xl">
          {/* Dates */}
          <div className="flex flex-1 w-full gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#494551] mb-1">
                Check-in
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  calendar_today
                </span>
                <input
                  className="w-full bg-[#f8f2fa] border border-[#cbc4d2] rounded-lg pl-9 pr-3 py-2.5 text-xs font-semibold focus:border-[#4f378a] focus:ring-1 focus:ring-[#4f378a] outline-none transition-all"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#494551] mb-1">
                Check-out
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  calendar_today
                </span>
                <input
                  className="w-full bg-[#f8f2fa] border border-[#cbc4d2] rounded-lg pl-9 pr-3 py-2.5 text-xs font-semibold focus:border-[#4f378a] focus:ring-1 focus:ring-[#4f378a] outline-none transition-all"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-px h-10 bg-[#cbc4d2]/40" />

          {/* Category Filter Pills */}
          <div className="w-full lg:w-auto overflow-x-auto flex items-center gap-2">
            {[
              { id: "ALL", label: "All Types" },
              { id: "suite", label: "Suites" },
              { id: "deluxe", label: "Deluxe" },
              { id: "villa", label: "Villas" },
              { id: "penthouse", label: "Penthouses" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold cursor-pointer border-none transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#4f378a] text-white shadow-sm"
                    : "bg-[#ece6ee] text-[#494551] hover:bg-[#e9ddff]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Price Range Slider */}
          <div className="w-full lg:w-56">
            <div className="flex justify-between text-xs font-semibold text-[#494551] mb-1">
              <span>Price Range</span>
              <span className="text-[#4f378a] font-bold">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="400"
              max="3000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-[#e6e0e9] rounded-full appearance-none cursor-pointer accent-[#4f378a]"
            />
          </div>

          <button
            onClick={fetchRooms}
            className="w-full lg:w-auto bg-[#4f378a] text-white p-3 rounded-lg flex items-center justify-center hover:bg-[#3d2a6c] transition-colors border-none cursor-pointer"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
      </section>

      {/* Room Catalog Grid */}
      {loading ? (
        <div className="py-16 text-center text-[#494551]">Loading available rooms...</div>
      ) : filteredRooms.length === 0 ? (
        <div className="py-16 text-center text-gray-500 bg-white/60 rounded-2xl p-8 border border-white">
          No rooms found matching your filter criteria. Try adjusting the price range or room category.
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="group aura-shadow rounded-2xl overflow-hidden bg-white border border-[#cbc4d2]/30 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Clickable Card Top -> Room Details */}
              <Link
                href={`/rooms/${room.id}`}
                className="relative block h-72 overflow-hidden no-underline"
              >
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url('${
                      room.roomType.images?.[0] ||
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhr6BJeRC7ITsv_IM3sVE_yr0qpoDtSUdS5sROsKNE8j5a_vBhpZXnZwb5r13V0tEoZaKoWds5OtMPjoCpIlwrwvVxG6MjhwxjqzxWYqERXW4qwSFMucJTP8AhOSvKwDqGX6_VRyV8mLUfH-Hw2Dk5mTQS3dJ7KIA2AdrGbg6D6IgJmvopOGWaTapn48X8MoMNhPTjB0QwDO1EvjMo-hCE84P8SAaB9z6uSur_Dit3InqxivuquzUc2tHnyeomUy0cEYXNYyKzTRYn"
                    }')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
                    Available Now
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold">{room.roomType.name}</h3>
                  <p className="text-xs opacity-90 flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-sm">square_foot</span>{" "}
                    {room.roomType.amenities?.[0] || "850 sq ft"} •{" "}
                    <span className="material-symbols-outlined text-sm">king_bed</span>{" "}
                    {room.roomType.amenities?.[1] || "King Suite"}
                  </p>
                </div>
              </Link>

              {/* Card Footer Info */}
              <div className="p-5 flex justify-between items-end">
                <div>
                  <div className="flex items-center gap-0.5 text-amber-500 mb-2 text-xs">
                    <span className="material-symbols-outlined text-sm">star</span>
                    <span className="material-symbols-outlined text-sm">star</span>
                    <span className="material-symbols-outlined text-sm">star</span>
                    <span className="material-symbols-outlined text-sm">star</span>
                    <span className="material-symbols-outlined text-sm">star</span>
                    <span className="text-[#494551] font-semibold ml-1 text-xs">
                      4.9 (124 reviews)
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#4f378a]">
                      ₹{room.roomType.basePrice}
                    </span>
                    <span className="text-xs text-gray-500">/ night</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/rooms/${room.id}`}
                    className="bg-[#ece6ee] hover:bg-[#e9ddff] text-[#4f378a] px-4 py-2.5 rounded-xl font-semibold text-xs transition-all no-underline shadow-sm"
                  >
                    Details
                  </Link>

                  <button
                    onClick={() => handleBookRoom(room.id)}
                    className="bg-[#4f378a] hover:bg-[#3d2a6c] text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer border-none shadow-sm"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#4f378a]">Loading Rooms Catalog...</div>}>
      <RoomCatalogContent />
    </Suspense>
  );
}
